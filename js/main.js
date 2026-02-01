/* =========================================================
   SAIPRAVEEN DURAIRAMAN — Portfolio v3 Interactions
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

  /* ---- LED Matrix ---- */
  const ledToggle = document.getElementById('led-toggle');
  const ledStrip = document.getElementById('led-strip');
  const ledInner = document.getElementById('led-strip-inner');

  if (ledToggle && ledStrip && ledInner) {
    const dotCount = 90;
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('div');
      dot.className = 'led-dot';
      dot.addEventListener('click', () => dot.classList.toggle('lit'));
      ledInner.appendChild(dot);
    }

    ledToggle.addEventListener('click', () => {
      const active = ledToggle.classList.toggle('active');
      ledStrip.classList.toggle('visible', active);
      document.body.classList.toggle('led-active', active);
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
    if (e.key === 'Escape') { closeModal(); closeLightbox(); }
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
