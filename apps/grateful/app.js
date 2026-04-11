// ═══════════════════════════════════════════
// PUSH CONFIGURATION
// Set these after deploying the worker — see workers/grateful-push/SETUP.md
// ═══════════════════════════════════════════

const PUSH_SERVER_URL = 'https://grateful-push.james-smits.workers.dev';
const VAPID_PUBLIC_KEY = 'BA0HcwyMxXf4foYG-UGjpMA93TynghGau6qJdFERKF9fn7GsiBrVq1IejIviSVgsZKCqICjvkQ2KWLSTEy6LqYY';

// ═══════════════════════════════════════════
// SERVICE WORKER
// ═══════════════════════════════════════════

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/apps/grateful/sw.js')
    .catch(err => console.warn('SW registration failed:', err));
}

// ═══════════════════════════════════════════
// SEED DATA
// ═══════════════════════════════════════════

const SEED_PROMPTS = [
  'One good thing that happened to me today…',
  'Something good that I saw someone do…',
  'Today I had fun when…',
  'Something I accomplished today…',
  'Something funny that happened today…',
  'Someone I was thankful for today…',
  'Today I smiled when…',
  'Something about today I\'ll always want to remember…',
  'Today was special because…',
  'Today I was proud of myself because…',
  'Something small that made today better…',
  'A moment I felt at peace today…',
  'Something I learned about myself today…',
  'A challenge I handled well today…',
  'Something I\'m looking forward to tomorrow…',
];

const SEED_TAGS = [
  'family', 'friends', 'nature', 'health', 'gratitude',
  'work', 'growth', 'learning', 'kindness', 'love',
  'peace', 'joy', 'creativity', 'mindfulness', 'community',
  'opportunity', 'resilience', 'achievement', 'simplethings', 'reflection',
];

const ENCOURAGING_MESSAGES = [
  'You showed up today, {name}.',
  '{name}, this habit is starting to stick.',
  'That\'s a win, {name}.',
  '{name}, you\'re building something that lasts.',
  'One step forward today, {name}.',
  '{name}, this kind of consistency adds up.',
  'You made time for yourself, {name}.',
  '{name}, keep the momentum going.',
  'Small actions, real impact — nice work, {name}.',
  '{name}, you\'re doing better than you think.',
  'Another entry in the books, {name}.',
  '{name}, this is how change happens.',
  'You kept the promise to yourself today, {name}.',
  '{name}, progress looks good on you.',
  'Bit by bit, {name}, you\'re getting there.',
];

const MOOD_EMOJIS = ['😞', '😕', '😐', '🙂', '😄'];

// ═══════════════════════════════════════════
// STORAGE KEYS
// ═══════════════════════════════════════════

const KEYS = {
  SETTINGS:  'grateful_settings',
  PROMPTS:   'grateful_prompts',
  TAGS:      'grateful_tags',
  ENTRIES:   'grateful_entries',
  STREAK:    'grateful_streak',
  CLIENT_ID: 'grateful_client_id',
};

// ═══════════════════════════════════════════
// STORAGE LAYER
// ═══════════════════════════════════════════

/** @param {string} key @param {*} fallback */
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/** @param {string} key @param {*} value */
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Client identity — stable anonymous ID scoped to this device/browser

/** @returns {string} UUID persisted in localStorage */
function getOrCreateClientId() {
  let id = localStorage.getItem(KEYS.CLIENT_ID);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEYS.CLIENT_ID, id);
  }
  return id;
}

// Settings

/** @returns {{ name: string, dob: string|null, reminderTime: string|null, notificationsEnabled: boolean, colorScheme: string }} */
function getSettings() {
  return load(KEYS.SETTINGS, {
    name: '',
    dob: null,
    reminderTime: null,
    notificationsEnabled: false,
    colorScheme: 'system',
  });
}

/** @param {object} patch */
function saveSettings(patch) {
  save(KEYS.SETTINGS, { ...getSettings(), ...patch });
}

// Prompts

/** @returns {string[]} */
function getPrompts() {
  return load(KEYS.PROMPTS, SEED_PROMPTS);
}

/** @param {string[]} prompts */
function savePrompts(prompts) {
  save(KEYS.PROMPTS, prompts);
}

function restoreDefaultPrompts() {
  save(KEYS.PROMPTS, SEED_PROMPTS);
}

// Tags

/** @returns {string[]} */
function getTags() {
  return load(KEYS.TAGS, SEED_TAGS);
}

/** @param {string[]} tags */
function saveTags(tags) {
  save(KEYS.TAGS, tags);
}

function restoreDefaultTags() {
  save(KEYS.TAGS, SEED_TAGS);
}

// Entries

/** @returns {Object.<string, object>} */
function getAllEntries() {
  return load(KEYS.ENTRIES, {});
}

/** @param {string} date YYYY-MM-DD */
function getEntry(date) {
  return getAllEntries()[date] ?? null;
}

/** @param {string} date @param {object} patch */
function saveEntry(date, patch) {
  const entries = getAllEntries();
  entries[date] = { ...entries[date], ...patch };
  save(KEYS.ENTRIES, entries);
}

/** @param {string} date */
function deleteEntry(date) {
  const entries = getAllEntries();
  delete entries[date];
  save(KEYS.ENTRIES, entries);
}

// Streak

/** @returns {{ current: number, longest: number, lastCompletedDate: string|null }} */
function getStreak() {
  return load(KEYS.STREAK, {
    current: 0,
    longest: 0,
    lastCompletedDate: null,
  });
}

/** @param {object} patch */
function saveStreak(patch) {
  save(KEYS.STREAK, { ...getStreak(), ...patch });
}

// ═══════════════════════════════════════════
// DATE UTILITIES
// ═══════════════════════════════════════════

/** @param {Date} d @returns {string} YYYY-MM-DD in local time */
function formatDateLocal(d) {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

/** Returns today as YYYY-MM-DD in local time. */
function today() {
  return formatDateLocal(new Date());
}

/** Returns YYYY-MM-DD for N days ago (negative = future). */
function dateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return formatDateLocal(d);
}

/** Returns the day-of-week abbreviation for a YYYY-MM-DD string. */
function dayLabel(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Returns the current entry step based on saved data.
 * 0-2 = gratitude prompt index, 3 = mood, 'done' = completed.
 * @param {object|null} entry
 */
function entryStep(entry) {
  if (!entry) return 0;
  if (entry.completed) return 'done';
  if ((entry.grateful?.length ?? 0) >= 3) return 3; // mood
  return entry.grateful?.length ?? 0;
}

/**
 * Checks if today is the user's birthday.
 * @param {string|null} dob  YYYY-MM-DD
 */
function isBirthday(dob) {
  if (!dob) return false;
  const now = new Date();
  const [, mm, dd] = dob.split('-');
  return String(now.getMonth() + 1).padStart(2, '0') === mm
      && String(now.getDate()).padStart(2, '0') === dd;
}

// ═══════════════════════════════════════════
// STREAK LOGIC
// ═══════════════════════════════════════════

/**
 * Called when a day is completed. Increments or resets streak.
 */
function recordStreakCompletion() {
  const streak = getStreak();
  const yesterday = dateOffset(-1);

  let current;
  if (streak.lastCompletedDate === yesterday) {
    current = streak.current + 1;           // continuing streak
  } else if (streak.lastCompletedDate === today()) {
    return;                                  // already recorded today
  } else {
    current = 1;                             // streak broken, restart
  }

  saveStreak({
    current,
    longest: Math.max(streak.longest, current),
    lastCompletedDate: today(),
  });
}

/**
 * On launch, resets streak to 0 if more than one day has been missed.
 */
function checkStreakDecay() {
  const streak = getStreak();
  if (!streak.lastCompletedDate) return;
  const yesterday = dateOffset(-1);
  if (streak.lastCompletedDate !== yesterday && streak.lastCompletedDate !== today()) {
    saveStreak({ current: 0 });
  }
}

// ═══════════════════════════════════════════
// ENCOURAGING MESSAGE
// ═══════════════════════════════════════════

/** Returns a random encouraging message with name interpolated. */
function encouragingMessage() {
  const { name } = getSettings();
  const msg = ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)];
  return msg.replace(/{name}/g, name || 'friend');
}

// ═══════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════

/** Applies the user's colour-scheme preference to <html data-theme>. */
function applyTheme(scheme) {
  if (scheme === 'system') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', scheme);
  }
}

/** Returns 'dark' or 'light' accounting for any manual override. */
function getEffectiveTheme() {
  const { colorScheme } = getSettings();
  if (colorScheme === 'dark')  return 'dark';
  if (colorScheme === 'light') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// ═══════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════

/** @param {string} screenId  e.g. 'daily', 'history', 'viz', 'settings' */
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => {
    const isActive = btn.dataset.screen === screenId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
  document.getElementById(`screen-${screenId}`)?.classList.add('active');
}

/** @param {string} viewId  e.g. 'view-entry', 'view-mood' */
function showView(viewId) {
  document.querySelectorAll('#screen-daily .view').forEach(el => el.classList.remove('active'));
  document.getElementById(viewId)?.classList.add('active');
}

function initNav() {
  document.getElementById('nav-bar').addEventListener('click', e => {
    const btn = e.target.closest('.nav-btn');
    if (!btn) return;
    const screen = btn.dataset.screen;
    showScreen(screen);
    if (screen === 'history')  { histPage = 0; renderHistory(); }
    if (screen === 'viz')      renderViz();
    if (screen === 'settings') renderSettings();
    if (screen === 'about')    renderAbout();
  });
}

// ═══════════════════════════════════════════
// IMPORT / EXPORT
// ═══════════════════════════════════════════

function exportData() {
  const data = {
    exported: new Date().toISOString(),
    settings: getSettings(),
    prompts:  getPrompts(),
    tags:     getTags(),
    entries:  getAllEntries(),
    streak:   getStreak(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: `grateful-export-${today()}.json`,
  });
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * @param {File} file
 * @param {'merge'|'replace'} mode
 */
function importData(file, mode) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (mode === 'replace') {
        if (data.settings) save(KEYS.SETTINGS, data.settings);
        if (data.prompts)  save(KEYS.PROMPTS,  data.prompts);
        if (data.tags)     save(KEYS.TAGS,      data.tags);
        if (data.entries)  save(KEYS.ENTRIES,   data.entries);
        if (data.streak)   save(KEYS.STREAK,    data.streak);
      } else {
        // Merge: incoming entries fill gaps, existing entries win conflicts
        if (data.entries) {
          const existing = getAllEntries();
          save(KEYS.ENTRIES, { ...data.entries, ...existing });
        }
        if (data.prompts) save(KEYS.PROMPTS, [...new Set([...getPrompts(), ...data.prompts])]);
        if (data.tags)    save(KEYS.TAGS,    [...new Set([...getTags(),    ...data.tags])]);
      }
      bootstrap(); // re-evaluate state after import
    } catch {
      alert('Could not read the file. Make sure it\'s a valid Grateful export.');
    }
  };
  reader.readAsText(file);
}

// ═══════════════════════════════════════════
// BIRTHDAY STATS
// ═══════════════════════════════════════════

/**
 * Summarises the last 365 days (or all available data) for the birthday modal.
 */
function getBirthdayStats() {
  const entries = Object.values(getAllEntries()).filter(e => e.completed);
  const cutoff = dateOffset(-365);
  const yearEntries = entries.filter(e => e.date >= cutoff);
  const pool = yearEntries.length > 0 ? yearEntries : entries;

  const tagCounts = {};
  const greatMoodEntries = [];

  for (const entry of pool) {
    for (const g of entry.grateful ?? []) {
      for (const tag of g.tags ?? []) {
        tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
      }
    }
    if (entry.mood >= 4) greatMoodEntries.push(entry);
  }

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);

  const avgMood = pool.length
    ? (pool.reduce((sum, e) => sum + (e.mood ?? 0), 0) / pool.length).toFixed(1)
    : null;

  const sampleEntries = greatMoodEntries
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return {
    daysRecorded: pool.length,
    topTags,
    avgMood,
    sampleEntries,
  };
}

// ═══════════════════════════════════════════
// BOOTSTRAP
// ═══════════════════════════════════════════

/**
 * Determines which screen/view to show on launch.
 * Render functions for each view are stubs — filled in subsequent steps.
 */
let navInitialised = false;

function bootstrap() {
  applyTheme(getSettings().colorScheme ?? 'system');
  checkStreakDecay();
  if (!navInitialised) { initNav(); navInitialised = true; }

  const settings = getSettings();

  // First run — no name saved yet
  if (!settings.name) {
    showScreen('daily');
    showView('view-firstrun-name');
    renderFirstRunName();
    return;
  }

  // Birthday check
  if (isBirthday(settings.dob)) {
    showScreen('daily');
    renderBirthdayModal();
  }

  // Determine daily state
  const dateKey = today();
  const entry = getEntry(dateKey);
  const step = entryStep(entry);

  showScreen('daily');

  if (step === 'done') {
    showView('view-done');
    renderDone();
  } else if (step === 3) {
    showView('view-mood');
    renderMood();
  } else {
    showView('view-entry');
    renderEntry(step);
  }
}

// ═══════════════════════════════════════════
// UI STATE
// ═══════════════════════════════════════════

let promptIndex = 0;
let selectedTags = [];

// ═══════════════════════════════════════════
// RENDER HELPERS
// ═══════════════════════════════════════════

/** @param {string} str */
function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Returns an entry skeleton for today if none exists. */
function getOrCreateEntry(dateKey) {
  return getEntry(dateKey) ?? {
    date: dateKey,
    grateful: [],
    draftText: '',
    draftPrompt: '',
    draftTags: [],
    mood: null,
    completed: false,
    completedAt: null,
  };
}

/** Builds the 7-day streak dot HTML. */
function buildStreakDots() {
  const entries = getAllEntries();
  const dots = [];
  for (let i = 6; i >= 0; i--) {
    const date = dateOffset(-i);
    const label = dayLabel(date);
    const done = entries[date]?.completed;
    const isToday = i === 0;
    dots.push(`<div class="streak-dot${done ? ' completed' : ''}${isToday ? ' today' : ''}"
      aria-label="${label}${done ? ' — completed' : ''}">${label.charAt(0)}</div>`);
  }
  return `<div class="streak-dots" role="img" aria-label="Last 7 days">${dots.join('')}</div>`;
}

/** Fires confetti unless the user prefers reduced motion. */
function showConfetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#7c9a7e', '#c8deca', '#5ab88a', '#f0e68c'],
  });
}

// ═══════════════════════════════════════════
// PROMPT MODAL
// ═══════════════════════════════════════════

/** @param {'add'|'edit'} mode @param {string[]} prompts @param {number} idx @param {Function} onDone */
function showPromptModal(mode, prompts, idx, onDone) {
  const isAdd = mode === 'add';
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="pm-title">
      <h3 id="pm-title">${isAdd ? 'Add Prompt' : 'Edit Prompt'}</h3>
      <textarea id="pm-input" class="input" rows="3" maxlength="200"
        placeholder="Write a prompt…" aria-label="Prompt text"></textarea>
      <div class="stack gap-md">
        <button id="pm-save" class="btn btn-primary">${isAdd ? 'Add' : 'Save'}</button>
        <button id="pm-cancel" class="btn btn-ghost">Cancel</button>
      </div>
    </div>`;

  const input = overlay.querySelector('#pm-input');
  if (!isAdd) input.value = prompts[idx];

  overlay.querySelector('#pm-save').addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    const updated = [...prompts];
    if (isAdd) { updated.push(text); promptIndex = updated.length - 1; }
    else        { updated[idx] = text; }
    savePrompts(updated);
    overlay.remove();
    onDone();
  });
  overlay.querySelector('#pm-cancel').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  input.focus();
}

// ═══════════════════════════════════════════
// TAG MODAL
// ═══════════════════════════════════════════

/** @param {Function} onDone — called after any change so the entry view refreshes its tag pills */
function showTagModal(onDone) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="tm-title">
      <h3 id="tm-title">Manage Tags</h3>
      <div id="tm-list" class="stack gap-sm modal-list"></div>
      <div class="row">
        <input id="tm-input" class="input" type="text" placeholder="New tag…" maxlength="30">
        <button id="tm-add" class="btn btn-primary btn-icon">Add</button>
      </div>
      <button id="tm-close" class="btn btn-ghost">Done</button>
    </div>`;

  const listEl = overlay.querySelector('#tm-list');

  const refresh = () => {
    listEl.innerHTML = getTags().map((tag, i) => `
      <div class="row">
        <span class="flex-1">#${escHtml(tag)}</span>
        <button class="btn btn-ghost btn-xs tm-edit" data-i="${i}">Edit</button>
        <button class="btn btn-ghost btn-xs btn-danger tm-del" data-i="${i}">✕</button>
      </div>`).join('');

    listEl.querySelectorAll('.tm-del').forEach(btn => {
      btn.addEventListener('click', () => {
        const tags = getTags();
        if (!confirm(`Delete tag #${tags[parseInt(btn.dataset.i, 10)]}?`)) return;
        tags.splice(parseInt(btn.dataset.i, 10), 1);
        saveTags(tags);
        selectedTags = selectedTags.filter(t => tags.includes(t));
        refresh(); onDone();
      });
    });
    listEl.querySelectorAll('.tm-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const tags = getTags();
        const i = parseInt(btn.dataset.i, 10);
        const val = prompt('Edit tag:', tags[i])?.trim().replace(/^#/, '').toLowerCase();
        if (!val) return;
        tags[i] = val;
        saveTags(tags);
        refresh(); onDone();
      });
    });
  };

  refresh();

  const tagInput = overlay.querySelector('#tm-input');
  overlay.querySelector('#tm-add').addEventListener('click', () => {
    const val = tagInput.value.trim().replace(/^#/, '').toLowerCase();
    if (!val) return;
    const tags = getTags();
    if (!tags.includes(val)) { tags.push(val); saveTags(tags); refresh(); onDone(); }
    tagInput.value = '';
    tagInput.focus();
  });
  overlay.querySelector('#tm-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

// ═══════════════════════════════════════════
// RENDER: FIRST RUN — NAME
// ═══════════════════════════════════════════

function renderFirstRunName() {
  const el = document.getElementById('view-firstrun-name');
  el.innerHTML = `
    <div class="stack gap-lg view-body">
      <h1 class="text-center text-2xl">Welcome to<br>Grateful 🌿</h1>
      <p class="text-center text-muted">A small daily habit with a big impact.</p>
      <div class="stack gap-md mt-xl">
        <label class="section-label" for="fn-name">What's your name?</label>
        <input id="fn-name" class="input" type="text" placeholder="Your name"
          autocomplete="given-name" maxlength="50">
      </div>
    </div>
    <div class="stack gap-md mt-auto">
      <button id="fn-continue" class="btn btn-primary" disabled>Continue</button>
    </div>`;

  const input = el.querySelector('#fn-name');
  const btn   = el.querySelector('#fn-continue');

  input.addEventListener('input', () => { btn.disabled = !input.value.trim(); });
  btn.addEventListener('click', () => {
    const name = input.value.trim();
    if (!name) return;
    saveSettings({ name });
    showView('view-firstrun-dob');
    renderFirstRunDob();
  });
  input.focus();
}

// ═══════════════════════════════════════════
// RENDER: FIRST RUN — DOB
// ═══════════════════════════════════════════

function renderFirstRunDob() {
  const { name } = getSettings();
  const el = document.getElementById('view-firstrun-dob');
  el.innerHTML = `
    <div class="stack gap-lg view-body">
      <h2 class="text-center text-xl">
        Nice to meet you, <span id="fd-name"></span>!
      </h2>
      <p class="text-center text-muted">
        Add your birthday and we'll celebrate with you each year.
      </p>
      <div class="stack gap-md mt-xl">
        <label class="section-label" for="fd-dob">Date of birth <span class="text-muted">(optional)</span></label>
        <input id="fd-dob" class="input" type="date">
      </div>
    </div>
    <div class="stack gap-md mt-auto">
      <button id="fd-continue" class="btn btn-primary">Continue</button>
      <button id="fd-skip"     class="btn btn-ghost">Skip</button>
    </div>`;

  el.querySelector('#fd-name').textContent = name;

  const proceed = dob => {
    saveSettings({ dob: dob || null });
    showView('view-entry');
    renderEntry(0);
  };

  el.querySelector('#fd-continue').addEventListener('click', () =>
    proceed(el.querySelector('#fd-dob').value));
  el.querySelector('#fd-skip').addEventListener('click', () => proceed(null));
}

// ═══════════════════════════════════════════
// RENDER: GRATITUDE ENTRY  (steps 0 / 1 / 2)
// ═══════════════════════════════════════════

function renderEntry(step) {
  const el      = document.getElementById('view-entry');
  const dateKey = today();
  const entry   = getOrCreateEntry(dateKey);
  const prompts = getPrompts();

  // Pick starting prompt
  if (entry.draftPrompt) {
    const i = prompts.indexOf(entry.draftPrompt);
    promptIndex = i >= 0 ? i : Math.floor(Math.random() * prompts.length);
  } else {
    promptIndex = Math.floor(Math.random() * prompts.length);
  }

  // Restore selected tags from draft
  selectedTags = [...(entry.draftTags ?? [])];

  el.innerHTML = `
    <div class="stack gap-lg flex-1">
      <p class="text-center text-muted text-sm">${step + 1} of 3</p>

      <!-- Prompt chooser -->
      <div class="stack gap-sm">
        <span class="section-label">I'm grateful for…</span>
        <div class="row">
          <button id="btn-prev-p" class="btn btn-ghost btn-sm" aria-label="Previous prompt">‹</button>
          <p id="prompt-text" class="prompt-text"></p>
          <button id="btn-next-p" class="btn btn-ghost btn-sm" aria-label="Next prompt">›</button>
        </div>
        <div class="row-center">
          <button id="btn-add-p"  class="btn btn-ghost btn-xs">+ Add</button>
          <button id="btn-edit-p" class="btn btn-ghost btn-xs">Edit</button>
          <button id="btn-del-p"  class="btn btn-ghost btn-xs btn-danger">Delete</button>
        </div>
      </div>

      <!-- Entry text -->
      <textarea id="entry-text" class="input" rows="4"
        placeholder="Write anything…" aria-label="Gratitude entry"></textarea>

      <!-- Tags -->
      <div class="stack gap-sm">
        <div class="row-between">
          <span class="section-label">Tags</span>
          <button id="btn-manage-tags" class="link-muted" aria-label="Manage tags">Manage</button>
        </div>
        <div id="tag-list" class="tag-list" role="group" aria-label="Select tags"></div>
      </div>
    </div>

    <div class="stack gap-md mt-auto">
      <button id="btn-entry-action" class="btn btn-primary">${step < 2 ? 'Next' : 'Submit'}</button>
    </div>`;

  // ── Prompt display & auto-save ───────────────────────────────────────────
  const promptEl = el.querySelector('#prompt-text');

  const syncPrompt = () => {
    promptEl.textContent = prompts[promptIndex] ?? '';
    saveEntry(dateKey, { ...getOrCreateEntry(dateKey), draftPrompt: prompts[promptIndex] });
  };
  syncPrompt();

  el.querySelector('#btn-prev-p').addEventListener('click', () => {
    promptIndex = (promptIndex - 1 + getPrompts().length) % getPrompts().length;
    syncPrompt();
  });
  el.querySelector('#btn-next-p').addEventListener('click', () => {
    promptIndex = (promptIndex + 1) % getPrompts().length;
    syncPrompt();
  });
  el.querySelector('#btn-add-p').addEventListener('click', () =>
    showPromptModal('add', getPrompts(), promptIndex, () => {
      promptEl.textContent = getPrompts()[promptIndex] ?? '';
    }));
  el.querySelector('#btn-edit-p').addEventListener('click', () =>
    showPromptModal('edit', getPrompts(), promptIndex, () => {
      promptEl.textContent = getPrompts()[promptIndex] ?? '';
    }));
  el.querySelector('#btn-del-p').addEventListener('click', () => {
    const ps = getPrompts();
    if (ps.length <= 1) return;
    if (!confirm('Delete this prompt?')) return;
    const updated = ps.filter((_, i) => i !== promptIndex);
    savePrompts(updated);
    promptIndex = Math.min(promptIndex, updated.length - 1);
    renderEntry(step); // full re-render to update closure over prompts
  });

  // ── Textarea ──────────────────────────────────────────────────────────────
  const textarea = el.querySelector('#entry-text');
  textarea.value = entry.draftText ?? '';
  textarea.addEventListener('input', () =>
    saveEntry(dateKey, { ...getOrCreateEntry(dateKey), draftText: textarea.value }));
  textarea.focus();

  // ── Tags ──────────────────────────────────────────────────────────────────
  const renderTagPills = () => {
    const listEl = el.querySelector('#tag-list');
    listEl.innerHTML = '';
    getTags().forEach(tag => {
      const btn = document.createElement('button');
      btn.className = `tag${selectedTags.includes(tag) ? ' selected' : ''}`;
      btn.textContent = `#${tag}`;
      btn.setAttribute('aria-pressed', String(selectedTags.includes(tag)));
      btn.addEventListener('click', () => {
        selectedTags = selectedTags.includes(tag)
          ? selectedTags.filter(t => t !== tag)
          : [...selectedTags, tag];
        saveEntry(dateKey, { ...getOrCreateEntry(dateKey), draftTags: selectedTags });
        btn.classList.toggle('selected', selectedTags.includes(tag));
        btn.setAttribute('aria-pressed', String(selectedTags.includes(tag)));
      });
      listEl.appendChild(btn);
    });
  };
  renderTagPills();

  el.querySelector('#btn-manage-tags').addEventListener('click', () =>
    showTagModal(renderTagPills));

  // ── Next / Submit ─────────────────────────────────────────────────────────
  el.querySelector('#btn-entry-action').addEventListener('click', () => {
    if (!textarea.value.trim()) {
      textarea.focus();
      return;
    }
    const current = getOrCreateEntry(dateKey);
    const item = {
      prompt: getPrompts()[promptIndex] ?? '',
      text:   textarea.value.trim(),
      tags:   [...selectedTags],
    };
    saveEntry(dateKey, {
      ...current,
      grateful:     [...current.grateful, item],
      draftText:    '',
      draftPrompt:  '',
      draftTags:    [],
    });
    selectedTags = [];

    if (step < 2) {
      renderEntry(step + 1);
    } else {
      showView('view-mood');
      renderMood();
    }
  });
}

// ═══════════════════════════════════════════
// RENDER: MOOD
// ═══════════════════════════════════════════

function renderMood() {
  const el = document.getElementById('view-mood');
  el.innerHTML = `
    <div class="stack gap-xl view-body">
      <h2 class="text-center text-xl">How are you feeling today?</h2>
      <div class="mood-group" role="radiogroup" aria-label="Mood rating 1 to 5">
        ${MOOD_EMOJIS.map((emoji, i) => `
          <div class="mood-option">
            <input type="radio" name="mood" id="mood-${i + 1}" value="${i + 1}">
            <label for="mood-${i + 1}">
              <span class="emoji">${emoji}</span>
              <span class="mood-num">${i + 1}</span>
            </label>
          </div>`).join('')}
      </div>
    </div>
    <div class="stack gap-md mt-auto">
      <button id="btn-mood-done" class="btn btn-primary" disabled>Done</button>
    </div>`;

  el.querySelectorAll('input[name="mood"]').forEach(r =>
    r.addEventListener('change', () => {
      el.querySelector('#btn-mood-done').disabled = false;
    }));

  el.querySelector('#btn-mood-done').addEventListener('click', () => {
    const selected = el.querySelector('input[name="mood"]:checked');
    if (!selected) return;
    const dateKey = today();
    saveEntry(dateKey, {
      ...getOrCreateEntry(dateKey),
      mood: parseInt(selected.value, 10),
      completed: true,
      completedAt: new Date().toISOString(),
    });
    recordStreakCompletion();
    showView('view-success');
    renderSuccess();
  });
}

// ═══════════════════════════════════════════
// RENDER: SUCCESS
// ═══════════════════════════════════════════

function renderSuccess() {
  const streak = getStreak();
  const el = document.getElementById('view-success');
  el.innerHTML = `
    <div class="stack gap-xl view-center">
      <div class="stack gap-md">
        <p id="encourage-msg" class="text-lg"></p>
        <p class="text-2xl font-bold">Current Streak</p>
        <p class="streak-count">${streak.current}</p>
        <p class="text-muted">${streak.current === 1 ? 'day' : 'days'}</p>
      </div>
      ${buildStreakDots()}
    </div>
    <div class="stack gap-md mt-auto">
      <button id="btn-success-done" class="btn btn-ghost">Done</button>
    </div>`;

  el.querySelector('#encourage-msg').textContent = encouragingMessage();
  el.querySelector('#btn-success-done').addEventListener('click', () => {
    showView('view-done');
    renderDone();
  });

  showConfetti();
}

// ═══════════════════════════════════════════
// RENDER: DONE (completed day — countdown)
// ═══════════════════════════════════════════

function renderDone() {
  const el = document.getElementById('view-done');
  el.innerHTML = `
    <div class="stack gap-xl view-center">
      <div class="stack gap-md">
        <p class="text-2xl font-bold text-accent">All done today!</p>
        <p class="text-muted">Come back tomorrow to keep your streak going.</p>
      </div>
      ${buildStreakDots()}
      <div class="stack gap-sm">
        <p class="text-muted text-sm">Next entry in</p>
        <p id="countdown" class="countdown"></p>
      </div>
    </div>`;

  const tick = () => {
    const cdEl = document.getElementById('countdown');
    if (!cdEl) { clearInterval(timer); return; }
    const now      = new Date();
    const midnight = new Date(now); midnight.setDate(midnight.getDate() + 1); midnight.setHours(0,0,0,0);
    const diff = midnight - now;
    const h = String(Math.floor(diff / 3_600_000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60_000) / 1_000)).padStart(2, '0');
    cdEl.textContent = `${h}:${m}:${s}`;
      if (diff < 1000) {
        clearInterval(timer);
        window.location.reload();
      }
  };

  tick();
  const timer = setInterval(tick, 1000);
}

// ═══════════════════════════════════════════
// RENDER: BIRTHDAY MODAL
// ═══════════════════════════════════════════

function renderBirthdayModal() {
  const { name } = getSettings();
  const stats    = getBirthdayStats();
  const overlay  = document.createElement('div');
  overlay.className = 'modal-overlay';

  const tagHtml = stats.topTags.length
    ? stats.topTags.map(t => `<span class="tag selected">#${escHtml(t)}</span>`).join('')
    : '<span class="text-muted">No tags yet</span>';

  const sampleHtml = stats.sampleEntries
    .map(e => e.grateful?.[0]?.text)
    .filter(Boolean)
    .map(t => `<li class="text-sm text-muted">"${escHtml(t)}"</li>`)
    .join('');

  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="bd-title">
      <div class="text-center stack gap-md">
        <p class="icon-xl">🎂</p>
        <h2 id="bd-title" class="text-xl">Happy Birthday!</h2>
        <p id="bd-sub" class="text-muted"></p>
      </div>
      <div class="card stack gap-lg">
        <div>
          <p class="section-label">Days recorded</p>
          <p class="text-2xl font-bold text-accent">${stats.daysRecorded}</p>
        </div>
        ${stats.avgMood ? `
        <div>
          <p class="section-label">Average mood</p>
          <p class="text-xl font-semibold">
            ${MOOD_EMOJIS[Math.round(parseFloat(stats.avgMood)) - 1]} ${stats.avgMood}
          </p>
        </div>` : ''}
        ${stats.topTags.length ? `
        <div>
          <p class="section-label">Your top themes</p>
          <div class="tag-list">${tagHtml}</div>
        </div>` : ''}
        ${sampleHtml ? `
        <div>
          <p class="section-label">A few bright moments</p>
          <ul class="list-unstyled stack gap-sm">${sampleHtml}</ul>
        </div>` : ''}
      </div>
      <button id="bd-close" class="btn btn-primary">Thank you 🌿</button>
    </div>`;

  overlay.querySelector('#bd-sub').textContent =
    `Here's to another great year, ${name}!`;
  overlay.querySelector('#bd-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  document.body.appendChild(overlay);
  overlay.querySelector('#bd-close').focus();
  showConfetti();
}

// ═══════════════════════════════════════════
// HISTORY SCREEN
// ═══════════════════════════════════════════

let histPage      = 0;
let histSearch    = '';
let histTagFilter = null;
let histDateFrom  = '';
let histDateTo    = '';

const HIST_PAGE_SIZE = 7;

/** Formats a YYYY-MM-DD string for display. */
function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

/** Returns completed entries filtered and sorted newest-first. */
function filteredEntries() {
  return Object.values(getAllEntries())
    .filter(e => e.completed)
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter(e => {
      if (histDateFrom && e.date < histDateFrom) return false;
      if (histDateTo   && e.date > histDateTo)   return false;
      if (histSearch) {
        const q = histSearch.toLowerCase();
        if (!(e.grateful ?? []).some(g => g.text?.toLowerCase().includes(q))) return false;
      }
      if (histTagFilter) {
        if (!(e.grateful ?? []).some(g => g.tags?.includes(histTagFilter))) return false;
      }
      return true;
    });
}

function renderHistory() {
  const el         = document.getElementById('screen-history');
  const filtered   = filteredEntries();
  const totalPages = Math.max(1, Math.ceil(filtered.length / HIST_PAGE_SIZE));
  histPage = Math.min(histPage, totalPages - 1);
  const pageEntries = filtered.slice(histPage * HIST_PAGE_SIZE, (histPage + 1) * HIST_PAGE_SIZE);

  el.innerHTML = `
    <div class="screen-filters">
      <input id="hist-search" class="input" type="search" placeholder="Search entries…"
        value="${escHtml(histSearch)}" aria-label="Search entries">
      <div class="row">
        <input id="hist-date-from" class="input flex-1" type="date"
          value="${escHtml(histDateFrom)}" aria-label="From date">
        <input id="hist-date-to" class="input flex-1" type="date"
          value="${escHtml(histDateTo)}" aria-label="To date">
        ${(histDateFrom || histDateTo) ? `
          <button id="hist-date-clear" class="btn btn-ghost btn-xs" aria-label="Clear date range">✕</button>` : ''}
      </div>
      <div id="hist-tag-filter" class="tag-list" role="group" aria-label="Filter by tag">
        ${getTags().map(t => `
          <button class="tag${histTagFilter === t ? ' selected' : ''}" data-tag="${escHtml(t)}"
            aria-pressed="${histTagFilter === t}">#${escHtml(t)}</button>`).join('')}
      </div>
    </div>

    <div id="hist-list" class="screen-list">
      ${pageEntries.length
        ? pageEntries.map(e => entryCardHtml(e)).join('')
        : `<p class="text-center text-muted mt-2xl">No entries found.</p>`}
    </div>

    ${filtered.length > HIST_PAGE_SIZE ? `
    <div class="pagination">
      <button id="hist-prev" class="btn btn-ghost btn-sm"
        ${histPage === 0 ? 'disabled' : ''}>← Prev</button>
      <span class="text-muted text-sm">${histPage + 1} / ${totalPages}</span>
      <button id="hist-next" class="btn btn-ghost btn-sm"
        ${histPage >= totalPages - 1 ? 'disabled' : ''}>Next →</button>
    </div>` : ''}`;

  // Filters
  el.querySelector('#hist-search').addEventListener('input', e => {
    histSearch = e.target.value; histPage = 0; renderHistory();
  });
  el.querySelector('#hist-date-from').addEventListener('change', e => {
    histDateFrom = e.target.value; histPage = 0; renderHistory();
  });
  el.querySelector('#hist-date-to').addEventListener('change', e => {
    histDateTo = e.target.value; histPage = 0; renderHistory();
  });
  el.querySelector('#hist-date-clear')?.addEventListener('click', () => {
    histDateFrom = ''; histDateTo = ''; histPage = 0; renderHistory();
  });
  el.querySelectorAll('#hist-tag-filter .tag').forEach(btn => {
    btn.addEventListener('click', () => {
      histTagFilter = histTagFilter === btn.dataset.tag ? null : btn.dataset.tag;
      histPage = 0; renderHistory();
    });
  });

  // Pagination
  el.querySelector('#hist-prev')?.addEventListener('click', () => { histPage--; renderHistory(); });
  el.querySelector('#hist-next')?.addEventListener('click', () => { histPage++; renderHistory(); });

  // Entry actions
  el.querySelectorAll('.hist-edit').forEach(btn => {
    btn.addEventListener('click', () => showEditModal(btn.dataset.date, renderHistory));
  });
  el.querySelectorAll('.hist-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const date = btn.dataset.date;
      if (!confirm(`Delete the entry for ${formatDate(date)}?`)) return;
      deleteEntry(date);
      // Walk streak back if this was the last completed date
      const streak = getStreak();
      if (streak.lastCompletedDate === date) {
        saveStreak({ current: Math.max(0, streak.current - 1), lastCompletedDate: null });
      }
      renderHistory();
    });
  });
}

/** Returns the HTML string for a single history entry card. */
function entryCardHtml(entry) {
  const moodEmoji = entry.mood ? MOOD_EMOJIS[entry.mood - 1] : '';
  const items = (entry.grateful ?? []).map((g, i) => `
    <li class="mb-sm">
      <p class="text-xs text-muted mb-xs">${escHtml(g.prompt ?? '')}</p>
      <p id="ht-${escHtml(entry.date)}-${i}" class="text-sm">${escHtml(g.text ?? '')}</p>
      ${g.tags?.length ? `
        <div class="tag-list mt-xs">
          ${g.tags.map(t => `<span class="tag selected">#${escHtml(t)}</span>`).join('')}
        </div>` : ''}
    </li>`).join('');

  return `
    <article class="card stack gap-md">
      <div class="card-header">
        <time datetime="${escHtml(entry.date)}" class="font-semibold text-sm">
          ${formatDate(entry.date)}
        </time>
        ${moodEmoji ? `<span class="text-xl" aria-label="Mood ${entry.mood} of 5">${moodEmoji}</span>` : ''}
      </div>
      <ol class="pl-lg">${items}</ol>
      <div class="row-end">
        <button class="btn btn-ghost btn-sm hist-edit" data-date="${escHtml(entry.date)}">Edit</button>
        <button class="btn btn-ghost btn-sm btn-danger hist-delete" data-date="${escHtml(entry.date)}">Delete</button>
      </div>
    </article>`;
}

/** Edit modal — pre-fills each gratitude item's text and tags. */
function showEditModal(date, onSave) {
  const entry = getEntry(date);
  if (!entry) return;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const itemsHtml = (entry.grateful ?? []).map((g, i) => `
    <div class="card stack gap-md mb-lg">
      <p class="section-label">Entry ${i + 1}</p>
      <p class="text-sm text-muted">${escHtml(g.prompt ?? '')}</p>
      <textarea class="input em-text" data-i="${i}" rows="3"
        aria-label="Edit entry ${i + 1}">${escHtml(g.text ?? '')}</textarea>
      <div class="tag-list em-tags" data-i="${i}" role="group" aria-label="Tags for entry ${i + 1}">
        ${getTags().map(t => `
          <button class="tag${g.tags?.includes(t) ? ' selected' : ''}" data-tag="${escHtml(t)}"
            aria-pressed="${String(g.tags?.includes(t) ?? false)}">#${escHtml(t)}</button>`).join('')}
      </div>
    </div>`).join('');

  overlay.innerHTML = `
    <div class="modal modal-scroll" role="dialog" aria-modal="true" aria-labelledby="em-title">
      <h3 id="em-title" class="text-lg">Edit — ${formatDate(date)}</h3>
      ${itemsHtml}
      <div class="stack gap-md">
        <button id="em-save"   class="btn btn-primary">Save</button>
        <button id="em-cancel" class="btn btn-ghost">Cancel</button>
      </div>
    </div>`;

  overlay.querySelectorAll('.em-tags .tag').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
      btn.setAttribute('aria-pressed', String(btn.classList.contains('selected')));
    });
  });

  overlay.querySelector('#em-save').addEventListener('click', () => {
    const grateful = (entry.grateful ?? []).map((g, i) => {
      const text = overlay.querySelector(`.em-text[data-i="${i}"]`)?.value.trim() ?? g.text;
      const tags = [...overlay.querySelectorAll(`.em-tags[data-i="${i}"] .tag.selected`)]
        .map(b => b.dataset.tag);
      return { ...g, text, tags };
    });
    saveEntry(date, { ...entry, grateful });
    overlay.remove();
    onSave();
  });

  overlay.querySelector('#em-cancel').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  overlay.querySelector('.em-text')?.focus();
}

// ═══════════════════════════════════════════
// VISUALIZATIONS SCREEN
// ═══════════════════════════════════════════

let moodChartType = 'line';
let tagChartType  = 'cloud';
let moodChartInst = null;
let tagChartInst  = null;

const MOOD_COLORS = ['#c0685a', '#c89060', '#a0a060', '#70a878', '#5ab88a'];

function renderViz() {
  const el = document.getElementById('screen-viz');

  // Gather data
  const entries = Object.values(getAllEntries())
    .filter(e => e.completed)
    .sort((a, b) => a.date.localeCompare(b.date));

  const tagCounts = {};
  for (const entry of entries) {
    for (const g of entry.grateful ?? []) {
      for (const tag of g.tags ?? []) {
        tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
      }
    }
  }
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  // Destroy stale instances before rebuilding DOM
  moodChartInst?.destroy(); moodChartInst = null;
  tagChartInst?.destroy();  tagChartInst  = null;

  // Theme
  const isDark    = getEffectiveTheme() === 'dark';
  const textColor = isDark ? '#8a9e8a' : '#5a7a5a';
  const gridColor = isDark ? '#3a4a3a' : '#d0dbd0';

  const toggles = (chart, types, active) => types.map(t => `
    <button class="btn ${active === t ? 'btn-primary' : 'btn-ghost'} btn-xs viz-toggle"
      data-chart="${chart}" data-type="${t}">
      ${t.charAt(0).toUpperCase() + t.slice(1)}
    </button>`).join('');

  // Bar chart height scales with number of tags
  const tagBarH = Math.max(200, sortedTags.length * 28);

  el.innerHTML = `
    <div class="screen-body">

      <div class="card stack gap-md">
        <h3 class="text-lg">Year in Review</h3>
        <div id="heatmap-wrap"></div>
      </div>

      <div class="card stack gap-md">
        <div class="row-between-wrap">
          <h3 class="text-lg">Mood Trend</h3>
          <div class="row-xs" role="group" aria-label="Mood chart type">
            ${toggles('mood', ['line', 'bubble'], moodChartType)}
          </div>
        </div>
        ${entries.length
          ? `<div class="chart-wrap">
               <canvas id="mood-chart" aria-label="Mood trend chart" role="img"></canvas>
             </div>`
          : `<p class="text-center text-muted py-xl">No mood data yet.</p>`}
      </div>

      <div class="card stack gap-md">
        <div class="row-between-wrap">
          <h3 class="text-lg">Tag Frequency</h3>
          <div class="row-xs" role="group" aria-label="Tag chart type">
            ${toggles('tag', ['cloud', 'bar'], tagChartType)}
          </div>
        </div>
        ${sortedTags.length
          ? tagChartType === 'cloud'
            ? `<div id="tag-chart-wrap" class="tag-cloud" aria-label="Tag cloud"></div>`
            : `<div style="position:relative; height:${tagBarH}px;">
                 <canvas id="tag-chart" aria-label="Tag frequency chart" role="img"></canvas>
               </div>`
          : `<p class="text-center text-muted py-xl">No tag data yet.</p>`}
      </div>

    </div>`;

  // Toggle buttons
  el.querySelectorAll('.viz-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.chart === 'mood') moodChartType = btn.dataset.type;
      else                              tagChartType  = btn.dataset.type;
      renderViz();
    });
  });

  // Chart.js global defaults
  Chart.defaults.color       = textColor;
  Chart.defaults.borderColor = gridColor;
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;

  if (entries.length)    buildMoodChart(entries, gridColor, textColor);
  if (sortedTags.length) buildTagChart(sortedTags, gridColor, textColor);
  buildHeatMap(getAllEntries());
}

/** @param {object[]} entries @param {string} gridColor @param {string} textColor */
function buildMoodChart(entries, gridColor, textColor) {
  const ctx = document.getElementById('mood-chart')?.getContext('2d');
  if (!ctx) return;

  const labels = entries.map(e =>
    new Date(e.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  const moods = entries.map(e => e.mood);

  const scaleCfg = {
    grid:  { color: gridColor },
    ticks: { color: textColor },
  };

  if (moodChartType === 'line') {
    moodChartInst = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Mood',
          data: moods,
          borderColor: '#7c9a7e',
          backgroundColor: 'rgba(124,154,126,0.15)',
          pointBackgroundColor: moods.map(m => MOOD_COLORS[m - 1]),
          pointRadius: 5,
          tension: 0.35,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            ...scaleCfg, min: 1, max: 5,
            ticks: { ...scaleCfg.ticks, stepSize: 1, callback: v => MOOD_EMOJIS[v - 1] ?? v },
          },
          x: { ...scaleCfg, ticks: { ...scaleCfg.ticks, maxTicksLimit: 8 } },
        },
      },
    });

  } else {
    moodChartInst = new Chart(ctx, {
      type: 'bubble',
      data: {
        datasets: [{
          label: 'Mood',
          data: entries.map((e, i) => ({ x: i, y: e.mood, r: 10 })),
          backgroundColor: entries.map(e => MOOD_COLORS[e.mood - 1] + 'cc'),
          borderColor:     entries.map(e => MOOD_COLORS[e.mood - 1]),
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: c => `${labels[c.dataIndex]}: ${MOOD_EMOJIS[entries[c.dataIndex].mood - 1]} (${entries[c.dataIndex].mood})`,
            },
          },
        },
        scales: {
          y: {
            ...scaleCfg, min: 0.5, max: 5.5,
            ticks: { ...scaleCfg.ticks, stepSize: 1, callback: v => MOOD_EMOJIS[v - 1] ?? '' },
          },
          x: { display: false },
        },
      },
    });
  }
}

/** @param {[string, number][]} sortedTags @param {string} gridColor @param {string} textColor */
function buildTagChart(sortedTags, gridColor, textColor) {
  if (tagChartType === 'cloud') {
    const wrap = document.getElementById('tag-chart-wrap');
    if (!wrap) return;
    const maxCount = sortedTags[0][1];
    const palette = ['#7c9a7e', '#5ab88a', '#70a878', '#4a8a6a', '#9dbf9f', '#3a7a5a', '#a0c8a2', '#c8deca'];
    wrap.innerHTML = sortedTags.map(([tag, count], i) => {
      const ratio    = count / maxCount;
      const size     = (0.8 + ratio * 1.7).toFixed(2); // 0.8rem – 2.5rem
      const weight   = ratio >= 0.6 ? '700' : ratio >= 0.3 ? '600' : '500';
      const color    = palette[i % palette.length];
      return `<span class="cloud-tag" style="font-size:${size}rem; color:${color}; font-weight:${weight};"
        title="${count} mention${count !== 1 ? 's' : ''}">#${escHtml(tag)}</span>`;
    }).join('');
    return;
  }

  // Bar chart
  const ctx = document.getElementById('tag-chart')?.getContext('2d');
  if (!ctx) return;

  const scaleCfg = {
    grid:  { color: gridColor },
    ticks: { color: textColor },
  };

  tagChartInst = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedTags.map(([t]) => `#${t}`),
      datasets: [{
        label: 'Mentions',
        data:  sortedTags.map(([, c]) => c),
        backgroundColor: '#7c9a7e99',
        borderColor:     '#7c9a7e',
        borderWidth: 1,
        borderRadius: 4,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ...scaleCfg, ticks: { ...scaleCfg.ticks, stepSize: 1 } },
        y: { ...scaleCfg },
      },
    },
  });
}

/** Builds the GitHub-style calendar heat map for the past 365 days. */
function buildHeatMap(allEntries) {
  const wrap = document.getElementById('heatmap-wrap');
  if (!wrap) return;

  const CELL = 11; // cell size in px (gap is 3px, set in CSS)

  // Date range: 365 days ending today (inclusive)
  const todayStr = today();
  const todayObj = new Date(todayStr + 'T00:00:00');
  const startObj = new Date(todayObj);
  startObj.setDate(startObj.getDate() - 364);

  // Align grid to Sunday of the start week
  const gridStartObj = new Date(startObj);
  gridStartObj.setDate(gridStartObj.getDate() - gridStartObj.getDay());

  // Total week-columns needed to reach today
  const msPerDay   = 86400000;
  const daysSpanned = Math.floor((todayObj - gridStartObj) / msPerDay);
  const numWeeks   = Math.ceil((daysSpanned + 1) / 7);

  // Month labels: first week-column where each month appears
  const monthLabels = [];
  let prevMonth = null;
  for (let w = 0; w < numWeeks; w++) {
    const wStart = new Date(gridStartObj);
    wStart.setDate(wStart.getDate() + w * 7);
    if (wStart > todayObj) break;
    const mo = wStart.toLocaleDateString('en-US', { month: 'short' });
    if (mo !== prevMonth) {
      monthLabels.push({ week: w, label: mo });
      prevMonth = mo;
    }
  }

  // Build cells in column-major order (week × day-of-week)
  const cells = [];
  for (let w = 0; w < numWeeks; w++) {
    for (let dow = 0; dow < 7; dow++) {
      const cellObj = new Date(gridStartObj);
      cellObj.setDate(cellObj.getDate() + w * 7 + dow);
      const dateStr = formatDateLocal(cellObj);

      if (cellObj < startObj || cellObj > todayObj) {
        // Outside 365-day window — invisible placeholder
        cells.push(`<div class="hm-cell hm-oob" aria-hidden="true"></div>`);
        continue;
      }

      const entry = allEntries[dateStr];
      if (!entry?.completed) {
        cells.push(`<div class="hm-cell hm-none" title="${dateStr}"></div>`);
      } else {
        const m   = entry.mood ?? 3;
        const tip = `${dateStr} · ${MOOD_EMOJIS[m - 1]} mood ${m}/5`;
        cells.push(`<div class="hm-cell" style="background:var(--mood-${m});" title="${tip}" aria-label="${tip}"></div>`);
      }
    }
  }

  const colTemplate = `repeat(${numWeeks},${CELL}px)`;
  const monthSpans  = monthLabels.map(({ week, label }) =>
    `<span class="hm-month" style="grid-column:${week + 1}">${label}</span>`
  ).join('');

  wrap.innerHTML = `
    <div class="hm-outer">
      <div class="hm-body">
        <div class="hm-doy" aria-hidden="true">
          <span>S</span><span></span><span>T</span><span></span><span>T</span><span></span><span>S</span>
        </div>
        <div class="hm-scroll">
          <div class="hm-months" style="grid-template-columns:${colTemplate}">${monthSpans}</div>
          <div class="hm-grid" style="grid-template-columns:${colTemplate}">${cells.join('')}</div>
        </div>
      </div>
      <div class="hm-legend" aria-label="Color legend">
        <span class="hm-legend-label">No entry</span>
        <div class="hm-cell hm-none"></div>
        <span class="hm-legend-sep">→</span>
        ${[1,2,3,4,5].map(m =>
          `<div class="hm-cell" style="background:var(--mood-${m});" title="Mood ${m} ${MOOD_EMOJIS[m-1]}"></div>`
        ).join('')}
        <span class="hm-legend-label">${MOOD_EMOJIS[4]}</span>
      </div>
    </div>`;
}

// ═══════════════════════════════════════════
// SETTINGS SCREEN
// ═══════════════════════════════════════════

/** Returns total localStorage usage for Grateful keys in KB. */
function storageUsageKb() {
  const bytes = Object.values(KEYS)
    .reduce((sum, k) => sum + (localStorage.getItem(k) ?? '').length, 0);
  return (bytes / 1024).toFixed(1);
}

// ── Push subscription helpers ─────────────────────────────────────────────────

/** Converts a VAPID public key (base64url) to a Uint8Array for PushManager */
function vapidKeyToUint8Array(base64url) {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from(raw, c => c.charCodeAt(0));
}

/**
 * Subscribes this device to push via the SW PushManager and registers it
 * with the push server. Saves reminderTime locally on success.
 * @param {string} reminderTime — HH:MM in local time
 * @returns {Promise<boolean>} true on success
 */
async function subscribeToPush(reminderTime) {
  const reg = await navigator.serviceWorker.ready;
  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: vapidKeyToUint8Array(VAPID_PUBLIC_KEY),
  });

  const res = await fetch(`${PUSH_SERVER_URL}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: getOrCreateClientId(),
      subscription: subscription.toJSON(),
      reminderTime,
      tzOffset: new Date().getTimezoneOffset(),
    }),
  });

  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  saveSettings({ reminderTime, notificationsEnabled: true });
  return true;
}

/**
 * Unsubscribes from push and removes the record from the server.
 */
async function unsubscribeFromPush() {
  const reg = await navigator.serviceWorker.ready;
  const existing = await reg.pushManager.getSubscription();
  if (existing) await existing.unsubscribe();

  await fetch(`${PUSH_SERVER_URL}/subscribe`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId: getOrCreateClientId() }),
  });

  saveSettings({ reminderTime: null, notificationsEnabled: false });
}

function renderSettings() {
  const el       = document.getElementById('screen-settings');
  const settings = getSettings();
  const notifOk  = 'Notification' in window;
  const notifPerm = notifOk ? Notification.permission : 'unsupported';

  const scheme = settings.colorScheme ?? 'system';
  const themeBtn = s => `
    <button class="btn theme-opt btn-theme ${scheme === s ? 'btn-primary' : 'btn-ghost'}"
      data-scheme="${s}">
      ${{ system: 'System', light: 'Light', dark: 'Dark' }[s]}
    </button>`;

  el.innerHTML = `
    <div class="screen-body">
      <h2 class="text-xl">Settings</h2>

      <!-- Appearance -->
      <div class="card stack gap-md">
        <p class="section-label">Appearance</p>
        <div class="row" role="group" aria-label="Colour scheme">
          ${themeBtn('system')}${themeBtn('light')}${themeBtn('dark')}
        </div>
      </div>

      <!-- Profile -->
      <div class="card stack gap-md">
        <p class="section-label">Profile</p>
        <div class="stack gap-sm">
          <label class="section-label" for="s-name">Name</label>
          <input id="s-name" class="input" type="text" maxlength="50"
            value="${escHtml(settings.name)}" autocomplete="given-name">
        </div>
        <div class="stack gap-sm">
          <label class="section-label" for="s-dob">
            Date of Birth <span class="text-muted">(optional)</span>
          </label>
          <input id="s-dob" class="input" type="date" value="${escHtml(settings.dob ?? '')}">
        </div>
      </div>

      <!-- Reminder -->
      <div class="card stack gap-md">
        <p class="section-label">Daily Reminder</p>
        ${notifOk ? `
          <div class="stack gap-sm">
            <label class="section-label" for="s-time">Reminder time</label>
            <input id="s-time" class="input" type="time"
              value="${escHtml(settings.reminderTime ?? '')}">
          </div>
          ${notifPerm === 'denied' ? `
            <p class="text-sm text-danger">
              Notifications are blocked. Allow them in your browser settings, then return here.
            </p>` : ''}
          <button id="s-set-reminder" class="btn btn-primary"
            ${notifPerm === 'denied' ? 'disabled' : ''}>
            ${settings.notificationsEnabled ? 'Update Reminder' : 'Set Reminder'}
          </button>
          ${settings.notificationsEnabled && settings.reminderTime ? `
            <p class="text-sm text-muted">✓ Reminder set for ${escHtml(settings.reminderTime)}</p>
            <button id="s-disable-reminder" class="btn btn-ghost">Disable Reminder</button>` : ''}
        ` : `
          <p class="text-muted text-sm">Notifications are not supported in this browser.</p>`}
      </div>

      <!-- Data -->
      <div class="card stack gap-md">
        <p class="section-label">Data</p>
        <div class="row">
          <button id="s-export" class="btn btn-ghost flex-1">Export JSON</button>
          <button id="s-import" class="btn btn-ghost flex-1">Import JSON</button>
          <input id="s-import-file" class="hidden" type="file" accept=".json"
            aria-hidden="true" tabindex="-1">
        </div>
        <p class="text-muted text-xs">Storage used: ${storageUsageKb()} KB</p>
      </div>

      <!-- Restore defaults -->
      <div class="card stack gap-md">
        <p class="section-label">Restore Defaults</p>
        <button id="s-restore-prompts" class="btn btn-ghost">Restore default prompts</button>
        <button id="s-restore-tags"    class="btn btn-ghost">Restore default tags</button>
      </div>

    </div>`;

  // ── Appearance ────────────────────────────────────────────────────────────
  el.querySelectorAll('.theme-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = btn.dataset.scheme;
      saveSettings({ colorScheme: s });
      applyTheme(s);
      renderSettings(); // refresh button states
    });
  });

  // ── Profile ───────────────────────────────────────────────────────────────
  el.querySelector('#s-name').addEventListener('input', e =>
    saveSettings({ name: e.target.value.trim() }));

  el.querySelector('#s-dob').addEventListener('change', e =>
    saveSettings({ dob: e.target.value || null }));

  // ── Reminder ──────────────────────────────────────────────────────────────
  el.querySelector('#s-set-reminder')?.addEventListener('click', async () => {
    const time = el.querySelector('#s-time')?.value;
    if (!time) { alert('Please choose a reminder time first.'); return; }

    if (Notification.permission === 'default') {
      const result = await Notification.requestPermission();
      if (result !== 'granted') { renderSettings(); return; }
    }
    if (Notification.permission !== 'granted') { renderSettings(); return; }

    const btn = el.querySelector('#s-set-reminder');
    btn.disabled = true;
    btn.textContent = 'Saving…';

    try {
      await subscribeToPush(time);
    } catch (e) {
      console.error('Push subscription failed:', e);
      alert('Could not set reminder. Please try again.');
      btn.disabled = false;
      renderSettings();
      return;
    }

    renderSettings();
  });

  el.querySelector('#s-disable-reminder')?.addEventListener('click', async () => {
    const btn = el.querySelector('#s-disable-reminder');
    btn.disabled = true;
    btn.textContent = 'Disabling…';

    try {
      await unsubscribeFromPush();
    } catch (e) {
      console.error('Push unsubscribe failed:', e);
    }

    renderSettings();
  });

  // ── Export ────────────────────────────────────────────────────────────────
  el.querySelector('#s-export').addEventListener('click', exportData);

  // ── Import ────────────────────────────────────────────────────────────────
  const fileInput = el.querySelector('#s-import-file');
  el.querySelector('#s-import').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const merge = confirm(
      'How would you like to import?\n\nOK — Merge (existing entries win conflicts)\nCancel — Replace all data'
    );
    importData(file, merge ? 'merge' : 'replace');
    fileInput.value = '';
  });

  // ── Restore defaults ──────────────────────────────────────────────────────
  el.querySelector('#s-restore-prompts').addEventListener('click', () => {
    if (confirm('Restore all prompts to defaults? Custom prompts will be lost.'))
      restoreDefaultPrompts();
  });
  el.querySelector('#s-restore-tags').addEventListener('click', () => {
    if (confirm('Restore all tags to defaults? Custom tags will be lost.'))
      restoreDefaultTags();
  });
}

// ═══════════════════════════════════════════
// ABOUT SCREEN
// ═══════════════════════════════════════════

function renderAbout() {
  const el = document.getElementById('screen-about');
  el.innerHTML = `
    <div class="screen-body">
      <h2 class="text-xl">About</h2>

      <!-- Privacy -->
      <div class="card stack gap-md">
        <p class="section-label">Privacy</p>
        <p class="text-sm">Grateful is a fully private journal. <strong>No data ever leaves your device.</strong> There are no accounts, no servers, and no analytics. Everything you write stays with you.</p>
      </div>

      <!-- Local Storage -->
      <div class="card stack gap-md">
        <p class="section-label">Your data &amp; localStorage</p>
        <p class="text-sm">All journal entries, moods, settings, and streaks are stored in your browser's <strong>localStorage</strong> — a small, sandboxed database built into your browser. This data is tied to this browser on this device.</p>
        <p class="text-sm">localStorage is separate from your browsing history and cookies, but it <em>can</em> be cleared by certain browser actions.</p>
      </div>

      <!-- Warning -->
      <div class="card stack gap-md" style="border-color: var(--danger);">
        <p class="section-label text-danger">Warning — data loss risk</p>
        <p class="text-sm"><strong>Clearing your browser cache, site data, or localStorage will permanently delete your journal.</strong> This cannot be undone.</p>
        <p class="text-sm">Actions that can erase your data:</p>
        <ul class="text-sm stack gap-sm" style="padding-left: var(--space-lg); list-style: disc;">
          <li>Clearing browser history or site data</li>
          <li>"Clear all cookies and site data" in browser settings</li>
          <li>Using private / incognito mode (data is lost when the window closes)</li>
          <li>Uninstalling or resetting the browser</li>
        </ul>
        <p class="text-sm font-semibold" style="color: var(--danger);">Export your journal regularly to keep a safe backup.</p>
      </div>

      <!-- Export reminder -->
      <div class="card stack gap-md">
        <p class="section-label">Export frequently</p>
        <p class="text-sm">Use the <strong>Export</strong> option in Settings to save a copy of your journal as a JSON file. Store it somewhere safe — your downloads folder, a cloud drive, or an external backup.</p>
        <button class="btn btn-ghost btn-sm" id="about-go-settings">Go to Settings &rarr;</button>
      </div>
    </div>
  `;

  el.querySelector('#about-go-settings').addEventListener('click', () => {
    showScreen('settings');
    renderSettings();
  });
}

// ── Go ───────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', bootstrap);
