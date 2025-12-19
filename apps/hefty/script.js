// script.js
// Weight Tracker — mobile-first JS
// - Strict client-side validation (digits + one decimal separator)
// - One entry per calendar day (local time)
// - Rounds to tenths
// - Persists to localStorage
// - Renders a time-series chart with Chart.js
// =  allow updating today's entry

(() => {
  const STORAGE_KEY = "wt.entries.v1"; // [{ date: "YYYY-MM-DD", weight: 186.4 }]
  const form = document.getElementById("weightForm");
  const input = document.getElementById("weight");
  const message = document.getElementById("message");
  const saveBtn = document.getElementById("saveBtn");
  const chartCanvas = document.getElementById("weightChart");

  /** Utils **/
  const todayISO = () => {
    const d = new Date();
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${yr}-${mo}-${da}`;
  };

  const loadEntries = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(
          (e) =>
            e &&
            typeof e.date === "string" &&
            typeof e.weight === "number" &&
            isFinite(e.weight)
        )
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch {
      return [];
    }
  };

  const saveEntries = (entries) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  };

  const roundToTenth = (n) => Math.round(n * 10) / 10;

  const showMsg = (text, type = "info") => {
    message.textContent = text;
    message.hidden = false;
    message.className = `message ${type}`;
  };

  const clearMsg = () => {
    message.hidden = true;
    message.textContent = "";
    message.className = "message";
  };

  /** Input filtering (digits + one decimal, comma allowed) **/
  input.addEventListener("input", () => {
    const old = input.value;
    let cleaned = old.replace(/[^0-9\.,]/g, "");
    const firstSep = cleaned.search(/[.,]/);
    if (firstSep !== -1) {
      const head = cleaned.slice(0, firstSep + 1);
      const tail = cleaned.slice(firstSep + 1).replace(/[.,]/g, "");
      cleaned = head + tail;
    }
    if (cleaned !== old) {
      const pos = input.selectionStart || cleaned.length;
      input.value = cleaned;
      requestAnimationFrame(() => input.setSelectionRange(pos, pos));
    }
  });

  function parseWeight(value) {
    if (typeof value !== "string") return null;
    const normalized = value.replace(",", ".").trim();
    if (!normalized) return null;
    if (!/^\d+(\.\d+)?$/.test(normalized)) return null;
    const num = Number(normalized);
    if (!isFinite(num)) return null;
    if (num < 50 || num > 1000) return null; // adjust if needed
    return roundToTenth(num);
  }

  /** Chart.js **/
  let chart;
  const buildChart = (entries) => {
    const dataPoints = entries.map((e) => ({ x: e.date, y: e.weight }));
    if (chart) {
      chart.data.datasets[0].data = dataPoints;
      chart.update();
      return;
    }
    chart = new Chart(chartCanvas.getContext("2d"), {
      type: "line",
      data: {
        datasets: [
          {
            label: "Weight",
            data: dataPoints,
            tension: 0.25,
            borderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 12,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "nearest", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) =>
                items[0]?.parsed?.x ? formatDate(items[0].parsed.x) : "",
              label: (item) => `${item.parsed.y.toFixed(1)}`,
            },
          },
        },
        scales: {
          x: {
            type: "time",
            time: { unit: "day", tooltipFormat: "yyyy-MM-dd" },
            grid: { display: false },
          },
          y: {
            beginAtZero: false,
            grid: { drawBorder: false },
            ticks: { callback: (v) => Number(v).toFixed(1) },
          },
        },
      },
    });
  };

  const formatDate = (msOrStr) => {
    const d = typeof msOrStr === "number" ? new Date(msOrStr) : new Date(msOrStr);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${yr}-${mo}-${da}`;
  };

  /** Helpers for today's entry UI **/
  const getTodayEntry = (entries) => entries.find((e) => e.date === todayISO());

  const setButtonMode = (mode /* 'save' | 'update' */) => {
    saveBtn.textContent = mode === "update" ? "Update" : "Save";
    saveBtn.dataset.mode = mode;
  };

  const prefillIfTodayExists = (entries) => {
    const t = getTodayEntry(entries);
    if (t) {
      input.value = String(t.weight);
      setButtonMode("update");
      showMsg("Today’s entry is loaded. You can update it if needed.", "info");
    } else {
      setButtonMode("save");
    }
  };

  /** Submit: create or overwrite today's entry **/
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearMsg();
    saveBtn.disabled = true;

    const weight = parseWeight(input.value);
    if (weight == null) {
      showMsg(
        "Please enter a valid number like 186.4 (between 50 and 1000).",
        "error"
      );
      saveBtn.disabled = false;
      return;
    }

    const entries = loadEntries();
    const today = todayISO();
    const existing = getTodayEntry(entries);

    if (existing) {
      const prev = existing.weight;
      existing.weight = weight; // overwrite
      entries.sort((a, b) => a.date.localeCompare(b.date));
      saveEntries(entries);
      buildChart(entries);
      showMsg(`Updated today’s entry: ${prev.toFixed(1)} → ${weight.toFixed(1)}.`, "success");
      setButtonMode("update");
    } else {
      entries.push({ date: today, weight });
      entries.sort((a, b) => a.date.localeCompare(b.date));
      saveEntries(entries);
      buildChart(entries);
      showMsg("Saved!", "success");
      setButtonMode("update"); // now it exists, so switch to update
    }

    // keep the value visible after save/update so user sees what’s recorded
    input.value = String(weight);
    saveBtn.disabled = false;
  });

  /** Init **/
  const initial = loadEntries();
  buildChart(initial);
  prefillIfTodayExists(initial);

  requestAnimationFrame(() => {
    input.focus({ preventScroll: true });
  });
})();
