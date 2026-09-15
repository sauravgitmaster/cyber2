import {
  MultiplayerQuestionData,
  multiplayerQuestionsPool,
  getEightRandomQuestions,
} from '../data/multiplayerQuestions';
import {
  PlayerProfileState,
  RoomStatus,
  RoomStateClient,
  RoundResultSummary,
  MultiplayerQuestionClient,
} from '../types/multiplayer';
import type { Response } from 'express';

interface InternalAnswer {
  optionId: string;
  isCorrect: boolean;
  pointsAwarded: number;
  responseTimeMs: number;
}

interface RoomInternal {
  code: string;
  host: PlayerProfileState;
  guest: PlayerProfileState | null;
  status: RoomStatus;
  questions: MultiplayerQuestionData[];
  currentQuestionIndex: number;
  roundStartTime: number | null;
  roundDurationSec: number;
  roundLockTime: number | null;
  startingStartTime: number | null;
  firstWinnerId: string | null;
  secondWinnerId: string | null;
  answers: Map<string, InternalAnswer>;
  lastRoundResult: RoundResultSummary | null;
  roundHistory: RoundResultSummary[];
  createdAt: number;
  updatedAt: number;
  subscribers: Set<Response>;
}

const rooms = new Map<string, RoomInternal>();

// Generate 6-char friendly code without confusing characters (no 0/O, 1/I)
function generateRoomCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Convert internal room state to safe client state
// Crucial for security: does NOT expose correctOptionId during active round!
export function toClientState(room: RoomInternal, forPlayerId?: string): RoomStateClient {
  const now = Date.now();
  let timeRemainingMs = 0;
  if (room.status === 'in_round' && room.roundStartTime) {
    const elapsed = now - room.roundStartTime;
    timeRemainingMs = Math.max(0, room.roundDurationSec * 1000 - elapsed);
  }

  const currQ = room.questions[room.currentQuestionIndex];
  let clientQuestion: MultiplayerQuestionClient | null = null;
  if (currQ && (room.status === 'in_round' || room.status === 'round_locked')) {
    clientQuestion = {
      id: currQ.id,
      roundNumber: room.currentQuestionIndex + 1,
      totalRounds: room.questions.length,
      category: currQ.category,
      difficulty: currQ.difficulty,
      situation: currQ.situation,
      prompt: currQ.prompt,
      options: currQ.options,
    };
  }

  return {
    code: room.code,
    status: room.status,
    host: { ...room.host },
    guest: room.guest ? { ...room.guest } : null,
    currentRound: room.currentQuestionIndex + 1,
    totalRounds: room.questions.length,
    currentQuestion: clientQuestion,
    roundStartTime: room.roundStartTime,
    roundDurationSec: room.roundDurationSec,
    timeRemainingMs,
    lastRoundResult: room.lastRoundResult,
    roundHistory: room.roundHistory,
    updatedAt: room.updatedAt,
  };
}

// Broadcast updated room state to all SSE subscribers
function broadcast(room: RoomInternal) {
  room.updatedAt = Date.now();
  const snapshot = toClientState(room);
  const data = `data: ${JSON.stringify(snapshot)}\n\n`;

  for (const res of room.subscribers) {
    try {
      res.write(data);
    } catch {
      room.subscribers.delete(res);
    }
  }
}

// Build round result summary when round locks
function buildRoundResult(room: RoomInternal): RoundResultSummary {
  const q = room.questions[room.currentQuestionIndex];
  const correctOpt = q.options.find((o) => o.id === q.correctOptionId);

  const playerAnswersObj: RoundResultSummary['playerAnswers'] = {};
  room.answers.forEach((ans, pid) => {
    playerAnswersObj[pid] = { ...ans };
  });

  const hostWinner = room.firstWinnerId === room.host.id;
  const guestWinner = room.guest && room.firstWinnerId === room.guest.id;

  const winnerName = hostWinner
    ? room.host.name
    : guestWinner && room.guest
    ? room.guest.name
    : null;

  const secondName =
    room.secondWinnerId === room.host.id
      ? room.host.name
      : room.guest && room.secondWinnerId === room.guest.id
      ? room.guest.name
      : null;

  return {
    questionId: q.id,
    roundNumber: room.currentQuestionIndex + 1,
    title: q.title,
    situation: q.situation,
    correctOptionId: q.correctOptionId,
    correctOptionText: correctOpt?.text || 'Safe choice',
    winnerPlayerId: room.firstWinnerId,
    winnerPlayerName: winnerName,
    secondPlayerId: room.secondWinnerId,
    secondPlayerName: secondName,
    whySafe: q.whySafe,
    playerAnswers: playerAnswersObj,
  };
}

// Exported Room Operations
export const roomService = {
  createRoom(hostData: { id: string; name: string; avatar: string }): RoomStateClient {
    let code = generateRoomCode();
    while (rooms.has(code)) {
      code = generateRoomCode();
    }

    const questions = getEightRandomQuestions();

    const newRoom: RoomInternal = {
      code,
      host: {
        id: hostData.id,
        name: hostData.name || 'Player 1',
        avatar: hostData.avatar || '🤖',
        score: 0,
        correctCount: 0,
        fastestResponseMs: null,
        isConnected: true,
        lastSeen: Date.now(),
      },
      guest: null,
      status: 'waiting',
      questions,
      currentQuestionIndex: 0,
      roundStartTime: null,
      roundDurationSec: 10,
      roundLockTime: null,
      startingStartTime: null,
      firstWinnerId: null,
      secondWinnerId: null,
      answers: new Map(),
      lastRoundResult: null,
      roundHistory: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      subscribers: new Set(),
    };

    rooms.set(code, newRoom);
    return toClientState(newRoom, hostData.id);
  },

  joinRoom(code: string, guestData: { id: string; name: string; avatar: string }): RoomStateClient {
    const upperCode = code.trim().toUpperCase();
    const room = rooms.get(upperCode);
    if (!room) {
      throw new Error('Hmm… I can’t find that game.');
    }

    if (room.status === 'expired') {
      throw new Error('This game has ended.');
    }

    // If guest is already in this room (reconnect scenario)
    if (room.guest && room.guest.id === guestData.id) {
      room.guest.isConnected = true;
      room.guest.lastSeen = Date.now();
      broadcast(room);
      return toClientState(room, guestData.id);
    }

    // If host is reconnecting
    if (room.host.id === guestData.id) {
      room.host.isConnected = true;
      room.host.lastSeen = Date.now();
      broadcast(room);
      return toClientState(room, guestData.id);
    }

    // Room is full if guest already present and active
    if (room.guest && room.guest.isConnected) {
      throw new Error('That game already has two players.');
    }

    // Attach new guest
    room.guest = {
      id: guestData.id,
      name: guestData.name || 'Friend',
      avatar: guestData.avatar || '🦊',
      score: 0,
      correctCount: 0,
      fastestResponseMs: null,
      isConnected: true,
      lastSeen: Date.now(),
    };

    room.updatedAt = Date.now();
    broadcast(room);
    return toClientState(room, guestData.id);
  },

  getRoom(code: string, playerId?: string): RoomStateClient {
    const upperCode = code.trim().toUpperCase();
    const room = rooms.get(upperCode);
    if (!room) {
      throw new Error('Hmm… I can’t find that game.');
    }

    if (playerId) {
      if (room.host.id === playerId) {
        room.host.lastSeen = Date.now();
        room.host.isConnected = true;
      } else if (room.guest && room.guest.id === playerId) {
        room.guest.lastSeen = Date.now();
        room.guest.isConnected = true;
      }
    }

    return toClientState(room, playerId);
  },

  startGame(code: string, playerId: string): RoomStateClient {
    const upperCode = code.trim().toUpperCase();
    const room = rooms.get(upperCode);
    if (!room) {
      throw new Error('Hmm… I can’t find that game.');
    }

    if (room.host.id !== playerId && room.guest?.id !== playerId) {
      throw new Error('Unauthorized');
    }

    if (!room.guest) {
      throw new Error('Wait for your friend to join before starting!');
    }

    // Transition to starting countdown
    room.status = 'starting';
    room.startingStartTime = Date.now();
    room.currentQuestionIndex = 0;
    room.host.score = 0;
    room.guest.score = 0;
    room.host.correctCount = 0;
    room.guest.correctCount = 0;
    room.roundHistory = [];
    room.lastRoundResult = null;
    room.answers.clear();
    room.firstWinnerId = null;
    room.secondWinnerId = null;

    broadcast(room);
    return toClientState(room, playerId);
  },

  submitAnswer(
    code: string,
    playerId: string,
    questionId: string,
    optionId: string
  ): RoomStateClient {
    const upperCode = code.trim().toUpperCase();
    const room = rooms.get(upperCode);
    if (!room) {
      throw new Error('Hmm… I can’t find that game.');
    }

    if (room.status !== 'in_round') {
      // Question already locked or round finished
      return toClientState(room, playerId);
    }

    const currentQ = room.questions[room.currentQuestionIndex];
    if (!currentQ || currentQ.id !== questionId) {
      return toClientState(room, playerId);
    }

    // Prevent duplicate answer submission
    if (room.answers.has(playerId)) {
      return toClientState(room, playerId);
    }

    const player = room.host.id === playerId ? room.host : room.guest?.id === playerId ? room.guest : null;
    if (!player) {
      throw new Error('Player not in this game');
    }

    const now = Date.now();
    const responseTimeMs = room.roundStartTime ? Math.max(100, now - room.roundStartTime) : 1000;
    const isCorrect = optionId === currentQ.correctOptionId;

    let pointsAwarded = 0;

    if (isCorrect) {
      if (room.firstWinnerId === null) {
        // FIRST CORRECT ANSWER!
        room.firstWinnerId = playerId;
        pointsAwarded = 100;
        player.score += 100;
        player.correctCount += 1;

        if (player.fastestResponseMs === null || responseTimeMs < player.fastestResponseMs) {
          player.fastestResponseMs = responseTimeMs;
        }

        // Lock round immediately!
        room.status = 'round_locked';
        room.roundLockTime = now;
      } else if (room.secondWinnerId === null) {
        // SECOND CORRECT ANSWER within lock transition
        room.secondWinnerId = playerId;
        pointsAwarded = 60;
        player.score += 60;
        player.correctCount += 1;
      }
    } else {
      // Incorrect answer: +0 points (no punishment)
      pointsAwarded = 0;
    }

    room.answers.set(playerId, {
      optionId,
      isCorrect,
      pointsAwarded,
      responseTimeMs,
    });

    // If both players have answered, lock the round immediately
    if (room.answers.size >= 2 && room.status === 'in_round') {
      room.status = 'round_locked';
      room.roundLockTime = now;
    }

    // If round locked, build result summary
    if (room.status === 'round_locked') {
      const summary = buildRoundResult(room);
      room.lastRoundResult = summary;
      room.roundHistory.push(summary);
    }

    broadcast(room);
    return toClientState(room, playerId);
  },

  restartGame(code: string, playerId: string): RoomStateClient {
    const upperCode = code.trim().toUpperCase();
    const room = rooms.get(upperCode);
    if (!room) {
      throw new Error('Hmm… I can’t find that game.');
    }

    const usedIds = room.questions.map((q) => q.id);
    room.questions = getEightRandomQuestions(usedIds);
    room.currentQuestionIndex = 0;
    room.roundStartTime = null;
    room.roundLockTime = null;
    room.firstWinnerId = null;
    room.secondWinnerId = null;
    room.answers.clear();
    room.lastRoundResult = null;
    room.roundHistory = [];
    room.host.score = 0;
    room.host.correctCount = 0;
    if (room.guest) {
      room.guest.score = 0;
      room.guest.correctCount = 0;
    }

    // If both players are connected, start countdown immediately
    if (room.guest && room.guest.isConnected) {
      room.status = 'starting';
      room.startingStartTime = Date.now();
    } else {
      room.status = 'waiting';
    }

    broadcast(room);
    return toClientState(room, playerId);
  },

  heartbeat(code: string, playerId: string): boolean {
    const room = rooms.get(code.trim().toUpperCase());
    if (!room) return false;

    if (room.host.id === playerId) {
      room.host.lastSeen = Date.now();
      room.host.isConnected = true;
    } else if (room.guest && room.guest.id === playerId) {
      room.guest.lastSeen = Date.now();
      room.guest.isConnected = true;
    }
    return true;
  },

  subscribe(code: string, playerId: string, res: Response) {
    const upperCode = code.trim().toUpperCase();
    const room = rooms.get(upperCode);
    if (!room) {
      res.status(404).json({ error: 'Game not found' });
      return;
    }

    if (room.host.id === playerId) {
      room.host.isConnected = true;
      room.host.lastSeen = Date.now();
    } else if (room.guest && room.guest.id === playerId) {
      room.guest.isConnected = true;
      room.guest.lastSeen = Date.now();
    }

    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    room.subscribers.add(res);

    // Send immediate current state
    const snapshot = toClientState(room, playerId);
    res.write(`data: ${JSON.stringify(snapshot)}\n\n`);

    res.on('close', () => {
      room.subscribers.delete(res);
    });
  },

  leaveRoom(code: string, playerId: string) {
    const upperCode = code.trim().toUpperCase();
    const room = rooms.get(upperCode);
    if (!room) return;

    if (room.host.id === playerId) {
      room.host.isConnected = false;
    } else if (room.guest && room.guest.id === playerId) {
      room.guest.isConnected = false;
    }

    broadcast(room);
  },
};

// Authoritative Background Tick: runs every 250ms
// Handles timer expirations, lock transitions, and room cleanup
setInterval(() => {
  const now = Date.now();

  rooms.forEach((room, code) => {
    // 1. Cleanup rooms inactive for > 15 minutes
    if (now - room.updatedAt > 15 * 60 * 1000) {
      rooms.delete(code);
      return;
    }

    // 2. Starting countdown transition: 2.5 seconds
    if (room.status === 'starting' && room.startingStartTime) {
      if (now - room.startingStartTime >= 2500) {
        room.status = 'in_round';
        room.roundStartTime = now;
        room.roundLockTime = null;
        room.firstWinnerId = null;
        room.secondWinnerId = null;
        room.answers.clear();
        broadcast(room);
      }
      return;
    }

    // 3. Round active timer check (10 seconds)
    if (room.status === 'in_round' && room.roundStartTime) {
      const elapsed = now - room.roundStartTime;
      if (elapsed >= room.roundDurationSec * 1000) {
        // Timeout! Lock round
        room.status = 'round_locked';
        room.roundLockTime = now;
        const summary = buildRoundResult(room);
        room.lastRoundResult = summary;
        room.roundHistory.push(summary);
        broadcast(room);
      }
      return;
    }

    // 4. Round locked transition: 2.8 seconds to view winner/takeaway, then advance
    if (room.status === 'round_locked' && room.roundLockTime) {
      if (now - room.roundLockTime >= 2800) {
        if (room.currentQuestionIndex < room.questions.length - 1) {
          // Next round!
          room.currentQuestionIndex++;
          room.status = 'in_round';
          room.roundStartTime = now;
          room.roundLockTime = null;
          room.firstWinnerId = null;
          room.secondWinnerId = null;
          room.answers.clear();
          broadcast(room);
        } else {
          // All 8 rounds completed!
          room.status = 'game_over';
          room.roundLockTime = null;
          broadcast(room);
        }
      }
      return;
    }

    // 5. Check player heartbeats (10s disconnect threshold)
    let changed = false;
    if (room.host.isConnected && now - room.host.lastSeen > 10000) {
      room.host.isConnected = false;
      changed = true;
    }
    if (room.guest && room.guest.isConnected && now - room.guest.lastSeen > 10000) {
      room.guest.isConnected = false;
      changed = true;
    }
    if (changed) {
      broadcast(room);
    }
  });
}, 250);
