import { hostnameFromUrl, generateAvatarDataURL } from './avatar.js';

const LINKS_KEY = 'quickLinks';
const SEARCH_KEY = 'recentSearches';
let dragSrcIndex = null;

export function saveRecentSearch(query) {
  let history = JSON.parse(localStorage.getItem(SEARCH_KEY)) || [];
  history = [query, ...history.filter(s => s !== query)].slice(0, 10);
  localStorage.setItem(SEARCH_KEY, JSON.stringify(history));
  renderRecentSearches();
}

export function renderRecentSearches() {
  const container = document.getElementById('recentSearches');
  const history = JSON.parse(localStorage.getItem(SEARCH_KEY)) || [];
  if (history.length === 0) { container.innerHTML = ''; return; }
  container.innerHTML = `<strong>Recent Searches:</strong> ${history.map(query =>
    `<a href="#" onclick="execSearch('${query.replace(/'/g, "\\'")}');return false;">${query}</a>`
  ).join(' • ')}`;
}

function getFavicon(hostname) {
  return `https://${hostname}/favicon.ico`;
}

export function loadLinks() {
  renderLinks(JSON.parse(localStorage.getItem(LINKS_KEY)) || []);
}

export function renderLinks(links) {
  const container = document.getElementById('quickLinksContainer');
  container.innerHTML = '';
  links.forEach((link, i) => {
    const div = document.createElement('div');
    div.className = 'quick-link';
    div.draggable = true;

    div.addEventListener('dragstart', (e) => {
      dragSrcIndex = i;
      e.dataTransfer.effectAllowed = 'move';
      requestAnimationFrame(() => div.classList.add('dragging'));
    });
    div.addEventListener('dragend', () => {
      div.classList.remove('dragging');
      container.querySelectorAll('.quick-link').forEach(el => el.classList.remove('drag-over'));
    });
    div.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (dragSrcIndex !== i) div.classList.add('drag-over');
    });
    div.addEventListener('dragleave', () => div.classList.remove('drag-over'));
    div.addEventListener('drop', (e) => {
      e.preventDefault();
      if (dragSrcIndex === null || dragSrcIndex === i) return;
      const updated = JSON.parse(localStorage.getItem(LINKS_KEY)) || [];
      const [moved] = updated.splice(dragSrcIndex, 1);
      updated.splice(i, 0, moved);
      localStorage.setItem(LINKS_KEY, JSON.stringify(updated));
      dragSrcIndex = null;
      renderLinks(updated);
    });

    const handle = document.createElement('span');
    handle.className = 'drag-handle';
    handle.textContent = '⋮⋮';
    handle.title = 'Drag to reorder';

    const a = document.createElement('a');
    a.href = link.url;
    a.draggable = false;
    const info = document.createElement('div');
    info.className = 'link-info';
    const img = document.createElement('img');
    img.alt = 'icon'; img.referrerPolicy = 'no-referrer';
    img.src = link.favicon || getFavicon(hostnameFromUrl(link.url));
    img.onerror = () => {
      img.onerror = () => { img.onerror = null; img.src = generateAvatarDataURL(link.text || hostnameFromUrl(link.url), 22); };
      img.src = `https://www.google.com/s2/favicons?domain=${hostnameFromUrl(link.url)}&sz=32`;
    };
    const text = document.createElement('span');
    text.textContent = link.text;
    info.appendChild(img); info.appendChild(text); a.appendChild(info);

    const del = document.createElement('button');
    del.className = 'delete-btn'; del.textContent = '✕';
    del.onclick = () => deleteLink(i);

    div.appendChild(handle); div.appendChild(a); div.appendChild(del);
    container.appendChild(div);
  });
}

export function openModal() { document.getElementById('linkModal').style.display = 'flex'; }
export function closeModal() { document.getElementById('linkModal').style.display = 'none'; }

export function saveLink() {
  const url = document.getElementById('linkUrl').value.trim();
  const text = document.getElementById('linkText').value.trim();
  const favicon = document.getElementById('linkFavicon').value.trim();
  if (!url || !text) return alert('URL and Text are required.');
  const links = JSON.parse(localStorage.getItem(LINKS_KEY)) || [];
  links.push({ url, text, favicon });
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
  closeModal(); renderLinks(links);
}

export function deleteLink(index) {
  const links = JSON.parse(localStorage.getItem(LINKS_KEY)) || [];
  links.splice(index, 1);
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
  renderLinks(links);
}

export function execSearch(searchQuery) {
  const query = searchQuery || document.getElementById('search').value.trim();
  if (!query) return;
  let url;
  if (query.includes('!p ')) {
    url = `https://www.perplexity.ai/search?q=${encodeURIComponent(query.replace('!p ', '').trim())}`;
  } else if (query.includes('!s')) {
    url = `https://www.stayonline.com/pc_combined_results.asp?search_prod=(searchlike~p.sku~${encodeURIComponent(query.replace('!s ', '').trim())})`;
  } else {
    url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }
  saveRecentSearch(query);
  window.location = url;
}
