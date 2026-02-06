/* =========================================================
   SAIPRAVEEN DURAIRAMAN — Portfolio v4.0
   Ambient Particles · Dark Mode · Modern Interactions
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. PARTICLE SYSTEM — Profile Image Silhouette
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

    const PARTICLE_COUNT = 40;
    const AVATAR_PARTICLE_COUNT = 120; // More particles for detailed portrait

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
        height: rect.height,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2
      };
    }

    // Extract points from profile image
    function extractImagePoints(img, targetCount) {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');

      // Sample at reasonable resolution
      const sampleSize = 100;
      tempCanvas.width = sampleSize;
      tempCanvas.height = sampleSize;

      tempCtx.drawImage(img, 0, 0, sampleSize, sampleSize);
      const imageData = tempCtx.getImageData(0, 0, sampleSize, sampleSize);
      const data = imageData.data;

      const points = [];
      const step = 2; // Sample every 2 pixels

      for (let y = 0; y < sampleSize; y += step) {
        for (let x = 0; x < sampleSize; x += step) {
          const i = (y * sampleSize + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Calculate brightness
          const brightness = (r + g + b) / 3;

          // Only include darker pixels (the subject, not background)
          // and pixels that aren't fully transparent
          if (a > 128 && brightness < 200) {
            points.push({
              x: x / sampleSize,
              y: y / sampleSize,
              brightness: brightness / 255
            });
          }
        }
      }

      // Randomly sample to get target count
      const sampled = [];
      const shuffled = points.sort(() => Math.random() - 0.5);
      for (let i = 0; i < Math.min(targetCount, shuffled.length); i++) {
        sampled.push(shuffled[i]);
      }

      return sampled;
    }

    // Load profile image and extract points
    function loadProfileImage() {
      if (!heroAvatar) {
        initParticles();
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        avatarPoints = extractImagePoints(img, AVATAR_PARTICLE_COUNT);
        imageLoaded = true;
        initParticles();
      };
      img.onerror = () => {
        // Fallback to simple circle if image fails
        avatarPoints = generateCirclePoints(AVATAR_PARTICLE_COUNT);
        imageLoaded = true;
        initParticles();
      };
      img.src = '/assets/images/profile.jpg';
    }

    // Fallback: generate circular points
    function generateCirclePoints(count) {
      const points = [];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const radius = 0.3 + Math.random() * 0.15;
        points.push({
          x: 0.5 + Math.cos(angle) * radius,
          y: 0.5 + Math.sin(angle) * radius,
          brightness: 0.5
        });
      }
      return points;
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

      return {
        x: targetX || Math.random() * canvas.width,
        y: targetY || Math.random() * canvas.height,
        targetX,
        targetY,
        size: isAvatarParticle ? 2 + (1 - brightness) * 2 : 2 + Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        isAvatar: isAvatarParticle,
        opacity: isAvatarParticle ? 0.5 + (1 - brightness) * 0.4 : 0.2 + Math.random() * 0.2,
        pulseOffset: Math.random() * Math.PI * 2
      };
    }

    function initParticles() {
      particles = [];
      const hasAvatar = !!heroAvatar && avatarPoints.length > 0;

      // Avatar particles (form profile silhouette)
      if (hasAvatar) {
        for (let i = 0; i < avatarPoints.length; i++) {
          particles.push(createParticle(i, true));
        }
      }

      // Ambient particles
      const ambientCount = hasAvatar ? PARTICLE_COUNT - 15 : PARTICLE_COUNT;
      for (let i = 0; i < ambientCount; i++) {
        particles.push(createParticle(i, false));
      }
    }

    function getParticleColor(particle) {
      const isDark = document.body.classList.contains('dark-mode');
      if (particle.isAvatar) {
        return isDark ? 'rgba(212,148,58,' : 'rgba(61,90,128,';
      }
      return isDark ? 'rgba(212,148,58,' : 'rgba(61,90,128,';
    }

    function drawParticle(p, time) {
      const color = getParticleColor(p);
      const pulse = p.isAvatar ? 0.1 * Math.sin(time * 0.002 + p.pulseOffset) : 0;
      const opacity = Math.max(0.1, Math.min(1, p.opacity + pulse));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = color + opacity + ')';
      ctx.fill();

      // Subtle glow for avatar particles
      if (p.isAvatar && p.opacity > 0.6) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
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
        const maxDist = 100;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          const angle = Math.atan2(dy, dx);
          const direction = p.isAvatar ? 0.2 : -0.6;
          p.x += Math.cos(angle) * force * direction;
          p.y += Math.sin(angle) * force * direction;
        }
      }

      // Avatar particles return to their position
      if (p.isAvatar && p.targetX !== null) {
        const avatarBounds = getAvatarBounds();
        if (avatarBounds && particles.indexOf(p) < avatarPoints.length) {
          const index = particles.indexOf(p);
          const point = avatarPoints[index];
          if (point) {
            p.targetX = avatarBounds.x + point.x * avatarBounds.width;
            p.targetY = avatarBounds.y + point.y * avatarBounds.height;
          }
        }

        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        p.x += dx * 0.05;
        p.y += dy * 0.05;

        // Tiny organic movement
        p.x += Math.sin(Date.now() * 0.001 + p.pulseOffset) * 0.2;
        p.y += Math.cos(Date.now() * 0.0012 + p.pulseOffset) * 0.2;
      } else {
        // Ambient particles drift
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;
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
