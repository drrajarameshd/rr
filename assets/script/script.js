// assets/script.js
// Shared site scripts: nav toggle, smooth scroll, form handling, accessibility tweaks.

document.addEventListener('DOMContentLoaded', function () {
  // ===== Mobile nav toggle =====
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('open');
    });
  }

  // ===== Smooth scroll for anchors =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navList && navList.classList.contains('open')) navList.classList.remove('open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ===== Contact form basic handler =====
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = contactForm.querySelector('#name');
      const phone = contactForm.querySelector('#phone');
      const message = contactForm.querySelector('#message');

      if (!name.value.trim()) {
        alert('Please enter your name.');
        name.focus();
        return;
      }
      if (!phone.value.trim()) {
        alert('Please enter your phone number.');
        phone.focus();
        return;
      }
      if (!message.value.trim()) {
        alert('Please write a message.');
        message.focus();
        return;
      }

      // Placeholder for actual submission (replace with fetch() later)
      alert('Thank you! Your message has been recorded locally. Replace this with backend integration.');
      contactForm.reset();
    });
  }

  // ===== Accessibility helper =====
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);

  // ===== WhatsApp button visibility on tiny screens =====
  const wa = document.querySelector('.whatsapp-float');
  function updateWhatsAppVisibility() {
    if (!wa) return;
    wa.style.display = window.innerWidth < 360 ? 'none' : '';
  }
  updateWhatsAppVisibility();
  window.addEventListener('resize', updateWhatsAppVisibility);

  // ===== Footer year auto-update =====
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
