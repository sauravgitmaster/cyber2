// Multiplayer Types for CyberMentor "Play With a Friend"

export interface PlayerProfileState {
  id: string;
  name: string;
  avatar: string;
  score: number;
  correctCount: number;
  fastestResponseMs: number | null;
  isConnected: boolean;
  lastSeen: number;
}

export interface MultiplayerQuestionClient {
  id: string;
  roundNumber: number; // 1-8
  totalRounds: number; // 8
  category: string;
  difficulty: string;
  situation: string;
  prompt: string;
  options: {
    id: string;
    text: string;
  }[];
}

export interface RoundResultSummary {
  questionId: string;
  roundNumber: number;
  title: string;
  situation: string;
  correctOptionId: string;
  correctOptionText: string;
  winnerPlayerId: string | null;
  winnerPlayerName: string | null;
  secondPlayerId: string | null;
  secondPlayerName: string | null;
  whySafe: string;
  playerAnswers: {
    [playerId: string]: {
      optionId: string;
      isCorrect: boolean;
      pointsAwarded: number;
      responseTimeMs: number;
    };
  };
}

export type RoomStatus =
  | 'waiting' // Host waiting for friend to join
  | 'starting' // Friend connected! Starting match in 3s
  | 'in_round' // Round active (10s soft timer)
  | 'round_locked' // Answer locked by first correct or timeout (2.5s transition)
  | 'game_over' // All 8 rounds completed
  | 'expired';

export interface RoomStateClient {
  code: string;
  status: RoomStatus;
  host: PlayerProfileState;
  guest: PlayerProfileState | null;
  currentRound: number; // 1 to 8
  totalRounds: number; // 8
  currentQuestion: MultiplayerQuestionClient | null;
  roundStartTime: number | null;
  roundDurationSec: number; // 10
  timeRemainingMs: number;
  lastRoundResult: RoundResultSummary | null;
  roundHistory: RoundResultSummary[];
  errorMessage?: string;
  updatedAt: number;
}
