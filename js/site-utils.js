// Centralized site utilities: sidebar and theme toggles (idempotent)
// Mark presence early so per-page scripts can detect this shared utility and avoid attaching duplicate handlers
window.siteUtilsPresent = true;

document.addEventListener('DOMContentLoaded', () => {
  if (window.siteUtilsInitialized) return;

  const sidebar = document.getElementById('sidebar');
  const themeToggleLogin = document.getElementById('themeToggleLogin');

  function toggleSidebar() {
    if (sidebar) sidebar.classList.toggle('show');
  }

  function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem(
      'theme',
      document.body.classList.contains('dark-mode') ? 'dark' : 'light'
    );

    const icon = document.body.classList.contains('dark-mode')
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';

    // Update all known toggle locations if present
    const hdr = document.getElementById('themeToggleHeader');
    const ins = document.getElementById('themeToggleInside');
    if (hdr) hdr.innerHTML = icon;
    if (ins) ins.innerHTML = icon;
    if (themeToggleLogin) themeToggleLogin.innerHTML = icon;
  }

  // Inject a high-specificity style block to enforce consistent sidebar sizing and header layout
  (function injectOverrides() {
    try {
      if (document.getElementById('site-utils-overrides')) return;
      const css = `
        /* Site-utils runtime overrides (high specificity, !important) */
        html body .sidebar { width: 180px !important; left: -180px !important; }
        html body .sidebar.show { left: 0 !important; }
        html body .sidebar .sidebar-top { display: flex !important; gap: 6px !important; align-items: center !important; padding: 8px !important; }
        html body .responsive-header .header-actions { display: flex !important; gap: 6px !important; align-items: center !important; }
        html body .responsive-header .header-actions .sidebar-toggle { margin: 0 !important; padding: 8px !important; }
        /* Fix nav link sizing to avoid shifting */
        html body .sidebar .sidebar-nav a { display: flex !important; align-items: center !important; height: 44px !important; padding: 8px 12px !important; box-sizing: border-box !important; }
        html body .sidebar .sidebar-nav a > * { margin: 0 !important; }
      `;
      const s = document.createElement('style');
      s.id = 'site-utils-overrides';
      s.appendChild(document.createTextNode(css));
      document.head.appendChild(s);
    } catch (err) { /* ignore */ }
  })();

  // Inject small animation CSS for header buttons (fallback when GSAP not available)
  (function injectHeaderAnimationCSS(){
    try {
      if (document.getElementById('site-utils-anim')) return;
      const css = `
        @keyframes hwb-pulse { 0% { transform: translateY(-6px); opacity:0 } 60% { transform: translateY(0); opacity:1 } 100% { transform: none; opacity:1 } }
        .site-utils-animate-header { animation: hwb-pulse 420ms cubic-bezier(.22,1,.36,1) both; }
        /* small focus ring matching the home style */
        .header-actions .sidebar-toggle:focus, .header-actions .theme-btn:focus { box-shadow: 0 0 0 4px rgba(8,58,115,0.12); }
      `;
      const s = document.createElement('style'); s.id = 'site-utils-anim'; s.appendChild(document.createTextNode(css)); document.head.appendChild(s);
    } catch (e) { /* ignore */ }
  })();

  // Header button animation: prefer GSAP (if present), otherwise add CSS class briefly
  function animateHeaderButtons() {
    try {
      const headerBtns = Array.from(document.querySelectorAll('#mainHeader .header-actions > button'));
      if (!headerBtns.length) return;
      if (window.gsap && typeof window.gsap.from === 'function') {
        // animate with a slight stagger from upward offset like home
        window.gsap.from(headerBtns, { y: -10, opacity: 0, duration: 0.45, ease: 'power3.out', stagger: 0.06 });
        return;
      }
      // CSS fallback: add class then remove after animation ends
      headerBtns.forEach(btn => {
        btn.classList.remove('site-utils-animate-header');
        // force reflow
        // eslint-disable-next-line no-unused-expressions
        btn.offsetWidth;
        btn.classList.add('site-utils-animate-header');
        btn.addEventListener('animationend', () => btn.classList.remove('site-utils-animate-header'), { once: true });
      });
    } catch (e) { /* ignore */ }
  }

  // Delegate clicks (use capture) so this runs before inline onclick handlers and is resilient to re-rendering
  document.addEventListener('click', (e) => {
    const t = e.target;
    // helper: ensure we always search from an Element node (event.target can be a Text node)
    const getClosest = (sel) => {
      try {
        if (!t) return null;
        // if target is an Element, prefer native closest
        if (t.nodeType === 1 && typeof t.closest === 'function') return t.closest(sel);
        // otherwise walk up from parentElement
        let el = (t.nodeType === 1) ? t : (t.parentElement || t.parentNode);
        while (el) {
          if (typeof el.matches === 'function' && el.matches(sel)) return el;
          el = el.parentElement;
        }
      } catch (err) { /* ignore */ }
      return null;
    };

    // Sidebar toggles: only explicit sidebar toggle buttons (avoid catching theme buttons that share classes)
    if (getClosest('#toggleSidebarHeader') || getClosest('#toggleSidebarInside')) {
      toggleSidebar();
      e.preventDefault();
      return;
    }

    // Theme toggles
    if (getClosest('#themeToggleHeader') || getClosest('#themeToggleInside') || getClosest('#themeToggleLogin')) {
      toggleTheme();
      e.preventDefault();
      return;
    }

    // Navigation to learning page: catch anchors, elements with onclick that contain learning.html, and elements with data-href
    const a = getClosest('a[href]');
    if (a) {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href.includes('learning.html')) {
        try { sessionStorage.setItem('playLearningAnimation', '1'); } catch (err) {}
      }
    }

    // Elements that use onclick="location.href='learning.html...'": check inline onclick attribute up the tree
    const withOnclick = getClosest('[onclick]');
    if (withOnclick) {
      const onclick = (withOnclick.getAttribute('onclick') || '').toLowerCase();
      if (onclick.includes('learning.html')) {
        try { sessionStorage.setItem('playLearningAnimation', '1'); } catch (err) {}
      }
    }

    // data-href or data-target attributes (some UI tiles may use these)
    const dataHref = getClosest('[data-href]');
    if (dataHref) {
      const dh = (dataHref.getAttribute('data-href') || '').toLowerCase();
      if (dh.includes('learning.html')) {
        try { sessionStorage.setItem('playLearningAnimation', '1'); } catch (err) {}
      }
    }
  }, true);

  // Load saved theme on page load
  try {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
      const icon = '<i class="fa-solid fa-sun"></i>';
      const hdr = document.getElementById('themeToggleHeader');
      const ins = document.getElementById('themeToggleInside');
      if (hdr) hdr.innerHTML = icon;
      if (ins) ins.innerHTML = icon;
      if (themeToggleLogin) themeToggleLogin.innerHTML = icon;
    }
  } catch (err) { /* ignore storage errors */ }

  // Learning page animation: call global playLearningAnimation() if present; otherwise use GSAP or CSS fallback
  try {
    const page = (window.location.pathname.split('/').pop() || '').toLowerCase();
    if (page === 'learning.html' && sessionStorage.getItem('playLearningAnimation') === '1') {
      // animate header buttons on arrival via the same helper so header animates like home
      animateHeaderButtons();
      if (typeof window.playLearningAnimation === 'function') {
        window.playLearningAnimation();
      } else if (window.gsap && typeof window.gsap.to === 'function') {
        // fade in main learning panels as a simple fallback
        try {
          window.gsap.fromTo('.learning-main, .learning-tab-panel, .fade-in-lessons', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 });
        } catch (e) { document.body.classList.add('play-learning-animation'); }
      } else {
        document.body.classList.add('play-learning-animation');
      }
      sessionStorage.removeItem('playLearningAnimation');
    }
  } catch (err) { /* ignore */ }

  // Active nav highlighting (first match wins) — tolerant to hash fragments
  try {
    const links = Array.from(document.querySelectorAll('.sidebar-nav a'));
    const currentPath = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    links.forEach((a) => {
      const href = a.getAttribute('href');
      if (!href) return;
      const hrefBase = href.split('#')[0].split('/').pop().toLowerCase();
      if (hrefBase === currentPath || (hrefBase === '' && currentPath === 'index.html')) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
      }
    });
  } catch (e) { /* ignore */ }

  window.siteUtilsInitialized = true;
});

// Also animate header buttons once on initial load for every page to match home page UX
try { document.addEventListener('DOMContentLoaded', () => { try { if (typeof animateHeaderButtons === 'function') animateHeaderButtons(); } catch(e){} }); } catch(e) {}
