document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('mobile-active');
    });
    
    // Close menu when clicking link
    document.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('mobile-active');
      });
    });
  }

  // --- Achievements Data ---
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

  // Render Achievements
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
      // If SVG fails to load (fallback), show a default medal style
      img.onerror = () => {
        img.src = 'assets/whip_classic.svg';
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

  // --- Web Audio Sound Synthesizer ---
  let audioCtx = null;
  const soundToggle = document.getElementById('soundToggle');

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playSynthWhip() {
    if (!soundToggle || !soundToggle.checked) return;
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;

    // 1. Crack Snap (High-Frequency White Noise)
    const bufferSize = audioCtx.sampleRate * 0.08; // 80ms
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1500;

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.8, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    noise.start(t);
    noise.stop(t + 0.08);

    // 2. Low-frequency Crack Thump (Oscillator sweep)
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(250, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.06);

    oscGain.gain.setValueAtTime(1.0, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  function playSynthSplat() {
    if (!soundToggle || !soundToggle.checked) return;
    initAudio();
    
    const t = audioCtx.currentTime;

    // Squish noise
    const bufferSize = audioCtx.sampleRate * 0.12;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.frequency.linearRampToValueAtTime(200, t + 0.1);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(t);
    noise.stop(t + 0.12);
  }

  function playSynthWater() {
    if (!soundToggle || !soundToggle.checked) return;
    initAudio();

    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.12);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  function playSynthFish() {
    if (!soundToggle || !soundToggle.checked) return;
    initAudio();

    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(120, t + 0.08);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  // --- Hero Section Shatter Effect ---
  const mockupAITarget = document.getElementById('mockupAITarget');
  const mockupSplat = document.getElementById('mockupSplat');
  
  if (mockupAITarget && mockupSplat) {
    mockupAITarget.addEventListener('click', (e) => {
      // Trigger shatter classes
      mockupAITarget.classList.remove('shattered');
      void mockupAITarget.offsetWidth; // trigger reflow
      mockupAITarget.classList.add('shattered');
      
      // Place splat graphic at click location
      const rect = mockupAITarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mockupSplat.style.left = `${x}px`;
      mockupSplat.style.top = `${y}px`;
      
      mockupSplat.classList.remove('active');
      void mockupSplat.offsetWidth;
      mockupSplat.classList.add('active');
      
      // Synthesize sound
      playSynthWhip();
    });
  }

  // --- Interactive Sandbox Simulator ---
  const sandbox = document.getElementById('sandboxArea');
  const physicsContainer = document.getElementById('physicsCursorContainer');
  const ropeCanvas = document.getElementById('whipRopeCanvas');
  const cursorGraphic = document.getElementById('cursorGraphic');
  const actionHint = document.getElementById('sandboxActionHint');
  const sliderLength = document.getElementById('ropeLength');
  const sliderWidth = document.getElementById('ropeWidth');
  const sliderSize = document.getElementById('cursorSize');
  const valLength = document.getElementById('ropeLengthVal');
  const valWidth = document.getElementById('ropeWidthVal');
  const valSize = document.getElementById('cursorSizeVal');
  const resetBtn = document.getElementById('resetPlaygroundBtn');

  // State variables for physics
  let activeCursor = 'bw'; // bw, leather, swatter, fish, watergun
  let isMouseInside = false;
  let mouse = { x: 0, y: 0 };
  let lastMouse = { x: 0, y: 0 };
  let mouseVelocity = 0;
  let lastCrackTime = 0;
  
  // Custom cursor styling configs
  let config = {
    length: 50,
    width: 3.0,
    size: 80
  };

  // Rope nodes arrays
  let points = [];
  const numPoints = 12;
  const gravity = 0.15;
  const friction = 0.88;

  // Initialize rope nodes
  function initRope() {
    points = [];
    const segmentLength = config.length / (numPoints - 1);
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: mouse.x,
        y: mouse.y,
        oldx: mouse.x,
        oldy: mouse.y
      });
    }
  }

  // Selectors Toggling
  const selectors = document.querySelectorAll('.selector-btn');
  selectors.forEach(sel => {
    sel.addEventListener('click', () => {
      selectors.forEach(s => s.classList.remove('active'));
      sel.classList.add('active');
      
      activeCursor = sel.getAttribute('data-cursor');
      
      // Update sidebar themes based on selection
      const isPremium = sel.classList.contains('premium-btn');
      const parent = sel.closest('.playground-container');
      if (isPremium) {
        parent.classList.add('premium-theme');
      } else {
        parent.classList.remove('premium-theme');
      }
      
      updateSidebarControls();
      initRope();
    });
  });

  // Slider inputs
  if (sliderLength) {
    sliderLength.addEventListener('input', () => {
      config.length = parseInt(sliderLength.value);
      valLength.textContent = config.length;
      initRope();
    });
  }
  if (sliderWidth) {
    sliderWidth.addEventListener('input', () => {
      config.width = parseFloat(sliderWidth.value);
      valWidth.textContent = config.width.toFixed(1);
    });
  }
  if (sliderSize) {
    sliderSize.addEventListener('input', () => {
      config.size = parseInt(sliderSize.value);
      valSize.textContent = config.size;
      updateCursorGraphicSize();
    });
  }

  // Reset controls
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      config.length = 50;
      config.width = 3.0;
      config.size = 80;
      
      if (sliderLength) { sliderLength.value = 50; valLength.textContent = '50'; }
      if (sliderWidth) { sliderWidth.value = 3; valWidth.textContent = '3.0'; }
      if (sliderSize) { sliderSize.value = 80; valSize.textContent = '80'; }
      
      initRope();
      updateCursorGraphicSize();
    });
  }

  function updateCursorGraphicSize() {
    if (cursorGraphic) {
      cursorGraphic.style.width = `${config.size}px`;
      cursorGraphic.style.height = `${config.size}px`;
      
      // Align graphic positioning based on cursor type
      if (activeCursor === 'swatter') {
        cursorGraphic.style.transform = `translate(-${config.size / 2}px, -${config.size / 2}px)`;
      } else if (activeCursor === 'fish') {
        cursorGraphic.style.transform = `translate(-${config.size / 2}px, -${config.size / 2}px)`;
      } else if (activeCursor === 'watergun') {
        cursorGraphic.style.transform = `translate(-${config.size / 2}px, -${config.size / 4}px)`;
      }
    }
  }

  function updateSidebarControls() {
    const lenGroup = document.getElementById('tuning-length-group');
    const widthGroup = document.getElementById('tuning-width-group');
    const sizeGroup = document.getElementById('tuning-size-group');
    
    // Hide rope length/thickness sliders if swatter or watergun is selected
    if (activeCursor === 'bw' || activeCursor === 'leather') {
      lenGroup.style.display = 'flex';
      widthGroup.style.display = 'flex';
      sizeGroup.style.display = 'none';
      actionHint.textContent = 'Flick fast to crack the whip!';
      ropeCanvas.style.display = 'block';
      cursorGraphic.style.display = 'none';
    } else {
      lenGroup.style.display = 'none';
      widthGroup.style.display = 'none';
      sizeGroup.style.display = 'flex';
      ropeCanvas.style.display = 'none';
      cursorGraphic.style.display = 'block';
      
      if (activeCursor === 'swatter') {
        cursorGraphic.style.backgroundImage = "url('assets/swatter.svg')";
        actionHint.textContent = 'Click to swat flies in the sandbox!';
      } else if (activeCursor === 'fish') {
        cursorGraphic.style.backgroundImage = "url('assets/fish.svg')";
        actionHint.textContent = 'Move mouse to watch the fish wobble!';
      } else if (activeCursor === 'watergun') {
        cursorGraphic.style.backgroundImage = "url('assets/watergun.svg')";
        actionHint.textContent = 'Click to shoot water blaster!';
      }
      
      updateCursorGraphicSize();
    }
  }

  // --- Fly mini-game variables ---
  let flies = [];
  const maxFlies = 4;
  
  function spawnFly() {
    if (!isMouseInside || activeCursor !== 'swatter' || flies.length >= maxFlies) return;
    
    const fly = document.createElement('div');
    fly.className = 'sandbox-fly';
    fly.style.backgroundImage = "url('assets/achievements/first_fly.svg')"; // Fallback: load fly badge
    // Fallback graphic check: if first_fly not resolved, use an SVG string inline
    fly.onerror = () => {
      fly.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"6\" fill=\"black\"/></svg>')";
    };
    
    const rect = sandbox.getBoundingClientRect();
    const x = Math.random() * (rect.width - 40) + 20;
    const y = Math.random() * (rect.height - 40) + 20;
    
    fly.style.left = `${x}px`;
    fly.style.top = `${y}px`;
    
    // Custom parameters for flying math movement
    fly.dataset.x = x;
    fly.dataset.y = y;
    fly.dataset.vx = (Math.random() - 0.5) * 4;
    fly.dataset.vy = (Math.random() - 0.5) * 4;
    fly.dataset.scaleX = 1;
    
    sandbox.appendChild(fly);
    flies.push(fly);
  }

  function updateFliesPhysics() {
    if (activeCursor !== 'swatter') {
      // Clear remaining flies if switched away
      clearAllFlies();
      return;
    }

    const rect = sandbox.getBoundingClientRect();
    flies.forEach(fly => {
      let fx = parseFloat(fly.dataset.x);
      let fy = parseFloat(fly.dataset.y);
      let fvx = parseFloat(fly.dataset.vx);
      let fvy = parseFloat(fly.dataset.vy);
      
      // Random direction shifts
      if (Math.random() < 0.05) {
        fvx += (Math.random() - 0.5) * 2;
        fvy += (Math.random() - 0.5) * 2;
      }
      
      // Limit speed
      const speed = Math.sqrt(fvx*fvx + fvy*fvy);
      if (speed > 5) {
        fvx = (fvx / speed) * 5;
        fvy = (fvy / speed) * 5;
      }
      
      fx += fvx;
      fy += fvy;
      
      // Boundaries bounce
      if (fx < 10 || fx > rect.width - 30) fvx *= -1;
      if (fy < 10 || fy > rect.height - 30) fvy *= -1;
      
      // Clamp values
      fx = Math.max(10, Math.min(rect.width - 30, fx));
      fy = Math.max(10, Math.min(rect.height - 30, fy));
      
      fly.dataset.x = fx;
      fly.dataset.y = fy;
      fly.dataset.vx = fvx;
      fly.dataset.vy = fvy;
      
      // Face flight direction
      const rot = Math.atan2(fvy, fvx) * (180 / Math.PI) + 90;
      fly.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
      fly.style.left = `${fx}px`;
      fly.style.top = `${fy}px`;
    });
  }

  function clearAllFlies() {
    flies.forEach(fly => fly.remove());
    flies = [];
  }

  // Trigger swatting action
  function attemptSwat(clickX, clickY) {
    playSynthSplat();
    
    // Animate swatter smash
    cursorGraphic.style.transition = 'transform 0.05s ease-out';
    cursorGraphic.style.transform = `translate(-${config.size / 2}px, -${config.size / 2}px) scale(0.7) rotate(-20deg)`;
    
    setTimeout(() => {
      cursorGraphic.style.transition = 'none';
      updateCursorGraphicSize();
    }, 120);

    // Splat flies check
    const hitbox = 35; // px radius
    const survivingFlies = [];
    
    flies.forEach(fly => {
      const fx = parseFloat(fly.dataset.x);
      const fy = parseFloat(fly.dataset.y);
      const dist = Math.sqrt(Math.pow(fx - clickX, 2) + Math.pow(fy - clickY, 2));
      
      if (dist <= hitbox + (config.size / 4)) {
        // Splat fly
        createSplatAnimation(fx, fy);
        fly.remove();
      } else {
        survivingFlies.push(fly);
      }
    });
    
    flies = survivingFlies;
  }

  function createSplatAnimation(x, y) {
    const splat = document.createElement('div');
    splat.className = 'sandbox-fly-splat';
    splat.style.left = `${x}px`;
    splat.style.top = `${y}px`;
    splat.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
    splat.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path d=\"M16 4 C 18 10, 24 8, 20 16 C 26 18, 20 24, 16 28 C 12 24, 6 22, 12 16 C 8 8, 14 10, 16 4 Z\" fill=\"%234a5d30\" opacity=\"0.8\"/><circle cx=\"16\" cy=\"16\" r=\"4\" fill=\"%23ff3333\"/></svg>')";
    
    sandbox.appendChild(splat);
    setTimeout(() => {
      splat.remove();
    }, 1500);
  }

  // --- Water Gun Shooting Droplets ---
  const waterDropletContainer = document.getElementById('waterDroplets');
  
  function shootWater(clickX, clickY) {
    playSynthWater();
    
    // Gun recoil animation
    cursorGraphic.style.transition = 'transform 0.05s ease-out';
    cursorGraphic.style.transform = `translate(-${config.size / 2}px, -${config.size / 4}px) translateY(8px) scale(0.95)`;
    
    setTimeout(() => {
      cursorGraphic.style.transition = 'none';
      updateCursorGraphicSize();
    }, 120);

    // Spawn 5 water droplets spraying forwards (upwards)
    for (let i = 0; i < 5; i++) {
      const drop = document.createElement('div');
      drop.className = 'water-droplet';
      
      // Shoot relative to target center
      drop.style.left = `${clickX}px`;
      drop.style.top = `${clickY - 20}px`;
      
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.4; // shoot straight up + spread
      const speed = 6 + Math.random() * 6;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      
      // Attach velocities
      drop.dataset.vx = vx;
      drop.dataset.vy = vy;
      drop.dataset.x = clickX;
      drop.dataset.y = clickY - 20;
      
      waterDropletContainer.appendChild(drop);
      
      // Animate physics locally
      animateWaterDrop(drop);
    }
  }

  function animateWaterDrop(drop) {
    let dx = parseFloat(drop.dataset.x);
    let dy = parseFloat(drop.dataset.y);
    let dvx = parseFloat(drop.dataset.vx);
    let dvy = parseFloat(drop.dataset.vy);
    const start = Date.now();
    
    function step() {
      const elapsed = Date.now() - start;
      if (elapsed > 600 || !drop.parentNode) {
        drop.remove();
        return;
      }
      
      // Apply gravity to water droplets (falling down)
      dvy += 0.3; 
      
      dx += dvx;
      dy += dvy;
      
      drop.style.left = `${dx}px`;
      drop.style.top = `${dy}px`;
      
      // Scale down over time
      const scale = 1 - (elapsed / 600);
      drop.style.transform = `translate(-50%, -50%) scale(${scale})`;
      
      requestAnimationFrame(step);
    }
    
    requestAnimationFrame(step);
  }

  // --- Fish swimming angle calculations ---
  let fishAngle = 0;
  let fishWobbleAccumulator = 0;

  function updateFishRotation(vx, vy) {
    if (activeCursor !== 'fish') return;
    
    const speed = Math.sqrt(vx*vx + vy*vy);
    if (speed > 1.5) {
      // Rotation angle points in movement direction
      const targetAngle = Math.atan2(vy, vx) * (180 / Math.PI);
      
      // Smooth interpolation of angle
      let diff = targetAngle - fishAngle;
      while (diff < -180) diff += 360;
      while (diff > 180) diff -= 360;
      fishAngle += diff * 0.15;
      
      // Trigger wobble sound when moving fast
      if (speed > 8 && Math.random() < 0.1) {
        playSynthFish();
      }
    }
    
    // Add continuous wiggling/wobble effect when moving
    if (speed > 0.5) {
      fishWobbleAccumulator += speed * 0.08;
    } else {
      fishWobbleAccumulator += 0.03; // idle sway
    }
    const wobble = Math.sin(fishWobbleAccumulator) * 12;
    
    cursorGraphic.style.transform = `translate(-50%, -50%) rotate(${fishAngle + wobble}deg)`;
  }

  // --- Rope Physics Loop ---
  function updateRopePhysics() {
    if (points.length === 0) return;
    
    // First point is locked to mouse
    points[0].x = mouse.x;
    points[0].y = mouse.y;
    
    // Verlet physics update
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
    const segmentLength = config.length / (numPoints - 1);
    for (let loop = 0; loop < 5; loop++) {
      for (let i = 1; i < numPoints; i++) {
        const p1 = points[i - 1];
        const p2 = points[i];
        
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist === 0) continue;
        
        const diff = segmentLength - dist;
        const percent = (diff / dist) * 0.5;
        const offsetX = dx * percent;
        const offsetY = dy * percent;
        
        if (i === 1) {
          // Locked anchor, only translate end node
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
    
    // Render Rope Canvas
    drawRope();
    
    // Crack whip detection
    const tip = points[numPoints - 1];
    const dx = tip.x - tip.oldx;
    const dy = tip.y - tip.oldy;
    const tipSpeed = Math.sqrt(dx * dx + dy * dy);
    
    const now = Date.now();
    if (tipSpeed > 32 && now - lastCrackTime > 280) {
      playSynthWhip();
      lastCrackTime = now;
      triggerSplatOverlay(tip.x, tip.y);
    }
  }

  function drawRope() {
    if (points.length === 0) return;
    
    // Clear canvas
    while (ropeCanvas.firstChild) {
      ropeCanvas.removeChild(ropeCanvas.firstChild);
    }
    
    // Build path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let d = `M ${points[0].x} ${points[0].y}`;
    
    // Draw Bezier curve using nodes
    for (let i = 1; i < numPoints - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      d += ` Q ${points[i].x} ${points[i].y}, ${xc} ${yc}`;
    }
    d += ` L ${points[numPoints - 1].x} ${points[numPoints - 1].y}`;
    
    // Rope outline / style
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    
    if (activeCursor === 'bw') {
      path.setAttribute('stroke', '#c8943a');
    } else {
      path.setAttribute('stroke', '#a6582a'); // Leather Theme
    }
    
    path.setAttribute('stroke-width', config.width);
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    
    // Cracker red tip
    const cracker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const tipNode = points[numPoints - 1];
    cracker.setAttribute('cx', tipNode.x);
    cracker.setAttribute('cy', tipNode.y);
    cracker.setAttribute('r', Math.max(3, config.width * 0.9));
    cracker.setAttribute('fill', '#ff3333');
    
    // Draw handle
    const handleLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    // Draw grip line starting at cursor point
    const angle = Math.atan2(points[1].y - points[0].y, points[1].x - points[0].x);
    const hLength = 20; //px
    const hx = points[0].x - Math.cos(angle) * hLength;
    const hy = points[0].y - Math.sin(angle) * hLength;
    
    handleLine.setAttribute('x1', points[0].x);
    handleLine.setAttribute('y1', points[0].y);
    handleLine.setAttribute('x2', hx);
    handleLine.setAttribute('y2', hy);
    
    if (activeCursor === 'bw') {
      handleLine.setAttribute('stroke', '#ffffff');
    } else {
      handleLine.setAttribute('stroke', '#5e2510');
    }
    
    handleLine.setAttribute('stroke-width', config.width * 2.2);
    handleLine.setAttribute('stroke-linecap', 'round');
    
    ropeCanvas.appendChild(path);
    ropeCanvas.appendChild(cracker);
    ropeCanvas.appendChild(handleLine);
  }

  function triggerSplatOverlay(x, y) {
    const splat = document.createElement('div');
    splat.className = 'splat-effect active';
    splat.style.left = `${x}px`;
    splat.style.top = `${y}px`;
    sandbox.appendChild(splat);
    
    setTimeout(() => {
      splat.remove();
    }, 400);
  }

  // --- Mouse Movement & Animation Tick ---
  function getLocalCoords(e) {
    const rect = sandbox.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  sandbox.addEventListener('mouseenter', (e) => {
    isMouseInside = true;
    document.querySelector('.sandbox-instructions').classList.add('hidden');
    
    const coords = getLocalCoords(e);
    mouse.x = coords.x;
    mouse.y = coords.y;
    lastMouse.x = coords.x;
    lastMouse.y = coords.y;
    
    physicsContainer.style.display = 'block';
    
    initRope();
    
    if (activeCursor === 'swatter') {
      // Spawn initial flies
      spawnFly();
      spawnFly();
    }
  });

  sandbox.addEventListener('mouseleave', () => {
    isMouseInside = false;
    document.querySelector('.sandbox-instructions').classList.remove('hidden');
    physicsContainer.style.display = 'none';
    clearAllFlies();
  });

  sandbox.addEventListener('mousemove', (e) => {
    if (!isMouseInside) return;
    const coords = getLocalCoords(e);
    
    // Smooth pointer tracker
    mouse.x = coords.x;
    mouse.y = coords.y;
    
    // Calculate cursor velocity
    const dx = mouse.x - lastMouse.x;
    const dy = mouse.y - lastMouse.y;
    mouseVelocity = Math.sqrt(dx*dx + dy*dy);
    
    // Position custom graphic
    if (activeCursor !== 'bw' && activeCursor !== 'leather') {
      cursorGraphic.style.left = `${mouse.x}px`;
      cursorGraphic.style.top = `${mouse.y}px`;
      
      if (activeCursor === 'fish') {
        updateFishRotation(dx, dy);
      }
    }
    
    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
  });

  // Sandbox Click Actions (Swatting & Shooting)
  sandbox.addEventListener('mousedown', (e) => {
    if (!isMouseInside) return;
    const coords = getLocalCoords(e);
    
    if (activeCursor === 'swatter') {
      attemptSwat(coords.x, coords.y);
    } else if (activeCursor === 'watergun') {
      shootWater(coords.x, coords.y);
    }
  });

  // Main animation frame tick loop
  function loop() {
    if (isMouseInside) {
      if (activeCursor === 'bw' || activeCursor === 'leather') {
        updateRopePhysics();
      } else if (activeCursor === 'swatter') {
        updateFliesPhysics();
        // Periodically spawn flies
        if (Math.random() < 0.015) {
          spawnFly();
        }
      }
    }
    requestAnimationFrame(loop);
  }

  // Run initialization setup
  updateSidebarControls();
  requestAnimationFrame(loop);

});
