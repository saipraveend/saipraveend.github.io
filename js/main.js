/* =========================================================
   SAIPRAVEEN DURAIRAMAN — Portfolio v4.0
   "The Spark" — Electrons organizing into creation
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. THE SPARK — Particle Installation

     Philosophy: Everything is atoms. When we organize electrons,
     magic happens. This installation visualizes that journey:

     SCATTERED → PULL → SPARK → ALIVE → BREATHE → repeat
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
    const CYCLE_DURATION = 12000; // 12 seconds per cycle

    // Phase timings (in ms)
    const PHASES = {
      SCATTERED: { start: 0, duration: 2000 },
      PULL: { start: 2000, duration: 2500 },
      SPARK: { start: 4500, duration: 500 },
      ALIVE: { start: 5000, duration: 5000 },
      BREATHE: { start: 10000, duration: 2000 }
    };

    let cycleStartTime = 0;
    let currentPhase = 'SCATTERED';
    let sparkIntensity = 0;
    let pulseRings = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function getAvatarCenter() {
      if (!heroAvatar) return { x: canvas.width / 2, y: canvas.height / 2 };
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
      const spreadRadius = center.radius * 3;

      // Start scattered around the center area
      const startAngle = Math.random() * Math.PI * 2;
      const startDist = center.radius * 1.5 + Math.random() * spreadRadius;

      return {
        // Current position
        x: center.x + Math.cos(startAngle) * startDist,
        y: center.y + Math.sin(startAngle) * startDist,

        // Scattered position (random)
        scatteredX: center.x + Math.cos(startAngle) * startDist,
        scatteredY: center.y + Math.sin(startAngle) * startDist,

        // Orbital position (for ALIVE phase)
        orbitAngle: angle,
        orbitRadius: center.radius * (0.4 + Math.random() * 0.5),
        orbitSpeed: 0.0003 + Math.random() * 0.0004,
        orbitLayer: Math.floor(Math.random() * 3), // 0, 1, or 2 - different orbit layers

        // Visual properties
        baseSize: 1.5 + Math.random() * 1.5,
        size: 1.5 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.4,
        pulseOffset: Math.random() * Math.PI * 2,

        // Movement
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,

        // State
        index: index
      };
    }

    function createAmbientParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 1 + Math.random() * 2,
        opacity: 0.08 + Math.random() * 0.12,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3
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

      cycleStartTime = performance.now();
    }

    function getCurrentPhase(time) {
      const cycleTime = (time - cycleStartTime) % CYCLE_DURATION;

      for (const [phase, timing] of Object.entries(PHASES)) {
        if (cycleTime >= timing.start && cycleTime < timing.start + timing.duration) {
          return {
            name: phase,
            progress: (cycleTime - timing.start) / timing.duration,
            cycleTime
          };
        }
      }
      return { name: 'SCATTERED', progress: 0, cycleTime };
    }

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function easeOutElastic(t) {
      const c4 = (2 * Math.PI) / 3;
      return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }

    function updateParticle(p, time, phase) {
      const center = getAvatarCenter();

      // Mouse interaction - gentle repulsion
      if (mouse.x !== null && !reduceMotion) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 100;

        if (dist < maxDist && dist > 0) {
          const force = (maxDist - dist) / maxDist * 0.5;
          p.x += (dx / dist) * force * 2;
          p.y += (dy / dist) * force * 2;
        }
      }

      if (reduceMotion) {
        // In reduce motion, just show particles in orbital positions
        const orbitX = center.x + Math.cos(p.orbitAngle) * p.orbitRadius;
        const orbitY = center.y + Math.sin(p.orbitAngle) * p.orbitRadius;
        p.x = orbitX;
        p.y = orbitY;
        p.size = p.baseSize;
        p.opacity = 0.6;
        return;
      }

      switch (phase.name) {
        case 'SCATTERED':
          // Drift randomly, slight movement toward scattered position
          p.x += p.vx;
          p.y += p.vy;

          // Gentle boundary bounce
          if (p.x < 0 || p.x > canvas.width) p.vx *= -0.8;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -0.8;

          // Keep near avatar area
          const distFromCenter = Math.sqrt(Math.pow(p.x - center.x, 2) + Math.pow(p.y - center.y, 2));
          if (distFromCenter > center.radius * 4) {
            p.vx += (center.x - p.x) * 0.001;
            p.vy += (center.y - p.y) * 0.001;
          }

          p.size = p.baseSize;
          p.opacity = 0.25 + Math.sin(time * 0.002 + p.pulseOffset) * 0.1;
          break;

        case 'PULL':
          // Particles are attracted toward center
          const pullProgress = easeInOutCubic(phase.progress);
          const targetRadius = p.orbitRadius * (1 - pullProgress * 0.3);

          // Calculate target position on orbit path
          const pullTargetX = center.x + Math.cos(p.orbitAngle) * targetRadius * 2;
          const pullTargetY = center.y + Math.sin(p.orbitAngle) * targetRadius * 2;

          // Lerp toward target
          p.x += (pullTargetX - p.x) * 0.03 * (1 + pullProgress);
          p.y += (pullTargetY - p.y) * 0.03 * (1 + pullProgress);

          // Increase brightness as they converge
          p.opacity = 0.3 + pullProgress * 0.4;
          p.size = p.baseSize * (1 + pullProgress * 0.5);
          break;

        case 'SPARK':
          // Quick snap to tight formation + flash
          const sparkProgress = easeOutElastic(Math.min(phase.progress * 2, 1));
          const tightRadius = p.orbitRadius * 0.6;

          const sparkTargetX = center.x + Math.cos(p.orbitAngle) * tightRadius;
          const sparkTargetY = center.y + Math.sin(p.orbitAngle) * tightRadius;

          p.x += (sparkTargetX - p.x) * 0.15;
          p.y += (sparkTargetY - p.y) * 0.15;

          // Flash effect
          const flashIntensity = phase.progress < 0.3 ? phase.progress / 0.3 : 1 - (phase.progress - 0.3) / 0.7;
          p.opacity = 0.7 + flashIntensity * 0.3;
          p.size = p.baseSize * (1.5 + flashIntensity);

          // Trigger pulse ring at spark moment
          if (phase.progress > 0.1 && phase.progress < 0.2 && pulseRings.length < 3) {
            pulseRings.push({
              x: center.x,
              y: center.y,
              radius: center.radius * 0.5,
              maxRadius: center.radius * 2.5,
              opacity: 0.6,
              birth: time
            });
          }
          break;

        case 'ALIVE':
          // Stable orbital motion - the system is alive
          p.orbitAngle += p.orbitSpeed * (1 + p.orbitLayer * 0.3);

          // Multi-layer orbits
          const layerMultiplier = 0.7 + p.orbitLayer * 0.25;
          const aliveRadius = p.orbitRadius * layerMultiplier;

          const orbitX = center.x + Math.cos(p.orbitAngle) * aliveRadius;
          const orbitY = center.y + Math.sin(p.orbitAngle) * aliveRadius;

          // Smooth transition to orbit
          p.x += (orbitX - p.x) * 0.08;
          p.y += (orbitY - p.y) * 0.08;

          // Gentle breathing pulse
          const breathe = Math.sin(time * 0.001 + p.pulseOffset) * 0.15;
          p.opacity = 0.5 + breathe + 0.1;
          p.size = p.baseSize * (1.2 + breathe * 0.3);
          break;

        case 'BREATHE':
          // Expand outward, preparing to scatter
          const breatheProgress = easeInOutCubic(phase.progress);
          const expandRadius = p.orbitRadius * (1 + breatheProgress * 1.5);

          const breatheX = center.x + Math.cos(p.orbitAngle) * expandRadius;
          const breatheY = center.y + Math.sin(p.orbitAngle) * expandRadius;

          p.x += (breatheX - p.x) * 0.05;
          p.y += (breatheY - p.y) * 0.05;

          // Fade out slightly
          p.opacity = 0.6 - breatheProgress * 0.35;
          p.size = p.baseSize * (1.3 - breatheProgress * 0.3);

          // Reset scattered position for next cycle
          if (phase.progress > 0.8) {
            p.scatteredX = p.x + (Math.random() - 0.5) * center.radius;
            p.scatteredY = p.y + (Math.random() - 0.5) * center.radius;
            p.vx = (Math.random() - 0.5) * 0.8;
            p.vy = (Math.random() - 0.5) * 0.8;
          }
          break;
      }
    }

    function updateAmbientParticle(p) {
      if (reduceMotion) return;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around screen
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

      // Core intensity based on phase
      let coreIntensity = 0.1;
      let coreSize = center.radius * 0.15;

      switch (phase.name) {
        case 'SCATTERED':
          coreIntensity = 0.1 + Math.sin(time * 0.002) * 0.05;
          coreSize = center.radius * 0.1;
          break;
        case 'PULL':
          coreIntensity = 0.1 + phase.progress * 0.4;
          coreSize = center.radius * (0.1 + phase.progress * 0.1);
          break;
        case 'SPARK':
          coreIntensity = 0.5 + (phase.progress < 0.3 ? phase.progress * 2 : 0.6);
          coreSize = center.radius * (0.2 + (phase.progress < 0.3 ? phase.progress : 0.3) * 0.3);
          break;
        case 'ALIVE':
          const alivePulse = Math.sin(time * 0.003) * 0.1;
          coreIntensity = 0.4 + alivePulse;
          coreSize = center.radius * (0.18 + alivePulse * 0.05);
          break;
        case 'BREATHE':
          coreIntensity = 0.4 - phase.progress * 0.3;
          coreSize = center.radius * (0.18 - phase.progress * 0.08);
          break;
      }

      // Draw core glow (multiple layers)
      for (let i = 3; i >= 0; i--) {
        const glowRadius = coreSize * (1 + i * 0.8);
        const glowOpacity = coreIntensity * (0.3 - i * 0.07);

        ctx.beginPath();
        ctx.arc(center.x, center.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${glowOpacity})`;
        ctx.fill();
      }

      // Draw core center
      ctx.beginPath();
      ctx.arc(center.x, center.y, coreSize * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${coreIntensity + 0.2})`;
      ctx.fill();
    }

    function drawPulseRings(time) {
      const color = getColor();

      pulseRings = pulseRings.filter(ring => {
        const age = time - ring.birth;
        const progress = age / 800; // 800ms duration

        if (progress >= 1) return false;

        const currentRadius = ring.radius + (ring.maxRadius - ring.radius) * easeInOutCubic(progress);
        const opacity = ring.opacity * (1 - progress);

        ctx.beginPath();
        ctx.arc(ring.x, ring.y, currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${opacity})`;
        ctx.lineWidth = 2 * (1 - progress);
        ctx.stroke();

        return true;
      });
    }

    function drawParticle(p) {
      const color = getColor();

      // Main particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${p.opacity})`;
      ctx.fill();

      // Subtle glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${p.opacity * 0.15})`;
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

      // Draw ambient particles (background)
      ambientParticles.forEach(p => {
        updateAmbientParticle(p);
        drawAmbientParticle(p);
      });

      // Draw core
      if (heroAvatar) {
        drawCore(time, phase);
      }

      // Draw pulse rings
      drawPulseRings(time);

      // Update and draw main particles
      particles.forEach(p => {
        updateParticle(p, time, phase);
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

    // Click to trigger spark
    if (heroAvatar) {
      heroAvatar.addEventListener('click', () => {
        if (!reduceMotion) {
          // Reset cycle to spark phase
          cycleStartTime = performance.now() - PHASES.SPARK.start;
          const center = getAvatarCenter();
          pulseRings.push({
            x: center.x,
            y: center.y,
            radius: center.radius * 0.3,
            maxRadius: center.radius * 3,
            opacity: 0.8,
            birth: performance.now()
          });
        }
      });
    }

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
        // Reinitialize particles with new positions
        particles.forEach((p, i) => {
          const newP = createParticle(i);
          p.scatteredX = newP.scatteredX;
          p.scatteredY = newP.scatteredY;
          p.orbitRadius = newP.orbitRadius;
        });
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
