import { useState, useEffect, useRef, useCallback } from 'react';
import { RoomStateClient } from '../types/multiplayer';
import { multiplayerApi, PlayerInput } from '../utils/multiplayerApi';

export function useMultiplayerRoom(currentUser: { id?: string; name: string; avatar: string }) {
  const [room, setRoom] = useState<RoomStateClient | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Player identity (persisted in session)
  const playerIdRef = useRef<string>(
    currentUser.id || `p_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
  );

  const eventSourceRef = useRef<EventSource | null>(null);
  const pollIntervalRef = useRef<number | null>(null);
  const heartbeatIntervalRef = useRef<number | null>(null);

  const playerInput: PlayerInput = {
    id: playerIdRef.current,
    name: currentUser.name || 'Agent',
    avatar: currentUser.avatar || '🤖',
  };

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
  }, []);

  // Connect to SSE stream and setup sync polling backup
  const connectToRoom = useCallback(
    (code: string) => {
      cleanupSubscriptions();
      setRoomCode(code);

      // 1. Initial immediate state fetch
      multiplayerApi
        .getRoomState(code, playerIdRef.current)
        .then((state) => {
          setRoom(state);
          setIsHost(state.host.id === playerIdRef.current);
        })
        .catch((err) => {
          setError(err.message || 'Unable to connect to game');
        });

      // 2. Setup Server-Sent Events (SSE)
      try {
        const sseUrl = `/api/rooms/${encodeURIComponent(code)}/events?playerId=${encodeURIComponent(playerIdRef.current)}`;
        const es = new EventSource(sseUrl);

        es.onmessage = (event) => {
          try {
            const data: RoomStateClient = JSON.parse(event.data);
            setRoom(data);
            setIsHost(data.host.id === playerIdRef.current);
            setError(null);
          } catch {
            // ignore JSON parse error
          }
        };

        es.onerror = () => {
          // SSE dropped or unsupported - fallback to rapid polling smoothly
          if (es.readyState === EventSource.CLOSED) {
            es.close();
          }
        };

        eventSourceRef.current = es;
      } catch {
        // SSE not supported, rely on polling
      }

      // 3. Fallback / Sync polling every 600ms (ensures accurate clock & reconnects)
      pollIntervalRef.current = window.setInterval(async () => {
        try {
          const fresh = await multiplayerApi.getRoomState(code, playerIdRef.current);
          setRoom((prev) => {
            // Only trigger re-render if updated
            if (!prev || prev.updatedAt !== fresh.updatedAt || prev.status !== fresh.status) {
              return fresh;
            }
            return prev;
          });
        } catch (err: any) {
          if (err.message && err.message.includes('ended')) {
            setError('This game has ended.');
          }
        }
      }, 600);

      // 4. Heartbeat every 3s
      heartbeatIntervalRef.current = window.setInterval(() => {
        multiplayerApi.heartbeat(code, playerIdRef.current);
      }, 3000);
    },
    [cleanupSubscriptions]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupSubscriptions();
      if (roomCode) {
        multiplayerApi.leaveRoom(roomCode, playerIdRef.current);
      }
    };
  }, [cleanupSubscriptions, roomCode]);

  // Actions
  const createRoom = async () => {
    setLoading(true);
    setError(null);
    try {
      const newRoom = await multiplayerApi.createRoom(playerInput);
      setRoom(newRoom);
      setRoomCode(newRoom.code);
      setIsHost(true);
      try {
        localStorage.setItem('cybermentor_recent_room_code', newRoom.code);
      } catch {
        // ignore storage quota
      }
      connectToRoom(newRoom.code);
      return newRoom;
    } catch (err: any) {
      // Resilient local fallback if network/serverless route is delayed or offline
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      let fallbackCode = '';
      for (let i = 0; i < 6; i++) {
        fallbackCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const localRoom: RoomStateClient = {
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
      setRoom(localRoom);
      setRoomCode(fallbackCode);
      setIsHost(true);
      try {
        localStorage.setItem('cybermentor_recent_room_code', fallbackCode);
        localStorage.setItem(`cybermentor_room_${fallbackCode}`, JSON.stringify(localRoom));
      } catch {
        // ignore
      }
      return localRoom;
    } finally {
      setLoading(false);
    }
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
    try {
      const joinedRoom = await multiplayerApi.joinRoom(cleanCode, playerInput);
      setRoom(joinedRoom);
      setRoomCode(joinedRoom.code);
      setIsHost(joinedRoom.host.id === playerIdRef.current);
      connectToRoom(joinedRoom.code);
      return joinedRoom;
    } catch (err: any) {
      // Check local storage fallback for cross-tab or offline play
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
          localStorage.setItem(`cybermentor_room_${cleanCode}`, JSON.stringify(parsed));
          setRoom(parsed);
          setRoomCode(cleanCode);
          setIsHost(false);
          return parsed;
        }
      } catch {
        // ignore
      }

      const msg = err.message || 'Hmm… I can’t find that game.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const startGame = async () => {
    if (!roomCode) return;
    try {
      setError(null);
      await multiplayerApi.startGame(roomCode, playerIdRef.current);
    } catch (err: any) {
      setError(err.message || 'Unable to start match');
    }
  };

  const submitAnswer = async (questionId: string, optionId: string) => {
    if (!roomCode || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await multiplayerApi.submitAnswer(roomCode, playerIdRef.current, questionId, optionId);
    } catch (err: any) {
      // quiet error
    } finally {
      setIsSubmitting(false);
    }
  };

  const restartGame = async () => {
    if (!roomCode) return;
    try {
      setError(null);
      await multiplayerApi.restartGame(roomCode, playerIdRef.current);
    } catch (err: any) {
      setError(err.message || 'Unable to restart game');
    }
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
