// ── Password protection ──
// To change the password, update PASS_HASH. Generate a new one in the browser console:
// crypto.subtle.digest('SHA-256', new TextEncoder().encode('your-password'))
//   .then(h => console.log(Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2,'0')).join('')))
(function () {
  const PASS_HASH = '40ed42c52462218c3cefc8c16c49c367c14052960d332b62119f088a1916503a';
  const AUTH_KEY = 'portfolio_auth';

  if (sessionStorage.getItem(AUTH_KEY) === 'true') return;

  document.documentElement.classList.add('site-locked');

  async function verify(input) {
    const data = new TextEncoder().encode(input);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('') === PASS_HASH;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.createElement('div');
    overlay.className = 'password-overlay';
    overlay.innerHTML =
      '<div class="password-modal">' +
        '<div class="password-lock-icon">' +
          '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
            '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>' +
            '<path d="M7 11V7a5 5 0 0 1 10 0v4"/>' +
          '</svg>' +
        '</div>' +
        '<h2>Password Required</h2>' +
        '<p>Enter the password to view this portfolio.</p>' +
        '<form class="password-form">' +
          '<input type="password" class="password-input" placeholder="Enter password" autocomplete="off" autofocus />' +
          '<button type="submit" class="password-btn">Unlock</button>' +
        '</form>' +
        '<div class="password-error" hidden>Incorrect password. Please try again.</div>' +
      '</div>';
    document.body.appendChild(overlay);

    const form = overlay.querySelector('.password-form');
    const input = overlay.querySelector('.password-input');
    const error = overlay.querySelector('.password-error');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (await verify(input.value)) {
        sessionStorage.setItem(AUTH_KEY, 'true');
        overlay.classList.add('password-overlay--unlocked');
        document.documentElement.classList.remove('site-locked');
        setTimeout(() => overlay.remove(), 400);
      } else {
        error.hidden = false;
        input.value = '';
        input.focus();
        error.classList.remove('shake');
        void error.offsetWidth;
        error.classList.add('shake');
      }
    });
  });
})();

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
