import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { roomService } from './src/server/roomService';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // In-memory user store for server auth
  const usersStore = new Map<string, any>();

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  // Auth: Sign Up
  app.post('/api/auth/signup', (req, res) => {
    try {
      const { name, email, password, avatar } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      const lowerEmail = email.toLowerCase().trim();
      const existing = usersStore.get(lowerEmail);
      if (existing) {
        // Return existing or update
        return res.json({
          user: existing,
          token: `token_${Date.now()}`,
        });
      }

      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: name.trim(),
        email: lowerEmail,
        avatar: avatar || '🤖',
        level: 1,
        levelTitle: 'Rookie',
        currentXP: 100,
        digitalTrustScore: 70,
        streakDays: 1,
        completedModulesCount: 0,
        scenariosCompletedCount: 0,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      };

      usersStore.set(lowerEmail, newUser);

      res.json({
        user: newUser,
        token: `token_${Date.now()}`,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email } = req.body;
      const lowerEmail = (email || '').toLowerCase().trim();
      const user = usersStore.get(lowerEmail);

      if (user) {
        return res.json({
          user,
          token: `token_${Date.now()}`,
        });
      }

      // Friendly fallback: if not found, create a clean profile so children are never blocked!
      const fallbackUser = {
        id: `user_${Date.now()}`,
        name: email ? email.split('@')[0] : 'Cyber Explorer',
        email: lowerEmail || 'explorer@cybermentor.app',
        avatar: '🤖',
        level: 1,
        levelTitle: 'Rookie',
        currentXP: 100,
        digitalTrustScore: 72,
        streakDays: 1,
        completedModulesCount: 0,
        scenariosCompletedCount: 0,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      };

      usersStore.set(fallbackUser.email, fallbackUser);

      res.json({
        user: fallbackUser,
        token: `token_${Date.now()}`,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Multiplayer Room: Create
  app.post('/api/rooms/create', (req, res) => {
    try {
      const { host } = req.body;
      if (!host || !host.id) {
        return res.status(400).json({ error: 'Host player information required' });
      }
      const room = roomService.createRoom(host);
      res.json(room);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Multiplayer Room: Join
  app.post('/api/rooms/join', (req, res) => {
    try {
      const { code, guest } = req.body;
      if (!code || !guest || !guest.id) {
        return res.status(400).json({ error: 'Game code and player info required' });
      }
      const room = roomService.joinRoom(code, guest);
      res.json(room);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Multiplayer Room: Get state (sync polling fallback)
  app.get('/api/rooms/:code', (req, res) => {
    try {
      const { code } = req.params;
      const playerId = req.query.playerId as string | undefined;
      const room = roomService.getRoom(code, playerId);
      res.json(room);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  });

  // Multiplayer Room: Start game
  app.post('/api/rooms/:code/start', (req, res) => {
    try {
      const { code } = req.params;
      const { playerId } = req.body;
      const room = roomService.startGame(code, playerId);
      res.json(room);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Multiplayer Room: Submit answer
  app.post('/api/rooms/:code/answer', (req, res) => {
    try {
      const { code } = req.params;
      const { playerId, questionId, optionId } = req.body;
      const room = roomService.submitAnswer(code, playerId, questionId, optionId);
      res.json(room);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Multiplayer Room: Restart game (Play Again)
  app.post('/api/rooms/:code/restart', (req, res) => {
    try {
      const { code } = req.params;
      const { playerId } = req.body;
      const room = roomService.restartGame(code, playerId);
      res.json(room);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Multiplayer Room: SSE Real-time Events Stream
  app.get('/api/rooms/:code/events', (req, res) => {
    const { code } = req.params;
    const playerId = (req.query.playerId as string) || '';
    roomService.subscribe(code, playerId, res);
  });

  // Multiplayer Room: Heartbeat
  app.post('/api/rooms/:code/heartbeat', (req, res) => {
    const { code } = req.params;
    const { playerId } = req.body;
    const ok = roomService.heartbeat(code, playerId);
    res.json({ ok });
  });

  // Multiplayer Room: Leave
  app.post('/api/rooms/:code/leave', (req, res) => {
    const { code } = req.params;
    const { playerId } = req.body;
    roomService.leaveRoom(code, playerId);
    res.json({ left: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
