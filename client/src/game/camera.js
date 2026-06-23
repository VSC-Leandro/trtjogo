// Câmera 2D do mapa (estilo Civ/CK3): arrastar para mover, zoom com roda/pinça/botões.
// Mantém o estado de visão (mv) e expõe os controles. Não conhece o conteúdo do mapa.

export const mv = { tx: 0, ty: 0, scale: 1, min: 1, max: 4, imgW: 1000, imgH: 700, init: false };

function vp() { return document.getElementById('viewport'); }

export function applyT() {
  document.getElementById('world').style.transform =
    `translate(${mv.tx}px,${mv.ty}px) scale(${mv.scale})`;
}

export function clampPan() {
  const v = vp();
  const vw = v.clientWidth, vh = v.clientHeight;
  const ww = mv.imgW * mv.scale, wh = mv.imgH * mv.scale;
  if (ww <= vw) mv.tx = (vw - ww) / 2; else mv.tx = Math.min(0, Math.max(vw - ww, mv.tx));
  if (wh <= vh) mv.ty = (vh - wh) / 2; else mv.ty = Math.min(0, Math.max(vh - wh, mv.ty));
}

export function zoomAt(cx, cy, factor) {
  const ns = Math.max(mv.min, Math.min(mv.max, mv.scale * factor));
  if (ns === mv.scale) return;
  const wx = (cx - mv.tx) / mv.scale, wy = (cy - mv.ty) / mv.scale;
  mv.scale = ns;
  mv.tx = cx - wx * mv.scale;
  mv.ty = cy - wy * mv.scale;
  clampPan();
  applyT();
}

export function zoomBtn(f) {
  const v = vp();
  zoomAt(v.clientWidth / 2, v.clientHeight / 2, f);
}

export function resetView() {
  const v = vp();
  mv.scale = mv.min;
  mv.tx = (v.clientWidth - mv.imgW * mv.scale) / 2;
  mv.ty = (v.clientHeight - mv.imgH * mv.scale) / 2;
  clampPan();
  applyT();
}

// Ajusta a visão para mostrar o território inteiro (chamado após o mapa ser construído).
export function fitView() {
  const v = vp();
  const vw = v.clientWidth, vh = v.clientHeight;
  mv.min = Math.min(vw / mv.imgW, vh / mv.imgH) * 0.92;
  mv.max = mv.min * 4;
  mv.scale = mv.min;
  mv.tx = (vw - mv.imgW * mv.scale) / 2;
  mv.ty = (vh - mv.imgH * mv.scale) / 2;
  clampPan();
  applyT();
  mv.init = true;
}

// Conecta arrastar/zoom/toque. onTap(worldX, worldY) é chamado num clique sem arraste.
export function attachCameraInput(onTap) {
  const v = vp();
  if (!v) return;
  const pts = new Map();
  let pd = 0, downX = 0, downY = 0, moved = false, tapId = null;

  v.addEventListener('wheel', (e) => {
    e.preventDefault();
    const r = v.getBoundingClientRect();
    zoomAt(e.clientX - r.left, e.clientY - r.top, e.deltaY < 0 ? 1.12 : 1 / 1.12);
  }, { passive: false });

  v.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return;
    v.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 1) {
      v.classList.add('grabbing');
      downX = e.clientX; downY = e.clientY; moved = false; tapId = e.pointerId;
    }
  });

  v.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    const prev = pts.get(e.pointerId);
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 1) {
      mv.tx += e.clientX - prev.x;
      mv.ty += e.clientY - prev.y;
      clampPan();
      applyT();
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 4) moved = true;
    } else if (pts.size === 2) {
      const a = [...pts.values()];
      const dist = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
      const r = v.getBoundingClientRect();
      if (pd) zoomAt((a[0].x + a[1].x) / 2 - r.left, (a[0].y + a[1].y) / 2 - r.top, dist / pd);
      pd = dist; moved = true;
    }
  });

  function up(e) {
    const tap = e.pointerId === tapId && !moved && pts.size === 1;
    pts.delete(e.pointerId);
    if (pts.size < 2) pd = 0;
    if (pts.size === 0) v.classList.remove('grabbing');
    if (tap && onTap) {
      const r = v.getBoundingClientRect();
      const wx = (e.clientX - r.left - mv.tx) / mv.scale;
      const wy = (e.clientY - r.top - mv.ty) / mv.scale;
      onTap(wx, wy);
    }
  }
  v.addEventListener('pointerup', up);
  v.addEventListener('pointercancel', up);
  window.addEventListener('resize', () => { if (mv.init) { clampPan(); applyT(); } });
}
