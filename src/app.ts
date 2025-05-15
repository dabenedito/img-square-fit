import express from "express";

const app = express();

app.get('/health', (_, res) => {
    res.json({message: 'Ok!'});
});

export default app;