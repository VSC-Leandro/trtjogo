// Pequenas utilidades de UI compartilhadas entre módulos.

import { res } from './state.js';

let toastTimer = null;
export function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

export function updateRes() {
  document.getElementById('rAgua').textContent = res.agua;
  document.getElementById('rAlim').textContent = res.alim;
  document.getElementById('rMat').textContent = res.mat;
  document.getElementById('rSab').textContent = res.sab;
}
