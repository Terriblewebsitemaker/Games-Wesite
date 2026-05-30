// pro.js — client-side guard for the Pro Area
// This script expects a one-time postMessage from the opener with the valid code.
// The authentication exists only in-memory for this window; reloading will reset it.

(function () {
  'use strict';

  const VALID_CODE = 'ampro';
  const proRoot = document.getElementById('proRoot');
  const accessDenied = document.getElementById('accessDenied');
  const gamesGrid = document.getElementById('gamesGrid');
  const closeBtn = document.getElementById('closeBtn');

  let unlocked = false;

  function showAccessDenied() {
    accessDenied.classList.remove('hidden');
    // After a short delay redirect back to homepage
    setTimeout(() => {
      window.location.replace('/');
    }, 1400);
  }

  function revealPro() {
    unlocked = true;
    accessDenied.classList.add('hidden');
    proRoot.classList.remove('hidden');
    proRoot.classList.add('fade-in');
    proRoot.setAttribute('aria-hidden', 'false');
    // Create 10 iframe slots so you can add up to 10 games
    populateGames(10);
  }

  function populateGames(count) {
    if (!gamesGrid) return;
    gamesGrid.innerHTML = '';
    for (let i = 1; i <= count; i++) {
      const card = document.createElement('article');
      card.className = 'course-card';

      const h3 = document.createElement('h3');
      h3.textContent = `Pro Game ${i}`;

      // iframe slot — empty src so you can set it later, or set data-src
      const frame = document.createElement('iframe');
      frame.className = 'game-iframe';
      frame.setAttribute('src', '');
      frame.setAttribute('title', `Pro Game ${i}`);
      frame.setAttribute('loading', 'lazy');
      frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');

      const caption = document.createElement('p');
      caption.textContent = `Challenge ${i} — add your game URL to the iframe src.`;

      card.appendChild(h3);
      card.appendChild(frame);
      card.appendChild(caption);
      gamesGrid.appendChild(card);
    }
  }

  // Listen for messages from opener
  function handleMessage(e) {
    try {
      if (e.origin !== location.origin) return;
    } catch (err) {
      // ignore
    }
    const m = e.data || {};
    if (m && m.type === 'proAccess' && typeof m.code === 'string') {
      if (m.code.trim().toLowerCase() === VALID_CODE) {
        revealPro();
      } else {
        showAccessDenied();
      }
    }
  }

  // If the page was opened by an opener, wait for a message. If none arrives soon,
  // deny access. If there is no opener (direct navigation), immediately deny.
  window.addEventListener('message', handleMessage, false);

  function waitForOpenerMessage() {
    if (!window.opener) {
      showAccessDenied();
      return;
    }
    // give the opener a short time to postMessage
    setTimeout(() => {
      if (!unlocked) showAccessDenied();
    }, 900);
  }

  // Close button returns user back to index
  if (closeBtn) closeBtn.addEventListener('click', () => window.location.replace('/'));

  // start the check
  document.addEventListener('DOMContentLoaded', waitForOpenerMessage);
})();
