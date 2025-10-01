import { Context } from 'telegraf';
import { TELEGRAM_BOT_TOKEN } from "../../../config/config";
import { FileMetadata } from "../../../types/document";
import { SharpService } from "../../../services/sharp.service";
import sharp from "sharp";

export const handleDocuments = async (ctx: Context) => {
  const document: FileMetadata = (<any>ctx.message).document;

  if (document) {
    if (!isValidFormat(document.mime_type)) {
      return ctx.reply('Por enquanto, só consigo trabalhar com imagens.\nMe envie uma foto que você queira ajustar para o formato quadrado estilizado — com fundo borrado e tudo mais.');
    }

    const fileInfo = await ctx.telegram.getFile(document.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${fileInfo.file_path}`;

    const response = await fetch(fileUrl);

    if (!response.ok) {
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);
    const processedBuffer = sharp(inputBuffer);

    const fullImage = await SharpService.fitImage(processedBuffer);

    await ctx.replyWithPhoto({ source: fullImage }, { caption: `Imagem ajustada para 1:1` });
  }
};

function isValidFormat(mimeType: string): boolean {
  const formatosSharp = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/tiff',
    'image/heif',
    'image/heic',
    'image/gif', // só o primeiro frame
  ];

  return formatosSharp.includes(mimeType.toLowerCase());
}

