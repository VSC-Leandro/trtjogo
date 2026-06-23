// Sistema de tempo: relógio com data correndo, organizado por estações.

import { game, SEASON_LEN, seasons, testSeasons } from '../state.js';
import { toast } from '../ui.js';

let playing = false;
let speed = 1;
let timer = null;

export function refreshClock() {
  const idx = Math.floor((game.dia - 1) / SEASON_LEN) % 4;
  const ano = 1 + Math.floor((game.dia - 1) / (SEASON_LEN * 4));
  const name = seasons[idx];
  const pill = document.getElementById('seasonPill');
  pill.textContent = name;
  pill.classList.toggle('test', !!testSeasons[name]);
  document.getElementById('dateLabel').textContent = `Ano ${ano} · Dia ${game.dia}`;
  return name;
}

export function advanceDay() {
  const before = Math.floor((game.dia - 1) / SEASON_LEN) % 4;
  game.dia++;
  const after = Math.floor((game.dia - 1) / SEASON_LEN) % 4;
  const name = refreshClock();
  if (before !== after) toast(`Chegou o ${name}.`);
}

function schedule() {
  clearInterval(timer);
  timer = setInterval(advanceDay, 1300 / speed);
}

export function togglePlay() {
  playing = !playing;
  const b = document.getElementById('playBtn');
  if (playing) {
    schedule();
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>';
  } else {
    clearInterval(timer);
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  }
}

export function setSpeed(s) {
  speed = s;
  document.querySelectorAll('.spd').forEach((x) => x.classList.toggle('sel', +x.dataset.s === s));
  if (playing) schedule();
}
