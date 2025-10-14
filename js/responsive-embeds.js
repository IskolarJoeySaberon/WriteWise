// Normalize iframes and videos across the site to be responsive
(function () {
  function wrapForResponsive(el) {
    const container = el.closest('.video-container');
    if (container) {
      // Strip hard-coded width/height to allow CSS to control size
      el.removeAttribute('width');
      el.removeAttribute('height');
      // If container lacks aspect control, set data attribute hook
      if (!container.hasAttribute('data-responsive')) {
        container.setAttribute('data-responsive', 'true');
      }
      return;
    }
    // No .video-container? Wrap with a utility wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'responsive-embed';
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
    el.removeAttribute('width');
    el.removeAttribute('height');
  }

  function init() {
    const embeds = document.querySelectorAll('iframe, video');
    embeds.forEach(wrapForResponsive);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
