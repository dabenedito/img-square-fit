import { Context } from 'telegraf';

export const handleIncomingMessage = async (ctx: Context) => {
  const message = ctx.message;

  if (message && 'text' in message) {
    await ctx.reply(`Oi! 😊 Por enquanto, só consigo trabalhar com imagens.\nMe envie uma foto que você queira ajustar para o formato quadrado estilizado — com fundo borrado e tudo mais.\n\nSe tiver dúvidas ou sugestões, pode mandar também!`
  );
  }
};
