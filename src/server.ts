import express from 'express';
import { PORT } from './config/config';
import { TelegramBot } from './modules/bot/telegram';
import api from './api/v1';
import requestLogger from './middlewares/request-logger.middleware';

const app = express();

const start = async () => {
  const bot = new TelegramBot(app);
  await bot.initWebhook();

  app.use(express.json({ limit: '1mb' }));

  // Middlewares
  app.use(requestLogger);

  // Endpoints
  app.use('/api/v1', api);

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${ PORT }`);
  });
};

void start();
