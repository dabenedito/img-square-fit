import { Context } from 'telegraf';
import sharp from 'sharp';

export const handleImageToSquare = async (ctx: Context) => {
  try {
    const { photo: photos } = <any>ctx.message;
    if (!photos || photos.length === 0) {
      return ctx.reply('Não encontrei nenhuma imagem na mensagem, Chief.');
    }

    const fileId = photos[photos.length - 1].file_id;
    const fileInfo = await ctx.telegram.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${ process.env.TELEGRAM_BOT_TOKEN }/${ fileInfo.file_path }`;

    // Faz download da imagem via fetch
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Erro ao baixar imagem: ${ response.status } ${ response.statusText }`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    const processedBuffer = sharp(inputBuffer);
    const metadata = await processedBuffer.metadata();

    let size: number;
    if (metadata.width && metadata.height) {
      size = Math.max(metadata.width, metadata.height);
    } else {
      size = 512; // Tamanho padrão se não conseguir obter as dimensões
    }

    const foreground = await processedBuffer.resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    }).png()
      .toBuffer();

    const background = await processedBuffer.resize(size, size, { fit: 'cover' })
      .blur(30)
      .toBuffer();

    const fullImage = await sharp(background)
      .composite([{ input: foreground, gravity: 'center' }])
      .png()
      .toBuffer();

    await ctx.replyWithPhoto({ source: fullImage }, { caption: `Imagem ajustada para 1:1` });
  } catch (err) {
    console.error('Erro ao processar imagem:', err);
    await ctx.reply('Falhei ao ajustar a imagem. Tenta outra ou verifica se a imagem');
  }
}
