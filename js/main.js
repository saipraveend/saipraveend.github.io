/* =========================================================
   SAIPRAVEEN DURAIRAMAN — Portfolio Interactions
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAV SCROLL STATE =====
  const nav = document.querySelector('.nav');
  if (nav) {
    const update = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // ===== MOBILE MENU =====
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
      document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });

    links.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== ACTIVE NAV LINK =====
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === path || (path === '/index.html' && href === '/')) {
      link.classList.add('active');
    }
  });

  // ===== SCROLL REVEAL =====
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  // ===== NUMBER COUNT-UP =====
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 1800;
        const startTime = performance.now();

        const step = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = prefix + Math.round(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => countObserver.observe(el));
  }

  // ===== PROJECT FILTERS =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach((card, i) => {
        const cats = card.dataset.category.split(',');
        const show = filter === 'all' || cats.includes(filter);
        card.style.display = show ? '' : 'none';
        if (show) {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s, transform 0.4s';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 60);
        }
      });
    });
  });

  // ===== PROJECT DETAIL MODAL =====
  const modalOverlay = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');

  document.querySelectorAll('.project-card[data-project]').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.project;
      const tmpl = document.getElementById('detail-' + id);
      if (tmpl && modalOverlay && modalContent) {
        modalContent.innerHTML = tmpl.innerHTML;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Wire up gallery lightbox inside modal
        modalContent.querySelectorAll('.modal-gallery img').forEach(img => {
          img.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox(img.src);
          });
        });
      }
    });
  });

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay || e.target.closest('.modal-close')) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeLightbox();
    }
  });

  // ===== LIGHTBOX =====
  const lightbox = document.getElementById('lightbox');

  function openLightbox(src) {
    if (!lightbox) return;
    lightbox.querySelector('img').src = src;
    lightbox.classList.add('active');
  }

  function closeLightbox() {
    if (lightbox) lightbox.classList.remove('active');
  }

  if (lightbox) {
    lightbox.addEventListener('click', closeLightbox);
  }

  // ===== STAGGERED CARD ENTRANCE =====
  const staggerCards = document.querySelectorAll('.stagger-children');
  if (staggerCards.length) {
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = entry.target.children;
          Array.from(children).forEach((child, i) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            setTimeout(() => {
              child.style.transition = 'opacity 0.5s cubic-bezier(0,0,0.2,1), transform 0.5s cubic-bezier(0,0,0.2,1)';
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, 100 + i * 80);
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    staggerCards.forEach(el => staggerObserver.observe(el));
  }

});
