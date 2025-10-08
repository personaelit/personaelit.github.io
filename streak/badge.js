// ======================= BadgeManager =======================
// Drop-in app-badge + favicon-badge abstraction for Streak
// Usage:
//   await BadgeManager.init();
//   BadgeManager.set(remaining); // number >= 0
//   BadgeManager.clear();

const BadgeManager = (() => {
  const BADGE_MAX = 99;

  // ---- state ----
  let _supportsAppBadge = false;
  let _isStandalone = false;
  let _origFaviconHref = null;
  let _faviconSelector = 'link[rel="icon"]';

  async function init(opts = {}) {
    _faviconSelector = opts.faviconSelector || _faviconSelector;

    // Detect app-badge availability
    _supportsAppBadge = 'setAppBadge' in navigator || 'setExperimentalAppBadge' in navigator;
    _isStandalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      // legacy iOS
      (typeof navigator.standalone !== 'undefined' && navigator.standalone === true);

    // Don’t auto-prompt; but if API exists on iOS, badges often respect notif permission.
    // If you want, you can call requestPermission() yourself from a user gesture.
    return true;
  }

  async function requestPermission() {
    if (!('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'default') {
      try { return await Notification.requestPermission(); } catch { /* ignore */ }
    }
    return Notification.permission;
  }

  async function set(n) {
    const count = Math.max(0, Number.isFinite(n) ? Math.floor(n) : 0);

    // Prefer native App Badge when running as an installed PWA
    if (_supportsAppBadge && _isStandalone) {
      try {
        const api = navigator.setAppBadge ? navigator : navigator.setExperimentalAppBadge ? navigator : null;
        if (api) {
          if (count > 0) {
            await api.setAppBadge(Math.min(count, BADGE_MAX));
          } else {
            await clear(); // clears native + favicon
            return;
          }
        }
      } catch { /* fall through to favicon */ }
    }

    // Always keep favicon badge in sync as a universal fallback
    await updateFaviconBadge(count);
  }

  async function clear() {
    if (_supportsAppBadge && _isStandalone) {
      try {
        if (navigator.clearAppBadge) await navigator.clearAppBadge();
        else if (navigator.setExperimentalAppBadge) await navigator.setExperimentalAppBadge(0);
      } catch { /* ignore */ }
    }
    await updateFaviconBadge(0);
  }

  // ---- Favicon badge (fallback) ----
  function getFaviconLink() {
    let link = document.querySelector(_faviconSelector);
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      document.head.appendChild(link);
    }
    return link;
  }

  function ensureBaseFavicon(link) {
    if (_origFaviconHref) return _origFaviconHref;
    _origFaviconHref = link.href || makeBlankFavicon(link);
    return _origFaviconHref;
  }

  function makeBlankFavicon(link) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#0f172a'; // Streak bg
    ctx.fillRect(0, 0, 64, 64);
    link.href = c.toDataURL('image/png');
    return link.href;
  }

  async function updateFaviconBadge(count) {
    const link = getFaviconLink();
    if (!link) return;
    const base = ensureBaseFavicon(link);

    if (count <= 0) {
      link.href = _origFaviconHref;
      return;
    }

    const cap = count > BADGE_MAX ? '99+' : String(count);
    const dataUrl = await generateFaviconBadge(base, cap);
    link.href = dataUrl;
  }

  function generateFaviconBadge(src, text) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const size = 64;
        const cvs = document.createElement('canvas');
        cvs.width = cvs.height = size;
        const ctx = cvs.getContext('2d');

        // Base icon
        ctx.drawImage(img, 0, 0, size, size);

        // Red badge circle (top-right)
        const r = 18, x = size - r + 4, y = r - 4;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = '#e11d48'; // rose-ish
        ctx.fill();

        // Text
        ctx.font = 'bold 26px system-ui, -apple-system, Segoe UI, Roboto';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText(text, x, y + 1);

        resolve(cvs.toDataURL('image/png'));
      };
      img.onerror = () => resolve(src);
      img.src = src;
    });
  }

  return { init, set, clear, requestPermission };
})();
