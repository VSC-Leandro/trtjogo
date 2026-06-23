// Ponto de entrada. Costura os módulos, controla a navegação entre telas
// e expõe no window as funções usadas pelos onclick do HTML.

import './style.css';
import { game, bonusText } from './state.js';
import { refreshClock, togglePlay, setSpeed } from './game/time.js';
import { attachCameraInput, zoomBtn, resetView } from './game/camera.js';
import { initMapView, handleTap, regenerar } from './game/hexmap.js';
import { updateRes, toast } from './ui.js';
import { saveGame } from './api.js';

function go(screen) {
  document.querySelectorAll('.screen').forEach((el) => el.classList.remove('active'));
  document.getElementById('screen-' + screen).classList.add('active');
  window.scrollTo(0, 0);
}

function startGame() {
  game.nome = document.getElementById('nome').value.trim();
  game.sobrenome = document.getElementById('sobrenome').value.trim();
  if (!game.nome) { toast('Dê um nome ao guardião da comunidade.'); return; }
  if (!game.genero) { toast('Escolha o gênero do personagem.'); return; }
  if (!game.personalidade) { toast('Escolha uma personalidade.'); return; }

  const full = (game.nome + ' ' + game.sobrenome).trim();
  const initials = ((game.nome[0] || '') + (game.sobrenome[0] || game.nome[1] || '')).toUpperCase();
  document.getElementById('charName').textContent = full;
  document.getElementById('charMeta').textContent = `${game.genero} · ${game.personalidade}`;
  document.getElementById('avatar').textContent = initials;
  document.getElementById('charBonus').innerHTML =
    `<span>${game.personalidade}:</span> ${bonusText[game.personalidade]}`;

  go('map');
  requestAnimationFrame(initMapView);
  setTimeout(() => toast(`Bem-vinde, ${game.nome}. A Mata Atlântica espera por você.`), 350);
}

function tool(name) {
  toast(`${name} — ferramenta em desenvolvimento.`);
}

// Seleção na tela de criação
document.getElementById('seg-genero').addEventListener('click', (e) => {
  const b = e.target.closest('.seg-opt');
  if (!b) return;
  document.querySelectorAll('#seg-genero .seg-opt').forEach((x) => x.classList.remove('sel'));
  b.classList.add('sel');
  game.genero = b.dataset.v;
});
document.getElementById('cards-pers').addEventListener('click', (e) => {
  const b = e.target.closest('.card');
  if (!b) return;
  document.querySelectorAll('#cards-pers .card').forEach((x) => x.classList.remove('sel'));
  b.classList.add('sel');
  game.personalidade = b.dataset.v;
});

// Liga a câmera ao mapa: um clique sem arraste seleciona o bairro.
attachCameraInput(handleTap);

// Expõe a API usada pelos onclick do HTML
Object.assign(window, {
  go, startGame, tool, togglePlay, setSpeed,
  zoomBtn, resetView, regenerar, saveGame,
});

// Estado inicial
updateRes();
refreshClock();
