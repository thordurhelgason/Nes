/* ==========================================================================
   Nes Endurskoðun – shared behaviour
   Every block is guarded so the same file can be loaded on every page.
   ========================================================================== */
(function () {
  'use strict';

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
     Contact form – this is a static site with no backend, so the message is
     handed off to the visitor's own mail client.
     ---------------------------------------------------------------------- */
  var form = document.getElementById('contact-form');
  var note = document.getElementById('form-note');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var nafn = form.nafn.value.trim();
      var postfang = form.postfang.value.trim();
      var skilabod = form.skilabod.value.trim();
      var body = 'Nafn: ' + nafn + '\nPóstfang: ' + postfang + '\n\n' + skilabod;

      window.location.href = 'mailto:bokhald@nesendurskodun.is' +
        '?subject=' + encodeURIComponent('Fyrirspurn frá ' + nafn) +
        '&body=' + encodeURIComponent(body);

      if (note) {
        note.textContent = 'Takk fyrir! Tölvupóstforritið þitt opnast með skilaboðunum.';
        note.hidden = false;
      }
    });
  }

  /* ----------------------------------------------------------------------
     Footer year
     ---------------------------------------------------------------------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
