let chart
let selectedExam = 'Choose Exam'
let chartType = 'line'

function getExamName(exam) {
    return exam
        .replaceAll(/_([^_])([^_]*)/g, (_, capital, lower) => ` ${capital}${lower.toLowerCase()}`)
        .replaceAll(/ (\w{2})(?: |$)/ig, (word) => ` ${word.toUpperCase()} `);
}

function renderChart(exam, chartType) {
    if (chart) {
        chart.destroy()
    }
    if (exam === 'Choose Exam') {
        return
    }
    fetch(`data/json/${exam}.json`).then(response => response.json()).then(data => {
        let type
        let years = [];
        let datasets = [
            {
                label: 1,
                data: [],
                backgroundColor: '#9966ff33',
                borderColor: '#9966ff',
                order: 1,
            }, {
                label: 2,
                data: [],
                backgroundColor: '#4bc0c033',
                borderColor: '#4bc0c0',
                order: 1,
            }, {
                label: 3,
                data: [],
                backgroundColor: '#ffce5633',
                borderColor: '#ffce56',
                order: 1,
            }, {
                label: 4,
                data: [],
                backgroundColor: '#36a2eb33',
                borderColor: '#36a2eb',
                order: 1,
            }, {
                label: 5,
                data: [],
                backgroundColor: '#ff638433',
                borderColor: '#ff6384',
                order: 1,
            }, {
                data: [],
                borderColor: '#ff9f40',
                fill: false,
                order: 0,
            }
        ];
        let options = {
            title: {
                display: true,
                text: `${getExamName(exam)} Exam Score Distribution`
            }
        };

        // Populate years as labels
        years = Object.keys(data.data)

        // Populate datasets
        years.forEach(year => {
            for (let i = 0; i <= 5; i++) {
                datasets[i].data.push(data.data[year][i]);
            }
        });

        // Populate chart type and options
        switch (chartType) {
            case 'line':
                type = 'line';
                options.scales = {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                    }]
                };
                for (let i = 0; i < 5; i++) {
                    datasets[i].fill = false;
                }
                datasets[5].label = 'Pass Percentage';
                break;
            case 'stacked-line':
                type = 'line';
                options.scales = {
                    xAxes: [{stacked: true}],
                    yAxes: [{stacked: true}]
                };
                datasets.pop();
                datasets[0].fill = true
                for (let i = 1; i < 5; i++) {
                    datasets[i].fill = '-1';
                }
                break;
            case 'stacked-bar':
                type = 'bar';
                options.scales = {
                    xAxes: [{stacked: true}],
                    yAxes: [{stacked: true}]
                };
                for (let i = 0; i < 5; i++) {
                    datasets[i].borderWidth = 3;
                }
                datasets[5].label = 'Failure Percentage';
                datasets[5].type = 'line';
                datasets[5].data = datasets[5].data.map(x => 1 - x);
                break;
        }

        let ctx = document.getElementById('chart').getContext('2d');
        chart = new Chart(ctx, {
            type: type,
            data: {
                labels: years,
                datasets: datasets
            },
            options: options
        });
    });
}

window.addEventListener('load', () => {
    fetch('data/exams.json').then(response => response.json()).then(data => {
        let examSelector = document.querySelector('#examSelector');
        data.sort();
        data.forEach(exam => {
            let examOption = document.createElement('option');
            examOption.value = exam;
            examOption.text = getExamName(exam);
            examSelector.append(examOption);
        });
    });

    document.querySelector('#examSelector').onchange = function () {
        selectedExam = this.options[this.selectedIndex].value;
        renderChart(selectedExam, chartType);
    };

    document.querySelector('#chartTypeSelector').onchange = function () {
        chartType = this.options[this.selectedIndex].value;
        renderChart(selectedExam, chartType);
    };
});