/* ============================================================
   WEDDING INVITATION INTERACTIVE LOGIC
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // -----------------------------------------------------------------
  // 1. CANVAS SETUP (SPARKLES & PIGEONS)
  // -----------------------------------------------------------------
  const sparkleCanvas = document.getElementById('sparkleCanvas');
  const sparkleCtx = sparkleCanvas.getContext('2d');
  const pigeonCanvas = document.getElementById('pigeonCanvas');
  const pigeonCtx = pigeonCanvas.getContext('2d');

  function resizeCanvases() {
    sparkleCanvas.width = window.innerWidth;
    sparkleCanvas.height = window.innerHeight;
    pigeonCanvas.width = window.innerWidth;
    pigeonCanvas.height = window.innerHeight;
  }
  resizeCanvases();
  window.addEventListener('resize', resizeCanvases);


  // -----------------------------------------------------------------
  // 2. GOLDEN & RED SPARKLE PARTICLE SYSTEM
  // -----------------------------------------------------------------
  const sparkles = [];
  function createSparkle(x, y) {
    for (let i = 0; i < 5; i++) {
      sparkles.push({
        x: x + (Math.random() - 0.5) * 25,
        y: y + (Math.random() - 0.5) * 25,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 2,
        size: Math.random() * 4 + 2,
        color: Math.random() > 0.3 ? '#F3E5AB' : '#E63946',
        life: 1,
        decay: Math.random() * 0.03 + 0.015
      });
    }
  }

  function updateSparkles() {
    sparkleCtx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
    for (let i = sparkles.length - 1; i >= 0; i--) {
      const p = sparkles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) {
        sparkles.splice(i, 1);
        continue;
      }
      sparkleCtx.save();
      sparkleCtx.globalAlpha = p.life;
      sparkleCtx.fillStyle = p.color;
      sparkleCtx.beginPath();
      sparkleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      sparkleCtx.fill();
      sparkleCtx.restore();
    }
    requestAnimationFrame(updateSparkles);
  }
  updateSparkles();


  // -----------------------------------------------------------------
  // 3. WHITE PIGEONS FLOCK SIMULATION
  // -----------------------------------------------------------------
  const pigeons = [];
  let pigeonAnimationActive = false;

  function triggerPigeonFlock() {
    pigeonAnimationActive = true;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 25; i++) {
      pigeons.push({
        x: centerX + (Math.random() - 0.5) * 80,
        y: centerY + (Math.random() - 0.5) * 80,
        z: 0.1 + Math.random() * 0.2, // scale depth
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 6 - 3,
        vz: Math.random() * 0.03 + 0.01,
        wingAngle: Math.random() * Math.PI,
        wingSpeed: 0.25 + Math.random() * 0.1,
        opacity: 1
      });
    }
  }

  function drawPigeon(ctx, x, y, scale, wingAngle, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.globalAlpha = opacity;

    // Body
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 10;
    
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 7, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    const wingY = Math.sin(wingAngle) * 18;
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.quadraticCurveTo(0, -25 + wingY, 20, -10 + wingY);
    ctx.quadraticCurveTo(5, -2, -5, 0);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.quadraticCurveTo(0, 25 - wingY, 20, 10 - wingY);
    ctx.quadraticCurveTo(5, 2, -5, 0);
    ctx.fill();

    // Tail
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(-24, -6);
    ctx.lineTo(-22, 6);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  function animatePigeons() {
    if (!pigeonAnimationActive) return;
    pigeonCtx.clearRect(0, 0, pigeonCanvas.width, pigeonCanvas.height);

    for (let i = pigeons.length - 1; i >= 0; i--) {
      const p = pigeons[i];
      p.x += p.vx * (1 + p.z);
      p.y += p.vy * (1 + p.z);
      p.z += p.vz;
      p.wingAngle += p.wingSpeed;

      if (p.x < -100 || p.x > window.innerWidth + 100 || p.y < -100 || p.z > 3) {
        p.opacity -= 0.02;
      }

      if (p.opacity <= 0) {
        pigeons.splice(i, 1);
        continue;
      }

      drawPigeon(pigeonCtx, p.x, p.y, p.z, p.wingAngle, Math.max(0, p.opacity));
    }

    if (pigeons.length > 0) {
      requestAnimationFrame(animatePigeons);
    } else {
      pigeonAnimationActive = false;
    }
  }


  // -----------------------------------------------------------------
  // 4. BRAIDED RED & GOLD PULL STRING MECHANICS (IMAGE TASSEL)
  // -----------------------------------------------------------------
  const pullTassel = document.getElementById('pullTassel');
  const initiatorOverlay = document.getElementById('initiatorOverlay');
  const invitationPage = document.getElementById('invitationPage');

  let isDragging = false;
  let startY = 0;
  let currentY = 0;
  const maxPull = 170;
  const triggerThreshold = 120;
  let isUnlocked = false;

  function updateStringPosition(pullDistance) {
    pullTassel.style.transform = `translateY(${pullDistance}px)`;

    // Emit sparkles along the bottom of the tassel image
    const tasselRect = pullTassel.getBoundingClientRect();
    createSparkle(tasselRect.left + tasselRect.width / 2, tasselRect.bottom - 15);
  }

  function resetString() {
    let currentPull = currentY;
    function springBack() {
      if (isUnlocked) return;
      currentPull *= 0.75;
      if (Math.abs(currentPull) < 1) {
        currentPull = 0;
        updateStringPosition(0);
      } else {
        updateStringPosition(currentPull);
        requestAnimationFrame(springBack);
      }
    }
    springBack();
  }

  function handleStart(e) {
    if (isUnlocked) return;
    isDragging = true;
    startY = e.touches ? e.touches[0].clientY : e.clientY;
  }

  function handleMove(e) {
    if (!isDragging || isUnlocked) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - startY;

    if (deltaY > 0) {
      currentY = Math.min(deltaY, maxPull);
      updateStringPosition(currentY);

      if (currentY >= triggerThreshold) {
        unlockGateSequence();
      }
    }
  }

  function handleEnd() {
    if (!isDragging || isUnlocked) return;
    isDragging = false;
    resetString();
  }

  pullTassel.addEventListener('mousedown', handleStart);
  window.addEventListener('mousemove', handleMove);
  window.addEventListener('mouseup', handleEnd);

  pullTassel.addEventListener('touchstart', handleStart, { passive: true });
  window.addEventListener('touchmove', handleMove, { passive: true });
  window.addEventListener('touchend', handleEnd);


  // -----------------------------------------------------------------
  // 5. ROYAL ARCH ZOOM & GATE UNLOCK SEQUENCE
  // -----------------------------------------------------------------
  function unlockGateSequence() {
    isUnlocked = true;
    isDragging = false;

    // Trigger Door Open & Royal Arch Image Zoom Forward
    initiatorOverlay.classList.add('opened');

    // Launch Pigeon Flock
    setTimeout(() => {
      triggerPigeonFlock();
      animatePigeons();
    }, 400);

    // Fade to Pistachio Main Invitation Page
    setTimeout(() => {
      invitationPage.classList.remove('hidden-page');
      initPetalFall();
      setupOriginalScratchCard();
    }, 1350);
  }


  // -----------------------------------------------------------------
  // 6. FLOATING DUSTY BLUSH PETAL FALL EFFECT
  // -----------------------------------------------------------------
  function initPetalFall() {
    const petalLayer = document.getElementById('petalLayer');
    for (let i = 0; i < 18; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.width = `${Math.random() * 12 + 8}px`;
      petal.style.height = `${Math.random() * 16 + 10}px`;
      petal.style.animationDuration = `${Math.random() * 6 + 6}s`;
      petalLayer.appendChild(petal);
    }
  }


  // -----------------------------------------------------------------
  // 7. EXACT "SCRATCH TO REVEAL" DIGITAL CARD EFFECT LOGIC
  // -----------------------------------------------------------------
  function setupOriginalScratchCard() {
    const canvas = document.getElementById('scratchCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const wrapper = canvas.parentElement;

    let isScratching = false;
    let lastX = 0;
    let lastY = 0;

    function initCanvas() {
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
      for (let i = 0; i < 400; i++) {
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

    initCanvas();
  }


  // -----------------------------------------------------------------
  // 8. BACKGROUND MUSIC SYNTHESIS (WEB AUDIO API)
  // -----------------------------------------------------------------
  const musicToggle = document.getElementById('musicToggle');
  let audioCtx = null;
  let isPlaying = false;
  let timerId = null;

  function startAmbientSynth() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33];
    
    function playNote() {
      if (!isPlaying) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      const freq = notes[Math.floor(Math.random() * notes.length)];
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 2.6);

      timerId = setTimeout(playNote, 800 + Math.random() * 1200);
    }

    playNote();
  }

  musicToggle.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
      musicToggle.classList.add('playing');
      startAmbientSynth();
    } else {
      musicToggle.classList.remove('playing');
      if (timerId) clearTimeout(timerId);
    }
  });

});
