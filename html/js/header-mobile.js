// Dynamically reserve space for left header actions so titles stay centered on mobile
(function () {
  let rafId = 0;
  function setSpace() {
    const vw = window.innerWidth || document.documentElement.clientWidth || 0;
    document.querySelectorAll('.responsive-header').forEach((header) => {
      const actions = header.querySelector('.header-actions');
      const logoTitle = header.querySelector('.logo-title');
      if (!actions) return;
      const rect = actions.getBoundingClientRect();
      const width = Math.ceil(rect.width);
      // Reserve equal padding so centered title isn't overlapped
      header.style.setProperty('--actions-block', (width + 12) + 'px');
      // Ensure min height at least the actions height on mobile
      const height = Math.ceil(rect.height);
      if (height > 0) {
        header.style.minHeight = Math.max(56, height + 16) + 'px';
      }

      // Auto micro-shift for optical centering on mobile only (not stacked)
      if (logoTitle) {
        // apply a slightly stronger fraction of the left group width, clamped to 0–10px
        const shouldShift = vw <= 600 && vw > 360;
        const shiftPx = shouldShift ? Math.min(10, Math.max(0, Math.round(width * 0.1))) : 0;
        logoTitle.style.setProperty('--title-shift-x', shiftPx + 'px');
      }
    });
  }
  function schedule() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(setSpace);
  }
  const ro = new ResizeObserver(schedule);
  const mo = new MutationObserver(schedule);
  function init() {
    document.querySelectorAll('.responsive-header .header-actions').forEach((el) => {
      ro.observe(el);
      mo.observe(el, { attributes: true, childList: true, subtree: true });
    });
    schedule();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.addEventListener('resize', schedule);
})();
