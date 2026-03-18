const EngagementView = {
render() {
const data = State.getVideo();
if (!data) {
Components.notify('Vui lòng phân tích video trước', 'error');
return;
}

const m = Utils.calculateMetrics(data);
const level = m.engagement > 15 ? 'Xuất sắc' : m.engagement > 10 ? 'Tốt' : m.engagement > 5 ? 'Trung bình' : 'Cần cải thiện';
const color = m.engagement > 15 ? 'var(--accent-green)' : m.engagement > 10 ? 'var(--accent-cyan)' : m.engagement > 5 ? 'var(--accent-yellow)' : 'var(--accent-rose)';
const icon = m.engagement > 10 ? 'face-smile' : 'face-meh';

const content = document.getElementById('content');

content.innerHTML = `
<div class="content-morph">
<div style="max-width:1000px;margin:0 auto">
<div class="engagement-dashboard">
<div class="eng-main">
<div class="eng-circle-container">
<svg class="eng-svg" viewBox="0 0 200 200">
<defs>
<linearGradient id="engGrad" x1="0%" y1="0%" x2="100%" y2="0%">
<stop offset="0%" style="stop-color:${m.engagement > 10 ? '#10b981' : '#f43f5e'}" />
<stop offset="100%" style="stop-color:${m.engagement > 10 ? '#06b6d4' : '#f97316'}" />
</linearGradient>
</defs>
<circle class="eng-track" cx="100" cy="100" r="90"/>
<circle class="eng-progress" id="engProgress" cx="100" cy="100" r="90" 
stroke="url(#engGrad)" stroke-dasharray="566" stroke-dashoffset="566"/>
</svg>
<div class="eng-center">
<div class="eng-icon"><i class="fas fa-${icon}" style="color:${color}"></i></div>
<div class="eng-value" id="engValue" style="color:${color}">0.00%</div>
<div class="eng-label">${level}</div>
</div>
</div>

<div class="eng-ranking">
<div class="rank-title">Xếp hạng so với video TikTok</div>
<div class="rank-bar">
<div class="rank-fill" style="width:${Math.min(m.engagement,100)}%;background:${color}"></div>
<div class="rank-markers">
<div class="rank-marker" style="left:5%">5%</div>
<div class="rank-marker" style="left:10%">10%</div>
<div class="rank-marker" style="left:15%">15%</div>
</div>
</div>
<div class="rank-legend">
<div class="legend-item"><span style="background:var(--accent-rose)"></span> Dưới 5% (Trung bình)</div>
<div class="legend-item"><span style="background:var(--accent-yellow)"></span> 5-10% (Khá)</div>
<div class="legend-item"><span style="background:var(--accent-cyan)"></span> 10-15% (Tốt)</div>
<div class="legend-item"><span style="background:var(--accent-green)"></span> Trên 15% (Xuất sắc)</div>
</div>
</div>
</div>

<div class="eng-breakdown-advanced">
<div class="break-title">Phân tích chi tiết từng loại tương tác</div>
<div class="break-charts">
${this.renderBreakdown('heart', 'var(--accent-pink)', 'Thích', m.likes, m.views)}
${this.renderBreakdown('comment', 'var(--accent-cyan)', 'Bình luận', m.comments, m.views)}
${this.renderBreakdown('share', 'var(--accent-purple)', 'Chia sẻ', m.shares, m.views)}
</div>
</div>
</div>

<div class="eng-insights" style="margin-top:32px">
${this.renderInsight('check-double', 'var(--accent-green)', 'Điểm mạnh', m.engagement > 10 ? 'Tỷ lệ tương tác cao, video có sức hút tốt.' : 'Cần cải thiện hook đầu video để giữ chân người xem.')}
${this.renderInsight('lightbulb', 'var(--accent-yellow)', 'Gợi ý cải thiện', m.comments / m.likes < 0.1 ? 'Thêm CTA để kêu gọi bình luận.' : 'Tỷ lệ bình luận tốt, duy trì tương tác!')}
${this.renderInsight('chart-line', 'var(--accent-purple)', 'Dự đoán', `Với tỷ lệ ${m.engagement}%, video có thể đạt ${Utils.formatNumber(Math.floor(m.views * 1.5))} views trong 24h tới.`)}
</div>
</div>
</div>
`;

this.animate(m);
},

renderBreakdown(icon, color, label, value, views) {
const percent = (value / views * 100).toFixed(2);
return `
<div class="break-chart-item">
<div class="chart-header-mini">
<i class="fas fa-${icon}" style="color:${color}"></i>
<span>${label}</span>
<span class="chart-percent" style="color:${color}">${percent}%</span>
</div>
<div class="mini-bar">
<div class="mini-fill" style="width:${percent}%;background:${color}"></div>
</div>
<div class="mini-stats">${Utils.formatNumber(value)} / ${Utils.formatNumber(views)} lượt xem</div>
</div>
`;
},

renderInsight(icon, color, title, text) {
return `
<div class="insight-card">
<div class="insight-icon" style="background:${color.replace(')', ',0.1)')};color:${color}">
<i class="fas fa-${icon}"></i>
</div>
<div class="insight-content">
<div class="insight-title" style="color:${color}">${title}</div>
<div class="insight-text">${text}</div>
</div>
</div>
`;
},

animate(m) {
setTimeout(() => {
const progress = document.getElementById('engProgress');
const offset = 566 - (566 * Math.min(parseFloat(m.engagement), 100) / 100);
progress.style.strokeDashoffset = offset;

Utils.animateNumber(document.getElementById('engValue'), parseFloat(m.engagement), 2000, '%');
}, 100);
}
};
