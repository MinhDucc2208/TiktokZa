const State = {
data: {
video: null,
history: [],
favorites: [],
settings: {
darkMode: true,
language: 'vi',
autoSave: true
}
},
ui: {
currentView: 'dashboard',
isAnalyzing: false,
sidebarOpen: false,
currentChart: null,
notificationId: 0
},
getVideo() {
return this.data.video;
},
setVideo(video) {
this.data.video = video;
},
getHistory() {
return this.data.history;
},
addToHistory(item) {
this.data.history.unshift(item);
if (this.data.history.length > CONFIG.STORAGE.MAX_HISTORY) {
this.data.history.pop();
}
this.saveHistory();
},
removeFromHistory(id) {
this.data.history = this.data.history.filter(h => h.id !== id);
this.saveHistory();
},
clearHistory() {
this.data.history = [];
this.saveHistory();
},
saveHistory() {
localStorage.setItem(CONFIG.STORAGE.HISTORY_KEY, JSON.stringify(this.data.history));
},
loadHistory() {
const stored = localStorage.getItem(CONFIG.STORAGE.HISTORY_KEY);
if (stored) {
this.data.history = JSON.parse(stored);
}
},
getFavorites() {
return this.data.favorites;
},
addToFavorites(item) {
if (!this.data.favorites.find(f => f.id === item.id)) {
this.data.favorites.push(item);
this.saveFavorites();
return true;
}
return false;
},
removeFromFavorites(id) {
this.data.favorites = this.data.favorites.filter(f => f.id !== id);
this.saveFavorites();
},
saveFavorites() {
localStorage.setItem(CONFIG.STORAGE.FAVORITES_KEY, JSON.stringify(this.data.favorites));
},
loadFavorites() {
const stored = localStorage.getItem(CONFIG.STORAGE.FAVORITES_KEY);
if (stored) {
this.data.favorites = JSON.parse(stored);
}
},
getSettings() {
return this.data.settings;
},
updateSettings(settings) {
this.data.settings = { ...this.data.settings, ...settings };
this.saveSettings();
},
saveSettings() {
localStorage.setItem(CONFIG.STORAGE.SETTINGS_KEY, JSON.stringify(this.data.settings));
},
loadSettings() {
const stored = localStorage.getItem(CONFIG.STORAGE.SETTINGS_KEY);
if (stored) {
this.data.settings = JSON.parse(stored);
}
},
init() {
this.loadHistory();
this.loadFavorites();
this.loadSettings();
}
};
