// Servidor mínimo do Território.
// Hoje só faz uma coisa: salvar e carregar partidas (em arquivos JSON).
// Quando o jogo precisar de contas, ranking ou multiplayer, é aqui que cresce.

import express from 'express';
import savesRouter from './routes/saves.js';

const app = express();
app.use(express.json({ limit: '1mb' }));

app.use('/api/saves', savesRouter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Território — servidor rodando em http://localhost:${PORT}`);
});
