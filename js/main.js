/* =========================================================
   SAIPRAVEEN DURAIRAMAN — Portfolio v4.0
   Ambient Particles · Dark Mode · Modern Interactions
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. PARTICLE SYSTEM — Robot Favicon Avatar
     ========================================================= */
  const canvas = document.getElementById('particle-canvas');
  const heroAvatar = document.getElementById('hero-avatar');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let avatarPoints = [];
    let mouse = { x: null, y: null };
    let animationId;
    let reduceMotion = localStorage.getItem('reduceMotion') === 'true';
    let imageLoaded = false;

    const PARTICLE_COUNT = 35;
    const AVATAR_PARTICLE_COUNT = 180;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function getAvatarBounds() {
      if (!heroAvatar) return null;
      const rect = heroAvatar.getBoundingClientRect();
      return {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      };
    }

    // Generate robot silhouette points (matches the favicon robot)
    function generateRobotPoints(count) {
      const points = [];

      // Robot head (rounded rectangle at top)
      const headPoints = Math.floor(count * 0.35);
      for (let i = 0; i < headPoints; i++) {
        // Head outline
        const t = i / headPoints;
        let x, y;
        if (t < 0.25) { // Top edge
          x = 0.25 + (t / 0.25) * 0.5;
          y = 0.08 + Math.random() * 0.02;
        } else if (t < 0.5) { // Right edge
          x = 0.75 + Math.random() * 0.02;
          y = 0.08 + ((t - 0.25) / 0.25) * 0.28;
        } else if (t < 0.75) { // Bottom edge
          x = 0.75 - ((t - 0.5) / 0.25) * 0.5;
          y = 0.36 + Math.random() * 0.02;
        } else { // Left edge
          x = 0.25 + Math.random() * 0.02;
          y = 0.36 - ((t - 0.75) / 0.25) * 0.28;
        }
        points.push({ x, y, brightness: 0.2 });
      }

      // Eyes (two rectangles)
      const eyePoints = Math.floor(count * 0.12);
      for (let i = 0; i < eyePoints; i++) {
        const isLeftEye = i < eyePoints / 2;
        const x = isLeftEye ? 0.32 + Math.random() * 0.08 : 0.60 + Math.random() * 0.08;
        const y = 0.18 + Math.random() * 0.06;
        points.push({ x, y, brightness: 0.5 });
      }

      // Mouth (rectangle)
      const mouthPoints = Math.floor(count * 0.06);
      for (let i = 0; i < mouthPoints; i++) {
        const x = 0.38 + Math.random() * 0.24;
        const y = 0.28 + Math.random() * 0.04;
        points.push({ x, y, brightness: 0.5 });
      }

      // Antenna
      const antennaPoints = Math.floor(count * 0.04);
      for (let i = 0; i < antennaPoints; i++) {
        const x = 0.48 + Math.random() * 0.04;
        const y = 0.02 + Math.random() * 0.06;
        points.push({ x, y, brightness: 0.3 });
      }

      // Body (rectangle below head)
      const bodyPoints = Math.floor(count * 0.2);
      for (let i = 0; i < bodyPoints; i++) {
        const t = i / bodyPoints;
        let x, y;
        if (t < 0.3) { // Top and sides
          x = 0.3 + (t / 0.3) * 0.4;
          y = 0.42 + Math.random() * 0.02;
        } else if (t < 0.6) {
          x = 0.3 + Math.random() * 0.02;
          y = 0.42 + ((t - 0.3) / 0.3) * 0.2;
        } else {
          x = 0.7 + Math.random() * 0.02;
          y = 0.42 + ((t - 0.6) / 0.4) * 0.2;
        }
        points.push({ x, y, brightness: 0.25 });
      }

      // Arms (extending from body sides)
      const armPoints = Math.floor(count * 0.1);
      for (let i = 0; i < armPoints; i++) {
        const isLeftArm = i < armPoints / 2;
        const x = isLeftArm ? 0.15 + Math.random() * 0.12 : 0.73 + Math.random() * 0.12;
        const y = 0.46 + Math.random() * 0.12;
        points.push({ x, y, brightness: 0.3 });
      }

      // Legs (two rectangles at bottom)
      const legPoints = Math.floor(count * 0.13);
      for (let i = 0; i < legPoints; i++) {
        const isLeftLeg = i < legPoints / 2;
        const x = isLeftLeg ? 0.35 + Math.random() * 0.08 : 0.57 + Math.random() * 0.08;
        const y = 0.68 + Math.random() * 0.22;
        points.push({ x, y, brightness: 0.25 });
      }

      return points;
    }

    // Extract points from favicon (black and white image)
    function extractImagePoints(img, targetCount) {
      try {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        const sampleSize = 64; // Favicon is small, no need for large canvas
        tempCanvas.width = sampleSize;
        tempCanvas.height = sampleSize;

        // White background to handle transparency
        tempCtx.fillStyle = '#FFFFFF';
        tempCtx.fillRect(0, 0, sampleSize, sampleSize);
        tempCtx.drawImage(img, 0, 0, sampleSize, sampleSize);

        let imageData;
        try {
          imageData = tempCtx.getImageData(0, 0, sampleSize, sampleSize);
        } catch (e) {
          console.log('Canvas security error, using fallback');
          return null;
        }

        const data = imageData.data;
        const darkPixels = [];

        // Collect all dark pixels (the robot is black on white background)
        for (let y = 0; y < sampleSize; y++) {
          for (let x = 0; x < sampleSize; x++) {
            const i = (y * sampleSize + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const brightness = (r + g + b) / 3;

            // Dark pixels are part of the robot (threshold for black pixels)
            if (brightness < 180) {
              darkPixels.push({
                x: x / sampleSize,
                y: y / sampleSize,
                brightness: brightness / 255
              });
            }
          }
        }

        if (darkPixels.length < 20) {
          console.log('Not enough dark pixels found, using fallback');
          return null;
        }

        // Shuffle and sample to get target count
        const shuffled = darkPixels.sort(() => Math.random() - 0.5);
        const result = shuffled.slice(0, Math.min(targetCount, shuffled.length));

        console.log('Extracted', result.length, 'points from favicon');
        return result;

      } catch (e) {
        console.log('Image processing error:', e);
        return null;
      }
    }

    // Load favicon and extract points for robot avatar
    function loadFaviconImage() {
      if (!heroAvatar) {
        avatarPoints = [];
        initParticles();
        return;
      }

      const img = new Image();

      img.onload = () => {
        const extracted = extractImagePoints(img, AVATAR_PARTICLE_COUNT);
        if (extracted && extracted.length > 50) {
          avatarPoints = extracted;
          console.log('Loaded', avatarPoints.length, 'points from favicon');
        } else {
          avatarPoints = generateRobotPoints(AVATAR_PARTICLE_COUNT);
          console.log('Using generated robot with', avatarPoints.length, 'points');
        }
        imageLoaded = true;
        initParticles();
      };

      img.onerror = () => {
        console.log('Favicon failed to load, using generated robot');
        avatarPoints = generateRobotPoints(AVATAR_PARTICLE_COUNT);
        imageLoaded = true;
        initParticles();
      };

      // Load the favicon
      img.src = '/assets/images/favicon/favicon-96x96.png';
    }

    function createParticle(index, isAvatarParticle = false) {
      const avatarBounds = getAvatarBounds();
      let targetX = null, targetY = null;
      let brightness = 0.5;

      if (isAvatarParticle && avatarBounds && index < avatarPoints.length) {
        const point = avatarPoints[index];
        targetX = avatarBounds.x + point.x * avatarBounds.width;
        targetY = avatarBounds.y + point.y * avatarBounds.height;
        brightness = point.brightness;
      }

      // Consistent sizing for robot particles
      const size = isAvatarParticle
        ? 1.5 + Math.random() * 1.0
        : 1.5 + Math.random() * 1.5;

      const opacity = isAvatarParticle
        ? 0.5 + Math.random() * 0.35
        : 0.15 + Math.random() * 0.2;

      return {
        x: targetX !== null ? targetX : Math.random() * canvas.width,
        y: targetY !== null ? targetY : Math.random() * canvas.height,
        targetX,
        targetY,
        size,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        isAvatar: isAvatarParticle,
        opacity,
        pulseOffset: Math.random() * Math.PI * 2
      };
    }

    function initParticles() {
      particles = [];
      const hasAvatar = heroAvatar && avatarPoints.length > 0;

      if (hasAvatar) {
        for (let i = 0; i < avatarPoints.length; i++) {
          particles.push(createParticle(i, true));
        }
      }

      const ambientCount = hasAvatar ? PARTICLE_COUNT : PARTICLE_COUNT + 15;
      for (let i = 0; i < ambientCount; i++) {
        particles.push(createParticle(i, false));
      }
    }

    function getParticleColor(particle) {
      const isDark = document.body.classList.contains('dark-mode');
      return isDark ? 'rgba(212,148,58,' : 'rgba(61,90,128,';
    }

    function drawParticle(p, time) {
      const color = getParticleColor(p);
      const pulse = p.isAvatar ? 0.06 * Math.sin(time * 0.002 + p.pulseOffset) : 0;
      const opacity = Math.max(0.05, Math.min(1, p.opacity + pulse));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = color + opacity + ')';
      ctx.fill();

      // Subtle glow for avatar particles
      if (p.isAvatar) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = color + (opacity * 0.1) + ')';
        ctx.fill();
      }
    }

    function updateParticle(p) {
      if (reduceMotion) {
        if (p.targetX !== null) {
          p.x = p.targetX;
          p.y = p.targetY;
        }
        return;
      }

      // Mouse interaction
      if (mouse.x !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 80;

        if (dist < maxDist && dist > 0) {
          const force = (maxDist - dist) / maxDist;
          const angle = Math.atan2(dy, dx);
          const direction = p.isAvatar ? 0.15 : -0.5;
          p.x += Math.cos(angle) * force * direction;
          p.y += Math.sin(angle) * force * direction;
        }
      }

      if (p.isAvatar && p.targetX !== null) {
        const avatarBounds = getAvatarBounds();
        const index = particles.indexOf(p);

        if (avatarBounds && index >= 0 && index < avatarPoints.length) {
          const point = avatarPoints[index];
          p.targetX = avatarBounds.x + point.x * avatarBounds.width;
          p.targetY = avatarBounds.y + point.y * avatarBounds.height;
        }

        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        p.x += dx * 0.06;
        p.y += dy * 0.06;

        // Subtle organic movement
        p.x += Math.sin(Date.now() * 0.0008 + p.pulseOffset) * 0.15;
        p.y += Math.cos(Date.now() * 0.001 + p.pulseOffset) * 0.15;
      } else {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < -30) p.x = canvas.width + 30;
        if (p.x > canvas.width + 30) p.x = -30;
        if (p.y < -30) p.y = canvas.height + 30;
        if (p.y > canvas.height + 30) p.y = -30;
      }
    }

    function animate(time) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        updateParticle(p);
        drawParticle(p, time);
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

    // Initialize
    resize();
    loadFaviconImage();
    animate(0);

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resize();
        if (imageLoaded) initParticles();
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
