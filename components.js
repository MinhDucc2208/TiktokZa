const Components = {
notify(message, type = 'success', duration = CONFIG.UI.NOTIFICATION_DURATION) {
const colors = {
success: { bg: 'rgba(16,185,129,0.95)', icon: 'check-circle' },
error: { bg: 'rgba(244,63,94,0.95)', icon: 'circle-xmark' },
warning: { bg: 'rgba(249,115,22,0.95)', icon: 'triangle-exclamation' },
info: { bg: 'rgba(59,130,246,0.95)', icon: 'circle-info' }
};

const config = colors[type] || colors.success;
const id = ++State.ui.notificationId;

const div = document.createElement('div');
div.innerHTML = `<i class="fas fa-${config.icon}" style="font-size:18px"></i><span style="font-weight:600">${message}</span>`;
div.style.cssText = `
position: fixed;
top: 24px;
right: 24px;
padding: 18px 28px;
background: ${config.bg};
backdrop-filter: blur(20px);
color: white;
border-radius: 16px;
display: flex;
align-items: center;
gap: 14px;
font-size: 15px;
z-index: 10000;
animation: notifySlide 0.4s cubic-bezier(0.16,1,0.3,1);
box-shadow: 0 20px 50px rgba(0,0,0,0.3);
border: 1px solid rgba(255,255,255,0.1);
`;
div.dataset.notificationId = id;

document.body.appendChild(div);

setTimeout(() => {
div.style.animation = 'notifySlideOut 0.3s ease forwards';
setTimeout(() => div.remove(), 300);
}, duration);
},

loading(message = 'Đang phân tích...') {
return `
<div class="loading-quantum">
<div class="spinner-quantum"></div>
<div class="loading-info">
<div class="loading-title">${message}<span class="loading-dots"></span></div>
<div class="loading-meta">Trích xuất dữ liệu • Phân tích metrics • Tính toán tiềm năng</div>
</div>
</div>
`;
},

error(message) {
return `
<div class="error-state">
<div class="error-icon"><i class="fas fa-circle-exclamation"></i></div>
<div>
<div style="font-weight:700;margin-bottom:4px">Phân tích thất bại</div>
<div style="font-size:13px;opacity:0.9">${message}</div>
</div>
</div>
`;
},

emptyState() {
return `
<div class="empty-premium content-morph">
<div class="empty-visual">
<div class="empty-orbit"><i class="fab fa-tiktok"></i></div>
<div class="empty-particles"></div>
</div>
<h2 class="empty-title">Sẵn sàng khám phá</h2>
<p class="empty-desc">Nhập link TikTok để bắt đầu phân tích chi tiết với AI. Khám phá tiềm năng viral, tối ưu nội dung và tăng tương tác.</p>
<div class="empty-features">
<div class="ef-card">
<div class="ef-icon"><i class="fas fa-wand-magic-sparkles"></i></div>
<div class="ef-title">Phân tích AI</div>
<div class="ef-desc">Đánh giá thông minh</div>
</div>
<div class="ef-card">
<div class="ef-icon" style="background:linear-gradient(135deg,var(--accent-pink),var(--accent-rose))"><i class="fas fa-fire"></i></div>
<div class="ef-title">Dự đoán Viral</div>
<div class="ef-desc">Tiềm năng bùng nổ</div>
</div>
<div class="ef-card">
<div class="ef-icon" style="background:linear-gradient(135deg,var(--accent-green),var(--accent-cyan))"><i class="fas fa-rocket"></i></div>
<div class="ef-title">Tối ưu SEO</div>
<div class="ef-desc">Tăng hiển thị</div>
</div>
<div class="ef-card">
<div class="ef-icon" style="background:linear-gradient(135deg,var(--accent-orange),var(--accent-yellow))"><i class="fas fa-clock"></i></div>
<div class="ef-title">Thời điểm vàng</div>
<div class="ef-desc">Đăng bài hiệu quả</div>
</div>
</div>
</div>
`;
},

statCard(icon, label, value, trend, colorClass) {
const trendHtml = trend ? `
<div class="stat-holo-trend ${trend.up ? 'up' : 'down'}">
<i class="fas fa-${trend.up ? 'arrow-trend-up' : 'arrow-trend-down'}"></i> ${trend.text}
</div>
` : `<div class="stat-holo-desc">${trend}</div>`;

return `
<div class="stat-holo-card">
<div class="stat-holo-icon ${colorClass}"><i class="fas fa-${icon}"></i></div>
<div class="stat-holo-label">${label}</div>
<div class="stat-holo-value" data-value="${value}">${typeof value === 'number' ? Utils.formatNumber(value) : value}</div>
${trendHtml}
</div>
`;
},

prismItem(icon, iconColor, label, value) {
return `
<div class="prism-item">
<div class="prism-label"><i class="fas fa-${icon}" style="color:${iconColor}"></i> ${label}</div>
<div class="prism-value">${value}</div>
</div>
`;
},

button(text, icon, onclick, style = 'primary') {
const styles = {
primary: `background:linear-gradient(135deg,var(--accent-cyan),var(--accent-blue));color:white;border:none;`,
secondary: `background:var(--glass-bg);border:2px solid var(--accent-cyan);color:var(--accent-cyan);`,
danger: `background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.3);color:var(--accent-rose);`
};

return `
<button onclick="${onclick}" style="padding:14px 28px;border-radius:12px;font-weight:700;cursor:pointer;transition:all 0.3s;display:flex;align-items:center;gap:10px;${styles[style]}" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
<i class="fas fa-${icon}"></i> ${text}
</button>
`;
}
};
