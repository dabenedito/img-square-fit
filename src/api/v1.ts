import { Router } from 'express';

const api = Router();

api.get('/', (_req, res) => {
  res.status(200).json({ ok: true, api: 'v1' });
});

api.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'imgsquarefit-bot', version: 'v1' });
});

export default api;