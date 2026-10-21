/* ==========================================================================
   Nes Endurskoðun – shared behaviour
   Every block is guarded so the same file can be loaded on every page.
   ========================================================================== */
(function () {
  'use strict';

  /* ----------------------------------------------------------------------
     Slide transitions for the About and Contact pages
     ---------------------------------------------------------------------- */
  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    document.body.classList.add('page-transition-enabled');
    window.requestAnimationFrame(function () {
      document.body.classList.add('page-ready');
    });

    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey ||
          e.shiftKey || e.altKey) return;

      var link = e.target.closest('a');
      if (!link || link.target && link.target !== '_self' || link.hasAttribute('download')) return;

      var destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin ||
          !/\/(?:about|contact)\.html$/i.test(destination.pathname) ||
          destination.pathname === window.location.pathname) return;

      e.preventDefault();
      document.body.classList.add('page-leaving');
      window.setTimeout(function () {
        window.location.href = destination.href;
      }, 280);
    });
  }

  /* ----------------------------------------------------------------------
     Keep --header-height in sync with the real height of the fixed header,
     so main content and anchor targets are never hidden behind it.
     ---------------------------------------------------------------------- */
  var header = document.querySelector('.site-header');

  if (header) {
    var setHeaderHeight = function () {
      document.documentElement.style.setProperty(
        '--header-height',
        header.getBoundingClientRect().height + 'px'
      );
    };

    setHeaderHeight();

    Array.prototype.forEach.call(header.querySelectorAll('img'), function (img) {
      if (!img.complete) img.addEventListener('load', setHeaderHeight);
    });

    if ('ResizeObserver' in window) {
      new ResizeObserver(setHeaderHeight).observe(header);
    } else {
      window.addEventListener('resize', setHeaderHeight);
    }

    /* Soft shadow under the header once the page is scrolled */
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 4);
    }, { passive: true });
  }

  /* ----------------------------------------------------------------------
     Mobile navigation
     ---------------------------------------------------------------------- */
  var burger = document.querySelector('.burger');
  var menu = document.querySelector('.menu');

  if (burger && menu) {
    var setMenu = function (open) {
      menu.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Loka valmynd' : 'Opna valmynd');
      document.body.classList.toggle('menu-open', open);
    };

    burger.addEventListener('click', function () {
      setMenu(!menu.classList.contains('open'));
    });

    Array.prototype.forEach.call(menu.querySelectorAll('a'), function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 700) setMenu(false);
    });
  }

  /* ----------------------------------------------------------------------
     Contact form – send submissions to Formspree
     ---------------------------------------------------------------------- */
  var form = document.getElementById('contact-form');
  var note = document.getElementById('form-note');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var submitButton = form.querySelector('[type="submit"]');
      var originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Sendi...';
      if (note) {
        note.textContent = 'Sendi skilaboðin...';
        note.hidden = false;
      }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (response) {
        if (!response.ok) {
          throw new Error('Formspree rejected the submission with status ' + response.status);
        }

        form.reset();
        if (note) note.textContent = 'Takk fyrir! Skilaboðin hafa verið send.';
      }).catch(function (error) {
        console.error('Unable to submit the contact form to Formspree.', error);
        if (note) note.textContent =
          'Ekki tókst að senda skilaboðin. Vinsamlegast reyndu aftur eða sendu tölvupóst á bokhald@nesendurskodun.is.';
      }).then(function () {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      });
    });
  }

  /* ----------------------------------------------------------------------
     Footer year
     ---------------------------------------------------------------------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
