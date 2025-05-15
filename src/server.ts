import express from 'express';
import { PORT } from './config/config';
import { TelegramBot } from './modules/bot/telegram';

const app = express();

const start = async () => {
    const bot = new TelegramBot(app);
    await bot.initWebhook();

    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
};

start();
