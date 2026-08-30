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
  // 2. GOLDEN SPARKLE PARTICLE SYSTEM
  // -----------------------------------------------------------------
  const sparkles = [];
  function createSparkle(x, y) {
    for (let i = 0; i < 4; i++) {
      sparkles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 2,
        size: Math.random() * 4 + 2,
        color: Math.random() > 0.4 ? '#F3E5AB' : '#D4AF37', // Golden sparkles
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
  // 4. GOLDEN PULL STRING ELASTIC & DRAG MECHANICS
  // -----------------------------------------------------------------
  const pullTassel = document.getElementById('pullTassel');
  const stringPath = document.getElementById('stringPath');
  const initiatorOverlay = document.getElementById('initiatorOverlay');
  const invitationPage = document.getElementById('invitationPage');

  let isDragging = false;
  let startY = 0;
  let currentY = 0;
  const maxPull = 160;
  const triggerThreshold = 120;
  let isUnlocked = false;

  function updateStringCurve(pullDistance) {
    const bend = pullDistance * 0.3;
    stringPath.setAttribute('d', `M 50 0 Q ${50 + bend} ${150 + pullDistance / 2} 50 ${300 + pullDistance}`);
    pullTassel.style.transform = `translateY(${pullDistance}px)`;

    // Emit golden sparkles along the tassel position
    const tasselRect = pullTassel.getBoundingClientRect();
    createSparkle(tasselRect.left + tasselRect.width / 2, tasselRect.top + tasselRect.height / 2);
  }

  function resetString() {
    let currentPull = currentY;
    function springBack() {
      if (isUnlocked) return;
      currentPull *= 0.75;
      if (Math.abs(currentPull) < 1) {
        currentPull = 0;
        updateStringCurve(0);
      } else {
        updateStringCurve(currentPull);
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
      updateStringCurve(currentY);

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
  // 5. ROYAL GATE UNLOCK & CAMERA TRANSITION
  // -----------------------------------------------------------------
  function unlockGateSequence() {
    isUnlocked = true;
    isDragging = false;

    // Trigger Door Open & Camera Forward Zoom
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
      initScratchCard();
    }, 1300);
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
  // 7. SCRATCH CARD CANVAS
  // -----------------------------------------------------------------
  function initScratchCard() {
    const scratchCanvas = document.getElementById('scratchCanvas');
    if (!scratchCanvas) return;
    const ctx = scratchCanvas.getContext('2d');
    const width = scratchCanvas.width;
    const height = scratchCanvas.height;

    // Fill with Metallic Gold Scratch Layer
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#B89748');
    grad.addColorStop(0.5, '#F3E5AB');
    grad.addColorStop(1, '#8C6D23');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Scratch Text Overlay
    ctx.fillStyle = '#1B261D';
    ctx.font = 'bold 16px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH HERE ✨', width / 2, height / 2 + 6);

    let isScratching = false;

    function scratch(x, y) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
    }

    function getPos(e) {
      const rect = scratchCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (scratchCanvas.width / rect.width),
        y: (clientY - rect.top) * (scratchCanvas.height / rect.height)
      };
    }

    function startScratch(e) {
      isScratching = true;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    }

    function moveScratch(e) {
      if (!isScratching) return;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    }

    function stopScratch() {
      isScratching = false;
    }

    scratchCanvas.addEventListener('mousedown', startScratch);
    scratchCanvas.addEventListener('mousemove', moveScratch);
    window.addEventListener('mouseup', stopScratch);

    scratchCanvas.addEventListener('touchstart', startScratch, { passive: true });
    scratchCanvas.addEventListener('touchmove', moveScratch, { passive: true });
    window.addEventListener('touchend', stopScratch);
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

    // Pentatonic scale frequency notes (Flute/Sitar ambient feel)
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
