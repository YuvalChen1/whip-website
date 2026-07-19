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

  // --- Audio System (Hybrid API) ---
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();
  let audioUnlocked = false;
  let useFallback = false;

  const audioBuffers = {};
  
  const audioSources = {
    whip: { url: 'assets/sounds/whip.mp3', vol: 0.7 },
    fire: { url: 'assets/sounds/fire.wav', vol: 0.4 },
    electric: { url: 'assets/sounds/electric.wav', vol: 0.8 },
    diamond: { url: 'assets/sounds/diamond.wav', vol: 0.8 },
    watergun: { url: 'assets/sounds/watergun.wav', vol: 0.8 },
    swatter: { url: 'assets/sounds/swatter.wav', vol: 0.8 },
    fly: { url: 'assets/sounds/fly.wav', vol: 0.8 }
  };

  function createAudioPool(src, size, volume) {
    const pool = [];
    for (let i = 0; i < size; i++) {
      const a = new Audio(src);
      a.volume = volume;
      a.preload = 'auto';
      pool.push(a);
    }
    return { pool, index: 0 };
  }

  const fallbackAudioPools = {
    whip: createAudioPool('assets/sounds/whip.mp3', 6, 0.7),
    fire: createAudioPool('assets/sounds/fire.wav', 4, 0.4),
    electric: createAudioPool('assets/sounds/electric.wav', 4, 0.8),
    diamond: createAudioPool('assets/sounds/diamond.wav', 4, 0.8),
    watergun: createAudioPool('assets/sounds/watergun.wav', 4, 0.8),
    swatter: createAudioPool('assets/sounds/swatter.wav', 4, 0.8),
    fly: createAudioPool('assets/sounds/fly.wav', 4, 0.8)
  };

  async function loadAudio() {
    let fetchFailed = false;
    for (const [key, config] of Object.entries(audioSources)) {
      try {
        const response = await fetch(config.url);
        if (!response.ok) throw new Error('Fetch failed');
        const arrayBuffer = await response.arrayBuffer();
        
        // Safari compatibility for decodeAudioData
        const audioBuffer = await new Promise((resolve, reject) => {
          const promise = audioCtx.decodeAudioData(
            arrayBuffer,
            (decoded) => resolve(decoded),
            (err) => reject(err)
          );
          if (promise !== undefined) {
            promise.then(resolve).catch(reject);
          }
        });
        
        audioBuffers[key] = { buffer: audioBuffer, vol: config.vol };
      } catch (e) {
        console.warn(`Local file environment detected or fetch blocked. Switching to HTML5 Audio fallback for: ${key}`);
        fetchFailed = true;
      }
    }
    if (fetchFailed) useFallback = true;
  }
  loadAudio();

  function unlockAudio() {
    audioUnlocked = true;
    if (useFallback) {
      Object.values(fallbackAudioPools).forEach(poolObj => {
        poolObj.pool.forEach(a => {
          a.muted = true;
          a.play().then(() => {
            a.pause();
            a.currentTime = 0;
            a.muted = false;
          }).catch(() => {
            a.muted = false;
          });
        });
      });
    } else if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  }

  const entryOverlay = document.getElementById('entry-overlay');
  const entryButton = document.getElementById('entry-button');

  if (entryOverlay) {
    document.body.style.overflow = 'hidden'; // Prevent scroll while overlay is active
  }

  if (entryButton) {
    entryButton.addEventListener('click', () => {
      unlockAudio();
      entryOverlay.classList.add('hidden');
      document.body.style.overflow = ''; // Restore scroll
    });
  }

  window.addEventListener('mousedown', unlockAudio);
  window.addEventListener('touchstart', unlockAudio, { passive: true });
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio);

  const globalSoundToggle = document.getElementById('globalSoundToggle');

  function playSound(type) {
    if (globalSoundToggle && !globalSoundToggle.checked) return;
    if (!audioUnlocked) return;
    
    if (useFallback) {
      const poolObj = fallbackAudioPools[type];
      if (!poolObj) return;
      const a = poolObj.pool[poolObj.index];
      a.currentTime = 0;
      a.play().catch(() => {});
      poolObj.index = (poolObj.index + 1) % poolObj.pool.length;
      return;
    }

    // Auto-resume if it fell back asleep (e.g. iOS backgrounding)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    const sound = audioBuffers[type];
    if (!sound) return;

    const source = audioCtx.createBufferSource();
    source.buffer = sound.buffer;
    
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = sound.vol;
    
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    source.start(0);
  }

  function playWhipCrack() {
    playSound('whip');
    if (currentCursorMode === 'fire') playSound('fire');
    if (currentCursorMode === 'electric') playSound('electric');
    if (currentCursorMode === 'diamond') playSound('diamond');
  }

  // --- Constants matching extension ---
  const CRACK_SPD = 22;       // Tip speed threshold
  const JERK_THRESH = 12;     // Speed threshold for direction reversal flick
  const HANDLE_LEN = 40;      // Rigid handle length
  const N = 50;               // Number of rope segments
  const GRAV = 0.38;
  const DAMP = 0.984;
  const ITERS = 12;
  const crackCooldownTime = 1000; // 1-second crack cooldown
  const ropeConfig = { length: 120, width: 2.5 };

  const STOCK_N = 4;
  const SEG = 9;
  const ARCH_BLEND = 0.45;
  let restLengths = [];
  const BEND_N = 14;
  let bendStiffness = [];
  let stockWeights = [];

  function updateRestLengths() {
    restLengths = [];
    bendStiffness = [];
    stockWeights = [];

    for (let i = 0; i < N - 1; i++) {
      if (i < STOCK_N) restLengths.push(SEG * 1.3);
      else restLengths.push(SEG * (0.6 + (i / N) * 0.5));
    }

    // Precalculate heavy math for physics loop
    for (let i = 1; i < BEND_N; i++) {
      bendStiffness[i] = 0.65 * Math.pow(1 - i / BEND_N, 1.2);
    }

    for (let i = 1; i <= STOCK_N; i++) {
      const dist = i * (SEG * 1.3);
      const upScale = 1.6;
      const outwardScale = 3.0 * Math.pow(i / STOCK_N, 2.5);
      const t = 1 - (i / (STOCK_N + 1));
      const stiffness = ARCH_BLEND * (t * t);
      stockWeights[i] = { dist, upScale, outwardScale, stiffness };
    }
  }
  updateRestLengths();

  // --- Global Custom Cursor ---
  const globalCursor = document.getElementById('global-cursor');
  const globalCanvas = document.getElementById('global-whip-canvas');
  const globalGraphic = document.getElementById('global-cursor-graphic');
  let globalCtx = null;

  if (globalCanvas) {
    globalCtx = globalCanvas.getContext('2d');
  }

  let currentCursorMode = ''; // bw, leather, fire, electric, diamond, swatter, fish, watergun
  let equippedPlaygroundCursor = 'bw'; // sidebar selection
  let isMouseInPlaygroundSandbox = false;
  let isMouseInHeroMockup = false;
  
  let mouse = { x: 0, y: 0 };
  let lastMouse = { x: 0, y: 0 };
  let mVel = { x: 0, y: 0 };
  let sVel = { x: 0, y: 0 }; // smoothed cursor velocity (exponential)
  let prevSVel = { x: 0, y: 0 };
  let lastCrackTime = 0;
  let hTilt = 0; // handle tilt angle accumulator
  let currentLoopOut = -1;     // visual float between -1 and 1
  let targetLoopSide = -1;     // locked target side
  let spinAngleAccumulator = 0;
  let prevVelAng = null;
  let prevTip = { x: 0, y: 0 };

  // Particles arrays
  let fireParticles = [];
  let electricParticles = [];
  let waterParticles = [];

  // Verlet Rope nodes
  let pts = [];
  let prv = [];

  function initGlobalRope() {
    pts = []; prv = [];
    const h = getHandle(mouse.x, mouse.y);
    for (let i = 0; i < N; i++) {
      const p = { x: h.topX, y: h.topY + i * SEG };
      pts.push(p);
      prv.push({ ...p });
    }
    prevTip = { x: pts[N-1].x, y: pts[N-1].y };
    lastCrackTime = Date.now(); // Prevent false crack on init
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

    // Smoothed velocity (exact extension logic)
    mVel.x = mouse.x - lastMouse.x;
    mVel.y = mouse.y - lastMouse.y;
    sVel.x = sVel.x * 0.7 + mVel.x * 0.3;
    sVel.y = sVel.y * 0.7 + mVel.y * 0.3;

    globalGraphic.style.left = `${mouse.x}px`;
    globalGraphic.style.top = `${mouse.y}px`;

    if (!isWhipMode(currentCursorMode)) {
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

  // --- Touch Simulation for Mobile ---
  let isTouching = false;

  function updateTouchPosition(e) {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;

      mVel.x = mouse.x - lastMouse.x;
      mVel.y = mouse.y - lastMouse.y;
      sVel.x = sVel.x * 0.7 + mVel.x * 0.3;
      sVel.y = sVel.y * 0.7 + mVel.y * 0.3;

      globalGraphic.style.left = `${mouse.x}px`;
      globalGraphic.style.top = `${mouse.y}px`;

      if (!isWhipMode(currentCursorMode)) {
        if (currentCursorMode === 'fish') {
          updateFishRotation(sVel.x, sVel.y);
        }
      }

      // Interactive morph checks
      const hoverTarget = document.elementFromPoint(mouse.x, mouse.y)?.closest('a, button, select, input, textarea, label, [role="button"], .selector-btn, .tab, .mockup-pill, .mockup-toggle-btn');
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
    }
  }

  window.addEventListener('touchstart', (e) => {
    isTouching = true;
    unlockAudio();
    
    if (currentCursorMode === 'swatter' || currentCursorMode === 'watergun' || currentCursorMode === 'fish') {
      globalCursor.style.opacity = '0';
    } else {
      globalCursor.style.opacity = '1';
    }
    
    // Teleport without velocity spike
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
    mVel.x = 0; mVel.y = 0;
    sVel.x = 0; sVel.y = 0;
    
    // Teleport whip anchor to prevent massive initial spring force
    if (isWhipMode(currentCursorMode) && pts.length > 0) {
      const h = getHandle(mouse.x, mouse.y);
      for(let i=0; i<N; i++) {
        pts[i].x = h.topX; pts[i].y = h.topY + i * SEG;
        prv[i].x = h.topX; prv[i].y = h.topY + i * SEG;
      }
      prevTip = { x: pts[N-1].x, y: pts[N-1].y };
      lastCrackTime = Date.now(); // Prevent crack sound when equipping via tap
    }

    // Removed synthetic tap trigger - handled by pointerdown natively

    updateTouchPosition(e);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isTouching) {
      updateTouchPosition(e);
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isTouching = false;
    globalCursor.style.opacity = '0';
    if (globalCtx) {
      globalCtx.clearRect(0, 0, globalCanvas.width, globalCanvas.height);
    }
  });

  window.addEventListener('touchcancel', () => {
    isTouching = false;
    globalCursor.style.opacity = '0';
  });

  const sections = [
    { selector: '.section-hero', mode: 'bw' },
    { selector: '.section-features', mode: 'fire' },
    { selector: '.section-premium', mode: 'electric' },
    { selector: '.section-achievements', mode: 'diamond' },
    { selector: '.section-cta', mode: 'watergun' },
    { selector: '.footer-bottom', mode: 'fish' },
    { selector: '.section-footer', mode: 'leather' }
  ];

  let cachedSections = [];

  function cacheSections() {
    cachedSections = sections.map(sec => {
      const el = document.querySelector(sec.selector);
      if (el) {
        const r = el.getBoundingClientRect();
        return { mode: sec.mode, top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
      }
      return null;
    }).filter(Boolean);
  }

  // Ensure sections are cached
  window.addEventListener('resize', cacheSections);
  window.addEventListener('scroll', cacheSections, { passive: true });
  setTimeout(cacheSections, 100);

  function updateActiveTheme() {
    let activeMode = 'bw';
    const pageY = mouse.y + window.scrollY;
    
    if (entryOverlay && !entryOverlay.classList.contains('hidden')) {
      activeMode = 'swatter';
    } else {
      for (const sec of cachedSections) {
        if (pageY >= sec.top && pageY <= sec.bottom) {
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
      
      // Hide swatter and watergun graphics entirely on mobile, but keep logic
      if (isTouching && (mode === 'swatter' || mode === 'watergun' || mode === 'fish')) {
        globalGraphic.style.display = 'none';
      } else {
        globalGraphic.style.display = 'block';
      }
      
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

  // --- Global Verlet Solver (exact match to extension content.js simulate()) ---
  function updateGlobalRopePhysics() {
    if (pts.length === 0 || !globalCtx) return;
    
    // Clear canvas
    globalCtx.clearRect(0, 0, globalCanvas.width, globalCanvas.height);

    // Get Handle
    const h = getHandle(mouse.x, mouse.y);

    // Hard-lock anchor to handle top (cursor)
    pts[0].x = h.topX;
    pts[0].y = h.topY;
    prv[0].x = h.topX - sVel.x * 0.1;
    prv[0].y = h.topY - sVel.y * 0.1;

    // Verlet integration
    for (let i = 1; i < N; i++) {
      const p = pts[i], pp = prv[i];
      const vx = (p.x - pp.x) * DAMP;
      const vy = (p.y - pp.y) * DAMP;
      prv[i] = { x: p.x, y: p.y };
      p.x += vx;
      p.y += vy + GRAV;
    }

    // --- Pre-Iteration Calculations (Once per frame) ---
    // Dynamic loop direction: flips after 3 full spins
    const speed = Math.sqrt(sVel.x ** 2 + sVel.y ** 2);
    if (speed > 2) {
      const velAng = Math.atan2(sVel.y, sVel.x);
      if (prevVelAng !== null) {
        let angleDiff = velAng - prevVelAng;
        if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        spinAngleAccumulator += angleDiff;
        if (Math.abs(spinAngleAccumulator) >= Math.PI * 6) {
          targetLoopSide = targetLoopSide === -1 ? 1 : -1;
          spinAngleAccumulator = 0;
        }
      }
      prevVelAng = velAng;
    } else {
      prevVelAng = null;
      spinAngleAccumulator *= 0.95;
    }

    // Smoothly transition to target loop side (compensating for moving out of 12x loop)
    currentLoopOut += (targetLoopSide - currentLoopOut) * 0.4;

    const upX = -h.dirX;
    const upY = -h.dirY;
    const outX = -h.perpX * currentLoopOut;
    const outY = -h.perpY * currentLoopOut;

    // Distance constraints + bending + stock curve (all inside ITERS loop)
    for (let iter = 0; iter < ITERS; iter++) {
      // Distance constraints
      for (let i = 0; i < N - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        const rest = restLengths[i] || SEG;
        const diff = (dist - rest) / dist;
        if (i === 0) {
          b.x -= dx * diff;
          b.y -= dy * diff;
        } else {
          a.x += dx * diff * 0.5;
          a.y += dy * diff * 0.5;
          b.x -= dx * diff * 0.5;
          b.y -= dy * diff * 0.5;
        }
      }

      // Re-lock anchor after constraints
      pts[0].x = h.topX;
      pts[0].y = h.topY;

      // Bending stiffness using precalculated array
      for (let i = 1; i < BEND_N && i < N - 1; i++) {
        const s = bendStiffness[i];
        const a = pts[i - 1], c = pts[i], b = pts[i + 1];
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        c.x += (mx - c.x) * s;
        c.y += (my - c.y) * s;
      }
      
      // Light global bending for the rest
      for (let i = BEND_N; i < N - 1; i++) {
        const s = 0.02;
        const a = pts[i - 1], c = pts[i], b = pts[i + 1];
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        c.x += (mx - c.x) * s;
        c.y += (my - c.y) * s;
      }

      // Stock projects UP out of the handle, biased outward
      for (let i = 1; i <= STOCK_N; i++) {
        const sw = stockWeights[i];
        const idealX = h.topX + upX * (sw.dist * sw.upScale) + outX * (sw.dist * sw.outwardScale);
        const idealY = h.topY + upY * (sw.dist * sw.upScale) + outY * (sw.dist * sw.outwardScale);

        pts[i].x += (idealX - pts[i].x) * sw.stiffness;
        pts[i].y += (idealY - pts[i].y) * sw.stiffness;
      }

      // Wall collisions
      for (let i = 1; i < N; i++) {
        const p = pts[i];
        let vx = p.x - prv[i].x, vy = p.y - prv[i].y, hit = false;

        if (p.x < 0) {
          p.x = 0; if (vx < 0) vx = -vx * 0.42; vy *= 0.86; hit = true;
          targetLoopSide = 1; spinAngleAccumulator = 0;
        } else if (p.x > globalCanvas.width) {
          p.x = globalCanvas.width; if (vx > 0) vx = -vx * 0.42; vy *= 0.86; hit = true;
          targetLoopSide = -1; spinAngleAccumulator = 0;
        }

        if (p.y < 0) { p.y = 0; if (vy < 0) vy = -vy * 0.42; vx *= 0.86; hit = true; }
        else if (p.y > globalCanvas.height) { p.y = globalCanvas.height; if (vy > 0) vy = -vy * 0.42; vx *= 0.86; hit = true; }

        if (hit) { prv[i].x = p.x - vx; prv[i].y = p.y - vy; }
      }
    }

    // Draw handle & rope
    drawCanvasHandle(globalCtx, h, currentCursorMode);
    drawCanvasRope(globalCtx, pts, currentCursorMode, ropeConfig.width);

    // Draw particles
    updateAndDrawParticles(globalCtx, pts, currentCursorMode);

    // Crack detection
    const tip = pts[N - 1];
    const tdx = tip.x - prevTip.x;
    const tdy = tip.y - prevTip.y;
    const tipSpeed = Math.sqrt(tdx * tdx + tdy * tdy);
    const now = Date.now();
    const canCrack = now - lastCrackTime > crackCooldownTime;

    // Speed-based crack
    if (tipSpeed > CRACK_SPD && canCrack) {
      triggerCrack(tip.x, tip.y);
    }

    // Direction reversal crack (flick)
    const dot = sVel.x * prevSVel.x + sVel.y * prevSVel.y;
    const curSpd = Math.sqrt(sVel.x ** 2 + sVel.y ** 2);
    const prvSpd = Math.sqrt(prevSVel.x ** 2 + prevSVel.y ** 2);
    if (dot < 0 && curSpd > JERK_THRESH && prvSpd > JERK_THRESH && canCrack) {
      triggerCrack(tip.x, tip.y);
    }

    prevSVel = { ...sVel };
    prevTip = { x: tip.x, y: tip.y };
  }

  // Trigger crack: sound + velocity impulse (runs ONCE per crack, not every frame)
  function triggerCrack(x, y) {
    playWhipCrack();
    lastCrackTime = Date.now();

    // Velocity impulse on rope points (exact extension logic)
    for (let i = 1; i < N; i++) {
      const t = i / (N - 1);
      pts[i].x += sVel.x * 0.5 * Math.sin(t * Math.PI) + (Math.random() - 0.5) * 3;
      pts[i].y += sVel.y * 0.5 * Math.sin(t * Math.PI) + (Math.random() - 0.5) * 3;
    }

    // Mockup target whacking
    if (isMouseInHeroMockup && mockupMode === 'fun') {
      checkMockupBubbleCollision(x, y);
    }
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


  function animateWaterDrop(drop) {
    let x = parseFloat(drop.dataset.x);
    let y = parseFloat(drop.dataset.y);
    let vx = parseFloat(drop.dataset.vx);
    let vy = parseFloat(drop.dataset.vy);

    function step() {
      x += vx;
      y += vy;
      vy += 0.4;
      drop.style.left = `${x}px`;
      drop.style.top = `${y}px`;
      if (y > window.innerHeight + 50) {
        drop.remove();
      } else {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  function checkMockupBubbleCollision(tipX, tipY) {
    if (!chatBody) return;
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

  // --- Global Interaction Effects ---
  window.addEventListener('pointerdown', (e) => {
    const isTouch = e.pointerType === 'touch' || isTouching;

    if (currentCursorMode === 'watergun') {
      playSound('watergun');
      const clickX = e.clientX;
      const clickY = e.clientY;
      
      if (!isTouch) {
        globalGraphic.style.transition = 'transform 0.05s ease-out';
        globalGraphic.style.transform = `translate(-32px, -16px) translateY(8px) scale(0.92)`;
        setTimeout(() => {
          globalGraphic.style.transition = 'none';
          updateGraphicScaling();
        }, 120);
      }

      for (let i = 0; i < 5; i++) {
        const drop = document.createElement('div');
        drop.className = 'water-droplet';
        drop.style.left = `${clickX}px`;
        drop.style.top = `${clickY - 15}px`;
        
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.4;
        const speed = 6 + Math.random() * 6;
        drop.dataset.vx = Math.cos(angle) * speed;
        drop.dataset.vy = Math.sin(angle) * speed;
        drop.dataset.x = clickX;
        drop.dataset.y = clickY - 15;
        
        document.body.appendChild(drop);
        animateWaterDrop(drop);
      }
    } else if (currentCursorMode === 'fish') {
      playSound('fish');
      const clickX = e.clientX;
      const clickY = e.clientY;
      
      // Bubble particle effect
      for(let i=0; i<3; i++) {
        const bubble = document.createElement('div');
        bubble.style.position = 'fixed';
        bubble.style.width = `${4 + Math.random() * 6}px`;
        bubble.style.height = bubble.style.width;
        bubble.style.border = '1px solid rgba(255,255,255,0.6)';
        bubble.style.borderRadius = '50%';
        bubble.style.left = `${clickX + (Math.random()-0.5)*10}px`;
        bubble.style.top = `${clickY}px`;
        bubble.style.pointerEvents = 'none';
        bubble.style.zIndex = '9999';
        document.body.appendChild(bubble);
        
        let by = clickY;
        let bx = clickX;
        function floatBubble() {
          by -= 1.5;
          bx += Math.sin(by * 0.1) * 1.5;
          bubble.style.top = `${by}px`;
          bubble.style.left = `${bx}px`;
          bubble.style.opacity = (by / clickY).toString();
          if (by > 0 && document.body.contains(bubble)) {
            requestAnimationFrame(floatBubble);
          } else {
            if (document.body.contains(bubble)) bubble.remove();
          }
        }
        requestAnimationFrame(floatBubble);
      }
      
      // Scale/wobble the fish to simulate bite
      if (!isTouch) {
        globalGraphic.style.transition = 'transform 0.05s ease-out';
        globalGraphic.style.transform = `translate(-32px, -32px) scale(1.3) rotate(${fishAngle - 20}deg)`;
        setTimeout(() => {
          globalGraphic.style.transition = 'none';
          updateGraphicScaling();
        }, 100);
      }
    } else if (currentCursorMode === 'swatter') {
      runGlobalSwat(e.clientX, e.clientY, isTouch);
    }
  });

  // --- Fly Swatter Logic ---
  let globalFlies = [];

  function spawnGlobalFly() {
    if (globalFlies.length >= 10) return; // Cap flies to prevent lag
    const isRare = Math.random() > 0.8;
    const fly = document.createElement('div');
    fly.className = 'sandbox-fly';
    if (isRare) fly.classList.add('rare');
    fly.style.backgroundImage = isRare ? "url('assets/rare_fly.svg')" : "url('assets/fly.svg')";

    const w = window.innerWidth;
    const h = window.innerHeight;
    const x = Math.random() * (w - 80) + 40;
    const y = Math.random() * (h - 80) + 40;
    
    fly.style.left = `${x}px`;
    fly.style.top = `${y}px`;
    
    document.body.appendChild(fly);
    globalFlies.push({
      el: fly,
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 4.5,
      vy: (Math.random() - 0.5) * 4.5,
      isRare: isRare
    });
  }

  function updateGlobalFlies(timeScale = 1) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    globalFlies.forEach(flyObj => {
      let fx = flyObj.x;
      let fy = flyObj.y;
      let fvx = flyObj.vx;
      let fvy = flyObj.vy;
      
      if (Math.random() < 0.05 * timeScale) {
        fvx += (Math.random() - 0.5) * 2;
        fvy += (Math.random() - 0.5) * 2;
      }
      
      const flySpeed = Math.sqrt(fvx*fvx + fvy*fvy);
      if (flySpeed > 5) {
        fvx = (fvx / flySpeed) * 5;
        fvy = (fvy / flySpeed) * 5;
      }
      fx += fvx * timeScale;
      fy += fvy * timeScale;
      
      if (fx < 10 || fx > w - 30) fvx *= -1;
      if (fy < 10 || fy > h - 30) fvy *= -1;
      
      fx = Math.max(10, Math.min(w - 30, fx));
      fy = Math.max(10, Math.min(h - 30, fy));
      
      flyObj.x = fx;
      flyObj.y = fy;
      flyObj.vx = fvx;
      flyObj.vy = fvy;
      
      const rot = Math.atan2(fvy, fvx) * (180 / Math.PI) + 90;
      flyObj.el.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
      flyObj.el.style.left = `${fx}px`;
      flyObj.el.style.top = `${fy}px`;
    });
  }

  function clearGlobalFlies() {
    globalFlies.forEach(f => f.el.remove());
    globalFlies = [];
  }

  function runGlobalSwat(x, y, isTouch = false) {
    if (!isTouch) {
      playSound('swatter');
      globalGraphic.style.transition = 'transform 0.05s ease-out';
      globalGraphic.style.transform = `translate(-32px, -32px) scale(0.7) rotate(-20deg)`;
      setTimeout(() => {
        globalGraphic.style.transition = 'none';
        updateGraphicScaling();
      }, 120);
    }

    const hitSize = 55;
    const surviving = [];
    let killed = false;
    globalFlies.forEach(flyObj => {
      const dist = Math.sqrt(Math.pow(flyObj.x - x, 2) + Math.pow(flyObj.y - y, 2));
      if (dist <= hitSize) {
        createGlobalSplat(flyObj.x, flyObj.y);
        flyObj.el.remove();
        killed = true;
      } else {
        surviving.push(flyObj);
      }
    });
    if (killed) playSound('fly');
    globalFlies = surviving;
  }

  function createGlobalSplat(x, y) {
    const splat = document.createElement('div');
    splat.className = 'sandbox-fly-splat';
    splat.style.left = `${x}px`;
    splat.style.top = `${y}px`;
    splat.style.width = '48px';
    splat.style.height = '48px';
    splat.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
    splat.style.backgroundImage = "url('assets/splat.svg')";
    document.body.appendChild(splat);
    setTimeout(() => {
      splat.style.transition = 'opacity 1s';
      splat.style.opacity = '0';
    }, 1500);
    setTimeout(() => splat.remove(), 2500);
  }

  // --- Main Tick Render Loop ---
  let lastTickTime = performance.now();
  function tick(time) {
    if (!time) time = performance.now();
    const dt = time - lastTickTime;
    lastTickTime = time;
    const timeScale = Math.min(dt / (1000 / 60), 3) || 1;

    updateActiveTheme();

    if (currentCursorMode === 'swatter') {
      updateGlobalFlies(timeScale);
      if (Math.random() < 0.005 * timeScale) spawnGlobalFly();
    } else {
      clearGlobalFlies();
    }

    if (isWhipMode(currentCursorMode)) {
      updateGlobalRopePhysics();
    } else {
      if (globalCtx) {
        globalCtx.clearRect(0, 0, globalCanvas.width, globalCanvas.height);
      }
    }

    requestAnimationFrame(tick);
  }

  // Start loop
  requestAnimationFrame(tick);

});
