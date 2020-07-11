let chart

function renderChart(exam) {
    if (chart) {
        chart.destroy()
    }
    if (exam === 'Choose Exam') {
        return
    }
    fetch(`data/json/${exam}.json`).then(response => response.json()).then(data => {
        let years = [];
        let datasets = [
            {
                label: 5,
                data: [],
                borderColor: '#ff6384',
                fill: false,
            }, {
                label: 4,
                data: [],
                borderColor: '#36a2eb',
                fill: false,
            }, {
                label: 3,
                data: [],
                borderColor: '#ffce56',
                fill: false,
            }, {
                label: 2,
                data: [],
                borderColor: '#4bc0c0',
                fill: false,
            }, {
                label: 1,
                data: [],
                borderColor: '#9966ff',
                fill: false,
            }, {
                label: '3 or Higher',
                data: [],
                borderColor: '#ff9f40',
                fill: false,
            }
        ];

        for (let year in data) {
            years.push(data[year][0]);
            for (let i = 1; i <= 5; i++) {
                datasets[i - 1].data.push(data[year][i]);
            }

            datasets[5].data.push(data[year][7]);
        }

        let ctx = document.getElementById('chart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: datasets
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                responsive: false
            }
        });
    });
}

window.addEventListener('load', () => {
    fetch('data/exams.json').then(response => response.json()).then(data => {
        let examSelector = document.querySelector('#examSelector');
        data.sort();
        data.forEach(exam => {
            let examName = exam
                .replaceAll(/_([^_])([^_]*)/g, (_, capital, lower) => ` ${capital}${lower.toLowerCase()}`)
                .replaceAll(/ (\w{2})(?: |$)/ig, (word) => ` ${word.toUpperCase()} `);
            let examOption = document.createElement('option');
            examOption.value = exam;
            examOption.text = examName;
            examSelector.append(examOption);
        });
    });

    document.querySelector('#examSelector').onchange = function () {
        renderChart(this.options[this.selectedIndex].value);
    };
});