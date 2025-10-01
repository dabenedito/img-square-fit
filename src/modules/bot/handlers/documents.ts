import { Context, Middleware } from 'telegraf';
import { handleImageToSquare } from './image-processor';

const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/tiff',
];


export const handleDocuments = async (ctx: Context) => {
  const { document: doc } = <any>ctx.message;

  if (!doc) return;

  const mime = doc.mime_type;
  const isSupported = mime && SUPPORTED_IMAGE_TYPES.includes(mime);

  if (!isSupported) {
    return ctx.reply(
      `📎 O formato *${mime}* não é suportado.\nEnvie imagens nos formatos: JPG, PNG, WEBP, HEIC, HEIF ou TIFF.`,
      { parse_mode: 'Markdown' }
    );
  }

  const fileId = doc.file_id;
  const fileInfo = await ctx.telegram.getFile(fileId);

  const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${fileInfo.file_path}`;
  const res = await fetch(fileUrl);
  const arrayBuffer = await res.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  await handleImageToSquare(ctx, inputBuffer);
}
