/**
 * Apple-Style Personal Site — Main JavaScript
 * Persona: Cookie the Yorkie 🐶
 * Zero dependencies, vanilla JS only.
 */
(function () {
  'use strict';

  // ── DOM Ready ─────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initTheme();
    initNavScroll();
    initMobileMenu();
    initScrollAnimations();
    initSmoothScroll();
  }

  // ── Theme Toggle ──────────────────────────────────────────
  function initTheme() {
    // Apply saved theme before paint (also handled by inline script in head)
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    // Toggle button
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      let next;
      if (!current) {
        // System preference -> force opposite
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        next = prefersDark ? 'light' : 'dark';
      } else {
        next = current === 'dark' ? 'light' : 'dark';
      }
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon(next);
    });

    // Set correct icon on load
    const current = document.documentElement.getAttribute('data-theme');
    if (current) {
      updateThemeIcon(current);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      updateThemeIcon(prefersDark ? 'dark' : 'light');
    }
  }

  function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-toggle .icon');
    if (!icon) return;
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  // ── Nav Scroll Effect ─────────────────────────────────────
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          if (window.scrollY > 16) {
            nav.classList.add('scrolled');
          } else {
            nav.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ── Mobile Menu ───────────────────────────────────────────
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Scroll Animations (Intersection Observer) ─────────────
  function initScrollAnimations() {
    var elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ── Smooth Scroll for Anchor Links ────────────────────────
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var targetId = link.getAttribute('href').slice(1);
      if (!targetId) return;

      var target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      var navHeight = document.querySelector('.nav')
        ? document.querySelector('.nav').offsetHeight
        : 52;
      var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 24;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }
})();
