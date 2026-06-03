// pro.js - Game launcher functionality
// Handles game selection, viewer management, and access control
//
// ========================================
// HOW TO ADD GAMES:
// 1. Find the GAME_SLOTS array below
// 2. Add the URL/path to your game's HTML file in the url field
// 3. Customize title and description as needed
//
// Example:
//   url: 'static/games/mygame.html'
//   url: 'https://example.com/game.html'
// ========================================

(function () {
  'use strict';

  // Configuration
  const VALID_CODE = 'ampro';

  // ========================================
  // GAME SLOTS - Add your game URLs here!
  // ========================================
  // Simply replace the empty url: '' with the path or URL to your game.
  // The game should be a complete HTML file.
  //
  // This launcher opens the game in a new browser tab for full-screen playback.
  //
  // You can also change:
  //   - title: The name shown on the game card
  //   - description: Short description of your game
  //   - icon: An emoji to represent the game (or leave as 🎮)
  //   - image: A custom card thumbnail image (optional)
  //   - thumbnailLink: Optional URL for a separate thumbnail link action
  //   - thumbnailLabel: Optional label for the thumbnail link action
  // ========================================

  const GAME_SLOTS = [
    {
      id: 1,
      title: 'Tuff Client 1.12.2',
      description: 'Launch Tuff Client 1.12.2 in a dedicated browser tab.',
      icon: '',
      image: 'https://i.postimg.cc/nrMnwBfL/image-2026-06-02-191525587.png',
      thumbnailLink: '',
      thumbnailLabel: '',
      url: 'https://creative-naiad-08aabd.netlify.app',
      status: 'available'
    },
    {
      id: 2,
      title: 'PolyTrack',
      description: '',
      icon: '',
      image: 'https://i.postimg.cc/0j3Kt93W/image-2026-06-02-193916628.png',
      thumbnailLink: '',
      thumbnailLabel: '',
      url: 'https://earnest-dieffenbachia-dae903.netlify.app', // <-- ADD YOUR GAME URL HERE
      status: 'available'
    },
    {
      id: 3,
      title: 'Super Mario 64',
      description: 'Mario',
      icon: '',
      image: 'https://i.postimg.cc/c4szZ0vS/image-2026-06-02-192850900.png',
      thumbnailLink: '',
      thumbnailLabel: '',
      url: 'https://thriving-tulumba-940dca.netlify.app',
      status: 'available'
    },
    {
      id: 4,
      title: 'Basketball Legends',
      description: '',
      icon: '',
      image: 'https://i.postimg.cc/6Qw2bjjy/image-2026-06-02-194053208.png',
      thumbnailLink: '',
      thumbnailLabel: '',
      url: 'https://jolly-gumdrop-f5aa41.netlify.app',
      status: 'available'
    },
    {
      id: 5,
      title: 'Game Slot 5',
      description: 'Add your game URL in pro.js to configure this slot.',
      icon: '',
      image: '',
      thumbnailLink: '',
      thumbnailLabel: '',
      url: '', // <-- ADD YOUR GAME URL HERE
      status: 'available'
    },
    {
      id: 6,
      title: 'Game Slot 6',
      description: 'Add your game URL in pro.js to configure this slot.',
      icon: '',
      image: '',
      thumbnailLink: '',
      thumbnailLabel: '',
      url: '', // <-- ADD YOUR GAME URL HERE
      status: 'available'
    },
    {
      id: 7,
      title: 'Game Slot 7',
      description: 'Add your game URL in pro.js to configure this slot.',
      icon: '',
      image: '',
      thumbnailLink: '',
      thumbnailLabel: '',
      url: '', // <-- ADD YOUR GAME URL HERE
      status: 'available'
    },
    {
      id: 8,
      title: 'Game Slot 8',
      description: 'Add your game URL in pro.js to configure this slot.',
      icon: '',
      image: '',
      thumbnailLink: '',
      thumbnailLabel: '',
      url: '', // <-- ADD YOUR GAME URL HERE
      status: 'available'
    },
    {
      id: 9,
      title: 'Game Slot 9',
      description: 'Add your game URL in pro.js to configure this slot.',
      icon: '',
      image: '',
      thumbnailLink: '',
      thumbnailLabel: '',
      url: '', // <-- ADD YOUR GAME URL HERE
      status: 'available'
    },
    {
      id: 10,
      title: 'Game Slot 10',
      description: 'Add your game URL in pro.js to configure this slot.',
      icon: '',
      image: '',
      thumbnailLink: '',
      thumbnailLabel: '',
      url: '', // <-- ADD YOUR GAME URL HERE
      status: 'available'
    }
  ];

  // DOM Elements
  const proRoot = document.getElementById('proRoot');
  const accessDenied = document.getElementById('accessDenied');
  const gamesGrid = document.getElementById('gamesGrid');
  const gameSelection = document.getElementById('gameSelection');
  const gameViewer = document.getElementById('gameViewer');
  const gameFrame = document.getElementById('gameFrame');
  const gameLoading = document.getElementById('gameLoading');
  const currentGameTitle = document.getElementById('currentGameTitle');
  const closeBtn = document.getElementById('closeBtn');
  const closeGameBtn = document.getElementById('closeGameBtn');
  const backToGames = document.getElementById('backToGames');
  const openBlankBtn = document.getElementById('openBlankBtn');
  const carouselScrollbar = document.querySelector('.carousel-scrollbar-inner');

  // Panel Elements
  const panelOverlay = document.getElementById('panelOverlay');
  const slidePanel = document.getElementById('slidePanel');
  const panelTitle = document.getElementById('panelTitle');
  const panelContent = document.getElementById('panelContent');
  const closePanelBtn = document.getElementById('closePanelBtn');
  const actionButtons = document.querySelectorAll('.action-btn[data-panel]');

  // Panel State
  let currentPanel = null;

  // State
  let unlocked = false;
  let currentGame = null;

  // ========================================
  // Access Control
  // ========================================

  function showAccessDenied() {
    // Access denied behavior has been disabled.
    accessDenied.classList.add('hidden');
    console.warn('Access denied blocked; revealing Pro area instead.');
    revealPro();
  }

  function revealPro() {
    unlocked = true;
    accessDenied.classList.add('hidden');
    proRoot.classList.remove('hidden');
    proRoot.classList.add('fade-in');
    proRoot.setAttribute('aria-hidden', 'false');
    populateGames();
    setupEventListeners();
    updateScrollbarPosition();
  }

  // ========================================
  // Game Card Generation
  // ========================================

  function populateGames() {
    if (!gamesGrid) return;
    gamesGrid.innerHTML = '';

    GAME_SLOTS.forEach((slot, index) => {
      const card = createGameCard(slot, index);
      gamesGrid.appendChild(card);
    });
  }

  function openGameInNewTab(game) {
    window.open(game.url, '_blank', 'noopener,noreferrer,fullscreen=yes');
  }

  function createGameCard(slot, index) {
    const card = document.createElement('article');
    card.className = 'game-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Play ${slot.title}`);
    card.style.animationDelay = `${index * 0.05}s`;

    // Check if game URL is configured
    const isConfigured = slot.url && slot.url.trim() !== '';
    const statusDotClass = slot.status === 'in-progress' ? 'in-progress' : '';
    const statusText = isConfigured ? (slot.status === 'in-progress' ? 'In Progress' : 'New') : 'Not Configured';
    const icon = slot.icon || '';

    card.innerHTML = `
      <div class="game-card-thumbnail">
        ${slot.image ? `<img src="${slot.image}" alt="${slot.title} thumbnail">` : `<span class="game-card-icon">${icon}</span>`}
        ${!isConfigured ? '<div class="not-configured-overlay">Coming Soon</div>' : ''}
      </div>
      <div class="game-card-content">
        <h3>${slot.title}</h3>
        <p>${slot.description}</p>
        <div class="game-card-meta">
          <span class="game-card-status">
            <span class="game-card-status-dot ${statusDotClass}"></span>
            ${statusText}
          </span>
          ${isConfigured ? `
            <span class="game-card-play-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
              Play
            </span>
          ` : ''}
        </div>
      </div>
    `;

    // Click handler (only if configured)
    if (isConfigured) {
      card.addEventListener('click', () => openGameInNewTab(slot));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openGameInNewTab(slot);
        }
      });
    } else {
      card.style.opacity = '0.5';
      card.style.cursor = 'not-allowed';
    }

    return card;
  }

  // ========================================
  // Game Viewer Management
  // ========================================

  function loadGame(game) {
    currentGame = game;
    currentGameTitle.textContent = game.title;

    // Show loading state
    gameLoading.classList.remove('hidden');

    // Load game from URL
    gameFrame.src = game.url;
    gameFrame.title = game.title;

    // Show viewer, hide selection
    gameSelection.classList.add('hidden');
    gameViewer.classList.remove('hidden');

    // Focus the iframe after a short delay
    setTimeout(() => {
      gameFrame.focus();
    }, 100);
  }

  function closeGame() {
    // Stop the game by clearing iframe src
    gameFrame.src = 'about:blank';

    // Reset state
    currentGame = null;
    currentGameTitle.textContent = 'Game Title';

    // Hide loading for next game
    gameLoading.classList.add('hidden');

    // Hide viewer, show selection
    gameViewer.classList.add('hidden');
    gameSelection.classList.remove('hidden');

    // Scroll to top of games section
    gameSelection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleIframeLoad() {
    // Hide loading when iframe finishes loading
    gameLoading.classList.add('hidden');
  }

  // ========================================
  // Scrollbar Position Update
  // ========================================

  function updateScrollbarPosition() {
    if (!gamesGrid || !carouselScrollbar) return;

    gamesGrid.addEventListener('scroll', () => {
      const scrollPercentage = gamesGrid.scrollLeft / (gamesGrid.scrollWidth - gamesGrid.clientWidth);
      carouselScrollbar.style.transform = `translateX(${scrollPercentage * 70}%)`;
    });
  }

  // ========================================
  // Event Listeners
  // ========================================

  // ========================================
  // Panel Management
  // ========================================

  const PANEL_CONTENT = {
    settings: {
      title: 'Settings',
      content: `
        <div class="panel-section">
          <h4 class="panel-section-title">Preferences</h4>
          <div class="toggle-item">
            <div class="toggle-label">
              <span class="toggle-label-text">Dark Mode</span>
              <span class="toggle-label-desc">Easy on the eyes</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="toggleDarkMode" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="toggle-item">
            <div class="toggle-label">
              <span class="toggle-label-text">Sound Effects</span>
              <span class="toggle-label-desc">Game audio and effects</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="toggleSound" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="toggle-item">
            <div class="toggle-label">
              <span class="toggle-label-text">Animations</span>
              <span class="toggle-label-desc">Smooth transitions</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="toggleAnimations" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="toggle-item">
            <div class="toggle-label">
              <span class="toggle-label-text">Compact Mode</span>
              <span class="toggle-label-desc">Smaller UI elements</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="toggleCompact">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
        <div class="panel-section">
          <h4 class="panel-section-title">Theme</h4>
          <div class="theme-selector">
            <div class="theme-option selected" data-theme="dark">
              <span class="theme-option-icon">🌙</span>
              Dark
            </div>
            <div class="theme-option" data-theme="light">
              <span class="theme-option-icon">☀️</span>
              Light
            </div>
            <div class="theme-option" data-theme="auto">
              <span class="theme-option-icon">🔄</span>
              Auto
            </div>
          </div>
        </div>
        <button class="panel-btn panel-btn-primary" id="saveSettingsBtn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Save Settings
        </button>
      `
    },
    help: {
      title: 'Help',
      content: `
        <div class="help-section">
          <h4>Getting Started</h4>
          <p>Click on any game card to start playing. Use the action buttons below for quick access to settings, chat, and more.</p>
        </div>
        <div class="help-section">
          <h4>How to Play</h4>
          <p>Select a game from the carousel. It will open in a new tab for full-screen play. Return to the launcher tab to choose another game.</p>
        </div>
        <div class="help-section">
          <h4>Keyboard Shortcuts</h4>
          <p><strong>ESC</strong> - Close the current panel<br>
          <strong>Left/Right Arrow</strong> - Scroll through games</p>
        </div>
        <div class="help-section">
          <h4>Contact Support</h4>
          <p>Need help? Reach out to our support team at <a href="mailto:support@example.com" class="help-link">support@example.com</a></p>
        </div>
      `
    },
    chat: {
      title: 'Chat',
      content: `
        <div class="chat-messages" id="chatMessages">
          <div class="chat-message">
            <div class="chat-message-avatar">S</div>
            <div class="chat-message-content">
              <div class="chat-message-name">System</div>
              <div class="chat-message-text">Welcome to the chat.</div>
            </div>
          </div>
          <div class="chat-message">
            <div class="chat-message-avatar">P</div>
            <div class="chat-message-content">
              <div class="chat-message-name">ProGamer42</div>
              <div class="chat-message-text">Just beat the final boss!</div>
            </div>
          </div>
        </div>
        <div class="chat-input-wrapper">
          <input type="text" class="chat-input" id="chatInput" placeholder="Type a message...">
          <button class="chat-send-btn" id="chatSendBtn">Send</button>
        </div>
      `
    },
    store: {
      title: 'Store',
      content: `
        <div class="store-item">
          <div class="store-item-info">
            <div class="store-item-name">Badge Pack</div>
            <div class="store-item-desc">5 exclusive badges for your achievements</div>
            <span class="store-item-price">100 points</span>
          </div>
        </div>
        <div class="store-item">
          <div class="store-item-info">
            <div class="store-item-name">Custom Theme</div>
            <div class="store-item-desc">Unlock custom color themes</div>
            <span class="store-item-price">250 points</span>
          </div>
        </div>
        <div class="store-item">
          <div class="store-item-info">
            <div class="store-item-name">XP Booster</div>
            <div class="store-item-desc">2x experience for 7 days</div>
            <span class="store-item-price">500 points</span>
          </div>
        </div>
        <div class="store-item">
          <div class="store-item-info">
            <div class="store-item-name">VIP Membership</div>
            <div class="store-item-desc">Access to exclusive games</div>
            <span class="store-item-price">1000 points</span>
          </div>
        </div>
      `
    },
    community: {
      title: 'Community',
      content: `
        <div class="panel-section">
          <h4 class="panel-section-title">Stats</h4>
          <div class="community-stat">
            <div class="community-stat-value">12,450</div>
            <div class="community-stat-label">Active Players</div>
          </div>
          <div class="community-stat">
            <div class="community-stat-value">89,320</div>
            <div class="community-stat-label">Games Played Today</div>
          </div>
          <div class="community-stat">
            <div class="community-stat-value">1,240</div>
            <div class="community-stat-label">Achievements Unlocked</div>
          </div>
          <div class="community-stat">
            <div class="community-stat-value">Top 1%</div>
            <div class="community-stat-label">Your Ranking</div>
          </div>
        </div>
        <div class="panel-section">
          <h4 class="panel-section-title">Connect</h4>
          <div class="theme-selector">
            <a href="#" class="theme-option">Discord</a>
            <a href="#" class="theme-option">Twitter</a>
            <a href="#" class="theme-option">YouTube</a>
          </div>
        </div>
      `
    }
  };

  function openPanel(panelType) {
    const panelData = PANEL_CONTENT[panelType];
    if (!panelData) return;

    currentPanel = panelType;
    panelTitle.textContent = panelData.title;
    panelContent.innerHTML = panelData.content;

    // Show panel and overlay
    panelOverlay.classList.remove('hidden');
    // Small delay to allow display:block to apply before opacity transition
    requestAnimationFrame(() => {
      panelOverlay.classList.add('visible');
    });
    slidePanel.classList.add('open');
    slidePanel.setAttribute('aria-hidden', 'false');

    // Setup panel-specific event listeners
    setupPanelListeners(panelType);
  }

  function closePanel() {
    panelOverlay.classList.remove('visible');
    slidePanel.classList.remove('open');
    slidePanel.setAttribute('aria-hidden', 'true');

    setTimeout(() => {
      panelOverlay.classList.add('hidden');
      currentPanel = null;
    }, 300);
  }

  // ========================================
  // Real-time Chat System
  // ========================================

  const CHAT_STORAGE_KEY = 'proChatMessages';
  const CHAT_MAX_MESSAGES = 50;

  // Generate a random user identity for this session
  function generateUserIdentity() {
    const initials = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'W'];
    return {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      name: 'User' + Math.floor(Math.random() * 1000),
      avatar: initials[Math.floor(Math.random() * initials.length)]
    };
  }

  let currentUser = null;

  function getCurrentUser() {
    if (!currentUser) {
      try {
        const saved = localStorage.getItem('proCurrentUser');
        currentUser = saved ? JSON.parse(saved) : generateUserIdentity();
        localStorage.setItem('proCurrentUser', JSON.stringify(currentUser));
      } catch (e) {
        currentUser = generateUserIdentity();
      }
    }
    return currentUser;
  }

  // Get chat messages from localStorage
  function getChatMessages() {
    try {
      const messages = localStorage.getItem(CHAT_STORAGE_KEY);
      return messages ? JSON.parse(messages) : [];
    } catch (e) {
      return [];
    }
  }

  // Save chat messages to localStorage
  function saveChatMessage(message) {
    try {
      const messages = getChatMessages();
      messages.push(message);
      // Keep only last N messages
      if (messages.length > CHAT_MAX_MESSAGES) {
        messages.splice(0, messages.length - CHAT_MAX_MESSAGES);
      }
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
      return true;
    } catch (e) {
      console.error('Failed to save chat message:', e);
      return false;
    }
  }

  // Broadcast message to all tabs via storage event
  function broadcastChatMessage(message) {
    // Save to localStorage (triggers storage event in other tabs)
    saveChatMessage(message);
    // Also update current tab's chat if open
    if (currentPanel === 'chat') {
      appendChatMessage(message);
    }
  }

  // Append a message to the chat display
  function appendChatMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    messageDiv.innerHTML = `
      <div class="chat-message-avatar">${message.avatar}</div>
      <div class="chat-message-content">
        <div class="chat-message-name">${escapeHtml(message.name)}</div>
        <div class="chat-message-text">${escapeHtml(message.text)}</div>
      </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Render all chat messages
  function renderChatMessages() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const messages = getChatMessages();
    chatMessages.innerHTML = '';
    messages.forEach(msg => appendChatMessage(msg));
  }

  // Listen for chat updates from other tabs
  function setupChatStorageListener() {
    window.addEventListener('storage', (e) => {
      if (e.key === CHAT_STORAGE_KEY && currentPanel === 'chat') {
        // Messages changed in another tab, refresh
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
          // Get new messages and display only new ones
          const newMessages = e.newValue ? JSON.parse(e.newValue) : [];
          const currentCount = chatMessages.querySelectorAll('.chat-message').length;
          if (newMessages.length > currentCount) {
            // Clear and re-render (simpler approach)
            chatMessages.innerHTML = '';
            newMessages.forEach(msg => appendChatMessage(msg));
          }
        }
      }
    });
  }

  // ========================================
  // Settings Management
  // ========================================

  // Default settings
  const DEFAULT_SETTINGS = {
    darkMode: true,
    soundEnabled: true,
    animationsEnabled: true,
    compactMode: false,
    theme: 'dark'
  };

  // Load settings from localStorage
  function loadSettings() {
    try {
      const saved = localStorage.getItem('proSettings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS };
    } catch (e) {
      return { ...DEFAULT_SETTINGS };
    }
  }

  // Save settings to localStorage
  function saveSettings(settings) {
    try {
      localStorage.setItem('proSettings', JSON.stringify(settings));
      applySettings(settings);
      return true;
    } catch (e) {
      console.error('Failed to save settings:', e);
      return false;
    }
  }

  // Apply settings to the page
  function applySettings(settings) {
    const root = document.documentElement;

    // Dark mode
    if (settings.darkMode) {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
    } else {
      root.classList.remove('dark-mode');
      root.classList.add('light-mode');
    }

    // Compact mode
    if (settings.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }

    // Theme-specific styles
    switch (settings.theme) {
      case 'dark':
        root.setAttribute('data-theme', 'dark');
        break;
      case 'light':
        root.setAttribute('data-theme', 'light');
        break;
      case 'auto':
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        break;
    }

    // Sound enabled (store for game use)
    root.setAttribute('data-sound', settings.soundEnabled.toString());

    // Animations (store for CSS/GSAP use)
    if (!settings.animationsEnabled) {
      root.style.setProperty('--pro-transition', 'none');
    } else {
      root.style.removeProperty('--pro-transition');
    }
  }

  // Current settings state
  let currentSettings = loadSettings();
  applySettings(currentSettings);

  // Setup chat listener early
  setupChatStorageListener();

  function setupPanelListeners(panelType) {
    // Settings panel
    if (panelType === 'settings') {
      // Load current settings into toggles
      const darkModeToggle = document.getElementById('toggleDarkMode');
      const soundToggle = document.getElementById('toggleSound');
      const animationsToggle = document.getElementById('toggleAnimations');
      const compactToggle = document.getElementById('toggleCompact');

      if (darkModeToggle) darkModeToggle.checked = currentSettings.darkMode;
      if (soundToggle) soundToggle.checked = currentSettings.soundEnabled;
      if (animationsToggle) animationsToggle.checked = currentSettings.animationsEnabled;
      if (compactToggle) compactToggle.checked = currentSettings.compactMode;

      // Theme selector - set current selection
      const themeOptions = document.querySelectorAll('.theme-option');
      themeOptions.forEach(option => {
        if (option.dataset.theme === currentSettings.theme) {
          option.classList.add('selected');
        }
      });

      // Toggle event listeners
      if (darkModeToggle) {
        darkModeToggle.addEventListener('change', (e) => {
          currentSettings.darkMode = e.target.checked;
        });
      }

      if (soundToggle) {
        soundToggle.addEventListener('change', (e) => {
          currentSettings.soundEnabled = e.target.checked;
        });
      }

      if (animationsToggle) {
        animationsToggle.addEventListener('change', (e) => {
          currentSettings.animationsEnabled = e.target.checked;
        });
      }

      if (compactToggle) {
        compactToggle.addEventListener('change', (e) => {
          currentSettings.compactMode = e.target.checked;
        });
      }

      // Save button
      const saveBtn = document.getElementById('saveSettingsBtn');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          const success = saveSettings(currentSettings);

          if (success) {
            saveBtn.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Settings Saved!
            `;
            saveBtn.style.background = '#22c55e';
            setTimeout(() => {
              saveBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Save Settings
              `;
              saveBtn.style.background = '';
            }, 2000);
          }
        });
      }

      // Theme selector event listeners
      themeOptions.forEach(option => {
        option.addEventListener('click', () => {
          themeOptions.forEach(o => o.classList.remove('selected'));
          option.classList.add('selected');
          currentSettings.theme = option.dataset.theme;
        });
      });
    }

    // Chat panel
    if (panelType === 'chat') {
      const chatInput = document.getElementById('chatInput');
      const chatSendBtn = document.getElementById('chatSendBtn');

      // Render existing messages
      renderChatMessages();

      function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        const user = getCurrentUser();
        const chatMessage = {
          id: 'msg_' + Date.now(),
          userId: user.id,
          name: user.name,
          avatar: user.avatar,
          text: message,
          timestamp: new Date().toISOString()
        };

        // Broadcast to all tabs (including this one)
        broadcastChatMessage(chatMessage);

        chatInput.value = '';
      }

      if (chatSendBtn) {
        chatSendBtn.addEventListener('click', sendMessage);
      }
      if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') sendMessage();
        });
      }
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function setupEventListeners() {
    // Close game button
    if (closeGameBtn) {
      closeGameBtn.addEventListener('click', closeGame);
    }

    // Back to games button
    if (backToGames) {
      backToGames.addEventListener('click', closeGame);
    }

    // Exit Pro Area button
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        window.location.replace('/');
      });
    }

    // Iframe load event
    gameFrame.addEventListener('load', handleIframeLoad);

    // ESC key to close game or panel
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (currentPanel) {
          closePanel();
        } else if (currentGame) {
          closeGame();
        }
      }
    });

    // Horizontal scroll with mouse wheel
    if (gamesGrid) {
      gamesGrid.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0 && Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
          e.preventDefault();
          gamesGrid.scrollLeft += e.deltaY;
        }
      }, { passive: false });
    }

    // Action buttons for panels
    actionButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const panelType = btn.getAttribute('data-panel');
        openPanel(panelType);
      });
    });

    // Close panel button
    if (closePanelBtn) {
      closePanelBtn.addEventListener('click', closePanel);
    }

    // Close panel when clicking overlay
    if (panelOverlay) {
      panelOverlay.addEventListener('click', closePanel);
    }

    // Launch site inside an about:blank tab
    if (openBlankBtn) {
      openBlankBtn.addEventListener('click', () => {
        const newWin = window.open('about:blank', '_blank');
        if (!newWin) return;

        const siteUrl = window.location.origin;
        newWin.document.write(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Site in blank page</title>
    <style>
      html, body { margin: 0; height: 100%; overflow: hidden; }
      iframe { border: 0; width: 100%; height: 100vh; }
    </style>
  </head>
  <body>
    <iframe src="${siteUrl}" title="Site in blank page"></iframe>
  </body>
</html>`);
        newWin.document.close();
      });
    }
  }

  // ========================================
  // Message Handler (for access control)
  // ========================================

  function handleMessage(e) {
    try {
      if (e.origin !== location.origin) return;
    } catch (err) {
      // ignore cross-origin errors
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

  window.addEventListener('message', handleMessage, false);

  // ========================================
  // Initialization
  // ========================================

  function waitForOpenerMessage() {
    if (!window.opener) {
      // For development/testing, allow direct access
      console.log('No opener detected. In production, access would be denied.');
      // showAccessDenied(); // Uncomment for strict access control
      revealPro(); // Remove this line in production
      return;
    }

    setTimeout(() => {
      if (!unlocked) showAccessDenied();
    }, 900);
  }

  // Start the check when DOM is ready
  document.addEventListener('DOMContentLoaded', waitForOpenerMessage);
})();