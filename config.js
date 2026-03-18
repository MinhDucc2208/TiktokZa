const CONFIG = {
API: {
BASE_URL: 'https://www.tikwm.com/api',
TIMEOUT: 15000,
RETRIES: 1
},
STORAGE: {
HISTORY_KEY: 'tiktok_history',
FAVORITES_KEY: 'tiktok_favorites',
SETTINGS_KEY: 'tiktok_settings',
MAX_HISTORY: 50
},
CHART: {
DEFAULT_OPTIONS: {
responsive: true,
maintainAspectRatio: false,
plugins: {
legend: {
labels: {
color: '#f9fafb',
font: { size: 14, family: 'Be Vietnam Pro' }
}
}
},
scales: {
y: {
grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
ticks: { color: '#9ca3af', font: { size: 12 } }
},
x: {
grid: { display: false },
ticks: { color: '#f9fafb', font: { size: 12 } }
}
}
}
},
UI: {
NOTIFICATION_DURATION: 3000,
ANIMATION_DURATION: 2000,
DEBOUNCE_DELAY: 300
},
SCORING: {
TREND_MAX: 2000000,
VIRAL_THRESHOLD_HOT: 10,
VIRAL_THRESHOLD_WARM: 5,
ENGAGEMENT_EXCELLENT: 15,
ENGAGEMENT_GOOD: 10,
ENGAGEMENT_AVERAGE: 5,
PERFORMANCE_MAX: 4000
}
};
