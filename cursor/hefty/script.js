document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('weightForm');
    const weightInput = document.getElementById('weight');
    const ctx = document.getElementById('weightChart').getContext('2d');
    let chart; // Reference to the chart instance

    // Function to check if the date has changed and if a weight has been entered
    function checkDateChange() {
        const lastDate = localStorage.getItem('lastDate');
        const currentDate = new Date().toLocaleDateString();
        const weightData = JSON.parse(localStorage.getItem('weightData')) || [];
        const weightEnteredToday = weightData.some(entry => entry.date === currentDate);

        if (lastDate !== currentDate || !weightEnteredToday) {
            localStorage.setItem('lastDate', currentDate);
            weightInput.value = ''; // Reset weight input for the new day
            form.style.display = 'block'; // Show the form
            document.getElementById('message').style.display = 'none'; // Hide the message
        } else {
            form.style.display = 'none'; // Hide the form
            document.getElementById('message').style.display = 'block'; // Show the message
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const weight = parseFloat(weightInput.value); // Convert weight to a number
        const date = new Date().toLocaleDateString();

        let weightData = JSON.parse(localStorage.getItem('weightData')) || [];
        weightData.push({ date, weight });
        localStorage.setItem('weightData', JSON.stringify(weightData));

        updateChart();
        weightInput.value = '';

        // Hide the form and show the message
        form.style.display = 'none';
        document.getElementById('message').style.display = 'block';
    });

    function updateChart() {
        const weightData = JSON.parse(localStorage.getItem('weightData')) || [];
        const data = weightData.map(entry => ({
            x: new Date(entry.date),
            y: parseFloat(entry.weight)
        }));

        console.log(data);
        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Weight Over Time',
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            tooltipFormat: 'MM/dd/yyyy',
                            displayFormats: {
                                day: 'MM/dd'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        },
                        // Add this to ensure all data points are shown
                        min: data[0].x,
                        max: data[data.length - 1].x
                    },
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Weight'
                        }
                    }
                },
                parsing: false
            }
        });
    }

    // Check date change on page load
    checkDateChange();
    updateChart();
});