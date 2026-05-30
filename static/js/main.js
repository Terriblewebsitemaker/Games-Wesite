document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('getStartedBtn');
  const heroStartBtn = document.getElementById('heroStartBtn');
  const loginModal = document.getElementById('loginModal');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCancel = document.getElementById('modalCancel');
  const loginForm = document.getElementById('loginForm');
  const termsLinks = document.querySelectorAll('#termsLink, #termsLinkFooter');
  const popup = document.getElementById('popup');
  const closePopup = document.getElementById('close-popup');
  const proArea = document.getElementById('pro-area');
  const proGames = document.getElementById('pro-games');
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.querySelector('.main-nav');
  const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-slide-up, .animate-slide-right, .animate-slide-left, .animate-scale-in');
  const counters = document.querySelectorAll('.count');

  const SECRET = 'ampro';
  const STORAGE_KEY = 'pro_area_unlocked';

  function openModal() {
    if (!loginModal) return;
    loginModal.classList.remove('hidden');
    loginModal.setAttribute('aria-hidden', 'false');
    const username = document.getElementById('username');
    if (username) username.focus();
  }

  function closeModal() {
    if (!loginModal) return;
    loginModal.classList.add('hidden');
    loginModal.setAttribute('aria-hidden', 'true');
  }

  function toggleMobileNav() {
    if (!mainNav) return;
    const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('open');
  }

  function openTerms() {
    if (!popup) return;
    popup.classList.remove('hidden');
  }

  function hideTerms() {
    if (!popup) return;
    popup.classList.add('hidden');
  }

  if (loginBtn) loginBtn.addEventListener('click', openModal);
  if (heroStartBtn) heroStartBtn.addEventListener('click', openModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalCancel) modalCancel.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  if (closePopup) closePopup.addEventListener('click', hideTerms);
  if (mobileToggle) mobileToggle.addEventListener('click', toggleMobileNav);
  if (termsLinks.length) {
    termsLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        openTerms();
      });
    });
  }

  if (popup) {
    popup.addEventListener('click', (event) => {
      if (event.target === popup) hideTerms();
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pwd = (document.getElementById('password') || {}).value || '';
      if (pwd === SECRET) {
        unlockProArea();
        closeModal();
        return;
      }
      closeModal();
      alert('Logged in (mock). Enter the special password to reveal the Pro Area.');
    });
  }

  function unlockProArea() {
    if (!proArea) return;
    proArea.classList.remove('hidden');
    proArea.setAttribute('aria-hidden', 'false');
    localStorage.setItem(STORAGE_KEY, 'true');
    if (proGames) {
      generateGameCards(120);
    }
  }

  if (localStorage.getItem(STORAGE_KEY) === 'true') {
    unlockProArea();
  }

  function generateGameCards(count) {
    if (!proGames) return;
    proGames.innerHTML = '';
    const fragment = document.createDocumentFragment();

    for (let i = 1; i <= count; i += 1) {
      const title = `Game ${i}`;
      const desc = `Short description for ${title}. Fun learning challenge ${i}.`;
      const card = document.createElement('article');
      card.className = 'course-card';

      const h3 = document.createElement('h3');
      h3.textContent = title;
      card.appendChild(h3);

      const p = document.createElement('p');
      p.textContent = desc;
      card.appendChild(p);

      const playBtn = document.createElement('button');
      playBtn.className = 'btn btn-primary';
      playBtn.textContent = 'Play';
      playBtn.addEventListener('click', () => {
        const w = window.open('', '_blank');
        if (w) {
          w.document.write(`<h1>${title}</h1><p>${desc}</p>`);
        }
      });
      card.appendChild(playBtn);
      fragment.appendChild(card);
    }

    proGames.appendChild(fragment);
  }

  function animateCounters(entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = +counter.dataset.target || 0;
      const duration = 1600;
      const startTime = performance.now();

      const step = (timestamp) => {
        const progress = Math.min((timestamp - startTime) / duration, 1);
        counter.textContent = Math.floor(progress * target).toLocaleString();
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };

      window.requestAnimationFrame(step);
      observer.unobserve(counter);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  if (counters.length) {
    const counterObserver = new IntersectionObserver(animateCounters, {
      threshold: 0.3,
    });
    counters.forEach((counter) => counterObserver.observe(counter));
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
      hideTerms();
      if (mainNav && mainNav.classList.contains('open')) {
        toggleMobileNav();
      }
    }
  });
});
