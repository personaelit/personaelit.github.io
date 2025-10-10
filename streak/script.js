// Streak — localStorage-powered habit tracker
// Jim: tweak SETTINGS.THRESHOLD to require more/less completion for a "win".
const SETTINGS = {
    THRESHOLD: 0.5, // 50% of today's tasks must be checked to keep the streak
    MAX_HISTORY_POINTS: 30
};

// ---------- Utilities ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const todayKey = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
const fmtLongDate = d => d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
const keyFromDate = d => d.toLocaleDateString('en-CA'); // YYYY-MM-DD
const dateFromKey = k => {
  const [y,m,d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
};


function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

// ---------- State ----------
const state = {
    tasks: load('streak.tasks', []), // [{id, text, createdAt}]
    order: load('streak.order', []), // [id, id, ...]
    completions: load('streak.completions', {}), // { 'YYYY-MM-DD': [taskId, ...] }
    streakCount: load('streak.count', 0),
    lastSuccessDate: load('streak.lastSuccessDate', null), // 'YYYY-MM-DD'
    history: load('streak.history', []), // [{date:'YYYY-MM-DD', streak: n}]
    settings: load('streak.settings', { threshold: SETTINGS.THRESHOLD })
};

// Ensure order contains all task ids
state.order = state.order.filter(id => state.tasks.some(t => t.id === id));
for (const t of state.tasks) { if (!state.order.includes(t.id)) state.order.push(t.id); }

// ---------- DOM refs ----------
const dateDisplay = $('#date-display');
const countdownDisplay = $('#countdown-display');
const form = $('#task-form');
const input = $('#task-input');
const streakDisplay = $('#streak-display');
const list = $('#task-list');
const percentDisplay = $('#percentage-display');
const progressBar = $('#progress-bar');
const historyCanvas = $('#history-chart');

let chart;

// ---------- Init ----------
init();

function init() {
    mountShell();
    renderTasks();
    updateForToday(false); // compute progress; don't reward twice on load
    bootSortable();
    initChart();
    tickCountdown();
    setInterval(tickCountdown, 1000);
}

// ---------- UI Shell ----------
function mountShell() {
    const now = new Date();
    dateDisplay.textContent = fmtLongDate(now);

    form.addEventListener('submit', e => {
        e.preventDefault();
        const text = (input.value || '').trim();
        if (!text) return;
        addTask(text);
        input.value = '';
    });
}

// ---------- Tasks ----------
function addTask(text) {
    const id = crypto.randomUUID();
    const t = { id, text, createdAt: Date.now() };
    state.tasks.push(t);
    state.order.push(id);
    save('streak.tasks', state.tasks);
    save('streak.order', state.order);
    renderTasks();
    updateForToday(false);
}

function deleteTask(id) {
    state.tasks = state.tasks.filter(t => t.id !== id);
    state.order = state.order.filter(x => x !== id);
    // Remove from all completion days
    for (const [k, arr] of Object.entries(state.completions)) {
        state.completions[k] = arr.filter(x => x !== id);
    }
    save('streak.tasks', state.tasks);
    save('streak.order', state.order);
    save('streak.completions', state.completions);
    renderTasks();
    updateForToday(false);
}

function renderTasks() {
  const today = todayKey();
  const doneSet = new Set(state.completions[today] || []);
  const map = new Map(state.tasks.map(t => [t.id, t]));

  list.innerHTML = '';
  for (const id of state.order) {
    const t = map.get(id);
    if (!t) continue;

    const li = document.createElement('li');
    li.className = 'task';
    li.dataset.id = id;

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = doneSet.has(id);
    cb.addEventListener('change', () => toggleComplete(id, cb.checked));

    const label = document.createElement('div');
    label.className = 'text';
    label.textContent = t.text;

    const actions = document.createElement('div');
    actions.className = 'actions';

    // NEW: per-task streak badge
    const badge = document.createElement('span');
    badge.className = 'streak-badge';
    const cur = currentTaskStreak(id);
    const max = maxTaskStreak(id);
    badge.textContent = `🔥 ${cur}`;
    badge.title = `Current streak: ${cur} • Max: ${max}`;

    const dragBtn = document.createElement('button');
    dragBtn.type = 'button';
    dragBtn.className = 'icon';
    dragBtn.title = 'Drag to reorder';
    dragBtn.textContent = '↕';

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'delete';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => deleteTask(id));

    actions.append(badge, dragBtn, delBtn); // ⟵ include badge
    li.append(cb, label, actions);
    list.appendChild(li);
  }
}


function toggleComplete(id, checked) {
  const key = todayKey();
  const set = new Set(state.completions[key] || []);
  if (checked) set.add(id); else set.delete(id);
  state.completions[key] = [...set];
  save('streak.completions', state.completions);

  // Re-render list so badges update immediately
  renderTasks();

  // Recompute progress & possibly award streak
  updateForToday(true);
}


// ---------- Progress / Streak ----------
function updateForToday(allowReward) {
    const key = todayKey();
    const total = state.tasks.length || 0;
    const done = (state.completions[key] || []).length;
    const pct = total ? done / total : 0;

    const pctText = total ? `${Math.round(pct * 100)}% (${done}/${total}) complete` : 'Add tasks to get started';
    percentDisplay.textContent = pctText;
    progressBar.style.width = `${Math.round(pct * 100)}%`;
    progressBar.style.background = pct >= state.settings.threshold
        ? 'linear-gradient(90deg, var(--good), var(--accent))'
        : 'linear-gradient(90deg, var(--warn), var(--accent))';

    maybeAwardStreak(pct, allowReward);
    renderStreak();
    updateChartData();
}

function maybeAwardStreak(pct, allowReward) {
    const threshold = state.settings.threshold ?? SETTINGS.THRESHOLD;
    const key = todayKey();
    const metToday = pct >= threshold;

    // If you already recorded today, do nothing
    if (state.lastSuccessDate === key) return;

    if (metToday && allowReward) {
        // If yesterday was your last success, increment; else reset to 1
        const y = new Date(key);
        y.setDate(y.getDate() - 1);
        const yKey = y.toLocaleDateString('en-CA');

        if (state.lastSuccessDate === yKey) {
            state.streakCount += 1;
        } else {
            state.streakCount = 1;
        }
        state.lastSuccessDate = key;
        pushHistoryPoint(key, state.streakCount);
        celebrate();
        save('streak.count', state.streakCount);
        save('streak.lastSuccessDate', state.lastSuccessDate);
        save('streak.history', state.history);
    }
}

function renderStreak() {
    streakDisplay.textContent = `🔥 Current Streak: ${state.streakCount} day${state.streakCount === 1 ? '' : 's'}`;
}

function pushHistoryPoint(dateKey, streakVal) {
    state.history.push({ date: dateKey, streak: streakVal });
    if (state.history.length > SETTINGS.MAX_HISTORY_POINTS) {
        state.history = state.history.slice(-SETTINGS.MAX_HISTORY_POINTS);
    }
}

function celebrate() {
    if (window.confetti) {
        confetti({
            particleCount: 140,
            spread: 70,
            startVelocity: 35,
            scalar: 0.9,
            ticks: 150,
            origin: { y: 0.7 }
        });
    }
}

// ---------- Sortable ----------
function bootSortable() {
    new Sortable(list, {
        animation: 150,
        handle: '.icon',
        onStart: (evt) => { evt.item.classList.add('dragging'); },
        onEnd: (evt) => {
            evt.item.classList.remove('dragging');
            const ids = $$('#task-list .task').map(li => li.dataset.id);
            state.order = ids;
            save('streak.order', state.order);
        }
    });
}

// ---------- Countdown ----------

function tickCountdown() {
    const pad = n => String(n).padStart(2, '0');
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const ms = midnight - now;

    const hrs = Math.floor(ms / 3_600_000);
    const mins = Math.floor((ms % 3_600_000) / 60_000);
    const secs = Math.floor((ms % 60_000) / 1000);
    countdownDisplay.textContent = `Time left today: ${pad(hrs)}:${pad(mins)}:${pad(secs)}`;

    // If a new day just began, refresh UI to clear checkboxes (but keep history)
    if (ms <= 1000) {
        setTimeout(() => {
            renderTasks();
            updateForToday(false);
            dateDisplay.textContent = fmtLongDate(new Date());
        }, 1200);
    }
}

// ---------- Chart ----------

// ---------- Timeline helpers for per-task chart ----------
function recentDays(n) {
    const days = [];
    const d = new Date();
    for (let i = 0; i < n; i++) {
        const k = d.toLocaleDateString('en-CA'); // YYYY-MM-DD
        days.push(k);
        d.setDate(d.getDate() - 1);
    }
    return days.reverse();
}

function safeTaskLabel(t) {
    // Keep labels short-ish; fallback to id tail if empty
    const txt = (t.text || '').trim();
    if (txt.length <= 24 && txt) return txt;
    return (txt ? txt.slice(0, 21) + '…' : ('Task ' + t.id.slice(-4)));
}

// ---- Date helpers ----
const DAY_MS = 86_400_000;


// Build a Set of dates where a task was completed
function taskDateSet(taskId) {
  const s = new Set();
  for (const [k, arr] of Object.entries(state.completions)) {
    if ((arr || []).includes(taskId)) s.add(k);
  }
  return s;
}

// Current streak for a task, counting back from today calendar-day by calendar-day
function currentTaskStreak(taskId) {
  const done = taskDateSet(taskId);
  let count = 0;
  let d = new Date(); // today, local time
  while (done.has(keyFromDate(d))) {
    count++;
    d = new Date(d.getTime() - DAY_MS);
  }
  return count;
}

// Max streak for a task across history (strictly consecutive calendar days)
function maxTaskStreak(taskId) {
  const done = [...taskDateSet(taskId)].sort(); // YYYY-MM-DD sorts lexicographically correctly
  let max = 0, run = 0, prev = null;
  for (const k of done) {
    if (!prev) {
      run = 1;
    } else {
      const diffDays = Math.round((dateFromKey(k) - dateFromKey(prev)) / DAY_MS);
      run = (diffDays === 1) ? run + 1 : 1;
    }
    if (run > max) max = run;
    prev = k;
  }
  return max;
}



function initChart() {
    const ctx = historyCanvas.getContext('2d');
    chart = new Chart(ctx, {
        data: makeChartData(), // mixed datasets
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    ticks: { color: '#a5b3c7', maxRotation: 0, autoSkip: true }
                },
                y: {
                    stacked: true, // stacks the bars; line uses same axis
                    ticks: { color: '#a5b3c7', precision: 0 },
                    beginAtZero: true,
                    suggestedMax: Math.max(3, state.tasks.length) // headroom
                }
            },
            plugins: {
                legend: { display: true },
                tooltip: { mode: 'index', intersect: false }
            }
        }
    });
    historyCanvas.parentElement.style.height = '260px';
}


function makeChartData() {
    const days = recentDays(SETTINGS.MAX_HISTORY_POINTS);
    const labels = days.map(k => k.slice(5)); // MM-DD

    // --- per-task 0/1 bars ---
    const taskById = new Map(state.tasks.map(t => [t.id, t]));
    const perTaskDatasets = state.order
        .filter(id => taskById.has(id))
        .map(id => {
            const t = taskById.get(id);
            const data = days.map(k => {
                const arr = state.completions[k] || [];
                return arr.includes(id) ? 1 : 0;
            });
            return {
                type: 'bar',
                label: safeTaskLabel(t),
                data,
                stack: 'tasks',
                borderWidth: 0,
            };
        });

    // --- streak line aligned to the same days ---
    const streakMap = new Map(state.history.map(p => [p.date, p.streak]));
    const streakData = days.map(k => streakMap.has(k) ? streakMap.get(k) : null);

    const streakDataset = {
        type: 'line',
        label: 'Streak',
        data: streakData,
        fill: false,
        tension: 0.25,
        borderWidth: 2
    };

    return {
        labels,
        datasets: [...perTaskDatasets, streakDataset]
    };
}


function updateChartData() {
    if (!chart) return;
    chart.data = makeChartData();
    chart.update();
}

// ---------- (Optional) Simple settings hook ----------
// Example: set threshold via URL like ?threshold=0.75
// try{
//   const url = new URL(location.href);
//   const t = url.searchParams.get('threshold');
//   if(t){
//     const v = Math.max(0, Math.min(1, parseFloat(t)));
//     state.settings.threshold = Number.isFinite(v) ? v : state.settings.threshold;
//     save('streak.settings', state.settings);
//   }
// }catch{ /* ignore */ }
