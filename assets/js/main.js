/**
 * MODERN PORTFOLIO - Interactive JavaScript
 * Smooth animations and engaging interactions
 */

(function() {
  'use strict';

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    initAOS();
    initTypingEffect();
    initNavigation();
    initSmoothScroll();
  });

  /**
   * Initialize AOS (Animate On Scroll)
   */
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100,
        delay: 0,
        disable: function() {
          return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
      });
    }
  }

  /**
   * Initialize Typing Effect in Hero
   */
  function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');

    if (typingElement && typeof Typed !== 'undefined') {
      new Typed('.typing-text', {
        strings: [
          'Runs Reliably',
          'Automates Workflows',
          'Scales with Demand',
          'Improves Delivery'
        ],
        typeSpeed: 62,
        backSpeed: 42,
        backDelay: 2000,
        startDelay: 500,
        loop: true,
        showCursor: true,
        cursorChar: '|',
        smartBackspace: false
      });
    }
  }

  /**
   * Mobile Navigation Toggle
   */
  function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
      // Toggle menu
      navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        toggleHamburger(navToggle);
      });

      // Close menu when clicking a link
      navLinks.forEach(link => {
        link.addEventListener('click', function() {
          navMenu.classList.remove('active');
          toggleHamburger(navToggle);
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          toggleHamburger(navToggle);
        }
      });
    }

    // Navbar scroll effect
    const nav = document.getElementById('nav');
    if (nav) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
          nav.style.background = 'rgba(15, 15, 35, 0.95)';
          nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
          nav.style.background = 'rgba(15, 15, 35, 0.8)';
          nav.style.boxShadow = 'none';
        }
      });
    }
  }

  /**
   * Toggle Hamburger Animation
   */
  function toggleHamburger(toggle) {
    const spans = toggle.querySelectorAll('span');
    if (spans.length === 3) {
      if (toggle.classList.contains('active')) {
        toggle.classList.remove('active');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      } else {
        toggle.classList.add('active');
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      }
    }
  }

  /**
   * Smooth Scroll for Anchor Links
   */
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Skip if just "#"
        if (href === '#') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offsetTop = target.offsetTop - 80; // Account for fixed nav
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Add Parallax Effect to Background Orbs
   */
  function initParallax() {
    const orbs = document.querySelectorAll('.gradient-orb');

    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      window.addEventListener('mousemove', function(e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        orbs.forEach((orb, index) => {
          const speed = (index + 1) * 0.05;
          const xOffset = (x - 0.5) * 100 * speed;
          const yOffset = (y - 0.5) * 100 * speed;

          orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
      });
    }
  }

  // Initialize parallax
  initParallax();

  /**
   * Add Tilt Effect to Cards (Optional Enhancement)
   */
  function initCardTilt() {
    const cards = document.querySelectorAll('.skill-card');

    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches && window.innerWidth > 768) {
      cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = (y - centerY) / 10;
          const rotateY = (centerX - x) / 10;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', function() {
          card.style.transform = 'none';
        });
      });
    }
  }

  // Initialize card tilt
  initCardTilt();

  /**
   * Scroll Progress Indicator (Optional)
   */
  function initScrollProgress() {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      width: 0%;
      z-index: 9999;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }

  // Initialize scroll progress
  initScrollProgress();

  /**
   * Lazy Load Images (if any are added)
   */
  function initLazyLoad() {
    if ('IntersectionObserver' in window) {
      const images = document.querySelectorAll('img[data-src]');

      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  // Initialize lazy load
  initLazyLoad();

  /**
   * Add Cursor Glow Effect (Optional Enhancement)
   */
  function initCursorGlow() {
    if (window.innerWidth > 1024 && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      const glow = document.createElement('div');
      glow.className = 'cursor-glow';
      glow.style.cssText = `
        position: fixed;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.15), transparent 70%);
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
        opacity: 0;
      `;
      document.body.appendChild(glow);

      document.addEventListener('mousemove', function(e) {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        glow.style.opacity = '1';
      });

      document.addEventListener('mouseleave', function() {
        glow.style.opacity = '0';
      });
    }
  }

  // Initialize cursor glow
  initCursorGlow();

  /**
   * Console Easter Egg
   */
  console.log(
    '%cPortfolio initialized',
    'font-size: 16px; font-weight: 600; color: #667eea;'
  );
  console.log(
    '%cOpen to DevOps, Platform, and Reliability roles.',
    'font-size: 14px; color: #8be9fd;'
  );
  console.log(
    '%cEmail: berkemuftuoglu1@gmail.com',
    'font-size: 12px; color: #43e97b;'
  );
  console.log(
    '%cThis portfolio was built with: HTML, CSS, JavaScript, AOS, Typed.js',
    'font-size: 10px; color: #f5576c;'
  );

})();
