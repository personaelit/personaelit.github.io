export function hostnameFromUrl(url) {
  try { return new URL(url).hostname; }
  catch { return location.hostname; }
}

export function pickColorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 65%, 55%)`;
}

export function generateAvatarDataURL(label, size = 64) {
  const initial = (label[0] || '•').toUpperCase();
  const bg = pickColorFromString(label);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <defs><filter id="s"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.2"/></filter></defs>
    <circle cx="${size/2}" cy="${size/2}" r="${size/2-2}" fill="${bg}" filter="url(#s)"/>
    <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
      font-family="Inter,Segoe UI,Arial" font-size="${size*0.52}" fill="#fff">${initial}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

export function ensurePageFavicon() {
  const link = document.getElementById('page-favicon');
  if (!link || !link.href) return;
  const testImg = new Image();
  testImg.onerror = () => { link.href = generateAvatarDataURL(location.hostname || 'site', 64); };
  testImg.src = link.href;
}
