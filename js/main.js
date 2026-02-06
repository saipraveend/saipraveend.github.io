/* =========================================================
   SAIPRAVEEN DURAIRAMAN — Portfolio v4.0
   Ambient Particles · Dark Mode · Modern Interactions
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. PARTICLE SYSTEM — Profile Image Portrait
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
    const AVATAR_PARTICLE_COUNT = 150;

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

    // Generate portrait silhouette points (head and shoulders)
    function generatePortraitPoints(count) {
      const points = [];

      // Head - oval shape (top portion)
      const headPoints = Math.floor(count * 0.45);
      for (let i = 0; i < headPoints; i++) {
        const angle = (i / headPoints) * Math.PI * 2;
        const radiusX = 0.18 + Math.random() * 0.04;
        const radiusY = 0.22 + Math.random() * 0.04;
        const x = 0.5 + Math.cos(angle) * radiusX;
        const y = 0.28 + Math.sin(angle) * radiusY * 0.9;
        points.push({ x, y, brightness: 0.3 + Math.random() * 0.3 });
      }

      // Face details - inner points
      const facePoints = Math.floor(count * 0.15);
      for (let i = 0; i < facePoints; i++) {
        const x = 0.35 + Math.random() * 0.3;
        const y = 0.15 + Math.random() * 0.3;
        // Check if inside head oval
        const dx = (x - 0.5) / 0.18;
        const dy = (y - 0.28) / 0.22;
        if (dx * dx + dy * dy < 1) {
          points.push({ x, y, brightness: 0.4 + Math.random() * 0.4 });
        }
      }

      // Neck
      const neckPoints = Math.floor(count * 0.05);
      for (let i = 0; i < neckPoints; i++) {
        const x = 0.45 + Math.random() * 0.1;
        const y = 0.48 + Math.random() * 0.08;
        points.push({ x, y, brightness: 0.3 + Math.random() * 0.2 });
      }

      // Shoulders - curved line
      const shoulderPoints = Math.floor(count * 0.35);
      for (let i = 0; i < shoulderPoints; i++) {
        const t = i / shoulderPoints;
        const x = 0.15 + t * 0.7;
        // Parabolic curve for shoulders
        const shoulderCurve = -0.3 * Math.pow((t - 0.5) * 2, 2) + 0.08;
        const y = 0.58 + shoulderCurve + Math.random() * 0.12;
        points.push({ x, y, brightness: 0.25 + Math.random() * 0.25 });
      }

      // Body fill
      const bodyPoints = count - points.length;
      for (let i = 0; i < bodyPoints; i++) {
        const x = 0.25 + Math.random() * 0.5;
        const y = 0.65 + Math.random() * 0.3;
        // Taper towards bottom
        const width = 0.5 - (y - 0.65) * 0.3;
        if (Math.abs(x - 0.5) < width / 2) {
          points.push({ x, y, brightness: 0.2 + Math.random() * 0.2 });
        }
      }

      return points;
    }

    // Extract points from profile image using edge detection
    function extractImagePoints(img, targetCount) {
      try {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        const sampleSize = 100;
        tempCanvas.width = sampleSize;
        tempCanvas.height = sampleSize;

        tempCtx.drawImage(img, 0, 0, sampleSize, sampleSize);

        let imageData;
        try {
          imageData = tempCtx.getImageData(0, 0, sampleSize, sampleSize);
        } catch (e) {
          console.log('Canvas security error, using fallback');
          return null;
        }

        const data = imageData.data;
        const points = [];

        // Edge detection: find pixels with high contrast to neighbors
        function getPixelBrightness(x, y) {
          if (x < 0 || x >= sampleSize || y < 0 || y >= sampleSize) return 0;
          const i = (y * sampleSize + x) * 4;
          const a = data[i + 3];
          if (a < 50) return -1; // Transparent
          return (data[i] + data[i + 1] + data[i + 2]) / 3;
        }

        // First pass: collect all visible pixels with edge strength
        const candidates = [];
        for (let y = 1; y < sampleSize - 1; y++) {
          for (let x = 1; x < sampleSize - 1; x++) {
            const center = getPixelBrightness(x, y);
            if (center < 0) continue; // Skip transparent

            // Calculate edge strength using Sobel-like operator
            const left = getPixelBrightness(x - 1, y);
            const right = getPixelBrightness(x + 1, y);
            const top = getPixelBrightness(x, y - 1);
            const bottom = getPixelBrightness(x, y + 1);

            // Check for edges (transitions from content to transparent or high contrast)
            let edgeStrength = 0;
            if (left < 0 || right < 0 || top < 0 || bottom < 0) {
              edgeStrength = 1.0; // Edge of visible content
            } else {
              const gx = Math.abs(right - left);
              const gy = Math.abs(bottom - top);
              edgeStrength = Math.sqrt(gx * gx + gy * gy) / 255;
            }

            candidates.push({
              x: x / sampleSize,
              y: y / sampleSize,
              brightness: center / 255,
              edgeStrength: edgeStrength,
              isEdge: edgeStrength > 0.15
            });
          }
        }

        if (candidates.length < 30) {
          console.log('Not enough visible pixels, using fallback');
          return null;
        }

        // Separate edge and interior points
        const edgePoints = candidates.filter(p => p.isEdge);
        const interiorPoints = candidates.filter(p => !p.isEdge);

        // Prioritize edges for the outline, fill with interior points
        const edgeCount = Math.min(Math.floor(targetCount * 0.6), edgePoints.length);
        const interiorCount = targetCount - edgeCount;

        // Shuffle and sample
        const shuffledEdges = edgePoints.sort(() => Math.random() - 0.5).slice(0, edgeCount);
        const shuffledInterior = interiorPoints.sort(() => Math.random() - 0.5).slice(0, interiorCount);

        const result = [...shuffledEdges, ...shuffledInterior].map(p => ({
          x: p.x,
          y: p.y,
          brightness: p.isEdge ? 0.2 : p.brightness
        }));

        console.log('Extracted', result.length, 'points (', edgeCount, 'edges,', result.length - edgeCount, 'interior)');
        return result;

      } catch (e) {
        console.log('Image processing error:', e);
        return null;
      }
    }

    // Load profile image and extract points
    function loadProfileImage() {
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
          console.log('Loaded', avatarPoints.length, 'points from profile image');
        } else {
          avatarPoints = generatePortraitPoints(AVATAR_PARTICLE_COUNT);
          console.log('Using generated portrait with', avatarPoints.length, 'points');
        }
        imageLoaded = true;
        initParticles();
      };

      img.onerror = () => {
        console.log('Image failed to load, using generated portrait');
        avatarPoints = generatePortraitPoints(AVATAR_PARTICLE_COUNT);
        imageLoaded = true;
        initParticles();
      };

      // Use the correct PNG extension
      img.src = '/assets/images/profile.png';
    }

    function createParticle(index, isAvatarParticle = false) {
      const avatarBounds = getAvatarBounds();
      let targetX = null, targetY = null;
      let brightness = 0.5;
      let isEdge = false;

      if (isAvatarParticle && avatarBounds && index < avatarPoints.length) {
        const point = avatarPoints[index];
        targetX = avatarBounds.x + point.x * avatarBounds.width;
        targetY = avatarBounds.y + point.y * avatarBounds.height;
        brightness = point.brightness;
        isEdge = brightness < 0.3; // Edge points have low brightness value
      }

      // Edge particles are smaller and brighter, interior particles are larger and dimmer
      const size = isAvatarParticle
        ? (isEdge ? 1.2 + Math.random() * 0.8 : 1.8 + Math.random() * 1.5)
        : 1.5 + Math.random() * 1.5;

      const opacity = isAvatarParticle
        ? (isEdge ? 0.6 + Math.random() * 0.3 : 0.25 + Math.random() * 0.25)
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
        isEdge,
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
      const pulse = p.isAvatar ? 0.08 * Math.sin(time * 0.002 + p.pulseOffset) : 0;
      const opacity = Math.max(0.05, Math.min(1, p.opacity + pulse));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = color + opacity + ')';
      ctx.fill();

      // Glow for edge particles (they define the outline)
      if (p.isAvatar && p.isEdge) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = color + (opacity * 0.15) + ')';
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
    loadProfileImage();
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
