import { Context } from 'telegraf';
import sharp from 'sharp';
import { SharpService } from '../../../services/sharp.service';

export const handleImageToSquare = async (ctx: Context, inputBuffer?: Buffer) => {
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

    const processedBuffer = sharp(inputBuffer);
    const fullImage = await SharpService.fitImage(processedBuffer);

    await ctx.replyWithPhoto({ source: fullImage }, { caption: `Imagem ajustada para 1:1` });
  } catch (err) {
    console.error('Erro ao processar imagem:', err);
    await ctx.reply('Falhei ao ajustar a imagem. Tenta outra ou verifica se a imagem não está corrompida.');
  }
}
