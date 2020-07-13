let chart;
let selectedExam = 'Choose Exam';
let chartType = 'line';

function getExamName(exam) {
    return exam
        .replaceAll(/_([^_])([^_]*)/g, (_, capital, lower) => ` ${capital}${lower.toLowerCase()}`)
        .replaceAll(/ (\w{2})(?: |$)/ig, (word) => ` ${word.toUpperCase()} `);
}

function renderChart() {
    if (chart) {
        chart.destroy();
    }
    if (selectedExam === 'Choose Exam') {
        return;
    }
    fetch(`data/json/${selectedExam}.json`).then(response => response.json()).then(data => {
        let type;
        let years;
        let colors = [];
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
                text: `${getExamName(selectedExam)} Exam Score Distribution`
            },
            tooltips: {
                callbacks: {
                    label: (tooltipItem, data) => {
                        let label = data.datasets[tooltipItem.datasetIndex].label || '';
                        label = label ? `${label}: ` : ''
                        return `${label}${tooltipItem.yLabel}%`
                    }
                }
            }
        };

        // Populate years as labels
        years = Object.keys(data.data);

        // Populate datasets
        years.forEach(year => {
            for (let i = 0; i <= 5; i++) {
                datasets[i].data.push(Math.round(data.data[year][i] * 1000) / 10);
            }
            colors.push(data['major_revisions'].includes(parseInt(year)) ? '#00000080' : '#00000019');
        });

        let yAxisTicks = {
            beginAtZero: true,
            callback: (value) => value + '%'
        };

        let xAxisGridLines = {drawBorder: false, color: colors};

        // Populate chart type and options
        switch (chartType) {
            case 'line':
                type = 'line';
                options.scales = {
                    yAxes: [{ticks: yAxisTicks}],
                    xAxes: [{gridLines: xAxisGridLines}]
                };
                for (let i = 0; i < 5; i++) {
                    datasets[i].fill = false;
                }
                datasets[5].label = 'Pass Percentage';
                break;
            case 'stacked-line':
                type = 'line';
                yAxisTicks.max = 100;
                options.scales = {
                    xAxes: [{stacked: true, gridLines: xAxisGridLines}],
                    yAxes: [{stacked: true, ticks: yAxisTicks}]
                };
                datasets.pop();
                datasets[0].fill = true;
                for (let i = 1; i < 5; i++) {
                    datasets[i].fill = '-1';
                }
                break;
            case 'stacked-bar':
                type = 'bar';
                yAxisTicks.max = 100;
                options.scales = {
                    xAxes: [{stacked: true, gridLines: xAxisGridLines}],
                    yAxes: [{stacked: true, ticks: yAxisTicks}]
                };
                for (let i = 0; i < 5; i++) {
                    datasets[i].borderWidth = 3;
                }
                datasets[5].label = 'Failure Percentage';
                datasets[5].type = 'line';
                datasets[5].data = datasets[5].data.map(x => 100 - x);
                break;
        }

        let ctx = document.getElementById('chart').getContext('2d');
        chart = new Chart(ctx, {
            type,
            data: {
                labels: years,
                datasets,
            },
            options
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

    document.querySelector('#examSelector').addEventListener('change', function () {
        selectedExam = this.options[this.selectedIndex].value;
        renderChart();
    });

    document.querySelector('#chartTypeSelector').addEventListener('change', function () {
        chartType = this.options[this.selectedIndex].value;
        renderChart();
    });
});