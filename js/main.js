/* =========================================================
   SAIPRAVEEN DURAIRAMAN — Portfolio v4.0
   "The Spark" — Electrons organizing into creation
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. THE SPARK — Particle Installation

     Philosophy: Everything is atoms. When we organize electrons,
     magic happens. Click to trigger the organization.

     Default: SCATTERED (particles drifting freely)
     On click: PULL → SPARK → ALIVE → BREATHE → back to SCATTERED
     ========================================================= */
  const canvas = document.getElementById('particle-canvas');
  const heroAvatar = document.getElementById('hero-avatar');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let ambientParticles = [];
    let mouse = { x: null, y: null };
    let animationId;
    let reduceMotion = localStorage.getItem('reduceMotion') === 'true';

    // Installation settings
    const PARTICLE_COUNT = 80;
    const AMBIENT_COUNT = 25;

    // Animation state - default is just scattered
    let isAnimating = false;
    let animationStartTime = 0;
    let currentPhase = 'SCATTERED';
    let pulseRings = [];

    // Phase durations for the click-triggered animation
    const ANIMATION_PHASES = [
      { name: 'PULL', duration: 1500 },
      { name: 'SPARK', duration: 400 },
      { name: 'ALIVE', duration: 3000 },
      { name: 'BREATHE', duration: 1500 }
    ];
    const TOTAL_ANIMATION_DURATION = ANIMATION_PHASES.reduce((sum, p) => sum + p.duration, 0);

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function getAvatarCenter() {
      if (!heroAvatar) return { x: canvas.width / 2, y: canvas.height / 2, radius: 80 };
      const rect = heroAvatar.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        radius: Math.min(rect.width, rect.height) / 2
      };
    }

    function createParticle(index) {
      const center = getAvatarCenter();
      const angle = (index / PARTICLE_COUNT) * Math.PI * 2;

      // Spread particles across a wider area
      const startAngle = Math.random() * Math.PI * 2;
      const startDist = center.radius * 0.5 + Math.random() * center.radius * 4;

      return {
        x: center.x + Math.cos(startAngle) * startDist,
        y: center.y + Math.sin(startAngle) * startDist,

        // Orbital position (for organized phases)
        orbitAngle: angle,
        orbitRadius: center.radius * (0.5 + Math.random() * 0.6),
        orbitSpeed: 0.0004 + Math.random() * 0.0003,
        orbitLayer: Math.floor(Math.random() * 3),

        // Visual - keep consistent size
        baseSize: 2 + Math.random() * 2,
        size: 2 + Math.random() * 2,
        baseOpacity: 0.35 + Math.random() * 0.3,
        opacity: 0.35 + Math.random() * 0.3,
        pulseOffset: Math.random() * Math.PI * 2,

        // Movement for scattered state
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,

        index: index
      };
    }

    function createAmbientParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 1.5 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.15,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
      };
    }

    function initParticles() {
      particles = [];
      ambientParticles = [];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle(i));
      }

      for (let i = 0; i < AMBIENT_COUNT; i++) {
        ambientParticles.push(createAmbientParticle());
      }
    }

    function getCurrentPhase(time) {
      if (!isAnimating) {
        return { name: 'SCATTERED', progress: 0 };
      }

      const elapsed = time - animationStartTime;

      // Animation finished - return to scattered
      if (elapsed >= TOTAL_ANIMATION_DURATION) {
        isAnimating = false;
        return { name: 'SCATTERED', progress: 0 };
      }

      // Find current phase
      let timeInPhase = elapsed;
      for (const phase of ANIMATION_PHASES) {
        if (timeInPhase < phase.duration) {
          return {
            name: phase.name,
            progress: timeInPhase / phase.duration
          };
        }
        timeInPhase -= phase.duration;
      }

      return { name: 'SCATTERED', progress: 0 };
    }

    function triggerAnimation() {
      if (reduceMotion) return;
      isAnimating = true;
      animationStartTime = performance.now();

      // Add pulse ring
      const center = getAvatarCenter();
      pulseRings.push({
        x: center.x,
        y: center.y,
        radius: center.radius * 0.2,
        maxRadius: center.radius * 3.5,
        opacity: 0.7,
        birth: performance.now()
      });
    }

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function easeOutElastic(t) {
      const c4 = (2 * Math.PI) / 3;
      return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function updateParticle(p, time, phase) {
      const center = getAvatarCenter();

      // Mouse interaction - gentle repulsion
      if (mouse.x !== null && !reduceMotion) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120;

        if (dist < maxDist && dist > 0) {
          const force = (maxDist - dist) / maxDist * 0.8;
          p.x += (dx / dist) * force * 2.5;
          p.y += (dy / dist) * force * 2.5;
        }
      }

      if (reduceMotion) {
        p.size = p.baseSize;
        p.opacity = p.baseOpacity;
        return;
      }

      switch (phase.name) {
        case 'SCATTERED':
          // Free floating particles - the default beautiful state
          p.x += p.vx;
          p.y += p.vy;

          // Soft boundary - keep particles in view
          const margin = 50;
          if (p.x < margin) p.vx += 0.02;
          if (p.x > canvas.width - margin) p.vx -= 0.02;
          if (p.y < margin) p.vy += 0.02;
          if (p.y > canvas.height - margin) p.vy -= 0.02;

          // Gentle pull toward avatar area (loose)
          const distFromCenter = Math.sqrt(Math.pow(p.x - center.x, 2) + Math.pow(p.y - center.y, 2));
          if (distFromCenter > center.radius * 5) {
            p.vx += (center.x - p.x) * 0.0003;
            p.vy += (center.y - p.y) * 0.0003;
          }

          // Speed limit
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (speed > 1.2) {
            p.vx *= 0.98;
            p.vy *= 0.98;
          }

          // Consistent size with subtle pulse
          p.size = p.baseSize;
          p.opacity = p.baseOpacity + Math.sin(time * 0.001 + p.pulseOffset) * 0.08;
          break;

        case 'PULL':
          // Particles attracted toward orbital positions
          const pullProgress = easeInOutCubic(phase.progress);
          const pullRadius = p.orbitRadius * (2 - pullProgress);

          const pullTargetX = center.x + Math.cos(p.orbitAngle) * pullRadius;
          const pullTargetY = center.y + Math.sin(p.orbitAngle) * pullRadius;

          p.x += (pullTargetX - p.x) * 0.04 * (1 + pullProgress);
          p.y += (pullTargetY - p.y) * 0.04 * (1 + pullProgress);

          p.opacity = p.baseOpacity + pullProgress * 0.3;
          p.size = p.baseSize * (1 + pullProgress * 0.3);
          break;

        case 'SPARK':
          // Snap to tight formation + flash
          const sparkProgress = easeOutElastic(Math.min(phase.progress * 1.5, 1));
          const tightRadius = p.orbitRadius * 0.7;

          const sparkTargetX = center.x + Math.cos(p.orbitAngle) * tightRadius;
          const sparkTargetY = center.y + Math.sin(p.orbitAngle) * tightRadius;

          p.x += (sparkTargetX - p.x) * 0.2;
          p.y += (sparkTargetY - p.y) * 0.2;

          // Flash
          const flash = phase.progress < 0.4 ? phase.progress / 0.4 : 1 - (phase.progress - 0.4) / 0.6;
          p.opacity = 0.7 + flash * 0.3;
          p.size = p.baseSize * (1.3 + flash * 0.5);

          // Trigger pulse ring
          if (phase.progress > 0.1 && phase.progress < 0.15 && pulseRings.length < 2) {
            pulseRings.push({
              x: center.x,
              y: center.y,
              radius: center.radius * 0.4,
              maxRadius: center.radius * 2.5,
              opacity: 0.5,
              birth: time
            });
          }
          break;

        case 'ALIVE':
          // Organized orbital motion
          p.orbitAngle += p.orbitSpeed * (1 + p.orbitLayer * 0.4);

          const layerMult = 0.75 + p.orbitLayer * 0.2;
          const aliveRadius = p.orbitRadius * layerMult;

          const orbitX = center.x + Math.cos(p.orbitAngle) * aliveRadius;
          const orbitY = center.y + Math.sin(p.orbitAngle) * aliveRadius;

          p.x += (orbitX - p.x) * 0.1;
          p.y += (orbitY - p.y) * 0.1;

          const pulse = Math.sin(time * 0.002 + p.pulseOffset) * 0.1;
          p.opacity = 0.6 + pulse;
          p.size = p.baseSize * (1.2 + pulse * 0.2);
          break;

        case 'BREATHE':
          // Expand back outward
          const breatheProgress = easeOutCubic(phase.progress);
          const expandRadius = p.orbitRadius * (1 + breatheProgress * 2.5);

          const breatheX = center.x + Math.cos(p.orbitAngle) * expandRadius;
          const breatheY = center.y + Math.sin(p.orbitAngle) * expandRadius;

          p.x += (breatheX - p.x) * 0.06;
          p.y += (breatheY - p.y) * 0.06;

          p.opacity = 0.6 - breatheProgress * 0.25;
          p.size = p.baseSize * (1.2 - breatheProgress * 0.2);

          // Restore velocity for scattered state
          if (phase.progress > 0.7) {
            p.vx = (Math.random() - 0.5) * 1;
            p.vy = (Math.random() - 0.5) * 1;
          }
          break;
      }
    }

    function updateAmbientParticle(p) {
      if (reduceMotion) return;

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = canvas.width + 20;
      if (p.x > canvas.width + 20) p.x = -20;
      if (p.y < -20) p.y = canvas.height + 20;
      if (p.y > canvas.height + 20) p.y = -20;
    }

    function getColor() {
      const isDark = document.body.classList.contains('dark-mode');
      return isDark ? { r: 212, g: 148, b: 58 } : { r: 61, g: 90, b: 128 };
    }

    function drawCore(time, phase) {
      const center = getAvatarCenter();
      const color = getColor();

      let coreIntensity = 0.08;
      let coreSize = center.radius * 0.08;

      switch (phase.name) {
        case 'SCATTERED':
          coreIntensity = 0.05 + Math.sin(time * 0.001) * 0.03;
          coreSize = center.radius * 0.06;
          break;
        case 'PULL':
          coreIntensity = 0.05 + phase.progress * 0.35;
          coreSize = center.radius * (0.06 + phase.progress * 0.12);
          break;
        case 'SPARK':
          const sparkFlash = phase.progress < 0.3 ? phase.progress / 0.3 : 0.8;
          coreIntensity = 0.4 + sparkFlash * 0.5;
          coreSize = center.radius * (0.18 + sparkFlash * 0.15);
          break;
        case 'ALIVE':
          const alivePulse = Math.sin(time * 0.003) * 0.08;
          coreIntensity = 0.35 + alivePulse;
          coreSize = center.radius * (0.15 + alivePulse * 0.03);
          break;
        case 'BREATHE':
          coreIntensity = 0.35 - phase.progress * 0.3;
          coreSize = center.radius * (0.15 - phase.progress * 0.09);
          break;
      }

      // Draw glow layers
      for (let i = 3; i >= 0; i--) {
        const glowRadius = coreSize * (1 + i * 1.2);
        const glowOpacity = coreIntensity * (0.25 - i * 0.05);

        ctx.beginPath();
        ctx.arc(center.x, center.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${Math.max(0, glowOpacity)})`;
        ctx.fill();
      }

      // Core center
      ctx.beginPath();
      ctx.arc(center.x, center.y, coreSize * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${coreIntensity + 0.1})`;
      ctx.fill();
    }

    function drawPulseRings(time) {
      const color = getColor();

      pulseRings = pulseRings.filter(ring => {
        const age = time - ring.birth;
        const progress = age / 700;

        if (progress >= 1) return false;

        const currentRadius = ring.radius + (ring.maxRadius - ring.radius) * easeOutCubic(progress);
        const opacity = ring.opacity * (1 - progress);

        ctx.beginPath();
        ctx.arc(ring.x, ring.y, currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${opacity})`;
        ctx.lineWidth = 2.5 * (1 - progress);
        ctx.stroke();

        return true;
      });
    }

    function drawConnections(phase) {
      if (phase.name === 'SCATTERED') return;

      const color = getColor();
      const center = getAvatarCenter();

      let connectionOpacity = 0;
      let maxDistance = center.radius * 0.9;

      switch (phase.name) {
        case 'PULL':
          connectionOpacity = phase.progress * 0.12;
          maxDistance = center.radius * (1.8 - phase.progress * 0.9);
          break;
        case 'SPARK':
          connectionOpacity = 0.2 + phase.progress * 0.1;
          maxDistance = center.radius * 0.8;
          break;
        case 'ALIVE':
          connectionOpacity = 0.18;
          maxDistance = center.radius * 0.9;
          break;
        case 'BREATHE':
          connectionOpacity = 0.18 * (1 - phase.progress);
          maxDistance = center.radius * (0.9 + phase.progress * 0.6);
          break;
      }

      if (connectionOpacity < 0.02) return;

      ctx.lineWidth = 0.6;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < Math.min(i + 6, particles.length); j++) {
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineOpacity = connectionOpacity * (1 - dist / maxDistance);
            ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${lineOpacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Radial connections to core during organized phases
      if (phase.name === 'ALIVE' || phase.name === 'SPARK') {
        const traceOpacity = phase.name === 'SPARK' ? 0.12 + phase.progress * 0.15 : 0.08;
        ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${traceOpacity})`;
        ctx.lineWidth = 0.8;

        particles.forEach((p, i) => {
          if (i % 4 === 0) {
            const dist = Math.sqrt(Math.pow(p.x - center.x, 2) + Math.pow(p.y - center.y, 2));
            if (dist < center.radius * 1.3) {
              ctx.beginPath();
              ctx.moveTo(center.x, center.y);
              ctx.lineTo(p.x, p.y);
              ctx.stroke();
            }
          }
        });
      }
    }

    function drawParticle(p) {
      const color = getColor();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${p.opacity})`;
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${p.opacity * 0.12})`;
      ctx.fill();
    }

    function drawAmbientParticle(p) {
      const color = getColor();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${p.opacity})`;
      ctx.fill();
    }

    function animate(time) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const phase = getCurrentPhase(time);
      currentPhase = phase.name;

      // Ambient particles
      ambientParticles.forEach(p => {
        updateAmbientParticle(p);
        drawAmbientParticle(p);
      });

      // Core
      if (heroAvatar) {
        drawCore(time, phase);
      }

      // Pulse rings
      drawPulseRings(time);

      // Update all particles
      particles.forEach(p => {
        updateParticle(p, time, phase);
      });

      // Connections (only during animation)
      if (!reduceMotion && isAnimating) {
        drawConnections(phase);
      }

      // Draw particles
      particles.forEach(p => {
        drawParticle(p);
      });

      animationId = requestAnimationFrame(animate);
    }

    // Mouse tracking
    document.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Click to trigger the spark animation
    if (heroAvatar) {
      heroAvatar.style.cursor = 'pointer';
      heroAvatar.addEventListener('click', triggerAnimation);
    }

    // Also allow clicking anywhere in the hero area
    canvas.addEventListener('click', (e) => {
      const center = getAvatarCenter();
      const dx = e.clientX - center.x;
      const dy = e.clientY - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // If click is near the avatar area
      if (dist < center.radius * 3) {
        triggerAnimation();
      }
    });

    // Initialize
    resize();
    initParticles();
    animate(0);

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resize();
        if (!isAnimating) {
          // Redistribute particles on resize
          const center = getAvatarCenter();
          particles.forEach(p => {
            const angle = Math.random() * Math.PI * 2;
            const dist = center.radius * 0.5 + Math.random() * center.radius * 4;
            p.x = center.x + Math.cos(angle) * dist;
            p.y = center.y + Math.sin(angle) * dist;
          });
        }
      }, 200);
    });

    // Reduce motion toggle
    const reduceMotionToggle = document.getElementById('reduce-motion-toggle');
    if (reduceMotionToggle) {
      if (reduceMotion) reduceMotionToggle.classList.add('active');

      reduceMotionToggle.addEventListener('click', () => {
        reduceMotion = !reduceMotion;
        localStorage.setItem('reduceMotion', reduceMotion);
        reduceMotionToggle.classList.toggle('active', reduceMotion);
        document.body.classList.toggle('reduce-motion', reduceMotion);
      });
    }

    if (reduceMotion) {
      document.body.classList.add('reduce-motion');
    }
  }

  /* =========================================================
     2. DARK MODE TOGGLE
     ========================================================= */
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && prefersDark.matches)) {
    document.body.classList.add('dark-mode');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  /* =========================================================
     3. NAVIGATION
     ========================================================= */
  const nav = document.querySelector('.nav');
  if (nav) {
    const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  // Mobile menu
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
      document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });
    links.querySelectorAll('.nav-link').forEach(l =>
      l.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('open');
        document.body.style.overflow = '';
      })
    );
  }

  // Active nav link
  const path = (window.location.pathname.replace(/\/$/, '') || '/');
  document.querySelectorAll('.nav-link').forEach(l => {
    const h = l.getAttribute('href').replace(/\/$/, '') || '/';
    if (h === path || (path === '/index.html' && h === '/')) {
      l.classList.add('active');
    }
  });

  /* =========================================================
     4. SCROLL REVEAL
     ========================================================= */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => obs.observe(el));
  }

  /* =========================================================
     5. COUNT-UP ANIMATION
     ========================================================= */
  document.querySelectorAll('[data-count]').forEach(el => {
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const t = parseInt(el.dataset.count, 10);
        const suf = el.dataset.suffix || '';
        const pre = el.dataset.prefix || '';
        const start = performance.now();
        const step = now => {
          const p = Math.min((now - start) / 1600, 1);
          el.textContent = pre + Math.round(t * (1 - Math.pow(1 - p, 3))) + suf;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    cObs.observe(el);
  });

  /* =========================================================
     6. PROJECT FILTERS
     ========================================================= */
  const fBtns = document.querySelectorAll('.filter-btn');
  const pCards = document.querySelectorAll('.project-card[data-category]');
  fBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      fBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      let idx = 0;
      pCards.forEach(card => {
        const show = f === 'all' || card.dataset.category.split(',').includes(f);
        card.style.display = show ? '' : 'none';
        if (show) {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          const d = idx++ * 50;
          setTimeout(() => {
            card.style.transition = 'opacity .4s, transform .4s';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, d);
        }
      });
    });
  });

  /* =========================================================
     7. PROJECT MODAL
     ========================================================= */
  const overlay = document.getElementById('project-modal');
  const mContent = document.getElementById('modal-content');

  document.querySelectorAll('.project-card[data-project]').forEach(card => {
    card.addEventListener('click', () => {
      const tmpl = document.getElementById('detail-' + card.dataset.project);
      if (tmpl && overlay && mContent) {
        mContent.innerHTML = tmpl.innerHTML;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        mContent.querySelectorAll('.modal-gallery img').forEach(img => {
          img.addEventListener('click', e => {
            e.stopPropagation();
            openLightbox(img.src);
          });
        });
      }
    });
  });

  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay || e.target.closest('.modal-close')) closeModal();
    });
  }

  /* =========================================================
     8. LIGHTBOX
     ========================================================= */
  const lb = document.getElementById('lightbox');

  function openLightbox(src) {
    if (!lb) return;
    lb.querySelector('img').src = src;
    lb.classList.add('active');
  }

  function closeLightbox() {
    if (lb) lb.classList.remove('active');
  }

  if (lb) lb.addEventListener('click', closeLightbox);

  /* =========================================================
     9. KEYBOARD SHORTCUTS
     ========================================================= */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      closeLightbox();
    }
  });

  /* =========================================================
     10. PAGE TRANSITIONS
     ========================================================= */
  document.querySelectorAll('a[href]').forEach(a => {
    if (a.hostname === window.location.hostname &&
        !a.hash &&
        a.target !== '_blank' &&
        !a.closest('.modal-overlay') &&
        !a.closest('.lightbox')) {
      a.addEventListener('click', e => {
        e.preventDefault();
        const href = a.href;
        document.body.style.transition = 'opacity .2s ease';
        document.body.style.opacity = '0';
        setTimeout(() => { window.location.href = href; }, 200);
      });
    }
  });

  /* =========================================================
     11. STAGGER CHILDREN ANIMATION
     ========================================================= */
  document.querySelectorAll('.stagger').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          Array.from(e.target.children).forEach((c, i) => {
            c.style.opacity = '0';
            c.style.transform = 'translateY(16px)';
            setTimeout(() => {
              c.style.transition = 'opacity .5s cubic-bezier(0,0,.2,1), transform .5s cubic-bezier(0,0,.2,1)';
              c.style.opacity = '1';
              c.style.transform = 'translateY(0)';
            }, 80 + i * 60);
          });
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    obs.observe(el);
  });

});
