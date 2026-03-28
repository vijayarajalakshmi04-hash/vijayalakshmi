/* ============================================================
   S. Vijaya Rajalakshmi – Portfolio Script
   Features: Canvas particles, typewriter, counters, scroll
   reveal, skill bars, project filter, dark mode, form
   ============================================================ */

'use strict';

/* ===== THEME TOGGLE ===== */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

const savedTheme = localStorage.getItem('portfolioTheme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const curr = html.getAttribute('data-theme');
  const next = curr === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolioTheme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  hamburger.classList.toggle('active');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 20);
  lastScroll = y;
  highlightNavLink();
}, { passive: true });

function highlightNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;
  sections.forEach(s => {
    const top    = s.offsetTop;
    const height = s.offsetHeight;
    const id     = s.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
  });
}

/* ===== CANVAS PARTICLE BACKGROUND ===== */
const canvas = document.getElementById('heroCanvas');
const ctx    = canvas.getContext('2d');

let W, H, particles = [], animReq;
const PARTICLE_COUNT = 60;

function resizeCanvas() {
  W = canvas.width  = canvas.parentElement.offsetWidth;
  H = canvas.height = canvas.parentElement.offsetHeight;
}

class Particle {
  constructor() { this.reset(true); }
  reset(init) {
    this.x  = Math.random() * W;
    this.y  = init ? Math.random() * H : H + 10;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = -(Math.random() * 0.6 + 0.2);
    this.r  = Math.random() * 2 + 0.5;
    this.a  = Math.random() * 0.5 + 0.1;
    this.pulse = Math.random() * Math.PI * 2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.pulse += 0.02;
    if (this.y < -10) this.reset(false);
    if (this.x < 0)  this.x = W;
    if (this.x > W)  this.x = 0;
  }
  draw() {
    const alpha = this.a * (0.7 + 0.3 * Math.sin(this.pulse));
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(59,130,246,${alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(59,130,246,${0.12 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  animReq = requestAnimationFrame(animateCanvas);
}

resizeCanvas();
initParticles();
animateCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); }, { passive: true });

/* ===== TYPEWRITER EFFECT ===== */
const phrases = [
  'Data Analyst',
  'AI & ML Enthusiast',
  'Power BI Developer',
  'Python Programmer',
  'Business Intelligence Pro'
];
const typedEl = document.getElementById('typedText');
let pIdx = 0, cIdx = 0, deleting = false, typingDelay = 120, deletingDelay = 60, pauseDelay = 1800;

function type() {
  const phrase = phrases[pIdx];
  if (!deleting) {
    typedEl.textContent = phrase.substring(0, cIdx + 1);
    cIdx++;
    if (cIdx === phrase.length) { deleting = true; setTimeout(type, pauseDelay); return; }
  } else {
    typedEl.textContent = phrase.substring(0, cIdx - 1);
    cIdx--;
    if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? deletingDelay : typingDelay);
}
setTimeout(type, 1000);

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.section > .container, .project-card, .skill-category, .strength-card, .dash-card, .timeline-content, .about-card, .about-quote, .about-text');

const revealOpts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
const revealObs  = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, revealOpts);

revealEls.forEach(el => {
  el.classList.add('reveal');
  revealObs.observe(el);
});

/* ===== SKILL BAR ANIMATION ===== */
const barFills = document.querySelectorAll('.bar-fill');
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const width = entry.target.getAttribute('data-width');
      entry.target.style.width = width + '%';
      barObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
barFills.forEach(b => barObs.observe(b));

/* ===== COUNTER OBSERVER ===== */
const counterEls = document.querySelectorAll('.stat-number');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObs.observe(el));

/* ===== PROJECT FILTER ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      const cat = card.getAttribute('data-category');
      if (filter === 'all' || cat === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeSlideUp 0.4s ease both';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ===== SMOOTH SCROLL for anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===== CONTACT FORM ===== */
const contactForm = document.getElementById('contactForm');
const formNote    = document.getElementById('formNote');

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Sending...';

  // Simulate send (replace with actual EmailJS / Formspree integration)
  setTimeout(() => {
    btn.querySelector('span').textContent = 'Message Sent!';
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    formNote.textContent = '✓ Thank you! I\'ll get back to you within 24 hours.';
    contactForm.reset();
    setTimeout(() => {
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Send Message';
      btn.style.background = '';
      formNote.textContent = '';
    }, 4000);
  }, 1500);
});

/* ===== CURSOR GLOW (desktop only) ===== */
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;width:360px;height:360px;border-radius:50%;pointer-events:none;
    background:radial-gradient(circle,rgba(59,130,246,0.06),transparent 70%);
    transform:translate(-50%,-50%);z-index:9999;transition:opacity 0.3s;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
}

/* ===== STAGGERED REVEAL for cards ===== */
document.querySelectorAll('.projects-grid, .strengths-grid, .skills-categories, .dashboard-grid').forEach(grid => {
  const cards = grid.querySelectorAll(':scope > *');
  const gridObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add('visible');
          }, i * 100);
        });
        gridObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  gridObs.observe(grid);
});
