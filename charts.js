const Charts = {
create(ctx, type, data, options = {}) {
const defaultOptions = CONFIG.CHART.DEFAULT_OPTIONS;
const mergedOptions = this.mergeOptions(defaultOptions, options);

if (State.ui.currentChart) {
State.ui.currentChart.destroy();
}

State.ui.currentChart = new Chart(ctx, {
type,
data,
options: mergedOptions
});

return State.ui.currentChart;
},

mergeOptions(defaults, custom) {
const merged = JSON.parse(JSON.stringify(defaults));

if (custom.plugins) {
merged.plugins = { ...merged.plugins, ...custom.plugins };
}
if (custom.scales) {
merged.scales = { ...merged.scales, ...custom.scales };
}
if (custom.animation) {
merged.animation = { ...merged.animation, ...custom.animation };
}

return merged;
},

createBarChart(ctx, labels, datasets) {
return this.create(ctx, 'bar', {
labels,
datasets: datasets.map((ds, i) => ({
...ds,
borderRadius: 20,
borderSkipped: false,
borderWidth: 2
}))
}, {
scales: {
y: {
beginAtZero: true,
grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
ticks: {
color: '#9ca3af',
callback: (val) => Utils.formatNumber(val)
}
},
x: {
grid: { display: false },
ticks: { color: '#f9fafb', font: { size: 14, weight: '600' } }
}
},
plugins: {
legend: { display: false },
tooltip: {
backgroundColor: 'rgba(3,7,18,0.95)',
titleColor: '#f9fafb',
bodyColor: '#f9fafb',
borderColor: 'rgba(6,182,212,0.3)',
borderWidth: 1,
cornerRadius: 16,
padding: 16,
displayColors: false,
callbacks: {
label: (ctx) => `${ctx.parsed.y.toLocaleString('vi-VN')} lượt`
}
}
},
animation: { duration: 2000, easing: 'easeOutQuart' }
});
},

createRadarChart(ctx, labels, data) {
return this.create(ctx, 'radar', {
labels,
datasets: [{
data,
backgroundColor: 'rgba(6,182,212,0.2)',
borderColor: '#06b6d4',
pointBackgroundColor: '#06b6d4',
pointBorderColor: '#fff',
pointHoverBackgroundColor: '#fff',
pointHoverBorderColor: '#06b6d4',
borderWidth: 2
}]
}, {
scales: {
r: {
beginAtZero: true,
max: 100,
grid: { color: 'rgba(255,255,255,0.05)' },
angleLines: { color: 'rgba(255,255,255,0.05)' },
pointLabels: {
color: '#9ca3af',
font: { size: 11, family: 'Be Vietnam Pro' }
}
}
},
plugins: { legend: { display: false } }
});
},

createLineChart(ctx, labels, datasets) {
return this.create(ctx, 'line', {
labels,
datasets: datasets.map(ds => ({
...ds,
tension: 0.4,
fill: true,
borderWidth: 2
}))
}, {
interaction: { intersect: false, mode: 'index' },
plugins: {
legend: {
position: 'top',
labels: { color: '#f9fafb', font: { size: 14 } }
},
tooltip: {
backgroundColor: 'rgba(3,7,18,0.95)',
titleColor: '#f9fafb',
bodyColor: '#f9fafb',
borderColor: 'rgba(6,182,212,0.3)',
borderWidth: 1,
cornerRadius: 16,
padding: 16,
callbacks: {
label: (ctx) => `${ctx.dataset.label}: ${Utils.formatNumber(ctx.parsed.y)}`
}
}
},
scales: {
y: {
beginAtZero: true,
grid: { color: 'rgba(255,255,255,0.05)' },
ticks: { color: '#9ca3af', callback: (v) => Utils.formatNumber(v) }
},
x: { grid: { display: false }, ticks: { color: '#f9fafb' } }
}
});
},

getGradient(ctx, color1, color2) {
const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, color1);
gradient.addColorStop(1, color2);
return gradient;
}
};
