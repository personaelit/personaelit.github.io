function linkify(text) {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped.replace(/(https?:\/\/[^\s]+)/g, url =>
    `<a href="${url}" target="_blank" onclick="event.stopPropagation()">${url}</a>`
  );
}

export function saveBlocks() {
  const blocks = [...document.querySelectorAll('.block')].map(b => ({
    x: parseFloat(b.style.left), y: parseFloat(b.style.top),
    title: b.querySelector('.block-title').textContent,
    content: b.querySelector('.block-content').textContent,
    created: b.querySelector('.block-date').textContent.replace('Created: ', '')
  }));
  localStorage.setItem('stickyBlocks', JSON.stringify(blocks));
}

export function createBlock(data = null) {
  const block = document.createElement('div');
  block.className = 'block';
  block.style.left = (data?.x || Math.random() * window.innerWidth * 0.6) + 'px';
  block.style.top  = (data?.y || Math.random() * window.innerHeight * 0.6) + 'px';

  const title = document.createElement('div');
  title.className = 'block-title';
  title.textContent = data?.title || 'Title...';
  title.contentEditable = true;
  title.addEventListener('input', saveBlocks);
  block.appendChild(title);

  const content = document.createElement('div');
  content.className = 'block-content';
  content.innerHTML = linkify(data?.content || 'Content...');
  content.contentEditable = true;
  content.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'A') { e.preventDefault(); e.stopPropagation(); window.open(e.target.href, '_blank'); }
  });
  content.addEventListener('focus', () => { content.textContent = content.textContent; });
  content.addEventListener('blur', () => { content.innerHTML = linkify(content.textContent); saveBlocks(); });
  content.addEventListener('input', saveBlocks);
  block.appendChild(content);

  const deleteBtn = document.createElement('a');
  deleteBtn.className = 'delete-btn'; deleteBtn.textContent = 'X';
  deleteBtn.style.marginRight = '10px';
  deleteBtn.onclick = () => { block.remove(); saveBlocks(); };
  block.appendChild(deleteBtn);

  const date = document.createElement('div');
  date.className = 'block-date';
  date.textContent = 'Created: ' + (data?.created || new Date().toLocaleString());
  block.appendChild(date);

  document.body.appendChild(block);
  block.onmousedown = function (e) {
    if (e.target.className && String(e.target.className).includes('delete-btn')) return;
    if (e.target.tagName === 'A') return;
    let offsetX = e.clientX - block.getBoundingClientRect().left;
    let offsetY = e.clientY - block.getBoundingClientRect().top;
    document.onmousemove = function (e) {
      block.style.left = e.clientX - offsetX + 'px';
      block.style.top  = e.clientY - offsetY + 'px';
    };
    document.onmouseup = () => { document.onmousemove = null; document.onmouseup = null; saveBlocks(); };
  };
}

export function loadBlocks() {
  JSON.parse(localStorage.getItem('stickyBlocks') || '[]').forEach(createBlock);
}
