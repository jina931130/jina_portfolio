/* ============================================
   Yeojin Jung — Portfolio
   GNB dropdown / evidence jump / stats toggle
   ============================================ */

(function () {
  'use strict';

  /* ---------- 1. GNB dropdown ---------- */
  function initDropdown() {
    var dd = document.querySelector('.dropdown');
    if (!dd) return;
    var toggle = dd.querySelector('.dropdown-toggle');
    var panel = dd.querySelector('.dropdown-panel');

    function open() {
      dd.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }
    function close() {
      dd.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
    function toggleOpen(e) {
      e.preventDefault();
      dd.classList.contains('open') ? close() : open();
    }

    toggle.addEventListener('click', toggleOpen);
    document.addEventListener('click', function (e) {
      if (!dd.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
    // keyboard: open on Enter/Space, move into panel with ArrowDown
    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        open();
        var first = panel.querySelector('a');
        if (first) first.focus();
      }
    });
  }

  /* ---------- 2. Evidence chip -> section jump + return ---------- */
  function initEvidenceJump() {
    var chips = document.querySelectorAll('[data-jump]');
    if (!chips.length) return;

    var back = document.createElement('button');
    back.className = 'back-to';
    back.type = 'button';
    back.hidden = true;
    document.body.appendChild(back);

    var returnY = null;
    var hideTimer = null;

    function showBack(label) {
      back.textContent = label;
      back.hidden = false;
      requestAnimationFrame(function () { back.classList.add('show'); });
      clearTimeout(hideTimer);
      hideTimer = setTimeout(hideBack, 9000);
    }
    function hideBack() {
      back.classList.remove('show');
      clearTimeout(hideTimer);
      setTimeout(function () { back.hidden = true; }, 250);
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function (e) {
        var id = chip.getAttribute('data-jump');
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();

        returnY = window.scrollY;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 96, behavior: 'smooth' });

        target.classList.add('flash');
        setTimeout(function () { target.classList.remove('flash'); }, 1600);

        showBack(chip.getAttribute('data-back-label') || '돌아가기');
      });
    });

    back.addEventListener('click', function () {
      if (returnY === null) return;
      window.scrollTo({ top: returnY, behavior: 'smooth' });
      hideBack();
    });
  }

  /* ---------- 3. Stats / method toggle ---------- */
  function initToggles() {
    document.querySelectorAll('[data-toggle]').forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute('data-toggle'));
      if (!panel) return;
      var openLabel = btn.getAttribute('data-label-open');
      var closeLabel = btn.getAttribute('data-label-close');
      var labelEl = btn.querySelector('.toggle-label') || btn;

      btn.setAttribute('aria-expanded', 'false');
      panel.hidden = true;

      btn.addEventListener('click', function () {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isOpen));
        panel.hidden = isOpen;
        btn.classList.toggle('open', !isOpen);
        if (openLabel && closeLabel) labelEl.textContent = isOpen ? openLabel : closeLabel;
      });
    });
  }

  /* ---------- 4. Video poster -> play with sound ---------- */
  function initVideos() {
    document.querySelectorAll('.video-frame').forEach(function (frame) {
      var video = frame.querySelector('video');
      var play = frame.querySelector('.play-btn');
      if (!video || !play) return;
      play.addEventListener('click', function () {
        video.muted = false;
        video.controls = true;
        video.play();
        frame.classList.add('playing');
      });
      video.addEventListener('pause', function () { frame.classList.remove('playing'); });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initDropdown();
    initEvidenceJump();
    initToggles();
    initVideos();
  });
})();
