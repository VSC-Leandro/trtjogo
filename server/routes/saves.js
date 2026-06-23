// Salvar/carregar partidas. Armazenamento simples em arquivos JSON (sem banco de dados).
// Para escalar de verdade, troque esta camada por SQLite/Postgres — a interface continua a mesma.

import { Router } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(__dirname, '..', 'data', 'saves');

const router = Router();

async function ensureDir() {
  await fs.mkdir(DIR, { recursive: true });
}

// Evita path traversal: só aceita ids alfanuméricos.
function safeId(id) {
  return /^[a-z0-9]+$/i.test(id) ? id : null;
}

// POST /api/saves  -> grava o estado recebido, devolve { id }
router.post('/', async (req, res) => {
  await ensureDir();
  const id = randomUUID().slice(0, 8);
  await fs.writeFile(path.join(DIR, `${id}.json`), JSON.stringify(req.body, null, 2));
  res.json({ id });
});

// GET /api/saves  -> lista os ids salvos
router.get('/', async (req, res) => {
  await ensureDir();
  const files = (await fs.readdir(DIR)).filter((f) => f.endsWith('.json'));
  res.json(files.map((f) => f.replace('.json', '')));
});

// GET /api/saves/:id  -> carrega uma partida
router.get('/:id', async (req, res) => {
  const id = safeId(req.params.id);
  if (!id) return res.status(400).json({ error: 'id inválido' });
  try {
    const data = await fs.readFile(path.join(DIR, `${id}.json`), 'utf8');
    res.json(JSON.parse(data));
  } catch {
    res.status(404).json({ error: 'partida não encontrada' });
  }
});

export default router;
