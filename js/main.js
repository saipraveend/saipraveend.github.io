/* =========================================================
   SAIPRAVEEN DURAIRAMAN — Portfolio v4.0
   Ambient Particles · Dark Mode · Modern Interactions
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. PARTICLE SYSTEM — Ambient Electrons
     ========================================================= */
  const canvas = document.getElementById('particle-canvas');
  const heroAvatar = document.getElementById('hero-avatar');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let animationId;
    let reduceMotion = localStorage.getItem('reduceMotion') === 'true';

    // Humanoid silhouette points (normalized 0-1, will scale to avatar area)
    const silhouettePoints = [
      // Head (circle approximation)
      { x: 0.5, y: 0.08 }, { x: 0.58, y: 0.1 }, { x: 0.62, y: 0.15 },
      { x: 0.62, y: 0.22 }, { x: 0.58, y: 0.27 }, { x: 0.5, y: 0.29 },
      { x: 0.42, y: 0.27 }, { x: 0.38, y: 0.22 }, { x: 0.38, y: 0.15 },
      { x: 0.42, y: 0.1 },
      // Neck
      { x: 0.47, y: 0.32 }, { x: 0.53, y: 0.32 },
      // Shoulders
      { x: 0.25, y: 0.38 }, { x: 0.35, y: 0.36 }, { x: 0.65, y: 0.36 }, { x: 0.75, y: 0.38 },
      // Arms left
      { x: 0.18, y: 0.45 }, { x: 0.15, y: 0.55 }, { x: 0.18, y: 0.65 },
      // Arms right
      { x: 0.82, y: 0.45 }, { x: 0.85, y: 0.55 }, { x: 0.82, y: 0.65 },
      // Torso
      { x: 0.35, y: 0.45 }, { x: 0.5, y: 0.42 }, { x: 0.65, y: 0.45 },
      { x: 0.35, y: 0.58 }, { x: 0.5, y: 0.55 }, { x: 0.65, y: 0.58 },
      { x: 0.38, y: 0.7 }, { x: 0.5, y: 0.68 }, { x: 0.62, y: 0.7 },
      // Legs
      { x: 0.38, y: 0.78 }, { x: 0.35, y: 0.88 }, { x: 0.38, y: 0.98 },
      { x: 0.62, y: 0.78 }, { x: 0.65, y: 0.88 }, { x: 0.62, y: 0.98 },
      // Extra body fill
      { x: 0.45, y: 0.48 }, { x: 0.55, y: 0.48 },
      { x: 0.45, y: 0.62 }, { x: 0.55, y: 0.62 },
    ];

    const PARTICLE_COUNT = 50;
    const AVATAR_PARTICLE_COUNT = silhouettePoints.length;

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

    function createParticle(index, isAvatarParticle = false) {
      const avatarBounds = getAvatarBounds();
      let targetX = null, targetY = null;

      if (isAvatarParticle && avatarBounds && index < silhouettePoints.length) {
        const point = silhouettePoints[index];
        targetX = avatarBounds.x + point.x * avatarBounds.width;
        targetY = avatarBounds.y + point.y * avatarBounds.height;
      }

      return {
        x: targetX || Math.random() * canvas.width,
        y: targetY || Math.random() * canvas.height,
        targetX,
        targetY,
        baseX: targetX || Math.random() * canvas.width,
        baseY: targetY || Math.random() * canvas.height,
        size: isAvatarParticle ? 3 + Math.random() * 2 : 2 + Math.random() * 2,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        isAvatar: isAvatarParticle,
        opacity: isAvatarParticle ? 0.7 + Math.random() * 0.3 : 0.3 + Math.random() * 0.3,
        pulseOffset: Math.random() * Math.PI * 2
      };
    }

    function initParticles() {
      particles = [];
      const hasAvatar = !!heroAvatar;

      // Avatar particles (cluster into silhouette)
      if (hasAvatar) {
        for (let i = 0; i < AVATAR_PARTICLE_COUNT; i++) {
          particles.push(createParticle(i, true));
        }
      }

      // Ambient particles
      const ambientCount = hasAvatar ? PARTICLE_COUNT - 10 : PARTICLE_COUNT;
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
      const pulse = p.isAvatar ? 0.15 * Math.sin(time * 0.002 + p.pulseOffset) : 0;
      const opacity = Math.max(0.1, Math.min(1, p.opacity + pulse));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = color + opacity + ')';
      ctx.fill();

      // Glow effect for avatar particles
      if (p.isAvatar) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = color + (opacity * 0.2) + ')';
        ctx.fill();
      }
    }

    function updateParticle(p) {
      if (reduceMotion) {
        // In reduce motion mode, particles stay at their target/base position
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
        const maxDist = 150;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          const angle = Math.atan2(dy, dx);
          // Avatar particles are attracted, ambient particles are repelled
          const direction = p.isAvatar ? 0.3 : -0.8;
          p.x += Math.cos(angle) * force * direction;
          p.y += Math.sin(angle) * force * direction;
        }
      }

      // Avatar particles return to silhouette position
      if (p.isAvatar && p.targetX !== null) {
        const avatarBounds = getAvatarBounds();
        if (avatarBounds) {
          const index = particles.indexOf(p);
          if (index < silhouettePoints.length) {
            const point = silhouettePoints[index];
            p.targetX = avatarBounds.x + point.x * avatarBounds.width;
            p.targetY = avatarBounds.y + point.y * avatarBounds.height;
          }
        }

        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        p.x += dx * 0.03;
        p.y += dy * 0.03;

        // Small organic movement
        p.x += Math.sin(Date.now() * 0.001 + p.pulseOffset) * 0.3;
        p.y += Math.cos(Date.now() * 0.001 + p.pulseOffset) * 0.3;
      } else {
        // Ambient particles drift
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around screen
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;
      }
    }

    function drawConnections() {
      if (reduceMotion) return;

      const avatarParticles = particles.filter(p => p.isAvatar);
      const isDark = document.body.classList.contains('dark-mode');
      const lineColor = isDark ? 'rgba(212,148,58,' : 'rgba(61,90,128,';

      for (let i = 0; i < avatarParticles.length; i++) {
        for (let j = i + 1; j < avatarParticles.length; j++) {
          const p1 = avatarParticles[i];
          const p2 = avatarParticles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 60) {
            const opacity = (1 - dist / 60) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = lineColor + opacity + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    function animate(time) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawConnections();

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
    initParticles();
    animate(0);

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resize();
        initParticles();
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

    // Apply reduce motion on load
    if (reduceMotion) {
      document.body.classList.add('reduce-motion');
    }
  }

  /* =========================================================
     2. DARK MODE TOGGLE
     ========================================================= */
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  // Check saved preference or system preference
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
