import { Context } from 'telegraf';
import { TELEGRAM_BOT_TOKEN } from "../../../config/config";
import { FileMetadata } from "../../../types/document";
import { SharpService } from "../../../services/sharp.service";


/**
 * Processa documentos enviados ao bot do Telegram, convertendo imagens para um formato quadrado estilizado.
 * O processamento inclui validação do formato, download do arquivo e aplicação de efeito de fundo borrado.
 *
 * @param {Context} ctx - O contexto do Telegram contendo informações da mensagem e documento
 *
 * @returns {Promise<void>} Promise que resolve após o processamento e envio da imagem
 *
 * @throws {Error} Se houver falha no download ou no processamento da imagem
 * @example
 * // Uso como handler do Telegraf
 * bot.on('document', handleDocuments);
 */
export const handleDocuments = async (ctx: Context) => {
  console.log(
    JSON.stringify({
      message: 'Document received',
      handler: 'document-handler',
      ok: true,
      date: Date(),
      from: {
        user_id: ctx.from?.id,
        username: ctx.from?.username,
        chat_id: ctx.chat?.id,
        type: ctx.updateType,
      }
    })
  );

  const start = Date.now();

  try {
    const document: FileMetadata = (<any>ctx.message).document;

    if (!document) {
      console.warn(
        JSON.stringify({
          message: 'No document found in the message',
          handler: 'document-handler',
          ok: false,
          ms: Date.now() - start,
        })
      );

      return;
    }

    if (!isValidFormat(document.mime_type)) {
      console.log(
        JSON.stringify({
          message: 'Document type not supported.',
          handler: 'document-handler',
          ok: false,
          ms: Date.now() - start,
        })
      );

      return ctx.reply('Por enquanto, só consigo trabalhar com imagens.\nMe envie uma foto que você queira ajustar para o formato quadrado estilizado — com fundo borrado e tudo mais.');
    }
    
    if (document.file_size > 10485760) {
      console.warn(
        JSON.stringify({
          message: 'Document too large',
          handler: 'document-handler',
          ok: false,
          ms: Date.now() - start,
        })
      );

      return ctx.reply('Desculpe... o máximo que consigo ajustar é até 10MB 🙇‍♀️');
    }

    const fileInfo = await ctx.telegram.getFile(document.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${fileInfo.file_path}`;

    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`Erro ao baixar documento: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    const fullImage = await SharpService.fitImage(inputBuffer);

    await ctx.replyWithPhoto({ source: fullImage }, { caption: `Imagem ajustada para 1:1` });

    console.log(JSON.stringify({
      message: 'Document processed',
      handler: 'document-handler',
      ok: true,
      ms: Date.now() - start,
    }));
  } catch (err) {
    console.error(
      JSON.stringify({
        message: (err as Error)?.message || 'Document processing failed.',
        handler: 'document-handler',
        stack: (err as Error)?.stack,
        ok: false,
        ms: Date.now() - start,
      })
    );

    await ctx.reply('Desculpe, tive um probleminha ao processar sua imagem. 😅 Por favor, tente novamente mais tarde, vou tentar melhorar! 🙏');

    throw err;
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

