// Conversa com o backend. Em dev, o Vite faz proxy de /api para o servidor Express.

import { game, res } from './state.js';
import { HEXES } from './data/bairros.js';
import { toast } from './ui.js';

// Monta um "snapshot" salvável do estado atual.
function snapshot() {
  return {
    game: { ...game },
    res: { ...res },
    hexes: HEXES.map((h) => ({ name: h.name, state: h.state })),
    savedAt: new Date().toISOString(),
  };
}

export async function saveGame() {
  // Em produção (build publicado) não há servidor: evita um fetch que falharia.
  if (!import.meta.env.DEV) {
    toast('Salvar na nuvem ainda não está disponível nesta versão publicada.');
    return null;
  }
  try {
    const r = await fetch('/api/saves', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snapshot()),
    });
    if (!r.ok) throw new Error('falha');
    const data = await r.json();
    toast('Comunidade salva.');
    return data.id;
  } catch (e) {
    toast('Não foi possível salvar (servidor offline?).');
    return null;
  }
}

export async function listSaves() {
  const r = await fetch('/api/saves');
  return r.json();
}

export async function loadGame(id) {
  const r = await fetch(`/api/saves/${id}`);
  if (!r.ok) return null;
  return r.json();
}
