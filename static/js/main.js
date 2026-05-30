document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const getStartedBtn = document.getElementById('getStartedBtn');
  const heroStartBtn = document.getElementById('heroStartBtn');
  const loginModal = document.getElementById('loginModal');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCancel = document.getElementById('modalCancel');
  const loginForm = document.getElementById('loginForm');
  const termsLinks = document.querySelectorAll('#termsLink, #termsLinkFooter');
  const popup = document.getElementById('popup');
  const closePopup = document.getElementById('close-popup');
  // Pro Area moved to separate page (pro.html); no in-page elements.
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.querySelector('.main-nav');
  const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-slide-up, .animate-slide-right, .animate-slide-left, .animate-scale-in');
  const counters = document.querySelectorAll('.count');

  const SECRET = 'ampro';

  function openModal() {
    if (!loginModal) return;
    loginModal.classList.remove('hidden');
    loginModal.setAttribute('aria-hidden', 'false');
    const username = document.getElementById('username');
    if (username) username.focus();
  }

  // No-op: Pro Area is on a separate page.

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
  if (getStartedBtn) getStartedBtn.addEventListener('click', openModal);
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
    const errorEl = document.createElement('div');
    errorEl.id = 'loginError';
    errorEl.style.color = '#ff4d4f';
    errorEl.style.marginTop = '12px';
    loginForm.appendChild(errorEl);

    // Handle submit: validate code and open pro page via postMessage (in-memory only)
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pwd = (document.getElementById('password') || {}).value || '';
      if (pwd.trim().toLowerCase() === SECRET) {
        // Open pro page in a new window/tab and send a one-time in-memory message
        const proWin = window.open('/pro', '_blank');
        if (!proWin) {
          errorEl.textContent = 'Popup blocked. Please allow popups and try again.';
          return;
        }
        // Post a short delay to ensure the new window is ready to receive messages
        setTimeout(() => {
          try {
            proWin.postMessage({ type: 'proAccess', code: SECRET }, location.origin);
          } catch (err) {
            // If posting fails, notify user
            errorEl.textContent = 'Could not open Pro Area. Please try again.';
            return;
          }
          // Show a brief success animation/message in the current page
          errorEl.style.color = '#16a34a';
          errorEl.textContent = 'Access granted — opening Pro Area...';
          // Close modal shortly after
          setTimeout(() => closeModal(), 600);
        }, 200);
        return;
      }
      errorEl.textContent = 'Incorrect code — please try again.';
    });
  }

  // No in-page Pro Area handling — pro page is separate and receives an in-memory message.

  // Nothing else required for Pro Area on index page.

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
