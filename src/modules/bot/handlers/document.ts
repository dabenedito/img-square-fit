import { Context } from 'telegraf';
import { TELEGRAM_BOT_TOKEN } from "../../../config/config";
import { FileMetadata } from "../../../types/document";
import { SharpService } from "../../../services/sharp.service";
import { QueueService } from "../../../services/queue.service";


/**
 * Processa documentos enviados ao bot do Telegram, convertendo imagens para um formato quadrado estilizado.
 * O processamento inclui validação do formato, download do arquivo e aplicação de efeito de fundo borrado.
 *
 * @param {Context} ctx - O contexto do Telegram contendo informações da mensagem e documento
 * @param {QueueService} queue - Queue service to prevent memory leak.
 *
 * @returns {Promise<void>} Promise que resolve após o processamento e envio da imagem
 *
 * @throws {Error} Se houver falha no download ou no processamento da imagem
 * @example
 * // Uso como handler do Telegraf
 * bot.on('document', handleDocuments);
 */
export const handleDocuments = async (ctx: Context, queue: QueueService) => {
  console.log(
    JSON.stringify({
      message: 'Document received',
      handler: 'document-handler',
      ok: true,
      date: Date(),
    })
  );

  const document: FileMetadata = (<any>ctx.message).document;

  const start = Date.now();

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

    const fullImage = await queue.schedule(() => SharpService.fitImage(inputBuffer));

    await ctx.replyWithPhoto({ source: fullImage }, { caption: `Imagem ajustada para 1:1` });

    console.log(JSON.stringify({
      message: 'Document processed',
      handler: 'document-handler',
      ok: true,
      ms: Date.now() - start,
    }));
  } else {
    console.log(
      JSON.stringify({
        message: 'Document processing failed',
        handler: 'document-handler',
        ok: false,
        ms: Date.now() - start,
      })
    );
  }
};

/**
 * Verifica se o tipo MIME do documento é um formato de imagem suportado.
 * Formatos suportados incluem: JPEG, PNG, WebP, TIFF, HEIF, HEIC e GIF (primeiro frame).
 *
 * @param {string} mimeType - O tipo MIME do documento a ser validado
 * @returns {boolean} Verdadeiro se o formato é suportado, falso caso contrário
 */
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

