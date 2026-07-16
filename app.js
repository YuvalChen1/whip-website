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
        audio.volume = 0.6;
        audioPool.push(audio);
      }
    } catch (e) {
      console.warn("Failed to initialize audio pool:", e);
    }
  }

  // Preload immediately
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

  // Synthesized sounds for other cursors
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

  // --- Particle Spawning System ---
  function spawnParticle(x, y, type) {
    const p = document.createElement('div');
    p.className = `cursor-particle particle-${type}`;
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    
    // Custom random size
    const size = Math.random() * 8 + 4;
    p.style.width = `${size}px`;
    p.style.height = (type === 'electric') ? `${size * 2}px` : `${size}px`;
    
    // Append to body (fixed viewport position)
    document.body.appendChild(p);
    
    // Physics float
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    let px = x;
    let py = y;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const start = Date.now();
    
    function update() {
      const elapsed = Date.now() - start;
      if (elapsed > 500) {
        p.remove();
        return;
      }
      px += vx;
      py += vy;
      p.style.left = `${px}px`;
      p.style.top = `${py}px`;
      requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // --- Global Custom Cursor ---
  const globalCursor = document.getElementById('global-cursor');
  const globalCanvas = document.getElementById('global-whip-canvas');
  const globalGraphic = document.getElementById('global-cursor-graphic');
  
  let currentCursorMode = 'bw'; // bw, leather, fire, electric, diamond, swatter, fish, watergun
  let equippedPlaygroundCursor = 'bw'; // sidebar selected cursor inside sandbox
  let isMouseInPlaygroundSandbox = false;
  let isMouseInHeroMockup = false;
  let mouse = { x: 0, y: 0 };
  let lastMouse = { x: 0, y: 0 };
  let mouseVelocity = 0;
  let lastCrackTime = 0;
  
  // Custom global rope config (length, thickness)
  let ropeConfig = { length: 50, width: 3.0 };

  // Global Verlet Rope chain
  let points = [];
  const numPoints = 12;
  const gravity = 0.15;
  const friction = 0.88;

  function initGlobalRope() {
    points = [];
    const segmentLength = ropeConfig.length / (numPoints - 1);
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: mouse.x,
        y: mouse.y,
        oldx: mouse.x,
        oldy: mouse.y
      });
    }
  }

  // Initial display setup
  if (globalCursor) {
    globalCursor.style.opacity = '1';
  }

  // Track mouse coordinates globally
  window.addEventListener('mousemove', (e) => {
    if (globalCursor.style.opacity === '0' || globalCursor.style.opacity === '') {
      globalCursor.style.opacity = '1';
    }
    
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    const dx = mouse.x - lastMouse.x;
    const dy = mouse.y - lastMouse.y;
    mouseVelocity = Math.sqrt(dx*dx + dy*dy);

    // Particle emission on movement
    if (mouseVelocity > 2) {
      if (currentCursorMode === 'fire') {
        if (Math.random() < 0.3) spawnParticle(mouse.x, mouse.y, 'fire');
      } else if (currentCursorMode === 'electric') {
        if (Math.random() < 0.25) spawnParticle(mouse.x, mouse.y, 'electric');
      } else if (currentCursorMode === 'diamond') {
        if (Math.random() < 0.2) spawnParticle(mouse.x, mouse.y, 'diamond');
      }
    }

    // Align non-whip graphic modes
    if (!isWhipMode(currentCursorMode)) {
      globalGraphic.style.left = `${mouse.x}px`;
      globalGraphic.style.top = `${mouse.y}px`;
      
      if (currentCursorMode === 'fish') {
        updateFishRotation(dx, dy);
      }
    }

    // Morph dot state checking
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

  // Track page section boundaries to transition active cursor themes
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
    
    // Check which section container is currently under the mouse
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
    
    // Reset/update canvas layout rules
    if (isWhipMode(mode)) {
      globalCanvas.style.display = 'block';
      globalGraphic.style.display = 'none';
      initGlobalRope();
    } else {
      globalCanvas.style.display = 'none';
      globalGraphic.style.display = 'block';
      
      // Update background graphic sources
      if (mode === 'swatter') {
        globalGraphic.style.backgroundImage = "url('assets/swatter.svg')";
      } else if (mode === 'fish') {
        globalGraphic.style.backgroundImage = "url('assets/fish.svg')";
      } else if (mode === 'watergun') {
        globalGraphic.style.backgroundImage = "url('assets/watergun.svg')";
      }
      
      updateGraphicScaling();
    }
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

  // Wobbling fish logic w/ angle interpolation
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

  // --- Rope Physics Loop ---
  function updateRopePhysics() {
    if (points.length === 0) return;
    
    // First node locked to mouse
    points[0].x = mouse.x;
    points[0].y = mouse.y;

    // Verlet integration
    for (let i = 1; i < numPoints; i++) {
      const p = points[i];
      const vx = (p.x - p.oldx) * friction;
      const vy = (p.y - p.oldy) * friction + gravity;
      
      p.oldx = p.x;
      p.oldy = p.y;
      p.x += vx;
      p.y += vy;
    }

    // Constraints resolution
    const segmentLength = ropeConfig.length / (numPoints - 1);
    for (let loop = 0; loop < 5; loop++) {
      for (let i = 1; i < numPoints; i++) {
        const p1 = points[i - 1];
        const p2 = points[i];
        
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist === 0) continue;
        
        const diff = segmentLength - dist;
        const percent = (diff / dist) * 0.5;
        const offsetX = dx * percent;
        const offsetY = dy * percent;
        
        if (i === 1) {
          // Anchored, translate only endpoint node
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

    // Draw the active whip
    drawGlobalRope();

    // Check velocity for whip crack trigger
    const tip = points[numPoints - 1];
    const dx = tip.x - tip.oldx;
    const dy = tip.y - tip.oldy;
    const tipSpeed = Math.sqrt(dx*dx + dy*dy);
    const now = Date.now();
    
    if (tipSpeed > 30 && now - lastCrackTime > 260) {
      playWhipCrack();
      lastCrackTime = now;
      
      // Spawn small flash splat
      spawnSplatOverlay(tip.x, tip.y);
      
      // Perform collision checking if inside ChatGPT mockup simulator
      if (isMouseInHeroMockup && mockupMode === 'fun') {
        checkMockupBubbleCollision(tip.x, tip.y);
      }
    }
  }

  function drawGlobalRope() {
    if (points.length === 0) return;
    
    while (globalCanvas.firstChild) {
      globalCanvas.removeChild(globalCanvas.firstChild);
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // 1. Calculate Stiff Handle Coordinates (End at hx, hy)
    const dx = points[1].x - points[0].x;
    const dy = points[1].y - points[0].y;
    const dist = Math.sqrt(dx*dx + dy*dy) || 1;
    const hLength = 22; // Handle length
    const hx = points[0].x + (dx / dist) * hLength;
    const hy = points[0].y + (dy / dist) * hLength;

    // Draw path connecting handle end node to remaining segments
    let d = `M ${hx} ${hy}`;
    for (let i = 1; i < numPoints - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      d += ` Q ${points[i].x} ${points[i].y}, ${xc} ${yc}`;
    }
    d += ` L ${points[numPoints - 1].x} ${points[numPoints - 1].y}`;
    
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    // Styled colors based on active mode
    if (currentCursorMode === 'bw') {
      path.setAttribute('stroke', '#c8943a');
      path.setAttribute('stroke-width', ropeConfig.width);
    } else if (currentCursorMode === 'leather') {
      path.setAttribute('stroke', '#a6582a');
      path.setAttribute('stroke-width', ropeConfig.width);
    } else if (currentCursorMode === 'fire') {
      path.setAttribute('stroke', 'url(#fireGradient)');
      path.setAttribute('stroke-width', ropeConfig.width * 1.2);
      path.style.filter = 'drop-shadow(0 0 4px #ff3300)';
    } else if (currentCursorMode === 'electric') {
      path.setAttribute('stroke', '#00e5ff');
      path.setAttribute('stroke-width', ropeConfig.width);
      path.style.filter = 'drop-shadow(0 0 6px #00e5ff)';
    } else if (currentCursorMode === 'diamond') {
      path.setAttribute('stroke', 'url(#diamondGradient)');
      path.setAttribute('stroke-width', ropeConfig.width * 0.9);
      path.style.filter = 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.6))';
    }

    // Append Gradients definitions
    ensureGradientDefinitions();

    // 2. Render Cracker red tip
    const cracker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const tipNode = points[numPoints - 1];
    cracker.setAttribute('cx', tipNode.x);
    cracker.setAttribute('cy', tipNode.y);
    cracker.setAttribute('r', Math.max(3, ropeConfig.width * 0.9));
    cracker.setAttribute('fill', '#ff3333');
    if (currentCursorMode === 'fire') cracker.setAttribute('fill', '#ffff55');
    if (currentCursorMode === 'electric') cracker.setAttribute('fill', '#ffffff');

    // 3. Render Multi-layered Stiff Handle
    const handles = [];
    const createLine = (color, width, dash = '') => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', points[0].x);
      line.setAttribute('y1', points[0].y);
      line.setAttribute('x2', hx);
      line.setAttribute('y2', hy);
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', width);
      line.setAttribute('stroke-linecap', 'round');
      if (dash) line.setAttribute('stroke-dasharray', dash);
      return line;
    };

    if (currentCursorMode === 'bw') {
      handles.push(createLine('#000000', ropeConfig.width * 2.5));
      handles.push(createLine('#ffffff', ropeConfig.width * 1.3));
    } else if (currentCursorMode === 'leather') {
      handles.push(createLine('#3a1800', ropeConfig.width * 2.6));
      handles.push(createLine('#8b4513', ropeConfig.width * 1.4));
      handles.push(createLine('#5e2510', ropeConfig.width * 0.7, '2 3'));
    } else if (currentCursorMode === 'fire') {
      handles.push(createLine('#1a0500', ropeConfig.width * 2.8));
      handles.push(createLine('#e63900', ropeConfig.width * 1.5));
      handles.push(createLine('#ff8c00', ropeConfig.width * 0.8));
    } else if (currentCursorMode === 'electric') {
      handles.push(createLine('#03141a', ropeConfig.width * 2.8));
      handles.push(createLine('#00a2e8', ropeConfig.width * 1.5));
      handles.push(createLine('#00e5ff', ropeConfig.width * 0.7));
    } else if (currentCursorMode === 'diamond') {
      handles.push(createLine('#111111', ropeConfig.width * 2.6));
      handles.push(createLine('#94a3b8', ropeConfig.width * 1.4));
      handles.push(createLine('#ffffff', ropeConfig.width * 0.6));
    }

    globalCanvas.appendChild(path);
    globalCanvas.appendChild(cracker);
    handles.forEach(h => globalCanvas.appendChild(h));
  }

  function ensureGradientDefinitions() {
    let defs = globalCanvas.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      
      // Fire Gradient
      const fireGrad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      fireGrad.setAttribute('id', 'fireGradient');
      fireGrad.innerHTML = `<stop offset="0%" stop-color="#ff1a00"/><stop offset="50%" stop-color="#ff7700"/><stop offset="100%" stop-color="#ffff00"/>`;
      
      // Diamond Gradient
      const diaGrad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      diaGrad.setAttribute('id', 'diamondGradient');
      diaGrad.innerHTML = `<stop offset="0%" stop-color="#80e5ff"/><stop offset="50%" stop-color="#ffffff"/><stop offset="100%" stop-color="#bcefff"/>`;
      
      defs.appendChild(fireGrad);
      defs.appendChild(diaGrad);
      globalCanvas.appendChild(defs);
    }
  }

  function spawnSplatOverlay(x, y) {
    const splat = document.createElement('div');
    splat.className = 'splat-effect active';
    splat.style.left = `${x}px`;
    splat.style.top = `${y}px`;
    
    // Set custom gradient based on cursor mode
    if (currentCursorMode === 'fire') {
      splat.style.background = 'radial-gradient(circle, #e63900 10%, transparent 60%)';
    } else if (currentCursorMode === 'electric') {
      splat.style.background = 'radial-gradient(circle, #00e5ff 10%, transparent 60%)';
    } else if (currentCursorMode === 'diamond') {
      splat.style.background = 'radial-gradient(circle, #ffffff 10%, transparent 60%)';
    }
    
    document.body.appendChild(splat);
    setTimeout(() => {
      splat.remove();
    }, 450);
  }

  // --- Click shoots custom water gun droplets ---
  window.addEventListener('mousedown', (e) => {
    const hoverTarget = e.target.closest('a, button, select, input, textarea, label, [role="button"], .selector-btn, .tab, .mockup-pill, .mockup-toggle-btn');
    if (hoverTarget) return; // ignore clicks on buttons/links
    
    if (currentCursorMode === 'watergun' && !isMouseInPlaygroundSandbox) {
      playSynthWater();
      
      // Recoil
      globalGraphic.style.transition = 'transform 0.05s ease-out';
      globalGraphic.style.transform = 'translate(-32px, -8px) scale(0.9)';
      
      setTimeout(() => {
        globalGraphic.style.transition = 'none';
        updateGraphicScaling();
      }, 120);

      // Spray droplets
      for (let i = 0; i < 5; i++) {
        const drop = document.createElement('div');
        drop.className = 'water-droplet';
        
        const sx = e.clientX;
        const sy = e.clientY - 20;
        
        drop.style.left = `${sx}px`;
        drop.style.top = `${sy}px`;
        
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.45; // Shoot upwards
        const speed = 7 + Math.random() * 7;
        
        drop.dataset.vx = Math.cos(angle) * speed;
        drop.dataset.vy = Math.sin(angle) * speed;
        drop.dataset.x = sx;
        drop.dataset.y = sy;
        
        document.body.appendChild(drop);
        animateWaterDrop(drop);
      }
    }
  });

  function animateWaterDrop(drop) {
    let dx = parseFloat(drop.dataset.x);
    let dy = parseFloat(drop.dataset.y);
    let dvx = parseFloat(drop.dataset.vx);
    let dvy = parseFloat(drop.dataset.vy);
    const start = Date.now();
    
    function step() {
      const elapsed = Date.now() - start;
      if (elapsed > 550 || !drop.parentNode) {
        drop.remove();
        return;
      }
      
      dvy += 0.35; // gravity
      dx += dvx;
      dy += dvy;
      
      drop.style.left = `${dx}px`;
      drop.style.top = `${dy}px`;
      
      const scale = 1 - (elapsed / 550);
      drop.style.transform = `translate(-50%, -50%) scale(${scale})`;
      
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // --- Interactive ChatGPT Simulator Logic ---
  const heroMockup = document.getElementById('heroMockup');
  const chatBody = document.getElementById('mockupChatBody');
  const toggleFun = document.getElementById('mockupToggleFun');
  const togglePrac = document.getElementById('mockupTogglePrac');
  const injectionsPanel = document.getElementById('mockupInjectionsPanel');
  const mockupTextbox = document.getElementById('mockupTextbox');
  const sendIcon = mockupInjectionsPanel ? mockupInjectionsPanel.querySelector('.mockup-send-icon') : null;
  
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
    // Mode toggling
    toggleFun.addEventListener('click', () => {
      toggleFun.classList.add('active');
      togglePrac.classList.remove('active');
      injectionsPanel.classList.add('disabled');
      mockupMode = 'fun';
      
      // Restore initial chat history
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

  // Click on prompt template pills
  document.querySelectorAll('.mockup-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      if (mockupMode !== 'prac') return;
      
      const promptText = pill.getAttribute('data-prompt');
      simulateTyping(promptText);
    });
  });

  function simulateTyping(text) {
    if (typingTimer) clearInterval(typingTimer);
    mockupTextbox.textContent = '';
    mockupTextbox.classList.add('typing');
    sendIcon.classList.remove('active');
    
    let index = 0;
    typingTimer = setInterval(() => {
      mockupTextbox.textContent += text[index];
      index++;
      
      if (index >= text.length) {
        clearInterval(typingTimer);
        sendIcon.classList.add('active');
        
        // Auto submit after short delay
        setTimeout(() => {
          submitMockupPrompt(text);
        }, 500);
      }
    }, 20);
  }

  function submitMockupPrompt(text) {
    if (!chatBody) return;
    
    // Add user bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.innerHTML = `
      <div class="bubble-content"><p>${text}</p></div>
      <div class="avatar-mock user-avatar">U</div>
    `;
    chatBody.appendChild(userBubble);
    
    // Reset textbox
    mockupTextbox.textContent = 'Type a prompt...';
    mockupTextbox.classList.remove('typing');
    sendIcon.classList.remove('active');
    
    chatBody.scrollTop = chatBody.scrollHeight;

    // AI typing indicator delay
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
      
      // Select response texts
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

  // Bounding box intersection check for whipping the chat bubbles
  function checkMockupBubbleCollision(tipX, tipY) {
    const targets = chatBody.querySelectorAll('.ai-bubble-target');
    targets.forEach(target => {
      const rect = target.getBoundingClientRect();
      
      // Check if coordinates overlap
      if (tipX >= rect.left && tipX <= rect.right && tipY >= rect.top && tipY <= rect.bottom) {
        if (!target.classList.contains('wobbling')) {
          // Play sound
          playWhipCrack();
          
          target.classList.add('wobbling');
          
          // Place splat particle inside bubble relative coordinates
          const splat = target.querySelector('.splat-effect');
          if (splat) {
            const rx = tipX - rect.left;
            const ry = tipY - rect.top;
            splat.style.left = `${rx}px`;
            splat.style.top = `${ry}px`;
            splat.classList.add('active');
            
            setTimeout(() => {
              splat.classList.remove('active');
            }, 400);
          }
          
          setTimeout(() => {
            target.classList.remove('wobbling');
          }, 500);
        }
      }
    });
  }

  // --- Sandbox Section specific overrides ---
  const sandbox = document.getElementById('sandboxArea');
  const sandboxSidebar = document.querySelector('.playground-sidebar');
  const sandboxCanvas = document.getElementById('whipRopeCanvas');
  const sandboxCursorGraphic = document.getElementById('cursorGraphic');

  if (sandbox) {
    sandbox.addEventListener('mouseenter', () => {
      isMouseInPlaygroundSandbox = true;
      document.querySelector('.sandbox-instructions').classList.add('hidden');
      
      // Hide global custom cursor elements so sandbox local cursor can draw
      globalCanvas.style.display = 'none';
      globalGraphic.style.display = 'none';
      
      // Update sandbox layouts
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
      
      // Restore global cursor visibility
      setCursorMode('bw'); // Trigger reset
      updateActiveTheme(); // Restore theme
      
      clearSandboxFlies();
    });

    // Handle local click swatting / shooting in sandbox
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

  // Sidebar selectors to change equipped sandbox cursors
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

  // Local sandbox tuning state variables
  let localPoints = [];
  const localNumPoints = 12;
  let localConfig = { length: 50, width: 3.0, size: 80 };

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
    localPoints = [];
    const rect = sandbox.getBoundingClientRect();
    const rx = mouse.x - rect.left;
    const ry = mouse.y - rect.top;
    
    const segmentLength = localConfig.length / (localNumPoints - 1);
    for (let i = 0; i < localNumPoints; i++) {
      localPoints.push({ x: rx, y: ry, oldx: rx, oldy: ry });
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

  // Local sandbox flies game logic
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
        // Splat fly
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
      drop.style.left = `${x}px`;
      drop.style.top = `${y - 15}px`;
      
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.4;
      const speed = 6 + Math.random() * 6;
      
      drop.dataset.vx = Math.cos(angle) * speed;
      drop.dataset.vy = Math.sin(angle) * speed;
      drop.dataset.x = x;
      drop.dataset.y = y - 15;
      
      waterContainer.appendChild(drop);
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

  // Sandbox local physics rope solver
  let sandboxLastCrackTime = 0;
  function updateSandboxRopePhysics(sandboxX, sandboxY) {
    if (localPoints.length === 0) return;
    
    localPoints[0].x = sandboxX;
    localPoints[0].y = sandboxY;

    for (let i = 1; i < localNumPoints; i++) {
      const p = localPoints[i];
      const vx = (p.x - p.oldx) * friction;
      const vy = (p.y - p.oldy) * friction + gravity;
      p.oldx = p.x;
      p.oldy = p.y;
      p.x += vx;
      p.y += vy;
    }

    const segmentLength = localConfig.length / (localNumPoints - 1);
    for (let loop = 0; loop < 5; loop++) {
      for (let i = 1; i < localNumPoints; i++) {
        const p1 = localPoints[i - 1];
        const p2 = localPoints[i];
        
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

    // Draw sandbox rope
    drawSandboxRope();

    // Crack detection
    const tip = localPoints[localNumPoints - 1];
    const dx = tip.x - tip.oldx;
    const dy = tip.y - tip.oldy;
    const tipSpeed = Math.sqrt(dx*dx + dy*dy);
    const now = Date.now();
    
    if (tipSpeed > 32 && now - sandboxLastCrackTime > 260) {
      playWhipCrack();
      sandboxLastCrackTime = now;
      
      // Splat overlay inside sandbox area
      const splat = document.createElement('div');
      splat.className = 'splat-effect active';
      splat.style.left = `${tip.x}px`;
      splat.style.top = `${tip.y}px`;
      sandbox.appendChild(splat);
      setTimeout(() => splat.remove(), 400);
    }
  }

  function drawSandboxRope() {
    if (localPoints.length === 0) return;
    
    while (sandboxCanvas.firstChild) {
      sandboxCanvas.removeChild(sandboxCanvas.firstChild);
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Handle coordinates alignment
    const dx = localPoints[1].x - localPoints[0].x;
    const dy = localPoints[1].y - localPoints[0].y;
    const dist = Math.sqrt(dx*dx + dy*dy) || 1;
    const hLength = 22;
    const hx = localPoints[0].x + (dx / dist) * hLength;
    const hy = localPoints[0].y + (dy / dist) * hLength;

    let d = `M ${hx} ${hy}`;
    for (let i = 1; i < localNumPoints - 1; i++) {
      const xc = (localPoints[i].x + localPoints[i + 1].x) / 2;
      const yc = (localPoints[i].y + localPoints[i + 1].y) / 2;
      d += ` Q ${localPoints[i].x} ${localPoints[i].y}, ${xc} ${yc}`;
    }
    d += ` L ${localPoints[localNumPoints - 1].x} ${localPoints[localNumPoints - 1].y}`;
    
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    
    if (equippedPlaygroundCursor === 'bw') {
      path.setAttribute('stroke', '#c8943a');
    } else {
      path.setAttribute('stroke', '#a6582a');
    }
    
    path.setAttribute('stroke-width', localConfig.width);
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    const cracker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const tipNode = localPoints[localNumPoints - 1];
    cracker.setAttribute('cx', tipNode.x);
    cracker.setAttribute('cy', tipNode.y);
    cracker.setAttribute('r', Math.max(3, localConfig.width * 0.9));
    cracker.setAttribute('fill', '#ff3333');

    // Handle render
    const handles = [];
    const createLine = (color, width, dash = '') => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', localPoints[0].x);
      line.setAttribute('y1', localPoints[0].y);
      line.setAttribute('x2', hx);
      line.setAttribute('y2', hy);
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', width);
      line.setAttribute('stroke-linecap', 'round');
      if (dash) line.setAttribute('stroke-dasharray', dash);
      return line;
    };

    if (equippedPlaygroundCursor === 'bw') {
      handles.push(createLine('#000000', localConfig.width * 2.5));
      handles.push(createLine('#ffffff', localConfig.width * 1.3));
    } else {
      handles.push(createLine('#3a1800', localConfig.width * 2.6));
      handles.push(createLine('#8b4513', localConfig.width * 1.4));
      handles.push(createLine('#5e2510', localConfig.width * 0.7, '2 3'));
    }

    sandboxCanvas.appendChild(path);
    sandboxCanvas.appendChild(cracker);
    handles.forEach(h => sandboxCanvas.appendChild(h));
  }

  // --- Main Render Frame Tick Loop ---
  function tick() {
    updateActiveTheme();

    if (isMouseInPlaygroundSandbox) {
      const rect = sandbox.getBoundingClientRect();
      const rx = mouse.x - rect.left;
      const ry = mouse.y - rect.top;
      
      if (equippedPlaygroundCursor === 'bw' || equippedPlaygroundCursor === 'leather') {
        updateSandboxRopePhysics(rx, ry);
      } else {
        // Align graphic cursor coordinates
        sandboxCursorGraphic.style.left = `${rx}px`;
        sandboxCursorGraphic.style.top = `${ry}px`;
        
        if (equippedPlaygroundCursor === 'fish') {
          const dx = rx - parseFloat(sandboxCursorGraphic.dataset.lastX || rx);
          const dy = ry - parseFloat(sandboxCursorGraphic.dataset.lastY || ry);
          updateLocalFishRotation(dx, dy);
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
      // Run global rope solver if active whip
      if (isWhipMode(currentCursorMode)) {
        updateRopePhysics();
      }
    }

    requestAnimationFrame(tick);
  }

  // Run main execution loop
  requestAnimationFrame(tick);

});
