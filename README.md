# img-square-fit
Este projeto é um bot de Telegram, desenvolvido para ajustar imagens
ao formato quadrado (1:1) com um fundo estilizado da mesma imagem
com desfoque. O principal objetivo é facilitar o redimensionamento
de imagens para serem exibidas em sites, posts em redes sociais e
outros.

## 💡 Funcionalidades
- Recebe imagens no Telegram e processa para o formato quadrado (1:1).
- Aplica um efeito de fundo desfocado para realce estético.
- Suporte a diversos formatos de imagem: JPEG, PNG, WebP, TIFF, HEIF, HEIC e GIF (somente o primeiro frame).
- Orientado a modularidade e escalabilidade.

## 📂 Estrutura do Projeto
```text
img-square-fit
│
├── src
│   ├── config
│   │   └── config.ts                   # Configurações do projeto, incluindo chaves e tokens
│   ├── modules
│   │   ├── bot
│   │   │   ├── handlers
│   │   │   │   ├── document.ts         # Lida com documentos enviados ao bot
│   │   │   │   ├── image-processor.ts  # Processamento específico de imagens
│   │   │   │   ├── message.ts          # Tratamento de mensagens
│   │   │   │   └── index.ts            # Arquivo index para importação dos handlers de forma menos verbosa
│   │   └── └── telegram.ts             # Configuração e inicialização do bot Telegraf
│   ├── services
│   │   └── sharp.service.ts            # Serviço para manipulação de imagens usando Sharp
│   ├── types
│   │   └── document.d.ts               # Tipos TypeScript (definições de dados)
│   └── server.ts                       # Servidor para execução
├── .env                                # Configurações de ambiente (não versionado)
├── .env.example                        # Exemplo de arquivo .env
├── package.json                        # Configurações e dependências do projeto
├── tsconfig.json                       # Configuração do TypeScript
└── README.md                           # Documentação do projeto
```

## 🚀 Tecnologias Utilizadas
- **Node.js**: Ambiente de execução para o JavaScript no lado do servidor.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Express**: Framework para criar servidores HTTP (se necessário).
- **Telegraf**: Biblioteca para integração com bots no Telegram.
- **Sharp**: Biblioteca para manipulação e processamento de imagens.

## 🛠️ Como Executar o Projeto
### Pré-Requisitos
- Node.js (v16 ou superior)
- NPM (ou Yarn)
- Token de bot Telegram configurado no arquivo `.env`

### Configuração do Ambiente
1. Copie o arquivo `.env.example` e crie um `.env`:
``` bash
   cp .env.example .env
```
1. Adicione o token do seu bot no arquivo `.env`:
``` env
   TELEGRAM_BOT_TOKEN=seu_token_aqui
```
1. Instale as dependências:
``` bash
   npm install
```
### Executando
- Para rodar o ambiente de desenvolvimento:
``` bash
  npm run start:dev
```

## 📸 Exemplo de Uso
1. Inicie o bot com o comando acima.
2. Envie uma imagem para o bot diretamente pelo Telegram.
3. O bot retornará a imagem ajustada no formato 1:1 com fundo estilizado.

4. Ou acesse o [bot no Telegram🔗](https://t.me/imgsquarefitbot) 


## 🔧 Principais Funcionalidades Implementadas
### Manipulação de Imagens com Sharp
O serviço é responsável por processar as imagens e ajustá-las ao formato quadrado. Ele também aplica efeitos como o fundo desfocado. `SharpService`
### Comunicação com a API do Telegram
O handler processa as mensagens, valida o formato das imagens e manipula os arquivos baixados da API do Telegram. `document.ts`


## 📝 Como Contribuir
1. Faça um fork do repositório.
2. Crie uma branch para sua feature:
``` bash
   git checkout -b minha-feature
```
3. Faça commit das suas alterações:
``` bash
   git commit -m 'Adiciona nova funcionalidade'
```
4. Suba as alterações:
``` bash
   git push origin minha-feature
```
5. Abra um Pull Request.

## 📄 Licença
Este projeto está sob a licença MIT. Sinta-se à vontade para utilizá-lo e modificá-lo conforme necessário.

## 🤝 Contato
Para dúvidas ou sugestões, entre em contato pelo: diogoa.benedito@outlook.com
