import { Telegraf } from 'telegraf';
import { Express } from 'express';
import { TELEGRAM_BOT_TOKEN, WEBHOOK_DOMAIN } from '../../config/config';
import { handleIncomingMessage,  handleImageToSquare } from './handlers';
import { handleDocuments } from "./handlers/document";

const WEBHOOK_URL = `${WEBHOOK_DOMAIN}`;

export class TelegramBot {
  private bot: Telegraf;
  private app: Express;

  constructor(app: Express) {
    this.bot = new Telegraf(TELEGRAM_BOT_TOKEN);
    this.app = app;
    this.setup();
  }

  private setup() {
    // Middlewares e handlers aqui
    this.bot.on('photo', handleImageToSquare);
    this.bot.on('document', handleDocuments);
    this.bot.on('message', handleIncomingMessage);
  }

  public async initWebhook() {
    // Aponta o Telegraf para usar o Express como handler do webhook
    this.app.use(this.bot.webhookCallback());

    // Registra o webhook no Telegram
    await this.bot.telegram.setWebhook(WEBHOOK_URL);

    console.log(`✅ Webhook setado em: ${WEBHOOK_URL}`);
  }
}
