import dovenv from 'dotenv';
dovenv.config();

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? '';
export const PORT = Number(process.env.PORT ?? 3000);
export const WEBHOOK_DOMAIN = process.env.WEBHOOK_DOMAIN ?? '';
