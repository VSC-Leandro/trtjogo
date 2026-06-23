// Mapa hexagonal (flat-top). Constrói os bairros como hexágonos, trata seleção e regeneração.

import { HEXES, STATE } from '../data/bairros.js';
import { res } from '../state.js';
import { toast, updateRes } from '../ui.js';
import { mv, fitView } from './camera.js';

const SVGNS = 'http://www.w3.org/2000/svg';
const HS = 58;            // raio do hexágono
const MGN = 34;           // margem
const SQ3 = Math.sqrt(3);

let mapBuilt = false;
let selected = null;

function wrapName(name) {
  const words = name.split(' ');
  if (name.length <= 11 || words.length === 1) return [name];
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length <= 11) cur = (cur + ' ' + w).trim();
    else { if (cur) lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

function hexPoints(cx, cy) {
  const p = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i);
    p.push(`${(cx + HS * Math.cos(a)).toFixed(1)},${(cy + HS * Math.sin(a)).toFixed(1)}`);
  }
  return p.join(' ');
}

function paint(h) {
  const c = STATE[h.state];
  h.poly.setAttribute('fill', c.fill);
  h.poly.setAttribute('stroke', h === selected ? '#F3F0E7' : 'rgba(14,22,32,.85)');
  h.poly.setAttribute('stroke-width', h === selected ? 3 : 1);
  h.txt.setAttribute('fill', c.text);
}

export function buildMap() {
  let maxX = 0, maxY = 0;
  for (const h of HEXES) {
    h.cx = MGN + HS + h.col * (HS * 1.5);
    h.cy = MGN + HS + h.row * (HS * SQ3) + (h.col % 2) * (HS * SQ3 / 2);
    maxX = Math.max(maxX, h.cx + HS);
    maxY = Math.max(maxY, h.cy + HS);
  }
  const W = Math.round(maxX + MGN), H = Math.round(maxY + MGN);

  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('width', W);
  svg.setAttribute('height', H);
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  for (const h of HEXES) {
    const g = document.createElementNS(SVGNS, 'g');
    g.setAttribute('class', 'hex');

    const poly = document.createElementNS(SVGNS, 'polygon');
    poly.setAttribute('points', hexPoints(h.cx, h.cy));

    const txt = document.createElementNS(SVGNS, 'text');
    txt.setAttribute('x', h.cx);
    txt.setAttribute('y', h.cy);
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('font-size', '11');
    txt.setAttribute('font-weight', '500');
    txt.setAttribute('font-family', 'Space Grotesk, sans-serif');
    txt.style.pointerEvents = 'none';

    const lines = wrapName(h.name);
    lines.forEach((ln, i) => {
      const ts = document.createElementNS(SVGNS, 'tspan');
      ts.setAttribute('x', h.cx);
      ts.setAttribute('dy', i === 0 ? -(lines.length - 1) * 6 : 12);
      ts.textContent = ln;
      txt.appendChild(ts);
    });

    g.appendChild(poly);
    g.appendChild(txt);
    svg.appendChild(g);
    h.poly = poly;
    h.txt = txt;
    paint(h);
  }

  const world = document.getElementById('world');
  world.innerHTML = '';
  world.appendChild(svg);
  mv.imgW = W;
  mv.imgH = H;
  mapBuilt = true;
}

// Constrói o mapa (se preciso) e enquadra a visão.
export function initMapView() {
  if (!mapBuilt) buildMap();
  fitView();
}

function updateTilePanel(h) {
  const c = STATE[h.state];
  document.getElementById('tilePanel').style.display = 'block';
  document.getElementById('tpName').textContent = h.name;
  document.getElementById('tpStateLabel').textContent = c.label;
  document.querySelector('#tpState .dot').style.background = c.fill;
  document.getElementById('tpHint').textContent = c.hint;
}

export function selectHex(h) {
  const prev = selected;
  selected = h;
  if (prev) paint(prev);
  paint(h);
  updateTilePanel(h);
}

// Hit-test: recebe coordenadas no mundo e seleciona o bairro mais próximo.
export function handleTap(wx, wy) {
  let best = null, bd = Infinity;
  for (const h of HEXES) {
    const d = Math.hypot(h.cx - wx, h.cy - wy);
    if (d < bd) { bd = d; best = h; }
  }
  if (best && bd <= HS * 0.92) selectHex(best);
}

export function regenerar() {
  if (!selected) { toast('Selecione um terreno no mapa primeiro.'); return; }
  const h = selected;
  if (h.state === 'viva') { toast(`${h.name} já está vivo e produtivo.`); return; }
  if (h.state === 'agua' || h.state === 'mata') { toast(`${h.name} é uma área natural — preserve-a.`); return; }
  if (res.mat < 1 || res.sab < 1) { toast('Recursos insuficientes (precisa de materiais e saberes).'); return; }

  res.mat -= 1;
  res.sab -= 1;
  h.state = h.state === 'ferida' ? 'recuperacao' : 'viva';
  paint(h);
  selectHex(h);
  if (h.state === 'viva') {
    res.alim += 2;
    res.agua += 1;
    toast(`${h.name} reverdeceu! A terra agora produz.`);
  } else {
    toast(`Reverdecendo ${h.name}...`);
  }
  updateRes();
}
