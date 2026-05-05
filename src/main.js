const { invoke } = window.__TAURI__ || {};

const BASE_URL = 'https://oxirondev.com';
const ALLOWED_ROUTES = ['/console', '/test-request', '/endpoints', '/docs'];

const iframe = document.getElementById('main-frame');
const buttons = document.querySelectorAll('.nav-btn');

function navigate(route) {
  if (!ALLOWED_ROUTES.includes(route)) return;
  
  const targetUrl = `${BASE_URL}${route}`;
  iframe.src = targetUrl;
  
  // Update active state
  buttons.forEach(btn => {
    if (btn.dataset.route === route) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Button Click Handlers
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    navigate(btn.dataset.route);
  });
});

// Security & Navigation Lock
// Handled natively by open_discord_login in Rust
let pollingInterval = null;

// Listen for messages from the iframe OR the popup window
window.addEventListener('message', async (event) => {
  // Case 1: Iframe requesting to open Discord (using window.open)
  if (event.data.type === 'login-discord') {
    // window.open in Tauri main window creates a new WebviewWindow
    const popup = window.open(event.data.url, 'discord-login', 'width=600,height=800');
    
    if (popup) {
      console.log('Opened login popup via window.open');
    } else {
      // Fallback to shell.open if popup is blocked
      if (window.__TAURI__) {
        window.__TAURI__.shell.open(event.data.url);
      }
    }
  }
  
  // Case 2: Popup window notifying of success via postMessage
  if (event.data.type === 'login-complete') {
    handleLoginComplete(event.data.payload);
  }

  // Case 3: Iframe notifying that its route has changed
  if (event.data.type === 'route-changed') {
    const route = event.data.pathname;
    buttons.forEach(btn => {
      if (btn.dataset.route === route) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Case 4: Iframe notifying that it successfully logged in (during polling)
  if (event.data.type === 'login-success-polling') {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
    // Refresh to dashboard
    iframe.src = `${BASE_URL}/console`;
  }
});

function handleLoginComplete(payload) {
  console.log('Login complete received:', payload);
  
  // 1. Save sessionKey to localStorage (shared with iframe)
  if (payload.sessionKey) {
    localStorage.setItem('oxiron_session_token', payload.sessionKey);
  }
  
  // 2. Notify the iframe via postMessage so it can update its React state
  // This is better than reloading because it's faster and avoids race conditions
  if (iframe.contentWindow) {
    iframe.contentWindow.postMessage({ type: 'login-complete', payload }, '*');
  }
}

// Listen for the login-complete event from the popup (Tauri Event)
if (window.__TAURI__) {
  window.__TAURI__.event.listen('login-complete', (event) => {
    handleLoginComplete(event.payload);
  });
}

// Initial navigation
navigate('/console');
