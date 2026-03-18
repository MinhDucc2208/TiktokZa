const PerformanceView = {
render() {
const data = State.getVideo();
if (!data) {
Components.notify('Vui lòng phân tích video trước', 'error');
return;
}

const m = Utils.calculateMetrics(data);
const content = document.getElementById('content');

content.innerHTML = `
<div class="content-morph">
<div style="max-width:1000px;margin:0 auto">
<div class="perf-container">
<div class="perf-score-section">
<div class="perf-header">
<div class="perf-badge"><i class="fas fa-gauge-high"></i> Hiệu Suất Tổng Thể</div>
<div class="perf-rank">${m.performanceScore > 1000 ? '🏆 Xuất sắc' : m.performanceScore > 500 ? '⭐ Tốt' : '📊 Trung bình'}</div>
</div>
<div class="perf-display">
<div class="perf-number" id="perfNumber">0.00</div>
<div class="perf-unit">điểm</div>
</div>
<div class="perf-scale">
<div class="scale-bg">
<div class="scale-fill" id="perfScale" style="width:0%"></div>
</div>
<div class="scale-labels">
<span>0</span>
<span>1000</span>
<span>2000</span>
<span>3000</span>
<span>4000+</span>
</div>
</div>
</div>

<div class="perf-radar-section">
<div class="radar-title">Phân tích đa chiều</div>
<div class="radar-container">
<canvas id="radarChart"></canvas>
</div>
</div>
</div>

<div class="perf-metrics-grid" style="margin-top:32px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px">
${this.renderMetric('eye', 'var(--accent-cyan)', 'Phạm vi tiếp cận', m.views, Math.min(m.views / 1000000 * 100, 100))}
${this.renderMetric('heart', 'var(--accent-pink)', 'Sức hút nội dung', m.likes, Math.min(m.likes / m.views * 200, 100))}
${this.renderMetric('comments', 'var(--accent-green)', 'Tương tác cộng đồng', m.comments, Math.min(m.comments / m.views * 500, 100))}
${this.renderMetric('share-nodes', 'var(--accent-purple)', 'Khả năng lan truyền', m.shares, Math.min(m.shares / m.views * 1000, 100))}
</div>

<div class="perf-recommendations" style="margin-top:32px">
<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
<div style="width:48px;height:48px;background:linear-gradient(135deg,var(--accent-cyan),var(--accent-blue));border-radius:14px;display:flex;align-items:center;justify-content:center;color:white;font-size:20px">
<i class="fas fa-clipboard-check"></i>
</div>
<div>
<div style="font-size:18px;font-weight:700">Đánh giá & Khuyến nghị</div>
<div style="font-size:13px;color:var(--text-muted)">Dựa trên phân tích AI</div>
</div>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px">
${this.renderRecommendation('thumbs-up', 'var(--accent-green)', 'Điểm mạnh', this.getStrengths(m))}
${this.renderRecommendation('arrow-up', 'var(--accent-orange)', 'Cơ hội cải thiện', this.getOpportunities(m))}
</div>
</div>
</div>
</div>
`;

this.animate(m);
},

renderMetric(icon, color, label, value, percent) {
return `
<div class="perf-metric-card">
<div class="metric-icon" style="background:${color.replace(')', ',0.1)')};color:${color}">
<i class="fas fa-${icon}"></i>
</div>
<div class="metric-name">${label}</div>
<div class="metric-value">${Utils.formatNumber(value)}</div>
<div class="metric-bar">
<div style="width:${percent}%;background:${color};transition:width 1.5s ease"></div>
</div>
</div>
`;
},

renderRecommendation(icon, color, title, text) {
return `
<div style="padding:20px;background:rgba(3,7,18,0.5);border-radius:16px;border-left:4px solid ${color}">
<div style="font-weight:700;margin-bottom:8px;color:${color}">
<i class="fas fa-${icon}" style="margin-right:8px"></i>${title}
</div>
<div style="color:var(--text-secondary);font-size:14px;line-height:1.6">${text}</div>
</div>
`;
},

getStrengths(m) {
const strengths = [];
if (m.views > 100000) strengths.push('Lượt xem ấn tượng, nội dung thu hút.');
if (m.engagement > 10) strengths.push('Tỷ lệ tương tác cao, audience chất lượng.');
if (m.shares > m.likes * 0.1) strengths.push('Khả năng lan truyền tốt, viral potential cao.');
if (strengths.length === 0) strengths.push('Video ổn định, cần tối ưu thêm để bùng nổ.');
return strengths.join(' ');
},

getOpportunities(m) {
const ops = [];
if (m.comments / m.likes < 0.05) ops.push('Tăng tương tác bằng cách đặt câu hỏi trong video.');
if (m.shares / m.views < 0.01) ops.push('Thêm CTA kêu gọi chia sẻ ở cuối video.');
if (m.duration < 15) ops.push('Video ngắn, cân nhắc thêm nội dung giá trị.');
else if (m.duration > 60) ops.push('Video dài, cân nhắc cắt ngắn để tăng retention.');
if (ops.length === 0) ops.push('Duy trì chiến lược hiện tại và thử nghiệm nội dung mới.');
return ops.join(' ');
},

animate(m) {
setTimeout(() => {
Utils.animateNumber(document.getElementById('perfNumber'), parseFloat(m.performanceScore), 2000);
document.getElementById('perfScale').style.width = Math.min(m.performanceScore / CONFIG.SCORING.PERFORMANCE_MAX * 100, 100) + '%';

const ctx = document.getElementById('radarChart').getContext('2d');
Charts.createRadarChart(ctx,
['Lượt xem', 'Thích', 'Bình luận', 'Chia sẻ', 'Tương tác', 'Chất lượng'],
[
Math.min(m.views / 50000, 100),
Math.min(m.likes / 5000, 100),
Math.min(m.comments / 500, 100),
Math.min(m.shares / 200, 100),
Math.min(parseFloat(m.engagement) * 5, 100),
m.qualityScore
]
);
}, 100);
}
};
