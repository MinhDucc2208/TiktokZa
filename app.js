const App = {
init() {
State.init();
this.setupEventListeners();
this.setupConstellation();
this.renderEmptyState();
},

setupEventListeners() {
const urlInput = document.getElementById('urlInput');
urlInput.addEventListener('paste', (e) => {
setTimeout(() => {
const url = urlInput.value.trim();
if (Utils.isValidTikTokUrl(url) && !State.ui.isAnalyzing) {
setTimeout(() => this.analyze(), 500);
}
}, 0);
});

urlInput.addEventListener('keydown', (e) => {
if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
this.analyze();
}
});

document.addEventListener('keydown', (e) => {
if (e.key === 'Escape') {
document.getElementById('sidebar').classList.remove('open');
}
if (e.key >= '1' && e.key <= '9') {
const views = ['dashboard', 'trend', 'virality', 'engagement', 'performance', 'seo', 'hashtags', 'besttime', 'compare'];
const index = parseInt(e.key) - 1;
if (views[index] && State.getVideo()) {
this.showView(views[index]);
}
}
});

window.addEventListener('beforeunload', (e) => {
if (State.ui.isAnalyzing) {
e.preventDefault();
e.returnValue = 'Đang phân tích video. Bạn có chắc muốn rời đi?';
}
});
},

setupConstellation() {
const canvas = document.getElementById('constellation');
const ctx = canvas.getContext('2d');
const particles = [];
let mouse = { x: 0, y: 0 };

const resize = () => {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
};

resize();
window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => {
mouse.x = e.clientX;
mouse.y = e.clientY;
});

const count = window.innerWidth < 768 ? 25 : 50;
for (let i = 0; i < count; i++) {
particles.push({
x: Math.random() * canvas.width,
y: Math.random() * canvas.height,
vx: (Math.random() - 0.5) * 0.3,
vy: (Math.random() - 0.5) * 0.3,
size: Math.random() * 2 + 0.5,
color: Math.random() > 0.6 ? 'rgba(6,182,212,0.6)' : Math.random() > 0.3 ? 'rgba(139,92,246,0.6)' : 'rgba(236,72,153,0.6)'
});
}

const animate = () => {
ctx.clearRect(0, 0, canvas.width, canvas.height);

particles.forEach((p, i) => {
p.x += p.vx;
p.y += p.vy;
if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

ctx.beginPath();
ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
ctx.fillStyle = p.color;
ctx.fill();

const dx = mouse.x - p.x;
const dy = mouse.y - p.y;
const dist = Math.sqrt(dx * dx + dy * dy);
if (dist < 120) {
ctx.beginPath();
ctx.moveTo(p.x, p.y);
ctx.lineTo(mouse.x, mouse.y);
ctx.strokeStyle = `rgba(6,182,212,${1 - dist / 120})`;
ctx.lineWidth = 0.8;
ctx.stroke();
}

for (let j = i + 1; j < particles.length; j++) {
const p2 = particles[j];
const dx2 = p2.x - p.x;
const dy2 = p2.y - p.y;
const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
if (dist2 < 80) {
ctx.beginPath();
ctx.moveTo(p.x, p.y);
ctx.lineTo(p2.x, p2.y);
ctx.strokeStyle = `rgba(139,92,246,${0.3 * (1 - dist2 / 80)})`;
ctx.lineWidth = 0.5;
ctx.stroke();
}
}
});

requestAnimationFrame(animate);
};

animate();
},

async analyze() {
const urlInput = document.getElementById('urlInput');
const btn = document.getElementById('analyzeBtn');
const statusDiv = document.getElementById('status');
const url = urlInput.value.trim();

if (!Utils.isValidTikTokUrl(url)) {
Components.notify('Link TikTok không hợp lệ', 'error');
urlInput.focus();
return;
}

State.ui.isAnalyzing = true;
btn.disabled = true;
statusDiv.innerHTML = Components.loading();

try {
const data = await API.analyze(url);
State.setVideo(data);

const historyItem = {
id: Utils.generateId(),
url: url,
title: data.title || 'Không có tiêu đề',
author: data.author?.nickname || 'Không rõ',
cover: data.cover,
duration: data.duration,
metrics: Utils.calculateMetrics(data),
date: new Date().toISOString(),
videoId: data.id
};

State.addToHistory(historyItem);

statusDiv.innerHTML = '';
Components.notify('Phân tích thành công!', 'success');
this.showView('dashboard');

} catch (error) {
statusDiv.innerHTML = Components.error(error.message);
Components.notify(error.message, 'error');
} finally {
State.ui.isAnalyzing = false;
btn.disabled = false;
}
},

showView(viewName) {
if (!State.getVideo() && viewName !== 'history' && viewName !== 'favorites' && viewName !== 'compare') {
Components.notify('Vui lòng phân tích video trước', 'error');
return;
}

State.ui.currentView = viewName;

document.querySelectorAll('.menu-item').forEach(item => {
item.classList.toggle('active', item.dataset.view === viewName);
});

const titles = {
dashboard: 'Bảng Điều Khiển',
trend: 'Điểm Xu Hướng',
virality: 'Tiềm Năng Viral',
engagement: 'Tương Tác',
performance: 'Hiệu Suất',
seo: 'Phân Tích SEO',
hashtags: 'Chiến Lược Hashtag',
besttime: 'Thời Điểm Vàng',
compare: 'So Sánh Video',
download: 'Tải Video',
history: 'Lịch Sử Phân Tích',
favorites: 'Video Yêu Thích'
};

document.getElementById('pageTitle').textContent = titles[viewName] || 'Bảng Điều Khiển';

const views = {
dashboard: DashboardView,
trend: TrendView,
virality: ViralityView,
engagement: EngagementView,
performance: PerformanceView,
seo: SEOView,
hashtags: HashtagsView,
besttime: BestTimeView,
compare: CompareView,
download: DownloadView,
history: HistoryView,
favorites: FavoritesView
};

if (views[viewName]) {
views[viewName].render();
}

if (window.innerWidth < 1024) {
document.getElementById('sidebar').classList.remove('open');
}
},

toggleSidebar() {
document.getElementById('sidebar').classList.toggle('open');
},

toggleTheme() {
const newMode = !State.getSettings().darkMode;
State.updateSettings({ darkMode: newMode });
document.body.style.filter = newMode ? 'none' : 'invert(1) hue-rotate(180deg)';
Components.notify(newMode ? 'Chế độ tối' : 'Chế độ sáng', 'info');
},

exportReport() {
const data = State.getVideo();
if (!data) {
Components.notify('Chưa có dữ liệu để xuất', 'error');
return;
}

const m = Utils.calculateMetrics(data);
const report = `
TIKTOK AI PRO - BÁO CÁO PHÂN TÍCH
====================================
Video: ${data.title}
Tác giả: ${data.author?.nickname}
Ngày: ${new Date().toLocaleString('vi-VN')}

THỐNG KÊ:
- Lượt xem: ${Utils.formatNumber(m.views)}
- Thích: ${Utils.formatNumber(m.likes)}
- Bình luận: ${Utils.formatNumber(m.comments)}
- Chia sẻ: ${Utils.formatNumber(m.shares)}
- Tỷ lệ tương tác: ${m.engagement}%
- Điểm xu hướng: ${m.trendScoreFormatted}
- Tiềm năng viral: ${m.viralProbability}%

ĐÁNH GIÁ:
- Chất lượng: ${m.qualityScore}/100
- SEO: ${m.seoScore}/100
- Hiệu suất: ${m.performanceScore} điểm
`;

const blob = new Blob([report], { type: 'text/plain' });
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = `tiktok-report-${Date.now()}.txt`;
a.click();
Components.notify('Đã xuất báo cáo!', 'success');
},

showSettings() {
const settings = State.getSettings();
const content = document.getElementById('content');

content.innerHTML = `
<div class="content-morph">
<div style="max-width:600px;margin:0 auto">
<div class="info-prism">
<div class="prism-header">
<div class="prism-icon"><i class="fas fa-gear"></i></div>
<div>
<div class="prism-title">Cài đặt</div>
<div class="prism-subtitle">Tùy chỉnh ứng dụng</div>
</div>
</div>
<div class="prism-grid">
<div class="prism-item" style="cursor:pointer" onclick="App.toggleTheme()">
<div class="prism-label"><i class="fas fa-moon" style="color:var(--accent-cyan)"></i> Giao diện</div>
<div class="prism-value">${settings.darkMode ? 'Tối' : 'Sáng'} (Click để đổi)</div>
</div>
<div class="prism-item">
<div class="prism-label"><i class="fas fa-language" style="color:var(--accent-purple)"></i> Ngôn ngữ</div>
<div class="prism-value">Tiếng Việt</div>
</div>
<div class="prism-item" style="cursor:pointer" onclick="App.clearHistory()">
<div class="prism-label"><i class="fas fa-trash" style="color:var(--accent-rose)"></i> Xóa lịch sử</div>
<div class="prism-value">${State.getHistory().length} video đã lưu</div>
</div>
<div class="prism-item" style="cursor:pointer" onclick="App.clearFavorites()">
<div class="prism-label"><i class="fas fa-star" style="color:var(--accent-yellow)"></i> Xóa yêu thích</div>
<div class="prism-value">${State.getFavorites().length} video</div>
</div>
</div>
</div>
</div>
</div>
`;
},

clearHistory() {
if (confirm('Xóa toàn bộ lịch sử?')) {
State.clearHistory();
Components.notify('Đã xóa lịch sử', 'success');
this.showSettings();
}
},

clearFavorites() {
if (confirm('Xóa toàn bộ yêu thích?')) {
State.data.favorites = [];
State.saveFavorites();
Components.notify('Đã xóa yêu thích', 'success');
this.showSettings();
}
},

addToFavorites() {
const data = State.getVideo();
if (!data) return;

const added = State.addToFavorites({
id: data.id || Utils.generateId(),
title: data.title,
author: data.author?.nickname,
cover: data.cover,
addedAt: new Date().toISOString()
});

Components.notify(added ? 'Đã thêm vào yêu thích!' : 'Video đã có trong danh sách', added ? 'success' : 'warning');
},

loadFromHistory(id) {
const item = State.getHistory().find(h => h.id === id);
if (!item) {
Components.notify('Không tìm thấy video', 'error');
return;
}

State.setVideo({
id: item.videoId,
title: item.title,
author: { nickname: item.author },
cover: item.cover,
duration: item.duration,
play_count: item.metrics.views,
digg_count: item.metrics.likes,
comment_count: item.metrics.comments,
share_count: item.metrics.shares
});

document.getElementById('urlInput').value = item.url;
Components.notify('Đã tải video từ lịch sử', 'success');
this.showView('dashboard');
},

renderEmptyState() {
document.getElementById('content').innerHTML = Components.emptyState();
}
};

document.addEventListener('DOMContentLoaded', () => App.init());
