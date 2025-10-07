document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('weightForm');
  const weightInput = document.getElementById('weight');
  const ctx = document.getElementById('weightChart').getContext('2d');
  let chart;

  // Build a canonical local YYYY-MM-DD date key (no TZ surprises)
  function getLocalDateKey(d = new Date()) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function checkDateChange() {
    const lastDateKey = localStorage.getItem('lastDateKey');
    const todayKey = getLocalDateKey();
    const weightData = JSON.parse(localStorage.getItem('weightData')) || [];

    // weightData now stores entry.dateKey === 'YYYY-MM-DD'
    const weightEnteredToday = weightData.some(entry => entry.dateKey === todayKey);

    if (lastDateKey !== todayKey || !weightEnteredToday) {
      localStorage.setItem('lastDateKey', todayKey);
      weightInput.value = '';
      form.style.display = 'block';
      document.getElementById('message').style.display = 'none';
    } else {
      form.style.display = 'none';
      document.getElementById('message').style.display = 'block';
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const weight = parseFloat(weightInput.value);
    const dateKey = getLocalDateKey();

    let weightData = JSON.parse(localStorage.getItem('weightData')) || [];
    weightData.push({ dateKey, weight });
    localStorage.setItem('weightData', JSON.stringify(weightData));

    // Refresh lastDateKey on submit too (keeps things consistent)
    localStorage.setItem('lastDateKey', dateKey);

    updateChart();
    weightInput.value = '';
    form.style.display = 'none';
    document.getElementById('message').style.display = 'block';
  });

  function updateChart() {
    const raw = JSON.parse(localStorage.getItem('weightData')) || [];

    // Map to {x: Date, y: Number} and sort by date ascending
    const data = raw
      .map(entry => ({
        x: new Date(`${entry.dateKey}T00:00:00`), // safe parse
        y: parseFloat(entry.weight)
      }))
      .sort((a, b) => a.x - b.x);

    if (chart) chart.destroy();

    // Guard against empty data
    const xMin = data.length ? data[0].x : undefined;
    const xMax = data.length ? data[data.length - 1].x : undefined;

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Weight Over Time',
          data,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: false
        }]
      },
      options: {
        parsing: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'MM/dd/yyyy',
              displayFormats: { day: 'MM/dd' }
            },
            title: { display: true, text: 'Date' },
            ...(data.length ? { min: xMin, max: xMax } : {})
          },
          y: {
            beginAtZero: false,
            title: { display: true, text: 'Weight' }
          }
        }
      }
    });
  }

  checkDateChange();
  updateChart();
});
