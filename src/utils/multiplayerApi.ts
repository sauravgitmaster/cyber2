import { RoomStateClient } from '../types/multiplayer';

export interface PlayerInput {
  id: string;
  name: string;
  avatar: string;
}

export const multiplayerApi = {
  async createRoom(host: PlayerInput): Promise<RoomStateClient> {
    const res = await fetch('/api/rooms/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create room');
    }
    return res.json();
  },

  async joinRoom(code: string, guest: PlayerInput): Promise<RoomStateClient> {
    const res = await fetch('/api/rooms/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, guest }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Hmm… I can’t find that game.');
    }
    return res.json();
  },

  async getRoomState(code: string, playerId?: string): Promise<RoomStateClient> {
    const url = `/api/rooms/${encodeURIComponent(code)}${playerId ? `?playerId=${encodeURIComponent(playerId)}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Game not found');
    }
    return res.json();
  },

  async startGame(code: string, playerId: string): Promise<RoomStateClient> {
    const res = await fetch(`/api/rooms/${encodeURIComponent(code)}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to start game');
    }
    return res.json();
  },

  async submitAnswer(
    code: string,
    playerId: string,
    questionId: string,
    optionId: string
  ): Promise<RoomStateClient> {
    const res = await fetch(`/api/rooms/${encodeURIComponent(code)}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, questionId, optionId, clientTime: Date.now() }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit answer');
    }
    return res.json();
  },

  async restartGame(code: string, playerId: string): Promise<RoomStateClient> {
    const res = await fetch(`/api/rooms/${encodeURIComponent(code)}/restart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to restart game');
    }
    return res.json();
  },

  async heartbeat(code: string, playerId: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/rooms/${encodeURIComponent(code)}/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async leaveRoom(code: string, playerId: string): Promise<void> {
    try {
      await fetch(`/api/rooms/${encodeURIComponent(code)}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId }),
      });
    } catch {
      // ignore
    }
  },
};
