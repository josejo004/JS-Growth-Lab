const slides = document.querySelectorAll('.slide');

let currentSlide = 0;

function showSlide() {
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    slides[currentSlide].classList.add('active');

    currentSlide = (currentSlide + 1) % slides.length;
}

showSlide(); // show first image immediately

setInterval(showSlide, 3000);

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
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const y = window.scrollY;
      header.classList.toggle('scrolled', y > 40);
      backToTop.classList.toggle('visible', y > 400);
      ticking = false;
    });
    ticking = true;
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
  entries.forEach((entry, i) => {
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
if (heroSection) {
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
document.addEventListener('DOMContentLoaded', () => {

    if (window.innerWidth <= 768) {

        const heroSub = document.querySelector('.hero__sub');
        const heroSlider = document.querySelector('.hero__slider');

        if (heroSub && heroSlider) {
            heroSub.after(heroSlider);
        }

    }

});