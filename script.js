/* ============================================================
   WEDDING INVITATION — CUSTOM SCRIPT & SCRATCH CARD LOGIC
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // Initialize Scratch Card Effect
  const canvas = document.getElementById('scratchCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const wrapper = canvas.parentElement;

  let isScratching = false;
  let lastX = 0;
  let lastY = 0;

  function initScratchCanvas() {
    const rect = wrapper.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Metallic Silver Coating Gradient
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#D8D8D8');
    gradient.addColorStop(0.3, '#F0F0F0');
    gradient.addColorStop(0.5, '#C0C0C0');
    gradient.addColorStop(0.8, '#E8E8E8');
    gradient.addColorStop(1, '#B0B0B0');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Speckle noise pattern
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    for (let i = 0; i < 450; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    // Overlay hint on silver coating
    ctx.fillStyle = '#555555';
    ctx.font = 'bold 14px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ SCRATCH HERE ✨', rect.width / 2, rect.height / 2);
  }

  function getCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function scratchLine(x1, y1, x2, y2) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 36;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  function startScratch(e) {
    isScratching = true;
    const pos = getCoords(e);
    lastX = pos.x;
    lastY = pos.y;
    scratchLine(lastX, lastY, lastX, lastY);
  }

  function moveScratch(e) {
    if (!isScratching) return;
    const pos = getCoords(e);
    scratchLine(lastX, lastY, pos.x, pos.y);
    lastX = pos.x;
    lastY = pos.y;
  }

  function endScratch() {
    isScratching = false;
  }

  // Mouse Listeners
  canvas.addEventListener('mousedown', startScratch);
  canvas.addEventListener('mousemove', moveScratch);
  window.addEventListener('mouseup', endScratch);

  // Touch Listeners
  canvas.addEventListener('touchstart', (e) => {
    startScratch(e);
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    moveScratch(e);
  }, { passive: true });

  window.addEventListener('touchend', endScratch);

  initScratchCanvas();
});
