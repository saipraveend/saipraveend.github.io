/* =========================================================
   SAIPRAVEEN DURAIRAMAN — Portfolio v3.1 Interactions
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Nav scroll state ---- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const up = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', up, { passive: true });
    up();
  }

  /* ---- Mobile menu ---- */
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
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

  /* ---- Active nav link ---- */
  const path = (window.location.pathname.replace(/\/$/, '') || '/');
  document.querySelectorAll('.nav-link').forEach(l => {
    const h = l.getAttribute('href').replace(/\/$/, '') || '/';
    if (h === path || (path === '/index.html' && h === '/')) l.classList.add('active');
  });

  /* ---- LED Matrix — Dark mode + Background grid ---- */
  const ledToggle = document.getElementById('led-toggle');
  const ledOverlay = document.getElementById('led-overlay');
  const ledGrid = document.getElementById('led-grid');

  if (ledToggle && ledOverlay && ledGrid) {
    let dotsCreated = false;
    let isPainting = false;
    let paintMode = true;
    let lastX = null, lastY = null;

    function paintAt(x, y) {
      const el = document.elementFromPoint(x, y);
      if (el && el.classList.contains('led-dot')) {
        el.classList.toggle('lit', paintMode);
      }
    }

    function paintLine(x1, y1, x2, y2) {
      const dx = x2 - x1, dy = y2 - y1;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(Math.ceil(dist / 3), 1);
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        paintAt(x1 + dx * t, y1 + dy * t);
      }
    }

    function createDots() {
      if (dotsCreated) return;
      const cellSize = window.innerWidth <= 480 ? 12 : 16;
      const cols = Math.floor((window.innerWidth - 32) / cellSize);
      const pageH = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      const rows = Math.floor((pageH - 72) / cellSize);
      const total = cols * rows;

      const fragment = document.createDocumentFragment();
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.className = 'led-dot';
        fragment.appendChild(dot);
      }
      ledGrid.appendChild(fragment);
      dotsCreated = true;

      // Mouse: smooth painting with line interpolation
      ledGrid.addEventListener('mousedown', e => {
        if (e.target.classList.contains('led-dot')) {
          isPainting = true;
          paintMode = !e.target.classList.contains('lit');
          e.target.classList.toggle('lit', paintMode);
          lastX = e.clientX; lastY = e.clientY;
          e.preventDefault();
        }
      });
      document.addEventListener('mousemove', e => {
        if (!isPainting) return;
        if (lastX !== null) {
          paintLine(lastX, lastY, e.clientX, e.clientY);
        }
        lastX = e.clientX; lastY = e.clientY;
      });
      document.addEventListener('mouseup', () => { isPainting = false; lastX = null; lastY = null; });

      // Touch: smooth painting with line interpolation
      ledGrid.addEventListener('touchstart', e => {
        const dot = e.target;
        if (dot.classList.contains('led-dot')) {
          isPainting = true;
          paintMode = !dot.classList.contains('lit');
          dot.classList.toggle('lit', paintMode);
          const t = e.touches[0];
          lastX = t.clientX; lastY = t.clientY;
        }
      }, { passive: true });
      document.addEventListener('touchmove', e => {
        if (!isPainting) return;
        const t = e.touches[0];
        if (lastX !== null) {
          paintLine(lastX, lastY, t.clientX, t.clientY);
        }
        lastX = t.clientX; lastY = t.clientY;
      }, { passive: true });
      document.addEventListener('touchend', () => { isPainting = false; lastX = null; lastY = null; });
    }

    ledToggle.addEventListener('click', () => {
      const active = ledToggle.classList.toggle('active');
      document.body.classList.toggle('led-mode', active);
      if (active) {
        createDots();
        ledOverlay.classList.add('visible');
      } else {
        ledOverlay.classList.remove('visible');
      }
    });
  }

  /* ---- Scroll reveal ---- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => obs.observe(el));
  }

  /* ---- Count-up numbers ---- */
  document.querySelectorAll('[data-count]').forEach(el => {
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const t = parseInt(el.dataset.count, 10), suf = el.dataset.suffix || '', pre = el.dataset.prefix || '';
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

  /* ---- Project filters ---- */
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
          card.style.opacity = '0'; card.style.transform = 'translateY(16px)';
          const d = idx++ * 50;
          setTimeout(() => { card.style.transition = 'opacity .4s,transform .4s'; card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, d);
        }
      });
    });
  });

  /* ---- Project modal ---- */
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
          img.addEventListener('click', e => { e.stopPropagation(); openLightbox(img.src); });
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
    overlay.addEventListener('click', e => { if (e.target === overlay || e.target.closest('.modal-close')) closeModal(); });
  }

  /* ---- Lightbox ---- */
  const lb = document.getElementById('lightbox');
  function openLightbox(src) { if (!lb) return; lb.querySelector('img').src = src; lb.classList.add('active'); }
  function closeLightbox() { if (lb) lb.classList.remove('active'); }
  if (lb) lb.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      closeLightbox();
      // Also close LED mode
      if (ledToggle && ledOverlay && ledOverlay.classList.contains('visible')) {
        ledToggle.classList.remove('active');
        ledOverlay.classList.remove('visible');
        document.body.classList.remove('led-mode');
      }
    }
  });

  /* ---- Page transitions ---- */
  document.querySelectorAll('a[href]').forEach(a => {
    if (a.hostname === window.location.hostname && !a.hash && a.target !== '_blank' && !a.closest('.modal-overlay') && !a.closest('.lightbox')) {
      a.addEventListener('click', e => {
        e.preventDefault();
        const href = a.href;
        document.body.style.transition = 'opacity .2s ease';
        document.body.style.opacity = '0';
        setTimeout(() => { window.location.href = href; }, 200);
      });
    }
  });

  /* ---- Stagger children ---- */
  document.querySelectorAll('.stagger').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          Array.from(e.target.children).forEach((c, i) => {
            c.style.opacity = '0'; c.style.transform = 'translateY(16px)';
            setTimeout(() => { c.style.transition = 'opacity .5s cubic-bezier(0,0,.2,1),transform .5s cubic-bezier(0,0,.2,1)'; c.style.opacity = '1'; c.style.transform = 'translateY(0)'; }, 80 + i * 60);
          });
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    obs.observe(el);
  });

});
