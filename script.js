/* ============================================================
   HERO GLOW — cursor-reactive purple glow follows the mouse
   ============================================================ */
(function () {
  const hero = document.getElementById('home');
  const glow = document.getElementById('heroGlow');
  if (!hero || !glow) return;

  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouch || prefersReducedMotion) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    glow.style.transform = `translate3d(${e.clientX - rect.left}px, ${e.clientY - rect.top}px, 0)`;
  });

  hero.addEventListener('mouseleave', () => {
    const rect = hero.getBoundingClientRect();
    glow.style.transform = `translate3d(${rect.width / 2}px, ${rect.height / 2}px, 0)`;
  });
})();

/* ============================================================
   HERO SLIDER — 5-image Ken Burns background + matching per-slide
   text (h1/p) + dot navigation. One slide is "active" at a time;
   switching restarts the Ken Burns zoom/pan animation and fades
   the new text block in.
   ============================================================ */
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const texts  = document.querySelectorAll('.hero-text');
  const dotsWrap = document.getElementById('heroDots');
  if (!slides.length) return;

  let current = 0;
  const total = slides.length;
  const intervalMs = 7000; // matches the Ken Burns animation duration

  // Build the dot navigation
  if (dotsWrap) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Show slide ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });
  }

  function goToSlide(index) {
    if (index === current || !slides[index]) return;

    const prevSlide = slides[current];
    prevSlide.classList.remove('active', 'kb-alt');
    if (texts[current]) texts[current].classList.remove('active');

    current = index;

    const nextSlide = slides[current];
    // Force reflow so the Ken Burns animation restarts cleanly
    void nextSlide.offsetWidth;
    nextSlide.classList.add('active');
    if (current % 2 === 1) nextSlide.classList.add('kb-alt');

    if (texts[current]) texts[current].classList.add('active');

    if (dotsWrap) {
      Array.from(dotsWrap.children).forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }
  }

  function nextSlide() {
    goToSlide((current + 1) % total);
  }

  setInterval(nextSlide, intervalMs);
})();

/* ============================================================
   SCROLL PARALLAX — any element with [data-speed] drifts at its
   own rate as the page scrolls.
   ============================================================ */
(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const parallaxEls = Array.from(document.querySelectorAll('[data-speed]'));
  if (!parallaxEls.length) return;

  let ticking = false;

  function applyParallax() {
    const viewportH = window.innerHeight;

    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.speed) || 0;
      const rect = el.getBoundingClientRect();

      if (rect.bottom < -200 || rect.top > viewportH + 200) return;

      const distanceFromCenter = rect.top + rect.height / 2 - viewportH / 2;
      const y = distanceFromCenter * speed * -1;

      el.style.transform = `translate3d(0, ${y}px, 0)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', applyParallax);
  applyParallax();
})();


// ---- DOM Refs ----
const header      = document.getElementById('header');
const hamburger   = document.getElementById('hamburger');
const nav         = document.getElementById('nav');
const navLinks    = document.querySelectorAll('.nav__link');
const backToTop   = document.getElementById('backToTop');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const yearEl      = document.getElementById('year');

// ---- Year ----
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- Sticky header + back-to-top ----
let headerTicking = false;
window.addEventListener('scroll', () => {
  if (!headerTicking) {
    requestAnimationFrame(() => {
      const y = window.scrollY;
      header.classList.toggle('scrolled', y > 40);
      backToTop.classList.toggle('visible', y > 400);
      headerTicking = false;
    });
    headerTicking = true;
  }
});

// ---- Back to top ----
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Mobile nav toggle ----
hamburger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close nav on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close nav on outside click
document.addEventListener('click', (e) => {
  if (nav.classList.contains('open') &&
      !nav.contains(e.target) &&
      !hamburger.contains(e.target)) {
    nav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');
const observerOpts = { rootMargin: '-40% 0px -40% 0px' };
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, observerOpts);
sections.forEach(s => sectionObserver.observe(s));

// ---- Reveal on scroll ----
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Stagger sibling reveals in same parent
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(entry.target);
      const delay = idx * 80; // ms stagger
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObserver.observe(el));

// ---- Animated counters ----
const statNums = document.querySelectorAll('.stat__num[data-target]');
let countersStarted = false;

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const startTime = performance.now();
  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const heroSection = document.getElementById('home');
if (heroSection && statNums.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      statNums.forEach(el => animateCounter(el));
      counterObserver.disconnect();
    }
  }, { threshold: 0.4 });
  counterObserver.observe(heroSection);
}

// ---- Contact form ----
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const name    = contactForm.querySelector('#name').value.trim();
    const email   = contactForm.querySelector('#email').value.trim();
    const message = contactForm.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      // Simple inline validation
      [
        { el: contactForm.querySelector('#name'),    val: name },
        { el: contactForm.querySelector('#email'),   val: email },
        { el: contactForm.querySelector('#message'), val: message }
      ].forEach(({ el, val }) => {
        el.style.borderColor = val ? '' : 'var(--blue)';
        if (!val) el.focus();
      });
      return;
    }

    // Simulate submission
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      contactForm.reset();
      btn.textContent = 'Send Message →';
      btn.disabled = false;
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1200);
  });

  // Clear red border on input
  contactForm.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => { el.style.borderColor = ''; });
  });
}

// ---- Smooth scroll for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // header height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
