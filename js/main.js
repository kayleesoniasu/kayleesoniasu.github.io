document.addEventListener('DOMContentLoaded', () => {


  // ── Nav scroll effect ──
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // ── Scroll reveal ──
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach((el) => revealObserver.observe(el));

  // ── Magnetic button effect ──
  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  // ── Animated counter (stats) ──
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1500;
        const start = performance.now();

        function updateCount(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(updateCount);
        }

        requestAnimationFrame(updateCount);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((el) => counterObserver.observe(el));

  // ── Work toggles (work page) ──
  document.querySelectorAll('.case-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const body = btn.closest('.case-detail').querySelector('.case-detail-body');
      const isOpen = body.classList.contains('open');
      body.classList.toggle('open');
      btn.classList.toggle('open');
      btn.querySelector('span').textContent = isOpen ? 'View work' : 'Collapse';
    });
  });

  // ── Staggered card reveals ──
  document.querySelectorAll('.case-card, .principle-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });


  // ── Smooth page transitions ──
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.endsWith('.html') && !href.startsWith('http')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        setTimeout(() => { window.location.href = href; }, 300);
      });
    }
  });

  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.4s ease';
    document.body.style.opacity = '1';
  });
});
