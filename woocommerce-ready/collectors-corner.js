/* ─────────────────────────────────────────────
   COLLECTOR'S CORNER — Rentagun WooCommerce JS
   Handles:
     1. Scroll-reveal (IntersectionObserver)
     2. FAQ accordion
     3. Animated counters (.cc-counter)
   ───────────────────────────────────────────── */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     1. SCROLL-REVEAL
     Adds .cc-visible to .cc-reveal elements
     when 20% of the element enters the viewport.
     Fires once per element (unobserves after).
     ═══════════════════════════════════════════ */

  function initScrollReveal() {
    var elements = document.querySelectorAll('.cc .cc-reveal');
    if (!elements.length) return;

    // Fallback: if IntersectionObserver not supported, show all immediately
    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) {
        el.classList.add('cc-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('cc-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }


  /* ═══════════════════════════════════════════
     2. FAQ ACCORDION
     Clicking .cc-faq-q toggles .cc-open on
     the parent .cc-faq-item.
     Only one item open at a time.
     ═══════════════════════════════════════════ */

  function initFaqAccordion() {
    var questions = document.querySelectorAll('.cc .cc-faq-q');
    if (!questions.length) return;

    questions.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.cc-faq-item');
        var isOpen = item.classList.contains('cc-open');

        // Close all open items
        document.querySelectorAll('.cc .cc-faq-item.cc-open').forEach(function (openItem) {
          openItem.classList.remove('cc-open');
          var openBtn = openItem.querySelector('.cc-faq-q');
          if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
        });

        // If this item was closed, open it
        if (!isOpen) {
          item.classList.add('cc-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }


  /* ═══════════════════════════════════════════
     3. ANIMATED COUNTERS
     Elements with class .cc-counter and
     data-target="NUMBER" count up from 0
     when they enter the viewport (once only).
     Supports negative display: prepend "-" to
     the parent .cc-price-big if target is for
     the "Buying Blind" panel.
     ═══════════════════════════════════════════ */

  function animateCounter(el, target) {
    var duration = 1400;
    var start = null;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function tick(timestamp) {
      if (!start) start = timestamp;
      var elapsed = timestamp - start;
      var progress = Math.min(elapsed / duration, 1);
      var value = Math.round(easeOutCubic(progress) * target);
      el.textContent = value;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(tick);
  }

  function initCounters() {
    var counters = document.querySelectorAll('.cc .cc-counter');
    if (!counters.length) return;

    // Fallback: if IntersectionObserver not supported, set final values
    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        el.textContent = el.getAttribute('data-target') || el.textContent;
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var target = parseInt(el.getAttribute('data-target'), 10);
            if (!isNaN(target)) {
              animateCounter(el, target);
            }
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.3
      }
    );

    counters.forEach(function (el) {
      // Set initial display to 0 before animation fires
      el.textContent = '0';
      observer.observe(el);
    });
  }


  /* ═══════════════════════════════════════════
     INIT — run after DOM is ready
     ═══════════════════════════════════════════ */

  function init() {
    initScrollReveal();
    initFaqAccordion();
    initCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already ready (script loaded with defer or at bottom of body)
    init();
  }

}());
