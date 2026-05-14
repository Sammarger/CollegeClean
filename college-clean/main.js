/* =====================================================
   College Clean — main.js
   Handles: sticky nav, mobile menu, FAQ accordion, reviews carousel
   ===================================================== */

(function () {
  'use strict';

  /* ---------- Sticky nav shadow ---------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 10
        ? '0 2px 24px rgba(26,31,94,0.13)'
        : '0 1px 0 rgba(26,31,94,0.08)';
    }, { passive: true });
  }

  /* ---------- Mobile hamburger ---------- */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      // Animate bars
      const bars = hamburger.querySelectorAll('span');
      if (open) {
        bars[0].style.transform = 'translateY(7px) rotate(45deg)';
        bars[1].style.opacity  = '0';
        bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
      }
    });
    // Close on outside click
    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && mobileMenu.classList.contains('open')) {
        hamburger.click();
      }
    });
  }

  /* ---------- Active nav link ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
      // Open clicked unless it was already open
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---------- Reviews Carousel ---------- */
  const carousel   = document.querySelector('.reviews-carousel');
  const wrapper    = document.querySelector('.reviews-wrapper');
  const dotsEl     = document.querySelector('.carousel-dots');
  const prevBtn    = document.querySelector('.carousel-btn--prev');
  const nextBtn    = document.querySelector('.carousel-btn--next');

  if (carousel && wrapper) {
    const cards = Array.from(carousel.querySelectorAll('.review-card'));
    const total = cards.length;
    let current = 1; // start at centre card

    function cardWidth() {
      if (cards.length === 0) return 340;
      return cards[0].offsetWidth + 24; // card + gap
    }

    function updateCarousel() {
      const cw = cardWidth();
      const ww = wrapper.offsetWidth;
      const totalWidth = total * cw - 24; // actual carousel width (no trailing gap)

      let offset;
      if (totalWidth <= ww) {
        // All cards fit — center the row in the wrapper
        offset = -Math.round((ww - totalWidth) / 2);
      } else {
        // Scroll to keep current card centered, clamped to valid range
        offset = Math.round(current * cw - ww / 2 + (cw - 24) / 2);
        offset = Math.max(0, Math.min(offset, totalWidth - ww));
      }

      carousel.style.transform = `translateX(-${offset}px)`;

      cards.forEach((c, i) => {
        c.classList.toggle('review-card--active', i === current);
      });

      // Dots
      if (dotsEl) {
        dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
          d.classList.toggle('active', i === current);
        });
      }
    }

    // Build dots
    if (dotsEl) {
      cards.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot' + (i === current ? ' active' : '');
        dot.addEventListener('click', () => { current = i; updateCarousel(); });
        dotsEl.appendChild(dot);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => {
      current = (current - 1 + total) % total;
      updateCarousel();
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      current = (current + 1) % total;
      updateCarousel();
    });

    // Auto-advance
    let autoTimer = setInterval(() => {
      current = (current + 1) % total;
      updateCarousel();
    }, 5000);

    carousel.closest('.reviews-section')?.addEventListener('mouseenter', () => clearInterval(autoTimer));
    carousel.closest('.reviews-section')?.addEventListener('mouseleave', () => {
      autoTimer = setInterval(() => {
        current = (current + 1) % total;
        updateCarousel();
      }, 5000);
    });

    // Touch swipe support
    let touchStartX = 0;
    wrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    wrapper.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        current = diff > 0
          ? (current + 1) % total
          : (current - 1 + total) % total;
        updateCarousel();
      }
    });

    // Init + respond to resize
    updateCarousel();
    window.addEventListener('resize', updateCarousel, { passive: true });
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
