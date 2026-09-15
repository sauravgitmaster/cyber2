import { useState, useEffect, useRef, useCallback } from 'react';
import { RoomStateClient, MultiplayerQuestionClient } from '../types/multiplayer';
import { multiplayerApi, PlayerInput } from '../utils/multiplayerApi';
import { multiplayerQuestionsPool, getEightRandomQuestions } from '../data/multiplayerQuestions';

function getSessionPlayerId(baseUserId?: string): string {
  try {
    const key = 'cybermentor_multiplayer_tab_player_id';
    let id = sessionStorage.getItem(key);
    if (!id) {
      const suffix = Math.random().toString(36).substring(2, 7);
      id = baseUserId ? `${baseUserId}_${suffix}` : `p_${Date.now().toString(36)}_${suffix}`;
      sessionStorage.setItem(key, id);
    }
    return id;
  } catch {
    return `p_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  }
}

export function useMultiplayerRoom(currentUser: { id?: string; name: string; avatar: string }) {
  const [room, setRoom] = useState<RoomStateClient | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Player identity (persisted per browser tab so host and guest never collide in multi-tab testing)
  const playerIdRef = useRef<string>(getSessionPlayerId(currentUser.id));
  const activeRoomCodeRef = useRef<string | null>(null);
  const roomRef = useRef<RoomStateClient | null>(null);

  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  useEffect(() => {
    activeRoomCodeRef.current = roomCode;
  }, [roomCode]);

  const eventSourceRef = useRef<EventSource | null>(null);
  const pollIntervalRef = useRef<number | null>(null);
  const heartbeatIntervalRef = useRef<number | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const storageListenerRef = useRef<((e: StorageEvent) => void) | null>(null);

  const playerInput: PlayerInput = {
    id: playerIdRef.current,
    name: currentUser.name || 'Explorer',
    avatar: currentUser.avatar || '🤖',
  };

  // Helper to publish state to local storage and broadcast channel
  const broadcastRoomState = useCallback((state: RoomStateClient) => {
    try {
      localStorage.setItem(`cybermentor_room_${state.code}`, JSON.stringify(state));
    } catch {
      // ignore
    }
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({ type: 'ROOM_UPDATE', room: state });
      } catch {
        // ignore
      }
    }
  }, []);

  // Stop all active subscriptions
  const cleanupSubscriptions = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.close();
      broadcastChannelRef.current = null;
    }
    if (storageListenerRef.current) {
      window.removeEventListener('storage', storageListenerRef.current);
      storageListenerRef.current = null;
    }
  }, []);

  // Connect to SSE stream, BroadcastChannel, and sync polling backup
  const connectToRoom = useCallback(
    (code: string) => {
      cleanupSubscriptions();
      setRoomCode(code);

      // 1. Setup cross-tab BroadcastChannel for 0ms latency sync across windows/tabs
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          const bc = new BroadcastChannel(`cybermentor_room_${code}`);
          bc.onmessage = (event) => {
            if (event.data && event.data.type === 'ROOM_UPDATE' && event.data.room) {
              const incoming: RoomStateClient = event.data.room;
              setRoom((prev) => {
                if (
                  !prev ||
                  incoming.updatedAt >= prev.updatedAt ||
                  (!prev.guest && incoming.guest) ||
                  prev.status !== incoming.status
                ) {
                  setIsHost(incoming.host.id === playerIdRef.current);
                  return incoming;
                }
                return prev;
              });
            }
          };
          broadcastChannelRef.current = bc;
        }
      } catch {
        // BroadcastChannel unavailable
      }

      // 2. Setup storage event listener for cross-tab sync
      const handleStorage = (e: StorageEvent) => {
        if (e.key === `cybermentor_room_${code}` && e.newValue) {
          try {
            const parsed: RoomStateClient = JSON.parse(e.newValue);
            setRoom((prev) => {
              if (
                !prev ||
                parsed.updatedAt >= prev.updatedAt ||
                (!prev.guest && parsed.guest) ||
                parsed.status !== prev.status
              ) {
                setIsHost(parsed.host.id === playerIdRef.current);
                return parsed;
              }
              return prev;
            });
          } catch {
            // ignore JSON error
          }
        }
      };
      window.addEventListener('storage', handleStorage);
      storageListenerRef.current = handleStorage;

      // 3. Initial immediate state fetch from server or localStorage
      multiplayerApi
        .getRoomState(code, playerIdRef.current)
        .then((state) => {
          setRoom(state);
          setIsHost(state.host.id === playerIdRef.current);
          broadcastRoomState(state);
        })
        .catch(() => {
          // Check localStorage if server is offline or serverless cold start
          try {
            const local = localStorage.getItem(`cybermentor_room_${code}`);
            if (local) {
              const parsed: RoomStateClient = JSON.parse(local);
              setRoom(parsed);
              setIsHost(parsed.host.id === playerIdRef.current);
            }
          } catch {
            // ignore
          }
        });

      // 4. Setup Server-Sent Events (SSE)
      try {
        const sseUrl = `/api/rooms/${encodeURIComponent(code)}/events?playerId=${encodeURIComponent(playerIdRef.current)}`;
        const es = new EventSource(sseUrl);

        es.onmessage = (event) => {
          try {
            const data: RoomStateClient = JSON.parse(event.data);
            setRoom(data);
            setIsHost(data.host.id === playerIdRef.current);
            setError(null);
            broadcastRoomState(data);
          } catch {
            // ignore JSON parse error
          }
        };

        es.onerror = () => {
          if (es.readyState === EventSource.CLOSED) {
            es.close();
          }
        };

        eventSourceRef.current = es;
      } catch {
        // SSE not supported, rely on polling
      }

      // 5. Active sync polling every 500ms
      pollIntervalRef.current = window.setInterval(async () => {
        // Check server state
        try {
          const fresh = await multiplayerApi.getRoomState(code, playerIdRef.current);
          if (fresh) {
            setRoom((prev) => {
              if (
                !prev ||
                fresh.updatedAt >= prev.updatedAt ||
                (!prev.guest && fresh.guest) ||
                prev.status !== fresh.status
              ) {
                setIsHost(fresh.host.id === playerIdRef.current);
                broadcastRoomState(fresh);
                return fresh;
              }
              return prev;
            });
            return;
          }
        } catch {
          // Server error or serverless cold-start: inspect localStorage
          try {
            const local = localStorage.getItem(`cybermentor_room_${code}`);
            if (local) {
              const parsed: RoomStateClient = JSON.parse(local);
              setRoom((prev) => {
                if (
                  !prev ||
                  parsed.updatedAt > prev.updatedAt ||
                  (!prev.guest && parsed.guest) ||
                  parsed.status !== prev.status
                ) {
                  setIsHost(parsed.host.id === playerIdRef.current);
                  return parsed;
                }
                return prev;
              });
            }
          } catch {
            // ignore
          }
        }
      }, 500);

      // 6. Heartbeat every 3s
      heartbeatIntervalRef.current = window.setInterval(() => {
        multiplayerApi.heartbeat(code, playerIdRef.current);
      }, 3000);
    },
    [cleanupSubscriptions, broadcastRoomState]
  );

  // Clean up ONLY on unmount (NOT when roomCode changes!)
  useEffect(() => {
    return () => {
      cleanupSubscriptions();
      if (activeRoomCodeRef.current) {
        multiplayerApi.leaveRoom(activeRoomCodeRef.current, playerIdRef.current);
      }
    };
  }, [cleanupSubscriptions]);

  // Actions
  const createRoom = async () => {
    setLoading(true);
    setError(null);
    let newRoom: RoomStateClient | null = null;
    try {
      newRoom = await multiplayerApi.createRoom(playerInput);
    } catch {
      // Resilient local fallback if network/serverless route is delayed or offline
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      let fallbackCode = '';
      for (let i = 0; i < 6; i++) {
        fallbackCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      newRoom = {
        code: fallbackCode,
        status: 'waiting',
        host: {
          id: playerIdRef.current,
          name: playerInput.name,
          avatar: playerInput.avatar,
          score: 0,
          correctCount: 0,
          fastestResponseMs: null,
          isConnected: true,
          lastSeen: Date.now(),
        },
        guest: null,
        currentRound: 1,
        totalRounds: 8,
        currentQuestion: null,
        roundStartTime: null,
        roundDurationSec: 10,
        timeRemainingMs: 0,
        lastRoundResult: null,
        roundHistory: [],
        updatedAt: Date.now(),
      };
    }

    setRoom(newRoom);
    setRoomCode(newRoom.code);
    setIsHost(true);

    try {
      localStorage.setItem('cybermentor_recent_room_code', newRoom.code);
      localStorage.setItem(`cybermentor_room_${newRoom.code}`, JSON.stringify(newRoom));
    } catch {
      // ignore
    }

    connectToRoom(newRoom.code);
    setLoading(false);
    return newRoom;
  };

  const joinRoom = async (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    setLoading(true);
    setError(null);
    try {
      localStorage.setItem('cybermentor_recent_room_code', cleanCode);
    } catch {
      // ignore
    }

    let joinedRoom: RoomStateClient | null = null;

    // Check localStorage first for instant multi-tab sync
    try {
      const localData = localStorage.getItem(`cybermentor_room_${cleanCode}`);
      if (localData) {
        const parsed: RoomStateClient = JSON.parse(localData);
        parsed.guest = {
          id: playerIdRef.current,
          name: playerInput.name,
          avatar: playerInput.avatar,
          score: 0,
          correctCount: 0,
          fastestResponseMs: null,
          isConnected: true,
          lastSeen: Date.now(),
        };
        parsed.updatedAt = Date.now();
        joinedRoom = parsed;
        localStorage.setItem(`cybermentor_room_${cleanCode}`, JSON.stringify(parsed));
      }
    } catch {
      // ignore
    }

    // Also call server API
    try {
      const serverRoom = await multiplayerApi.joinRoom(cleanCode, playerInput);
      if (serverRoom && serverRoom.guest) {
        joinedRoom = serverRoom;
      }
    } catch (apiErr: any) {
      if (!joinedRoom) {
        const msg = apiErr?.message || 'Hmm… I can’t find that game.';
        setError(msg);
        setLoading(false);
        throw new Error(msg);
      }
    }

    if (!joinedRoom) {
      setError('Game not found');
      setLoading(false);
      throw new Error('Game not found');
    }

    // Ensure guest is attached
    if (!joinedRoom.guest || joinedRoom.guest.id !== playerIdRef.current) {
      joinedRoom.guest = {
        id: playerIdRef.current,
        name: playerInput.name,
        avatar: playerInput.avatar,
        score: 0,
        correctCount: 0,
        fastestResponseMs: null,
        isConnected: true,
        lastSeen: Date.now(),
      };
      joinedRoom.updatedAt = Date.now();
    }

    setRoom(joinedRoom);
    setRoomCode(cleanCode);
    setIsHost(false);

    try {
      localStorage.setItem(`cybermentor_room_${cleanCode}`, JSON.stringify(joinedRoom));
    } catch {
      // ignore
    }

    connectToRoom(cleanCode);

    // Broadcast guest joined to other tabs immediately (Host sees it instantly)
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({ type: 'ROOM_UPDATE', room: joinedRoom });
      } catch {
        // ignore
      }
    }

    setLoading(false);
    return joinedRoom;
  };

  const startGame = async () => {
    if (!roomCode) return;
    setError(null);

    // Call server API
    try {
      await multiplayerApi.startGame(roomCode, playerIdRef.current);
    } catch {
      // ignore if serverless/offline
    }

    // Local state transition to starting countdown
    setRoom((prev) => {
      if (!prev) return prev;
      const questions = getEightRandomQuestions();
      const firstQ = questions[0];
      const clientFirstQ: MultiplayerQuestionClient = {
        id: firstQ.id,
        roundNumber: 1,
        totalRounds: 8,
        category: firstQ.category,
        difficulty: firstQ.difficulty,
        situation: firstQ.situation,
        prompt: firstQ.prompt,
        options: firstQ.options,
      };

      const startingState: RoomStateClient = {
        ...prev,
        status: 'starting',
        currentRound: 1,
        totalRounds: 8,
        currentQuestion: clientFirstQ,
        roundDurationSec: 10,
        roundStartTime: null,
        lastRoundResult: null,
        roundHistory: [],
        updatedAt: Date.now(),
        host: { ...prev.host, score: 0, correctCount: 0 },
        guest: prev.guest ? { ...prev.guest, score: 0, correctCount: 0 } : null,
      };

      broadcastRoomState(startingState);
      return startingState;
    });
  };

  const submitAnswer = async (questionId: string, optionId: string) => {
    if (!roomCode || isSubmitting) return;
    setIsSubmitting(true);

    // Send to backend
    try {
      await multiplayerApi.submitAnswer(roomCode, playerIdRef.current, questionId, optionId);
    } catch {
      // ignore
    }

    // Update local state
    setRoom((prev) => {
      if (!prev || prev.status !== 'in_round' || !prev.currentQuestion || prev.currentQuestion.id !== questionId) {
        return prev;
      }

      const q = multiplayerQuestionsPool.find((item) => item.id === questionId);
      const isCorrect = q ? q.correctOptionId === optionId : false;
      const isHostPlayer = prev.host.id === playerIdRef.current;

      const updatedHost = { ...prev.host };
      const updatedGuest = prev.guest ? { ...prev.guest } : null;
      const activePlayer = isHostPlayer ? updatedHost : updatedGuest;

      if (activePlayer && isCorrect) {
        activePlayer.score += 100;
        activePlayer.correctCount += 1;
      }

      const summary = {
        questionId,
        roundNumber: prev.currentRound,
        title: q?.title || 'Cyber Challenge',
        situation: q?.situation || prev.currentQuestion.situation,
        correctOptionId: q?.correctOptionId || optionId,
        correctOptionText: q?.options.find((o) => o.id === (q?.correctOptionId || optionId))?.text || '',
        winnerPlayerId: isCorrect ? playerIdRef.current : null,
        winnerPlayerName: isCorrect ? activePlayer?.name || 'Player' : null,
        secondPlayerId: null,
        secondPlayerName: null,
        whySafe: q?.whySafe || 'Great job making the secure choice!',
        playerAnswers: {
          [playerIdRef.current]: {
            optionId,
            isCorrect,
            pointsAwarded: isCorrect ? 100 : 0,
            responseTimeMs: prev.roundStartTime ? Math.max(100, Date.now() - prev.roundStartTime) : 1000,
          },
        },
      };

      const lockedState: RoomStateClient = {
        ...prev,
        status: 'round_locked',
        host: updatedHost,
        guest: updatedGuest,
        lastRoundResult: summary,
        roundHistory: [...prev.roundHistory, summary],
        updatedAt: Date.now(),
      };

      broadcastRoomState(lockedState);
      return lockedState;
    });

    setIsSubmitting(false);
  };

  const restartGame = async () => {
    if (!roomCode) return;
    try {
      await multiplayerApi.restartGame(roomCode, playerIdRef.current);
    } catch {
      // ignore
    }
    startGame();
  };

  const leaveRoom = async () => {
    if (roomCode) {
      await multiplayerApi.leaveRoom(roomCode, playerIdRef.current);
    }
    cleanupSubscriptions();
    setRoom(null);
    setRoomCode(null);
    setError(null);
  };

  // Local Game Lifecycle Ticker for offline / serverless / cross-tab play
  useEffect(() => {
    if (!room) return;

    // 1. Starting countdown -> in_round
    if (room.status === 'starting') {
      const timer = setTimeout(() => {
        setRoom((prev) => {
          if (!prev || prev.status !== 'starting') return prev;
          const questions = getEightRandomQuestions();
          const firstQ = questions[0];
          const activeState: RoomStateClient = {
            ...prev,
            status: 'in_round',
            currentRound: 1,
            totalRounds: 8,
            currentQuestion: {
              id: firstQ.id,
              roundNumber: 1,
              totalRounds: 8,
              category: firstQ.category,
              difficulty: firstQ.difficulty,
              situation: firstQ.situation,
              prompt: firstQ.prompt,
              options: firstQ.options,
            },
            roundStartTime: Date.now(),
            roundDurationSec: 10,
            timeRemainingMs: 10000,
            updatedAt: Date.now(),
          };
          broadcastRoomState(activeState);
          return activeState;
        });
      }, 2500);

      return () => clearTimeout(timer);
    }

    // 2. Round locked -> Next round or game_over
    if (room.status === 'round_locked') {
      const timer = setTimeout(() => {
        setRoom((prev) => {
          if (!prev || prev.status !== 'round_locked') return prev;
          if (prev.currentRound < prev.totalRounds) {
            const nextRound = prev.currentRound + 1;
            const nextQ = multiplayerQuestionsPool[nextRound % multiplayerQuestionsPool.length];
            const nextState: RoomStateClient = {
              ...prev,
              status: 'in_round',
              currentRound: nextRound,
              currentQuestion: {
                id: nextQ.id,
                roundNumber: nextRound,
                totalRounds: prev.totalRounds,
                category: nextQ.category,
                difficulty: nextQ.difficulty,
                situation: nextQ.situation,
                prompt: nextQ.prompt,
                options: nextQ.options,
              },
              roundStartTime: Date.now(),
              roundDurationSec: 10,
              timeRemainingMs: 10000,
              lastRoundResult: null,
              updatedAt: Date.now(),
            };
            broadcastRoomState(nextState);
            return nextState;
          } else {
            const overState: RoomStateClient = {
              ...prev,
              status: 'game_over',
              lastRoundResult: null,
              updatedAt: Date.now(),
            };
            broadcastRoomState(overState);
            return overState;
          }
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [room?.status, room?.currentRound, broadcastRoomState]);

  return {
    room,
    roomCode,
    loading,
    error,
    isHost,
    playerId: playerIdRef.current,
    createRoom,
    joinRoom,
    startGame,
    submitAnswer,
    restartGame,
    leaveRoom,
  };
}
