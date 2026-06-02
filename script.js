// ============================================================
//  RABBANI PEER – script.js
// ============================================================

// ─── Page Navigation ────────────────────────────────────────
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');
  else document.getElementById('page-home').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('main-nav').classList.remove('open');
  document.querySelectorAll('.has-sub').forEach(el => el.classList.remove('open'));
}

// ─── Init ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  showPage('home');
  initMobileNav();
  initStickyHeader();
  initHeroCarousel();
  initGoldenWords();
  initClock();
  initVideoCarousel();
});

window.addEventListener('load', () => {
  initVideoCarousel();
});

// ─── Mobile Nav ──────────────────────────────────────────────
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('main-nav');
  hamburger.addEventListener('click', () => nav.classList.toggle('open'));
  document.querySelectorAll('.has-sub > .nav-link').forEach(link => {
    link.addEventListener('click', e => {
      if (window.innerWidth <= 900) {
        e.preventDefault(); e.stopPropagation();
        link.closest('.has-sub').classList.toggle('open');
      }
    });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('#site-header')) nav.classList.remove('open');
  });
}

// ─── Sticky Header ───────────────────────────────────────────
function initStickyHeader() {
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 4px 30px rgba(0,0,0,0.6)'
      : '0 2px 20px rgba(0,0,0,0.5)';
  });
}

// ─── Hero Image Carousel ─────────────────────────────────────
let heroIndex = 0;
let heroTimer;

function initHeroCarousel() {
  heroTimer = setInterval(() => moveCarousel('heroCarousel', 1), 5000);
}

function moveCarousel(id, dir) {
  const wrap   = document.getElementById(id);
  const slides = wrap.querySelectorAll('.hc-slide');
  const dots   = document.querySelectorAll('#heroDots .hc-dot');
  slides[heroIndex].classList.remove('active');
  dots[heroIndex].classList.remove('active');
  heroIndex = (heroIndex + dir + slides.length) % slides.length;
  slides[heroIndex].classList.add('active');
  dots[heroIndex].classList.add('active');
  resetHeroTimer();
}

function goCarousel(id, idx) {
  const wrap   = document.getElementById(id);
  const slides = wrap.querySelectorAll('.hc-slide');
  const dots   = document.querySelectorAll('#heroDots .hc-dot');
  slides[heroIndex].classList.remove('active');
  dots[heroIndex].classList.remove('active');
  heroIndex = idx;
  slides[heroIndex].classList.add('active');
  dots[heroIndex].classList.add('active');
  resetHeroTimer();
}

function resetHeroTimer() {
  clearInterval(heroTimer);
  heroTimer = setInterval(() => moveCarousel('heroCarousel', 1), 5000);
}

// ─── Golden Words Rotator ─────────────────────────────────────
let gwIndex    = 0;
let gwTimer;
const GW_DURATION = 6000; // ms per quote
let gwStart;

function initGoldenWords() {
  const quotes = document.querySelectorAll('.gw-quote');
  const dots   = document.querySelectorAll('#gwDots .gw-dot');
  const fill   = document.getElementById('gwProgressFill');

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      setGwQuote(i);
    });
  });

  function setGwQuote(idx) {
    quotes[gwIndex].classList.remove('active');
    dots[gwIndex].classList.remove('active');
    gwIndex = idx;
    quotes[gwIndex].classList.add('active');
    dots[gwIndex].classList.add('active');
    resetGwTimer();
  }

  function advanceGw() {
    setGwQuote((gwIndex + 1) % quotes.length);
  }

  function resetGwTimer() {
    clearInterval(gwTimer);
    gwStart = Date.now();
    gwTimer = setInterval(advanceGw, GW_DURATION);
  }

  // Progress bar animation
  function animateProgress() {
    if (fill) {
      const elapsed = Date.now() - gwStart;
      const pct = Math.min((elapsed / GW_DURATION) * 100, 100);
      fill.style.width = pct + '%';
    }
    requestAnimationFrame(animateProgress);
  }

  gwStart = Date.now();
  gwTimer = setInterval(advanceGw, GW_DURATION);
  requestAnimationFrame(animateProgress);
}

// ─── Real-Time Clock + Hijri Date ────────────────────────────
function initClock() {
  updateClock();
  setInterval(updateClock, 1000);
}

function updateClock() {
  const now = new Date();

  // English time
  const timeEl = document.getElementById('clockTime');
  if (timeEl) {
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    const ss = String(now.getSeconds()).padStart(2,'0');
    timeEl.textContent = `${hh}:${mm}:${ss}`;
  }

  // English date
  const dateEl = document.getElementById('clockDateEn');
  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  // Islamic (Hijri) date
  const hijriEl   = document.getElementById('clockHijri');
  const hijriArEl = document.getElementById('clockHijriAr');

  if (hijriEl || hijriArEl) {
    try {
      const hijriEn = now.toLocaleDateString('en-u-ca-islamic-umalqura', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });
      const hijriAr = now.toLocaleDateString('ar-SA-u-ca-islamic-umalqura', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });
      if (hijriEl) hijriEl.textContent = hijriEn;
      if (hijriArEl) hijriArEl.textContent = hijriAr;
    } catch(e) {
      if (hijriEl) hijriEl.textContent = 'Islamic calendar';
    }
  }
}

// ─── Books Carousel ──────────────────────────────────────────
let bookOffset = 0;

function getBookVisible() {
  const w = window.innerWidth;
  if (w <= 600)  return 1;
  if (w <= 900)  return 2;
  if (w <= 1100) return 3;
  return 4;
}

function getBookCardWidth() {
  const track = document.getElementById('bookTrack');
  if (!track) return 0;
  const card  = track.querySelector('.book-card');
  if (!card)  return 0;
  const gap = 24; // 1.5rem
  return card.offsetWidth + gap;
}

function shiftBooks(dir) {
  const track    = document.getElementById('bookTrack');
  if (!track) return;
  const cards    = track.querySelectorAll('.book-card');
  const visible  = getBookVisible();
  const maxShift = Math.max(0, cards.length - visible);
  bookOffset = Math.max(0, Math.min(bookOffset + dir, maxShift));
  const cw = getBookCardWidth();
  track.style.transform = `translateX(-${bookOffset * cw}px)`;
}

let vcIdx = 0;
let vcAuto = null;

function vcTotalCards() {
  return document.querySelectorAll('#vcTrack .vc-card').length;
}

function vcVisibleCount() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function getVCStep() {
  const card = document.querySelector('.vc-card');
  const track = document.querySelector('.vc-track');

  if (!card || !track) return 324;

  const gap = parseFloat(getComputedStyle(track).gap) || 24;

  return card.offsetWidth + gap;
}

function vcMaxSlides() {
  return Math.max(0, vcTotalCards() - vcVisibleCount());
}

function vcApply() {
  const track = document.getElementById('vcTrack');

  if (!track) return;

  track.style.transform =
    `translateX(-${vcIdx * getVCStep()}px)`;

  document.querySelectorAll('#vcDots .vc-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === vcIdx);
  });
}

function vcStep(dir) {
  const max = vcMaxSlides();

  vcIdx += dir;

  if (vcIdx > max) vcIdx = 0;
  if (vcIdx < 0) vcIdx = max;

  vcApply();
}

function vcResetAuto() {
  clearInterval(vcAuto);

  vcAuto = setInterval(() => {
    vcStep(1);
  }, 4000);
}

function buildDots() {
  const dotsEl = document.getElementById('vcDots');

  if (!dotsEl) return;

  dotsEl.innerHTML = '';

  const slides = vcMaxSlides() + 1;

  for (let i = 0; i < slides; i++) {
    const dot = document.createElement('span');

    dot.className = 'vc-dot';

    if (i === 0) {
      dot.classList.add('active');
    }

    dot.addEventListener('click', () => {
      vcIdx = i;
      vcApply();
      vcResetAuto();
    });

    dotsEl.appendChild(dot);
  }
}

function initVideoCarousel() {
  const prev = document.getElementById('vcPrev');
  const next = document.getElementById('vcNext');

  if (!prev || !next) return;

  buildDots();

  prev.addEventListener('click', () => {
    vcStep(-1);
    vcResetAuto();
  });

  next.addEventListener('click', () => {
    vcStep(1);
    vcResetAuto();
  });

  vcApply();
  vcResetAuto();
}

/* ==========================================================
   VIDEO POPUP
========================================================== */

function openVidPopup(videoId) {
  const popup = document.getElementById('vcPopup');
  const frame = document.getElementById('vcFrame');

  if (!popup || !frame) return;

  frame.src =
    `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  popup.classList.add('open');

  document.body.style.overflow = 'hidden';
}

function closeVidPopup() {
  const popup = document.getElementById('vcPopup');
  const frame = document.getElementById('vcFrame');

  if (!popup || !frame) return;

  frame.src = '';
  popup.classList.remove('open');

  document.body.style.overflow = '';
}

/* Close button */
document.addEventListener('DOMContentLoaded', () => {

  initVideoCarousel();

  const closeBtn = document.getElementById('vcClose');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeVidPopup);
  }

  const popup = document.getElementById('vcPopup');

  if (popup) {
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        closeVidPopup();
      }
    });
  }
});

/* ESC key */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeVidPopup();
  }
});

/* Resize */
window.addEventListener('resize', () => {

  const max = vcMaxSlides();

  if (vcIdx > max) {
    vcIdx = max;
  }

  buildDots();
  vcApply();
});



// ─── FAQ Accordion ───────────────────────────────────────────
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  document.querySelectorAll('.faq-q').forEach(b => {
    b.classList.remove('open');
    b.nextElementSibling.classList.remove('open');
  });
  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}

// ─── Contact Form ────────────────────────────────────────────
function handleContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = '✓ Message Sent!';
  btn.style.background = 'linear-gradient(135deg,#2a6640,#1a4a28)';
  btn.style.color = '#f5f0e8';
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    btn.style.color = '';
    e.target.reset();
  }, 3000);
}