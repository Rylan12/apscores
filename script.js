function renderChart(exam) {
    $.getJSON('data/json/' + exam + '.json', function (data) {
        let years = [];
        let datasets = [
            {
                label: 5,
                data: [],
                // data: [0.12, 0.19, 0.3, 0.5, 0.2, 0.3],
                borderColor: '#ff6384',
                fill: false,
            }, {
                label: 4,
                data: [],
                // data: [0.9, 0.88, 0.18, 0.85, 0.26, 0.29],
                borderColor: '#36a2eb',
                fill: false,
            }, {
                label: 3,
                data: [],
                // data: [0.65, 0.75, 0.32, 0.62, 0.82, 0.13],
                borderColor: '#ffce56',
                fill: false,
            }, {
                label: 2,
                data: [],
                // data: [0.72, 0.89, 0.49, 0.11, 0.38, 0.32],
                borderColor: '#4bc0c0',
                fill: false,
            }, {
                label: 1,
                data: [],
                // data: [0.68, 0.02, 0.28, 0.91, 0.18, 0.3],
                borderColor: '#9966ff',
                fill: false,
            }, {
                label: '3 or Higher',
                data: [],
                // data: [0.87, 0.97, 0.21, 0.57, 0.14, 0.33],
                borderColor: '#ff9f40',
                fill: false,
            }
        ];

        for (let year in data) {
            years.push(data[year][0])
            for (let i = 1; i <= 5; i++) {
                datasets[i - 1].data.push(data[year][i])
            }

            datasets[5].data.push(data[year][7])
        }

        let ctx = document.getElementById('chart').getContext('2d');
        let myChart = new Chart(ctx, {
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

$(document).ready(function() {
    $.getJSON('data/exams.json', function (data) {
        let examSelector = $('#examSelector')
        data.forEach(function (exam) {
            let examOption = $(`<option value="${exam}">${exam}</option>`)
            examSelector.append(examOption)
        })
    })

    $('#examSelector').change(function () {
        let selectedExam = $(this).children('option:selected').val();
        renderChart(selectedExam)
    })
});