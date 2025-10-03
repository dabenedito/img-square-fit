import { Context } from 'telegraf';
import { SharpService } from '../../../services/sharp.service';
import { QueueService } from "../../../services/queue.service";

/**
 * Handles the conversion of a Telegram photo message into a square format image.
 * The function processes the highest resolution version of the uploaded photo,
 * downloads it from Telegram's servers, and creates a stylized square composition
 * with the original image centered on a blurred background.
 *
 * @param {Context} ctx - Telegram context object containing message data and reply methods
 * @param {QueueService} queue - Queue service to prevent memory leak.
 * @returns {Promise<void>} A promise that resolves when the image is processed and sent back
 * @throws {Error} When image download fails or processing encounters issues
 */
export const handleImageToSquare = async (ctx: Context, queue: QueueService) => {
  try {
    const { photo: photos } = <any>ctx.message;
    if (!photos || photos.length === 0) {
      return ctx.reply('Não encontrei nenhuma imagem na mensagem 😕');
    }

    const fileId = photos[photos.length - 1].file_id;
    const fileInfo = await ctx.telegram.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${ process.env.TELEGRAM_BOT_TOKEN }/${ fileInfo.file_path }`;

    // Faz download da imagem via fetch.
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Erro ao baixar imagem: ${ response.status } ${ response.statusText }`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    const fullImage = await queue.schedule(() => SharpService.fitImage(inputBuffer));

    await ctx.replyWithPhoto({ source: fullImage }, { caption: `Imagem ajustada para 1:1` });
  } catch (err) {
    console.error('Erro ao processar imagem:', err);
    await ctx.reply('Falhei ao ajustar a imagem. Tenta outra ou verifica se a imagem não está corrompida.');
  }
}
