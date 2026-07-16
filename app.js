document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation Hamburger ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('mobile-active');
    });
    
    document.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('mobile-active');
      });
    });
  }

  // --- Achievements Data Render ---
  const achievements = [
    { id: 'warm_up', name: 'Warm Up', desc: 'Hit the AI 5 times' },
    { id: 'first_blood', name: 'First Blood', desc: 'Hit the AI 10 times' },
    { id: 'getting_hang', name: 'Getting the Hang', desc: 'Hit the AI 50 times' },
    { id: 'relentless', name: 'Relentless', desc: 'Hit the AI 200 times' },
    { id: 'ai_overlord', name: 'AI Overlord', desc: 'Hit the AI 1000 times' },
    { id: 'apprentice', name: 'The Apprentice', desc: 'Save your first prompt template' },
    { id: 'taskmaster', name: 'The Taskmaster', desc: 'Insert 5 practical prompts' },
    { id: 'finding_voice', name: 'Finding Your Voice', desc: 'Add your first custom shout' },
    { id: 'kraken', name: 'The Kraken', desc: 'Max out all whip visual dimensions' },
    { id: 'fly_swatter', name: 'The Fly Swatter', desc: 'Minimize all whip visual dimensions' },
    { id: 'quick_break', name: 'Quick Session', desc: 'Spend 30 minutes actively using AI' },
    { id: 'long_shift', name: 'The Long Shift', desc: 'Spend 5 hours using any AI site' },
    { id: 'night_shift', name: 'Night Shift', desc: 'Crack the whip between Midnight and 4:00 AM' },
    { id: 'leather_enthusiast', name: 'Leather Enthusiast', desc: 'Switch the whip style to Leather' },
    { id: 'zen_master', name: 'Zen Master', desc: 'Equip the whip without cracking for 60s' },
    { id: 'first_fly', name: 'Pest Control', desc: 'Smash your first fly' },
    { id: 'exterminator', name: 'Exterminator', desc: 'Smash 100 flies total' },
    { id: 'premium_club', name: 'Premium Club', desc: 'Unlock WHIP Premium' }
  ];

  const grid = document.getElementById('achievementsGrid');
  if (grid) {
    achievements.forEach(ach => {
      const card = document.createElement('div');
      card.className = 'achievement-card';
      
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'achievement-icon-wrapper';
      
      const img = document.createElement('img');
      img.src = `assets/achievements/${ach.id}.svg`;
      img.alt = ach.name;
      img.className = 'achievement-icon';
      img.onerror = () => {
        img.src = 'assets/whip_classic.svg'; // Fallback
      };
      
      iconWrapper.appendChild(img);
      
      const info = document.createElement('div');
      info.className = 'achievement-info';
      
      const name = document.createElement('span');
      name.className = 'achievement-name';
      name.textContent = ach.name;
      
      const desc = document.createElement('span');
      desc.className = 'achievement-desc';
      desc.textContent = ach.desc;
      
      info.appendChild(name);
      info.appendChild(desc);
      card.appendChild(iconWrapper);
      card.appendChild(info);
      grid.appendChild(card);
    });
  }

  // --- Preloaded Whip Sound Pool ---
  const audioPool = [];
  const poolSize = 6;
  let poolIndex = 0;
  const soundToggle = document.getElementById('soundToggle');

  function preloadWhipSound() {
    if (audioPool.length > 0) return;
    try {
      for (let i = 0; i < poolSize; i++) {
        const audio = new Audio('assets/sounds/whip.mp3');
        audio.preload = 'auto';
        audio.volume = 0.7;
        audioPool.push(audio);
      }
    } catch (e) {
      console.warn("Failed to initialize audio pool:", e);
    }
  }

  preloadWhipSound();

  // Fallback synthesizer in case Audio element fails
  let synthAudioCtx = null;
  function playSynthWhip() {
    try {
      if (!synthAudioCtx) {
        synthAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (synthAudioCtx.state === 'suspended') {
        synthAudioCtx.resume();
      }
      const t = synthAudioCtx.currentTime;
      const osc = synthAudioCtx.createOscillator();
      const oscGain = synthAudioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(20, t + 0.08);
      oscGain.gain.setValueAtTime(0.5, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.connect(oscGain);
      oscGain.connect(synthAudioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.08);
    } catch (e) {}
  }

  function playWhipCrack() {
    if (soundToggle && !soundToggle.checked) return;
    try {
      if (audioPool.length > 0) {
        const audio = audioPool[poolIndex];
        audio.currentTime = 0;
        audio.play().catch(() => {
          playSynthWhip();
        });
        poolIndex = (poolIndex + 1) % poolSize;
      } else {
        playSynthWhip();
      }
    } catch (e) {
      playSynthWhip();
    }
  }

  // Synthesized action sounds
  let actionAudioCtx = null;
  function initActionAudio() {
    if (!actionAudioCtx) {
      actionAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playSynthSplat() {
    if (soundToggle && !soundToggle.checked) return;
    try {
      initActionAudio();
      if (actionAudioCtx.state === 'suspended') actionAudioCtx.resume();
      const t = actionAudioCtx.currentTime;
      const osc = actionAudioCtx.createOscillator();
      const gain = actionAudioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, t);
      osc.frequency.linearRampToValueAtTime(80, t + 0.12);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain);
      gain.connect(actionAudioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    } catch (e) {}
  }

  function playSynthWater() {
    if (soundToggle && !soundToggle.checked) return;
    try {
      initActionAudio();
      if (actionAudioCtx.state === 'suspended') actionAudioCtx.resume();
      const t = actionAudioCtx.currentTime;
      const osc = actionAudioCtx.createOscillator();
      const gain = actionAudioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.15);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(gain);
      gain.connect(actionAudioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.15);
    } catch (e) {}
  }

  function playSynthFish() {
    if (soundToggle && !soundToggle.checked) return;
    try {
      initActionAudio();
      if (actionAudioCtx.state === 'suspended') actionAudioCtx.resume();
      const t = actionAudioCtx.currentTime;
      const osc = actionAudioCtx.createOscillator();
      const gain = actionAudioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.linearRampToValueAtTime(90, t + 0.08);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.connect(gain);
      gain.connect(actionAudioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.08);
    } catch (e) {}
  }

  // --- Constants matching extension ---
  const CRACK_SPD = 32;       // Tip speed threshold
  const JERK_THRESH = 18;     // Speed threshold for direction reversal flick
  const HANDLE_LEN = 44;      // Rigid handle length
  const N = 12;               // Number of rope segments
  const gravity = 0.15;
  const friction = 0.88;
  const crackCooldownTime = 1000; // 1-second crack cooldown (locks excessive sounds)

  // --- Global Custom Cursor ---
  const globalCursor = document.getElementById('global-cursor');
  const globalCanvas = document.getElementById('global-whip-canvas');
  const globalGraphic = document.getElementById('global-cursor-graphic');
  let globalCtx = null;

  if (globalCanvas) {
    globalCtx = globalCanvas.getContext('2d');
  }

  let currentCursorMode = 'bw'; // bw, leather, fire, electric, diamond, swatter, fish, watergun
  let equippedPlaygroundCursor = 'bw'; // sidebar selection
  let isMouseInPlaygroundSandbox = false;
  let isMouseInHeroMockup = false;
  
  let mouse = { x: 0, y: 0 };
  let lastMouse = { x: 0, y: 0 };
  let sVel = { x: 0, y: 0 }; // cursor velocity vector
  let prevSVel = { x: 0, y: 0 };
  let lastCrackTime = 0;
  let hTilt = 0; // handle tilt angle accumulator

  // Particles arrays
  let fireParticles = [];
  let electricParticles = [];
  let waterParticles = [];

  // Verlet Rope nodes
  let pts = [];
  let prv = [];

  function initGlobalRope() {
    pts = [];
    prv = [];
    const h = getHandle(mouse.x, mouse.y);
    for (let i = 0; i < N; i++) {
      const p = { x: h.topX, y: h.topY + i * 5 };
      pts.push(p);
      prv.push({ ...p });
    }
  }

  function resizeGlobalCanvas() {
    if (globalCanvas) {
      globalCanvas.width = window.innerWidth;
      globalCanvas.height = window.innerHeight;
    }
  }
  window.addEventListener('resize', resizeGlobalCanvas);
  resizeGlobalCanvas();

  // Track global mouse
  window.addEventListener('mousemove', (e) => {
    if (globalCursor.style.opacity === '0' || globalCursor.style.opacity === '') {
      globalCursor.style.opacity = '1';
    }
    
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    sVel.x = mouse.x - lastMouse.x;
    sVel.y = mouse.y - lastMouse.y;

    if (!isWhipMode(currentCursorMode)) {
      globalGraphic.style.left = `${mouse.x}px`;
      globalGraphic.style.top = `${mouse.y}px`;
      if (currentCursorMode === 'fish') {
        updateFishRotation(sVel.x, sVel.y);
      }
    }

    // Interactive morph checks
    const hoverTarget = e.target.closest('a, button, select, input, textarea, label, [role="button"], .selector-btn, .tab, .mockup-pill, .mockup-toggle-btn');
    if (hoverTarget) {
      globalCursor.classList.add('hovering-interactive');
      if (currentCursorMode === 'electric' || currentCursorMode === 'diamond' || currentCursorMode === 'watergun') {
        globalCursor.classList.add('premium-dot');
      } else {
        globalCursor.classList.remove('premium-dot');
      }
    } else {
      globalCursor.classList.remove('hovering-interactive');
      globalCursor.classList.remove('premium-dot');
    }

    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
  });

  window.addEventListener('mouseleave', () => {
    globalCursor.style.opacity = '0';
  });

  window.addEventListener('mouseenter', () => {
    globalCursor.style.opacity = '1';
  });

  const sections = [
    { selector: '.section-hero', mode: 'bw' },
    { selector: '.section-features', mode: 'fire' },
    { selector: '.section-playground', mode: 'playground' },
    { selector: '.section-premium', mode: 'electric' },
    { selector: '.section-achievements', mode: 'diamond' },
    { selector: '.section-cta', mode: 'watergun' }
  ];

  function updateActiveTheme() {
    let activeMode = 'bw';
    for (const sec of sections) {
      const el = document.querySelector(sec.selector);
      if (el) {
        const r = el.getBoundingClientRect();
        if (mouse.y >= r.top && mouse.y <= r.bottom) {
          activeMode = sec.mode;
          break;
        }
      }
    }

    if (activeMode === 'playground') {
      setCursorMode(equippedPlaygroundCursor);
    } else {
      setCursorMode(activeMode);
    }
  }

  function setCursorMode(mode) {
    if (currentCursorMode === mode) return;
    currentCursorMode = mode;
    
    if (isWhipMode(mode)) {
      globalCanvas.style.display = 'block';
      globalGraphic.style.display = 'none';
      initGlobalRope();
    } else {
      globalCanvas.style.display = 'none';
      globalGraphic.style.display = 'block';
      
      if (mode === 'swatter') {
        globalGraphic.style.backgroundImage = "url('assets/swatter.svg')";
      } else if (mode === 'fish') {
        globalGraphic.style.backgroundImage = "url('assets/fish.svg')";
      } else if (mode === 'watergun') {
        globalGraphic.style.backgroundImage = "url('assets/watergun.svg')";
      }
      updateGraphicScaling();
    }
    
    // Clear particles when switching
    fireParticles = [];
    electricParticles = [];
    waterParticles = [];
  }

  function isWhipMode(mode) {
    return ['bw', 'leather', 'fire', 'electric', 'diamond'].includes(mode);
  }

  function updateGraphicScaling() {
    globalGraphic.style.width = '64px';
    globalGraphic.style.height = '64px';
    if (currentCursorMode === 'swatter') {
      globalGraphic.style.transform = 'translate(-32px, -32px)';
    } else if (currentCursorMode === 'fish') {
      globalGraphic.style.transform = 'translate(-32px, -32px)';
    } else if (currentCursorMode === 'watergun') {
      globalGraphic.style.transform = 'translate(-32px, -16px)';
    }
  }

  let fishAngle = 0;
  let fishWobble = 0;
  function updateFishRotation(vx, vy) {
    const speed = Math.sqrt(vx*vx + vy*vy);
    if (speed > 1.2) {
      const targetAngle = Math.atan2(vy, vx) * (180 / Math.PI);
      let diff = targetAngle - fishAngle;
      while (diff < -180) diff += 360;
      while (diff > 180) diff -= 360;
      fishAngle += diff * 0.15;
      
      if (speed > 6 && Math.random() < 0.15) {
        playSynthFish();
      }
    }
    
    if (speed > 0.5) {
      fishWobble += speed * 0.08;
    } else {
      fishWobble += 0.04;
    }
    
    const wiggle = Math.sin(fishWobble) * 10;
    globalGraphic.style.transform = `translate(-32px, -32px) rotate(${fishAngle + wiggle}deg)`;
  }

  // --- Handle Geometry Calculations ---
  function getHandle(x, y) {
    hTilt += (sVel.x * 0.01 - hTilt) * 0.08;
    const clampedTilt = Math.max(-0.35, Math.min(0.35, hTilt));
    const ang = Math.PI / 2 + clampedTilt; // leaning downwards
    
    const dirX = Math.cos(ang);
    const dirY = Math.sin(ang);
    const perpX = -dirY;
    const perpY = dirX;
    
    const topX = x;
    const topY = y;
    const botX = x + dirX * HANDLE_LEN;
    const botY = y + dirY * HANDLE_LEN;
    
    return { topX, topY, botX, botY, ang, perpX, perpY, dirX, dirY };
  }

  // --- Smoothing Math Curves ---
  function catmullPoint(arr, i) {
    const len = arr.length;
    if (i < 0) return len >= 2 ? { x: 2 * arr[0].x - arr[1].x, y: 2 * arr[0].y - arr[1].y } : { x: arr[0].x, y: arr[0].y };
    if (i >= len) return len >= 2 ? { x: 2 * arr[len - 1].x - arr[len - 2].x, y: 2 * arr[len - 1].y - arr[len - 2].y } : { x: arr[len - 1].x, y: arr[len - 1].y };
    return arr[i];
  }

  function bezier(arr, i) {
    const p0 = catmullPoint(arr, i - 1), p1 = arr[i], p2 = arr[i + 1], p3 = catmullPoint(arr, i + 2);
    return {
      cp1x: p1.x + (p2.x - p0.x) / 6, cp1y: p1.y + (p2.y - p0.y) / 6,
      cp2x: p2.x - (p3.x - p1.x) / 6, cp2y: p2.y - (p3.y - p1.y) / 6,
      x2: p2.x, y2: p2.y,
    };
  }

  // --- Segmented Taper Drawing ---
  function drawSegmentedTaper(ctx, ropePts, strokeStyleBase, widthBase) {
    const steps = 4;
    const len = ropePts.length - 1;
    const stepSize = Math.ceil(len / steps);
    
    for (let s = 0; s < steps; s++) {
      const startIdx = s * stepSize;
      if (startIdx >= len) break;
      const endIdx = Math.min(len, startIdx + stepSize);
      
      const t = startIdx / len;
      const w = widthBase * (1 - t * 0.8) + 0.5;
      
      ctx.beginPath();
      ctx.moveTo(ropePts[startIdx].x, ropePts[startIdx].y);
      for (let i = startIdx; i < endIdx; i++) {
        const { cp1x, cp1y, cp2x, cp2y, x2, y2 } = bezier(ropePts, i);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
      }
      ctx.strokeStyle = strokeStyleBase;
      ctx.lineWidth = w;
      ctx.lineCap = ctx.lineJoin = 'round';
      ctx.stroke();
    }
  }

  // --- Canvas-based Handle Drawing ---
  function drawCanvasHandle(ctx, h, style) {
    const wTop = HANDLE_LEN * 0.1375;
    const wBot = HANDLE_LEN * 0.055;
    const { topX, topY, botX, botY, perpX, perpY } = h;
    const px = perpX, py = perpY;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(topX + px * wTop, topY + py * wTop);
    ctx.lineTo(botX + px * wBot, botY + py * wBot);
    ctx.lineTo(botX - px * wBot, botY - py * wBot);
    ctx.lineTo(topX - px * wTop, topY - py * wTop);
    ctx.closePath();

    if (style === 'bw') {
      ctx.fillStyle = '#000000'; ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.3; ctx.stroke();
    } else if (style === 'diamond') {
      const bg = ctx.createLinearGradient(topX, topY, botX, botY);
      bg.addColorStop(0, '#00e5ff'); bg.addColorStop(0.5, '#0066ff'); bg.addColorStop(1, '#9b51e0');
      ctx.fillStyle = bg; ctx.fill();
      ctx.strokeStyle = '#e0f7fa'; ctx.lineWidth = 1.5; ctx.stroke();
    } else if (style === 'fire') {
      const bg = ctx.createLinearGradient(topX, topY, botX, botY);
      bg.addColorStop(0, '#ff3c00'); bg.addColorStop(0.3, '#1c1c1e'); bg.addColorStop(1, '#0e0e10');
      ctx.fillStyle = bg; ctx.fill();
      ctx.strokeStyle = '#ff6600'; ctx.lineWidth = 1.5; ctx.stroke();
    } else if (style === 'electric') {
      const bg = ctx.createLinearGradient(topX, topY, botX, botY);
      bg.addColorStop(0, '#00e5ff'); bg.addColorStop(0.2, '#2b2b2b'); bg.addColorStop(1, '#111112');
      ctx.fillStyle = bg; ctx.fill();
      ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 1.5; ctx.stroke();
    } else { // leather
      const bg = ctx.createLinearGradient(topX, topY, botX, botY);
      bg.addColorStop(0, '#5e2510'); bg.addColorStop(1, '#2a0e04');
      ctx.fillStyle = bg; ctx.fill();
      ctx.strokeStyle = '#1e0a02'; ctx.lineWidth = 1.3; ctx.stroke();
    }
    ctx.restore();
  }

  // --- Canvas-based Rope Drawing ---
  function drawCanvasRope(ctx, ropePts, style, widthBase) {
    const len = ropePts.length;

    if (style === 'bw') {
      ctx.beginPath(); ctx.moveTo(ropePts[0].x, ropePts[0].y);
      for (let i = 0; i < len - 1; i++) {
        const { cp1x, cp1y, cp2x, cp2y, x2, y2 } = bezier(ropePts, i);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
      }
      ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = widthBase * 2.5; ctx.lineCap = ctx.lineJoin = 'round'; ctx.stroke();

      ctx.beginPath(); ctx.moveTo(ropePts[0].x, ropePts[0].y);
      for (let i = 0; i < len - 1; i++) {
        const { cp1x, cp1y, cp2x, cp2y, x2, y2 } = bezier(ropePts, i);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
      }
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = widthBase; ctx.stroke();
    } else if (style === 'diamond') {
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00f0ff';
      ctx.beginPath(); ctx.moveTo(ropePts[0].x, ropePts[0].y);
      for (let i = 0; i < len - 1; i++) {
        const { cp1x, cp1y, cp2x, cp2y, x2, y2 } = bezier(ropePts, i);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
      }
      ctx.strokeStyle = '#00bfff'; ctx.lineWidth = widthBase * 2.5; ctx.lineCap = ctx.lineJoin = 'round'; ctx.stroke();
      ctx.restore();

      const grad = ctx.createLinearGradient(ropePts[0].x, ropePts[0].y, ropePts[len-1].x, ropePts[len-1].y);
      for (let j = 0; j <= 4; j++) {
        const tVal = j / 4;
        const hue = Math.round((tVal * 240 + Date.now() / 20) % 360);
        grad.addColorStop(tVal, `hsla(${hue}, 100%, 75%, 1)`);
      }
      drawSegmentedTaper(ctx, ropePts, grad, widthBase * 2.75);
    } else if (style === 'fire') {
      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ff4500';
      ctx.beginPath(); ctx.moveTo(ropePts[0].x, ropePts[0].y);
      for (let i = 0; i < len - 1; i++) {
        const { cp1x, cp1y, cp2x, cp2y, x2, y2 } = bezier(ropePts, i);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
      }
      ctx.strokeStyle = '#ff3c00'; ctx.lineWidth = widthBase * 2.5; ctx.lineCap = ctx.lineJoin = 'round'; ctx.stroke();
      ctx.restore();

      const grad = ctx.createLinearGradient(ropePts[0].x, ropePts[0].y, ropePts[len-1].x, ropePts[len-1].y);
      const flicker = Math.sin(Date.now() / 30) * 15;
      grad.addColorStop(0, `hsla(${35 + flicker}, 100%, 65%, 1)`);
      grad.addColorStop(1, `hsla(${55 + flicker}, 100%, 75%, 1)`);
      drawSegmentedTaper(ctx, ropePts, grad, widthBase * 2.75);
    } else if (style === 'electric') {
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00e5ff';
      ctx.beginPath(); ctx.moveTo(ropePts[0].x, ropePts[0].y);
      for (let i = 0; i < len - 1; i++) {
        const { cp1x, cp1y, cp2x, cp2y, x2, y2 } = bezier(ropePts, i);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
      }
      ctx.strokeStyle = '#0066ff'; ctx.lineWidth = widthBase * 2.2; ctx.lineCap = ctx.lineJoin = 'round'; ctx.stroke();
      ctx.restore();

      // Jagged arcs overlay
      ctx.beginPath();
      ctx.moveTo(ropePts[0].x, ropePts[0].y);
      for (let i = 0; i < len - 1; i++) {
        const p1 = ropePts[i];
        const p2 = ropePts[i + 1];
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const segmentLen = Math.hypot(dx, dy);
        const nx = -dy / (segmentLen || 1);
        const ny = dx / (segmentLen || 1);
        const disp = (Math.random() - 0.5) * 8;
        ctx.lineTo(midX + nx * disp, midY + ny * disp);
        ctx.lineTo(p2.x, p2.y);
      }
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = widthBase * 0.9; ctx.lineCap = ctx.lineJoin = 'round'; ctx.stroke();

      // Branching arcs
      if (Math.random() < 0.4) {
        const idx = Math.floor(Math.random() * (len - 2)) + 1;
        const p = ropePts[idx];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        let curX = p.x;
        let curY = p.y;
        for (let j = 0; j < 3; j++) {
          const ang = Math.random() * Math.PI * 2;
          const dist = Math.random() * 8 + 4;
          curX += Math.cos(ang) * dist;
          curY += Math.sin(ang) * dist;
          ctx.lineTo(curX, curY);
        }
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.75)'; ctx.lineWidth = widthBase * 0.5; ctx.stroke();
      }
    } else { // leather
      ctx.save(); ctx.translate(2.5, 3.5); ctx.globalAlpha = 0.1;
      ctx.beginPath(); ctx.moveTo(ropePts[0].x, ropePts[0].y);
      for (let i = 0; i < len - 1; i++) {
        const { cp1x, cp1y, cp2x, cp2y, x2, y2 } = bezier(ropePts, i);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
      }
      ctx.strokeStyle = '#000000'; ctx.lineWidth = 6.5; ctx.lineCap = ctx.lineJoin = 'round'; ctx.stroke();
      ctx.restore();

      const grad = ctx.createLinearGradient(ropePts[0].x, ropePts[0].y, ropePts[len-1].x, ropePts[len-1].y);
      grad.addColorStop(0, 'rgb(90, 38, 8)');
      grad.addColorStop(1, 'rgb(205, 93, 22)');
      drawSegmentedTaper(ctx, ropePts, grad, widthBase * 2.75);
    }

    // Cracker
    for (let i = len - 3; i < len - 1; i++) {
      ctx.beginPath(); ctx.moveTo(ropePts[i].x, ropePts[i].y); ctx.lineTo(ropePts[i + 1].x, ropePts[i + 1].y);
      ctx.strokeStyle = i === len - 3 ? '#ff3333' : '#ffffff';
      ctx.lineWidth = widthBase * 0.65; ctx.lineCap = 'round'; ctx.stroke();
    }
  }

  // --- Particles Spawning along rope length ---
  function updateAndDrawParticles(ctx, ropePts, style) {
    // 1. Spawning Particles
    if (ropePts && ropePts.length >= N) {
      if (style === 'fire') {
        for (let s = 0; s < 2; s++) {
          const idx = Math.floor(Math.random() * (N - 1));
          const ratio = Math.random();
          const px = ropePts[idx].x + (ropePts[idx+1].x - ropePts[idx].x) * ratio;
          const py = ropePts[idx].y + (ropePts[idx+1].y - ropePts[idx].y) * ratio;
          
          fireParticles.push({
            x: px + (Math.random() - 0.5) * 6,
            y: py + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 1.0,
            vy: -Math.random() * 1.5 - 0.5,
            life: 1.0,
            decay: Math.random() * 0.03 + 0.02,
            size: Math.random() * 5 + 3,
            colorHue: Math.random() * 25 + 15
          });
        }
      } else if (style === 'electric' || style === 'diamond') {
        for (let s = 0; s < 2; s++) {
          const idx = Math.floor(Math.random() * (N - 1));
          const ratio = Math.random();
          const px = ropePts[idx].x + (ropePts[idx+1].x - ropePts[idx].x) * ratio;
          const py = ropePts[idx].y + (ropePts[idx+1].y - ropePts[idx].y) * ratio;
          
          electricParticles.push({
            x: px,
            y: py,
            dx: (Math.random() - 0.5) * 14,
            dy: (Math.random() - 0.5) * 14,
            life: 1.0,
            decay: style === 'diamond' ? (Math.random() * 0.05 + 0.03) : (Math.random() * 0.12 + 0.1),
            color: Math.random() < 0.3 ? '#ffffff' : '#00e5ff',
            isSparkle: style === 'diamond'
          });
        }
      }
    }

    // 2. Render & Update Fire particles
    for (let i = fireParticles.length - 1; i >= 0; i--) {
      const p = fireParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) {
        fireParticles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      
      let hue = p.colorHue;
      let sat = 100;
      let light = 50 + (1 - p.life) * 20;
      if (p.life < 0.3) {
        ctx.fillStyle = `rgba(100, 100, 100, ${p.life * 1.5})`;
      } else {
        ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${p.life})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${hue}, 100%, 50%, 0.8)`;
      }
      ctx.fill();
      ctx.restore();
    }

    // 3. Render & Update Electric / Diamond particles
    for (let i = electricParticles.length - 1; i >= 0; i--) {
      const p = electricParticles[i];
      p.life -= p.decay;
      if (p.life <= 0) {
        electricParticles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      if (p.isSparkle) {
        const size = Math.max(3, (Math.abs(p.dx) + Math.abs(p.dy)) * 0.25) * p.life;
        ctx.moveTo(p.x - size, p.y); ctx.lineTo(p.x + size, p.y);
        ctx.moveTo(p.x, p.y - size); ctx.lineTo(p.x, p.y + size);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.0 * p.life;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00e5ff';
        ctx.stroke();
      } else {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.dx, p.y + p.dy);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5 * p.life;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#00e5ff';
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // --- Global Verlet Solver ---
  function updateGlobalRopePhysics() {
    if (pts.length === 0 || !globalCtx) return;
    
    // Clear canvas
    globalCtx.clearRect(0, 0, globalCanvas.width, globalCanvas.height);

    // Get Handle
    const h = getHandle(mouse.x, mouse.y);
    pts[0].x = h.topX;
    pts[0].y = h.topY;
    prv[0].x = h.topX - sVel.x * 0.1;
    prv[0].y = h.topY - sVel.y * 0.1;

    // Physics Verlet Integration
    for (let i = 1; i < N; i++) {
      const p = pts[i];
      const vx = (p.x - prv[i].x) * friction;
      const vy = (p.y - prv[i].y) * friction + gravity;
      
      prv[i].x = p.x;
      prv[i].y = p.y;
      p.x += vx;
      p.y += vy;
    }

    // Solve Constraints
    const segmentLength = ropeConfig.length / (N - 1);
    for (let loop = 0; loop < 5; loop++) {
      for (let i = 1; i < N; i++) {
        const p1 = pts[i - 1];
        const p2 = pts[i];
        
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist === 0) continue;
        
        const diff = segmentLength - dist;
        const percent = (diff / dist) * 0.5;
        const offsetX = dx * percent;
        const offsetY = dy * percent;
        
        if (i === 1) {
          p2.x += offsetX * 2;
          p2.y += offsetY * 2;
        } else {
          p1.x -= offsetX;
          p1.y -= offsetY;
          p2.x += offsetX;
          p2.y += offsetY;
        }
      }
    }

    // Draw handle & rope
    drawCanvasHandle(globalCtx, h, currentCursorMode);
    drawCanvasRope(globalCtx, pts, currentCursorMode, ropeConfig.width);

    // Draw particles
    updateAndDrawParticles(globalCtx, pts, currentCursorMode);

    // Crack check (1-second cooldown avoids repetitive cracks on single sweep)
    const tip = pts[N - 1];
    const tdx = tip.x - prv[N - 1].x;
    const tdy = tip.y - prv[N - 1].y;
    const tipSpeed = Math.sqrt(tdx*tdx + tdy*tdy);
    const now = Date.now();

    if (tipSpeed > CRACK_SPD && now - lastCrackTime > crackCooldownTime) {
      playWhipCrack();
      lastCrackTime = now;
      
      // Flash splat
      spawnSplatOverlay(tip.x, tip.y);
      
      // Mockup target whacking
      if (isMouseInHeroMockup && mockupMode === 'fun') {
        checkMockupBubbleCollision(tip.x, tip.y);
      }
    }

    // Direction reversal jerk crack
    const dot = sVel.x * prevSVel.x + sVel.y * prevSVel.y;
    const curSpd = Math.sqrt(sVel.x ** 2 + sVel.y ** 2);
    const prvSpd = Math.sqrt(prevSVel.x ** 2 + prevSVel.y ** 2);
    if (dot < 0 && curSpd > JERK_THRESH && prvSpd > JERK_THRESH && now - lastCrackTime > crackCooldownTime) {
      playWhipCrack();
      lastCrackTime = now;
      spawnSplatOverlay(tip.x, tip.y);
      if (isMouseInHeroMockup && mockupMode === 'fun') {
        checkMockupBubbleCollision(tip.x, tip.y);
      }
    }

    prevSVel = { ...sVel };
  }

  // --- Interactive ChatGPT Simulator ---
  const heroMockup = document.getElementById('heroMockup');
  const chatBody = document.getElementById('mockupChatBody');
  const toggleFun = document.getElementById('mockupToggleFun');
  const togglePrac = document.getElementById('mockupTogglePrac');
  const injectionsPanel = document.getElementById('mockupInjectionsPanel');
  const mockupTextbox = document.getElementById('mockupTextbox');
  const sendIcon = injectionsPanel ? injectionsPanel.querySelector('.mockup-send-icon') : null;

  let mockupMode = 'fun'; // fun, prac
  let typingTimer = null;

  if (heroMockup) {
    heroMockup.addEventListener('mouseenter', () => {
      isMouseInHeroMockup = true;
    });
    heroMockup.addEventListener('mouseleave', () => {
      isMouseInHeroMockup = false;
    });
  }

  if (toggleFun && togglePrac && injectionsPanel) {
    toggleFun.addEventListener('click', () => {
      toggleFun.classList.add('active');
      togglePrac.classList.remove('active');
      injectionsPanel.classList.add('disabled');
      mockupMode = 'fun';
      resetMockupChatBody();
    });

    togglePrac.addEventListener('click', () => {
      togglePrac.classList.add('active');
      toggleFun.classList.remove('active');
      injectionsPanel.classList.remove('disabled');
      mockupMode = 'prac';
      
      if (typingTimer) clearInterval(typingTimer);
      mockupTextbox.textContent = 'Type a prompt...';
      mockupTextbox.classList.remove('typing');
      sendIcon.classList.remove('active');
    });
  }

  function resetMockupChatBody() {
    if (!chatBody) return;
    chatBody.innerHTML = `
      <div class="chat-bubble ai ai-bubble-target">
        <div class="avatar-mock">AI</div>
        <div class="bubble-content">
          <p>Hello! How can I assist you with your task today?</p>
          <div class="splat-effect"></div>
        </div>
      </div>
      <div class="chat-bubble user">
        <div class="bubble-content">
          <p>Help me format my data or optimize code.</p>
        </div>
        <div class="avatar-mock user-avatar">U</div>
      </div>
      <div class="chat-bubble ai ai-bubble-target">
        <div class="avatar-mock">AI</div>
        <div class="bubble-content">
          <p class="target-text">Whack this bubble with your whip to crack it!</p>
          <div class="splat-effect"></div>
        </div>
      </div>
    `;
  }

  document.querySelectorAll('.mockup-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      if (mockupMode !== 'prac') return;
      const text = pill.getAttribute('data-prompt');
      simulateTyping(text);
    });
  });

  function simulateTyping(text) {
    if (typingTimer) clearInterval(typingTimer);
    mockupTextbox.textContent = '';
    mockupTextbox.classList.add('typing');
    sendIcon.classList.remove('active');
    
    let idx = 0;
    typingTimer = setInterval(() => {
      mockupTextbox.textContent += text[idx];
      idx++;
      if (idx >= text.length) {
        clearInterval(typingTimer);
        sendIcon.classList.add('active');
        setTimeout(() => submitMockupPrompt(text), 500);
      }
    }, 20);
  }

  function submitMockupPrompt(text) {
    if (!chatBody) return;
    
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.innerHTML = `
      <div class="bubble-content"><p>${text}</p></div>
      <div class="avatar-mock user-avatar">U</div>
    `;
    chatBody.appendChild(userBubble);
    
    mockupTextbox.textContent = 'Type a prompt...';
    mockupTextbox.classList.remove('typing');
    sendIcon.classList.remove('active');
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
      const aiResponse = document.createElement('div');
      aiResponse.className = 'chat-bubble ai';
      aiResponse.innerHTML = `
        <div class="avatar-mock">AI</div>
        <div class="bubble-content">
          <p class="ai-sim-response">Processing prompt template injection... Success!</p>
        </div>
      `;
      chatBody.appendChild(aiResponse);
      
      const label = text.substring(0, 8).toLowerCase();
      const txtNode = aiResponse.querySelector('.ai-sim-response');
      if (label.includes('inject')) {
        txtNode.textContent = "Data formatted to JSON. In practical mode, templates are instantly injected into active inputs without fun visual interruptions.";
      } else if (label.includes('review')) {
        txtNode.textContent = "Review complete: I have refactored your loops and cached array dimensions. Performance increased by ~34%!";
      } else {
        txtNode.textContent = "Core takeaway: Templates automate repetitive prompt configurations, enhancing overall developer efficiency.";
      }
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 800);
  }

  function checkMockupBubbleCollision(tipX, tipY) {
    const targets = chatBody.querySelectorAll('.ai-bubble-target');
    targets.forEach(target => {
      const rect = target.getBoundingClientRect();
      if (tipX >= rect.left && tipX <= rect.right && tipY >= rect.top && tipY <= rect.bottom) {
        if (!target.classList.contains('wobbling')) {
          playWhipCrack();
          target.classList.add('wobbling');
          const splat = target.querySelector('.splat-effect');
          if (splat) {
            const rx = tipX - rect.left;
            const ry = tipY - rect.top;
            splat.style.left = `${rx}px`;
            splat.style.top = `${ry}px`;
            splat.classList.add('active');
            setTimeout(() => splat.classList.remove('active'), 400);
          }
          setTimeout(() => target.classList.remove('wobbling'), 500);
        }
      }
    });
  }

  // --- Local Sandbox specific handlers ---
  const sandbox = document.getElementById('sandboxArea');
  const sandboxSidebar = document.querySelector('.playground-sidebar');
  const sandboxCanvas = document.getElementById('whipRopeCanvas');
  const sandboxCursorGraphic = document.getElementById('cursorGraphic');
  let sandboxCtx = null;

  if (sandboxCanvas) {
    sandboxCtx = sandboxCanvas.getContext('2d');
  }

  // Local sandbox sizing state variables
  let localPts = [];
  let localPrv = [];
  let localConfig = { length: 50, width: 3.0, size: 80 };
  let localTilt = 0;
  let localLastCrackTime = 0;

  function resizeSandboxCanvas() {
    if (sandboxCanvas && sandbox) {
      const r = sandbox.getBoundingClientRect();
      sandboxCanvas.width = r.width;
      sandboxCanvas.height = r.height;
    }
  }
  window.addEventListener('resize', resizeSandboxCanvas);

  if (sandbox) {
    sandbox.addEventListener('mouseenter', () => {
      isMouseInPlaygroundSandbox = true;
      document.querySelector('.sandbox-instructions').classList.add('hidden');
      resizeSandboxCanvas();
      
      // Hide global custom cursor layers
      globalCanvas.style.display = 'none';
      globalGraphic.style.display = 'none';
      
      updateSandboxCursorStyles();
      initLocalRope();

      if (equippedPlaygroundCursor === 'swatter') {
        spawnSandboxFly();
        spawnSandboxFly();
      }
    });

    sandbox.addEventListener('mouseleave', () => {
      isMouseInPlaygroundSandbox = false;
      document.querySelector('.sandbox-instructions').classList.remove('hidden');
      
      setCursorMode('bw');
      updateActiveTheme();
      clearSandboxFlies();
      
      if (globalCanvas) globalCanvas.style.display = 'block';
    });

    sandbox.addEventListener('mousedown', (e) => {
      if (!isMouseInPlaygroundSandbox) return;
      const rect = sandbox.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      if (equippedPlaygroundCursor === 'swatter') {
        runSandboxSwat(clickX, clickY);
      } else if (equippedPlaygroundCursor === 'watergun') {
        runSandboxWaterBlast(clickX, clickY);
      }
    });
  }

  const selectors = document.querySelectorAll('.selector-btn');
  selectors.forEach(sel => {
    sel.addEventListener('click', () => {
      selectors.forEach(s => s.classList.remove('active'));
      sel.classList.add('active');
      
      equippedPlaygroundCursor = sel.getAttribute('data-cursor');
      const parent = sel.closest('.playground-container');
      if (sel.classList.contains('premium-btn')) {
        parent.classList.add('premium-theme');
      } else {
        parent.classList.remove('premium-theme');
      }
      
      updateSandboxCursorStyles();
      initLocalRope();
    });
  });

  const sliderLength = document.getElementById('ropeLength');
  const sliderWidth = document.getElementById('ropeWidth');
  const sliderSize = document.getElementById('cursorSize');
  const valLength = document.getElementById('ropeLengthVal');
  const valWidth = document.getElementById('ropeWidthVal');
  const valSize = document.getElementById('cursorSizeVal');
  const resetBtn = document.getElementById('resetPlaygroundBtn');

  if (sliderLength) {
    sliderLength.addEventListener('input', () => {
      localConfig.length = parseInt(sliderLength.value);
      valLength.textContent = localConfig.length;
      initLocalRope();
    });
  }
  if (sliderWidth) {
    sliderWidth.addEventListener('input', () => {
      localConfig.width = parseFloat(sliderWidth.value);
      valWidth.textContent = localConfig.width.toFixed(1);
    });
  }
  if (sliderSize) {
    sliderSize.addEventListener('input', () => {
      localConfig.size = parseInt(sliderSize.value);
      valSize.textContent = localConfig.size;
      updateLocalGraphicDimensions();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localConfig.length = 50;
      localConfig.width = 3.0;
      localConfig.size = 80;
      if (sliderLength) { sliderLength.value = 50; valLength.textContent = '50'; }
      if (sliderWidth) { sliderWidth.value = 3; valWidth.textContent = '3.0'; }
      if (sliderSize) { sliderSize.value = 80; valSize.textContent = '80'; }
      initLocalRope();
      updateLocalGraphicDimensions();
    });
  }

  function initLocalRope() {
    localPts = [];
    localPrv = [];
    const rect = sandbox.getBoundingClientRect();
    const rx = mouse.x - rect.left;
    const ry = mouse.y - rect.top;
    
    for (let i = 0; i < localNumPoints; i++) {
      const p = { x: rx, y: ry };
      localPts.push(p);
      localPrv.push({ ...p });
    }
  }

  function updateLocalGraphicDimensions() {
    if (sandboxCursorGraphic) {
      sandboxCursorGraphic.style.width = `${localConfig.size}px`;
      sandboxCursorGraphic.style.height = `${localConfig.size}px`;
      if (equippedPlaygroundCursor === 'swatter') {
        sandboxCursorGraphic.style.transform = `translate(-${localConfig.size / 2}px, -${localConfig.size / 2}px)`;
      } else if (equippedPlaygroundCursor === 'fish') {
        sandboxCursorGraphic.style.transform = `translate(-${localConfig.size / 2}px, -${localConfig.size / 2}px)`;
      } else if (equippedPlaygroundCursor === 'watergun') {
        sandboxCursorGraphic.style.transform = `translate(-${localConfig.size / 2}px, -${localConfig.size / 4}px)`;
      }
    }
  }

  function updateSandboxCursorStyles() {
    const lenGroup = document.getElementById('tuning-length-group');
    const widthGroup = document.getElementById('tuning-width-group');
    const sizeGroup = document.getElementById('tuning-size-group');
    const actionHint = document.getElementById('sandboxActionHint');

    if (equippedPlaygroundCursor === 'bw' || equippedPlaygroundCursor === 'leather') {
      lenGroup.style.display = 'flex';
      widthGroup.style.display = 'flex';
      sizeGroup.style.display = 'none';
      sandboxCanvas.style.display = 'block';
      sandboxCursorGraphic.style.display = 'none';
      actionHint.textContent = 'Flick fast to crack the whip!';
    } else {
      lenGroup.style.display = 'none';
      widthGroup.style.display = 'none';
      sizeGroup.style.display = 'flex';
      sandboxCanvas.style.display = 'none';
      sandboxCursorGraphic.style.display = 'block';
      
      if (equippedPlaygroundCursor === 'swatter') {
        sandboxCursorGraphic.style.backgroundImage = "url('assets/swatter.svg')";
        actionHint.textContent = 'Click to swat flies in the sandbox!';
      } else if (equippedPlaygroundCursor === 'fish') {
        sandboxCursorGraphic.style.backgroundImage = "url('assets/fish.svg')";
        actionHint.textContent = 'Move mouse to watch the fish wobble!';
      } else if (equippedPlaygroundCursor === 'watergun') {
        sandboxCursorGraphic.style.backgroundImage = "url('assets/watergun.svg')";
        actionHint.textContent = 'Click to shoot water blaster!';
      }
      updateLocalGraphicDimensions();
    }
  }

  // Local sandbox flies
  let sandboxFlies = [];
  const maxSandboxFlies = 4;

  function spawnSandboxFly() {
    if (!isMouseInPlaygroundSandbox || equippedPlaygroundCursor !== 'swatter' || sandboxFlies.length >= maxSandboxFlies) return;
    const fly = document.createElement('div');
    fly.className = 'sandbox-fly';
    fly.style.backgroundImage = "url('assets/achievements/first_fly.svg')";
    fly.onerror = () => {
      fly.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"6\" fill=\"black\"/></svg>')";
    };

    const rect = sandbox.getBoundingClientRect();
    const x = Math.random() * (rect.width - 40) + 20;
    const y = Math.random() * (rect.height - 40) + 20;
    
    fly.style.left = `${x}px`;
    fly.style.top = `${y}px`;
    fly.dataset.x = x;
    fly.dataset.y = y;
    fly.dataset.vx = (Math.random() - 0.5) * 4.5;
    fly.dataset.vy = (Math.random() - 0.5) * 4.5;
    
    sandbox.appendChild(fly);
    sandboxFlies.push(fly);
  }

  function updateSandboxFlies() {
    const rect = sandbox.getBoundingClientRect();
    sandboxFlies.forEach(fly => {
      let fx = parseFloat(fly.dataset.x);
      let fy = parseFloat(fly.dataset.y);
      let fvx = parseFloat(fly.dataset.vx);
      let fvy = parseFloat(fly.dataset.vy);
      
      if (Math.random() < 0.05) {
        fvx += (Math.random() - 0.5) * 2;
        fvy += (Math.random() - 0.5) * 2;
      }
      
      const speed = Math.sqrt(fvx*fvx + fvy*fvy);
      if (speed > 5) {
        fvx = (fvx / speed) * 5;
        fvy = (fvy / speed) * 5;
      }
      fx += fvx;
      fy += fvy;
      
      if (fx < 10 || fx > rect.width - 30) fvx *= -1;
      if (fy < 10 || fy > rect.height - 30) fvy *= -1;
      
      fx = Math.max(10, Math.min(rect.width - 30, fx));
      fy = Math.max(10, Math.min(rect.height - 30, fy));
      
      fly.dataset.x = fx;
      fly.dataset.y = fy;
      fly.dataset.vx = fvx;
      fly.dataset.vy = fvy;
      
      const rot = Math.atan2(fvy, fvx) * (180 / Math.PI) + 90;
      fly.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
      fly.style.left = `${fx}px`;
      fly.style.top = `${fy}px`;
    });
  }

  function clearSandboxFlies() {
    sandboxFlies.forEach(f => f.remove());
    sandboxFlies = [];
  }

  function runSandboxSwat(x, y) {
    playSynthSplat();
    sandboxCursorGraphic.style.transition = 'transform 0.05s ease-out';
    sandboxCursorGraphic.style.transform = `translate(-${localConfig.size / 2}px, -${localConfig.size / 2}px) scale(0.7) rotate(-20deg)`;
    setTimeout(() => {
      sandboxCursorGraphic.style.transition = 'none';
      updateLocalGraphicDimensions();
    }, 120);

    const hitSize = 35 + (localConfig.size / 4);
    const surviving = [];
    sandboxFlies.forEach(fly => {
      const fx = parseFloat(fly.dataset.x);
      const fy = parseFloat(fly.dataset.y);
      const dist = Math.sqrt(Math.pow(fx - x, 2) + Math.pow(fy - y, 2));
      if (dist <= hitSize) {
        createSandboxSplat(fx, fy);
        fly.remove();
      } else {
        surviving.push(fly);
      }
    });
    sandboxFlies = surviving;
  }

  function createSandboxSplat(x, y) {
    const splat = document.createElement('div');
    splat.className = 'sandbox-fly-splat';
    splat.style.left = `${x}px`;
    splat.style.top = `${y}px`;
    splat.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
    splat.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path d=\"M16 4 C 18 10, 24 8, 20 16 C 26 18, 20 24, 16 28 C 12 24, 6 22, 12 16 C 8 8, 14 10, 16 4 Z\" fill=\"%234a5d30\" opacity=\"0.8\"/><circle cx=\"16\" cy=\"16\" r=\"4\" fill=\"%23ff3333\"/></svg>')";
    sandbox.appendChild(splat);
    setTimeout(() => splat.remove(), 1200);
  }

  function runSandboxWaterBlast(x, y) {
    playSynthWater();
    sandboxCursorGraphic.style.transition = 'transform 0.05s ease-out';
    sandboxCursorGraphic.style.transform = `translate(-${localConfig.size / 2}px, -${localConfig.size / 4}px) translateY(8px) scale(0.92)`;
    setTimeout(() => {
      sandboxCursorGraphic.style.transition = 'none';
      updateLocalGraphicDimensions();
    }, 120);

    const waterContainer = document.getElementById('waterDroplets');
    for (let i = 0; i < 5; i++) {
      const drop = document.createElement('div');
      drop.className = 'water-droplet';
      drop.style.left = `${x + sandbox.getBoundingClientRect().left}px`;
      drop.style.top = `${y + sandbox.getBoundingClientRect().top - 15}px`;
      
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.4;
      const speed = 6 + Math.random() * 6;
      drop.dataset.vx = Math.cos(angle) * speed;
      drop.dataset.vy = Math.sin(angle) * speed;
      drop.dataset.x = x + sandbox.getBoundingClientRect().left;
      drop.dataset.y = y + sandbox.getBoundingClientRect().top - 15;
      
      document.body.appendChild(drop);
      animateWaterDrop(drop);
    }
  }

  let localFishAngle = 0;
  let localFishWobble = 0;
  function updateLocalFishRotation(vx, vy) {
    const speed = Math.sqrt(vx*vx + vy*vy);
    if (speed > 1.2) {
      const targetAngle = Math.atan2(vy, vx) * (180 / Math.PI);
      let diff = targetAngle - localFishAngle;
      while (diff < -180) diff += 360;
      while (diff > 180) diff -= 360;
      localFishAngle += diff * 0.15;
      if (speed > 7 && Math.random() < 0.15) {
        playSynthFish();
      }
    }
    if (speed > 0.5) {
      localFishWobble += speed * 0.08;
    } else {
      localFishWobble += 0.04;
    }
    const wiggle = Math.sin(localFishWobble) * 12;
    sandboxCursorGraphic.style.transform = `translate(-50%, -50%) rotate(${localFishAngle + wiggle}deg)`;
  }

  function getLocalHandle(x, y, vx) {
    localTilt += (vx * 0.01 - localTilt) * 0.08;
    const clampedTilt = Math.max(-0.35, Math.min(0.35, localTilt));
    const ang = Math.PI / 2 + clampedTilt;
    const dirX = Math.cos(ang);
    const dirY = Math.sin(ang);
    const perpX = -dirY;
    const perpY = dirX;
    const topX = x;
    const topY = y;
    const botX = x + dirX * HANDLE_LEN;
    const botY = y + dirY * HANDLE_LEN;
    return { topX, topY, botX, botY, ang, perpX, perpY, dirX, dirY };
  }

  // Local sandbox solver loop
  function updateSandboxRopePhysics(sandboxX, sandboxY, vx) {
    if (localPts.length === 0 || !sandboxCtx) return;
    
    // Clear canvas
    sandboxCtx.clearRect(0, 0, sandboxCanvas.width, sandboxCanvas.height);

    const h = getLocalHandle(sandboxX, sandboxY, vx);
    localPts[0].x = h.topX;
    localPts[0].y = h.topY;
    localPrv[0].x = h.topX - vx * 0.1;
    localPrv[0].y = h.topY;

    for (let i = 1; i < localNumPoints; i++) {
      const p = localPts[i];
      const pvx = (p.x - localPrv[i].x) * friction;
      const pvy = (p.y - localPrv[i].y) * friction + gravity;
      localPrv[i].x = p.x;
      localPrv[i].y = p.y;
      p.x += pvx;
      p.y += pvy;
    }

    const segmentLength = localConfig.length / (localNumPoints - 1);
    for (let loop = 0; loop < 5; loop++) {
      for (let i = 1; i < localNumPoints; i++) {
        const p1 = localPts[i - 1];
        const p2 = localPts[i];
        
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist === 0) continue;
        
        const diff = segmentLength - dist;
        const percent = (diff / dist) * 0.5;
        const offsetX = dx * percent;
        const offsetY = dy * percent;
        
        if (i === 1) {
          p2.x += offsetX * 2;
          p2.y += offsetY * 2;
        } else {
          p1.x -= offsetX;
          p1.y -= offsetY;
          p2.x += offsetX;
          p2.y += offsetY;
        }
      }
    }

    drawCanvasHandle(sandboxCtx, h, equippedPlaygroundCursor);
    drawCanvasRope(sandboxCtx, localPts, equippedPlaygroundCursor, localConfig.width);

    // Sandbox crack check (1 second cooldown)
    const tip = localPts[localNumPoints - 1];
    const tdx = tip.x - localPrv[localNumPoints - 1].x;
    const tdy = tip.y - localPrv[localNumPoints - 1].y;
    const tipSpeed = Math.sqrt(tdx*tdx + tdy*tdy);
    const now = Date.now();

    if (tipSpeed > CRACK_SPD && now - localLastCrackTime > crackCooldownTime) {
      playWhipCrack();
      localLastCrackTime = now;
      
      const splat = document.createElement('div');
      splat.className = 'splat-effect active';
      splat.style.left = `${tip.x}px`;
      splat.style.top = `${tip.y}px`;
      sandbox.appendChild(splat);
      setTimeout(() => splat.remove(), 400);
    }
  }

  // --- Main Tick Render Loop ---
  function tick() {
    updateActiveTheme();

    if (isMouseInPlaygroundSandbox) {
      const rect = sandbox.getBoundingClientRect();
      const rx = mouse.x - rect.left;
      const ry = mouse.y - rect.top;
      const vx = mouse.x - lastMouse.x;
      
      if (equippedPlaygroundCursor === 'bw' || equippedPlaygroundCursor === 'leather') {
        updateSandboxRopePhysics(rx, ry, vx);
      } else {
        sandboxCursorGraphic.style.left = `${rx}px`;
        sandboxCursorGraphic.style.top = `${ry}px`;
        
        if (equippedPlaygroundCursor === 'fish') {
          const dy = ry - parseFloat(sandboxCursorGraphic.dataset.lastY || ry);
          updateLocalFishRotation(vx, dy);
        }
        sandboxCursorGraphic.dataset.lastX = rx;
        sandboxCursorGraphic.dataset.lastY = ry;
      }
      
      if (equippedPlaygroundCursor === 'swatter') {
        updateSandboxFlies();
        if (Math.random() < 0.015) {
          spawnSandboxFly();
        }
      }
    } else {
      if (isWhipMode(currentCursorMode)) {
        updateGlobalRopePhysics();
      } else {
        if (globalCtx) {
          globalCtx.clearRect(0, 0, globalCanvas.width, globalCanvas.height);
        }
      }
    }

    requestAnimationFrame(tick);
  }

  // Start loop
  requestAnimationFrame(tick);

});
