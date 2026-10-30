// -----------------------------------------
// AIR QUALITY & POLLUTION PATTERN ANALYSIS
// Sample dataset for academic demonstration
// -----------------------------------------

const cities = [
    {
        name: "Delhi",
        aqi: 280,
        pm25: 110,
        pm10: 190,
        no2: 48,
        trend: [210, 230, 220, 260, 280, 250, 280]
    },
    {
        name: "Lucknow",
        aqi: 180,
        pm25: 72,
        pm10: 125,
        no2: 32,
        trend: [140, 160, 155, 175, 190, 170, 180]
    },
    {
        name: "Bareilly",
        aqi: 120,
        pm25: 48,
        pm10: 85,
        no2: 22,
        trend: [100, 110, 105, 125, 135, 115, 120]
    },
    {
        name: "Mumbai",
        aqi: 95,
        pm25: 35,
        pm10: 65,
        no2: 18,
        trend: [80, 85, 90, 100, 95, 90, 95]
    },
    {
        name: "Kolkata",
        aqi: 200,
        pm25: 80,
        pm10: 140,
        no2: 38,
        trend: [170, 180, 190, 210, 220, 195, 200]
    }
];

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

// Determine a simple descriptive category.
// Categories are illustrative and should not be treated
// as an official AQI conversion for every country.

function getQuality(aqi) {
    if (aqi <= 50) {
        return {
            label: "Good",
            className: "good"
        };
    }

    if (aqi <= 100) {
        return {
            label: "Satisfactory",
            className: "moderate"
        };
    }

    if (aqi <= 200) {
        return {
            label: "Moderate",
            className: "moderate"
        };
    }

    if (aqi <= 300) {
        return {
            label: "Poor",
            className: "poor"
        };
    }

    return {
        label: "Very Poor",
        className: "very-poor"
    };
}

// Get currently selected cities.

function getSelectedCities() {
    const selected = document.getElementById("citySelect").value;

    if (selected === "all") {
        return cities;
    }

    return cities.filter(city => city.name === selected);
}

// Calculate average values.

function average(data, key) {
    if (data.length === 0) {
        return 0;
    }

    const total = data.reduce((sum, item) => sum + item[key], 0);

    return total / data.length;
}

// Chart.js configuration.

Chart.defaults.font.family = "Inter, Arial, sans-serif";
Chart.defaults.color = "#7b8b84";

// AQI Bar Chart.

const aqiChart = new Chart(
    document.getElementById("aqiChart"),
    {
        type: "bar",

        data: {
            labels: [],
            datasets: [{
                label: "Air Quality Index",
                data: [],
                backgroundColor: [
                    "#e58d59",
                    "#e9bb5c",
                    "#49ad83",
                    "#65a8d9",
                    "#9a87d8"
                ],
                borderRadius: 7,
                maxBarThickness: 45
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: "#edf1ee"
                    },
                    title: {
                        display: true,
                        text: "AQI (index)"
                    }
                },

                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    }
);

// Pollutant Doughnut Chart.

const pollutantChart = new Chart(
    document.getElementById("pollutantChart"),
    {
        type: "doughnut",

        data: {
            labels: ["PM2.5", "PM10", "NO₂"],
            datasets: [{
                data: [72, 118, 32],
                backgroundColor: [
                    "#17866a",
                    "#f0b65d",
                    "#6aa9d9"
                ],
                borderWidth: 3,
                borderColor: "#ffffff",
                hoverOffset: 7
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        usePointStyle: true,
                        padding: 18
                    }
                }
            }
        }
    }
);

// Daily Trend Line Chart.

const trendChart = new Chart(
    document.getElementById("trendChart"),
    {
        type: "line",

        data: {
            labels: days,
            datasets: [{
                label: "AQI",
                data: [],
                borderColor: "#17866a",
                backgroundColor: "rgba(23, 134, 106, 0.12)",
                fill: true,
                tension: 0.35,
                borderWidth: 3,

                pointRadius: 4,
                pointBackgroundColor: "#17866a"
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: "#edf1ee"
                    },
                    title: {
                        display: true,
                        text: "AQI (index)"
                    }
                },

                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    }
);

// Update dashboard statistics.

function updateStatistics(data) {
    document.getElementById("avgAqi").textContent =
        Math.round(average(data, "aqi"));

    document.getElementById("avgPm25").innerHTML =
        `${Math.round(average(data, "pm25"))} <small>µg/m³</small>`;

    document.getElementById("avgPm10").innerHTML =
        `${Math.round(average(data, "pm10"))} <small>µg/m³</small>`;

    document.getElementById("cityCount").textContent = data.length;
}

// Update city comparison chart.

function updateAqiChart(data) {
    aqiChart.data.labels = data.map(city => city.name);

    aqiChart.data.datasets[0].data =
        data.map(city => city.aqi);

    aqiChart.update();
}

// Update pollutant chart.

function updatePollutantChart(data) {
    pollutantChart.data.datasets[0].data = [
        average(data, "pm25"),
        average(data, "pm10"),
        average(data, "no2")
    ];

    pollutantChart.update();
}

// Update the daily trend chart.

function updateTrendChart(data) {
    if (data.length === 1) {
        trendChart.data.datasets[0].data = data[0].trend;

        trendChart.data.datasets[0].label =
            `${data[0].name} AQI`;

        trendChart.data.datasets[0].borderColor = "#17866a";
        trendChart.data.datasets[0].pointBackgroundColor = "#17866a";

        trendChart.data.datasets[0].backgroundColor =
            "rgba(23, 134, 106, 0.12)";
    } else {
        const dailyAverages = days.map((day, index) => {
            return Math.round(
                data.reduce(
                    (sum, city) => sum + city.trend[index],
                    0
                ) / data.length
            );
        });

        trendChart.data.datasets[0].data = dailyAverages;
        trendChart.data.datasets[0].label = "Average AQI";

        trendChart.data.datasets[0].borderColor = "#17866a";
        trendChart.data.datasets[0].pointBackgroundColor = "#17866a";

        trendChart.data.datasets[0].backgroundColor =
            "rgba(23, 134, 106, 0.12)";
    }

    trendChart.update();
}

// Update the pollution report table.

function updateTable(data) {
    const tableBody = document.getElementById("cityTableBody");

    tableBody.innerHTML = "";

    data.forEach(city => {
        const quality = getQuality(city.aqi);

        const row = document.createElement("tr");

        const values = [
            city.name,
            city.aqi,
            city.pm25,
            city.pm10,
            city.no2
        ];

        values.forEach((value, index) => {
            const cell = document.createElement("td");

            cell.textContent = value;

            if (index === 0) {
                cell.className = "city-name";
            }

            if (index === 1) {
                cell.className = "aqi-value";
            }

            row.appendChild(cell);
        });

        const qualityCell = document.createElement("td");
        const badge = document.createElement("span");

        badge.className = `quality ${quality.className}`;
        badge.textContent = quality.label;

        qualityCell.appendChild(badge);
        row.appendChild(qualityCell);

        tableBody.appendChild(row);
    });
}

// Generate a basic data insight.

function updateInsight(data) {
    const insight = document.getElementById("insightText");

    if (data.length === 0) {
        insight.textContent = "No data is available for analysis.";
        return;
    }

    const highest = data.reduce((a, b) =>
        a.aqi > b.aqi ? a : b
    );

    const lowest = data.reduce((a, b) =>
        a.aqi < b.aqi ? a : b
    );

    const avg = Math.round(average(data, "aqi"));

    if (data.length === 1) {
        const city = data[0];

        const maximum = Math.max(...city.trend);
        const minimum = Math.min(...city.trend);

        insight.textContent =
            `${city.name} has a sample AQI of ${city.aqi}. ` +
            `Its illustrative weekly values range from ${minimum} ` +
            `to ${maximum}, with an average of ${Math.round(
                average(city.trend.map(aqi => ({ aqi })), "aqi")
            )}. These values are simulated for demonstration.`;
    } else {
        insight.textContent =
            `The highest sample AQI is ${highest.aqi} in ${highest.name}, ` +
            `while the lowest is ${lowest.aqi} in ${lowest.name}. ` +
            `The average AQI across ${data.length} cities is ${avg}. ` +
            `These comparisons use illustrative data, not live readings.`;
    }
}

// Refresh all dashboard components.

function updateDashboard() {
    const selectedCities = getSelectedCities();

    updateStatistics(selectedCities);
    updateAqiChart(selectedCities);
    updatePollutantChart(selectedCities);
    updateTrendChart(selectedCities);
    updateTable(selectedCities);
    updateInsight(selectedCities);
}

// City selector event.

document.getElementById("citySelect").addEventListener(
    "change",
    updateDashboard
);

// Initial dashboard display.

updateDashboard();