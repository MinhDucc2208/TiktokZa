const ViralityView = {
render() {
const data = State.getVideo();
if (!data) {
Components.notify('Vui lòng phân tích video trước', 'error');
return;
}

const m = Utils.calculateMetrics(data);
const viralPercent = Math.min(parseFloat(m.viralityScore) * 100, 100);
const status = viralPercent > 10 ? 'hot' : viralPercent > 5 ? 'warm' : 'cold';
const statusText = viralPercent > 10 ? '🔥 Cực kỳ viral' : viralPercent > 5 ? '⚡ Tiềm năng cao' : '📊 Cần thêm thời gian';

const content = document.getElementById('content');

content.innerHTML = `
<div class="content-morph">
<div style="max-width:900px;margin:0 auto">
<div class="viral-container">
<div class="viral-header">
<div class="viral-badge"><i class="fas fa-bolt"></i> Tiềm Năng Viral</div>
<div class="viral-status ${status}">${statusText}</div>
</div>

<div class="viral-meter">
<div class="meter-bg">
<div class="meter-fill" id="viralFill" style="width:0%"></div>
<div class="meter-markers">
<div class="marker" style="left:25%"><span>25%</span></div>
<div class="marker" style="left:50%"><span>50%</span></div>
<div class="marker" style="left:75%"><span>75%</span></div>
<div class="marker" style="left:100%"><span>100%</span></div>
</div>
</div>
<div class="meter-value" id="viralPercent">0.00%</div>
<div class="meter-label">Chỉ số lan truyền</div>
</div>

<div class="viral-factors">
<div class="factor-title">Các yếu tố ảnh hưởng</div>
<div class="factor-grid">
${this.renderFactor('share', 'var(--accent-purple)', 'Tác động Chia sẻ ×5', (m.shares * 5) / m.views, m.views)}
${this.renderFactor('comment', 'var(--accent-cyan)', 'Tác động Bình luận ×3', (m.comments * 3) / m.views, m.views)}
${this.renderFactor('heart', 'var(--accent-pink)', 'Tác động Thích ×1', m.likes / m.views, m.views)}
</div>
</div>

<div class="viral-prediction">
<div class="prediction-title"><i class="fas fa-crystal-ball"></i> Dự đoán AI</div>
<div class="prediction-grid">
<div class="pred-item">
<div class="pred-icon" style="background:rgba(16,185,129,0.1);color:var(--accent-green)"><i class="fas fa-arrow-trend-up"></i></div>
<div class="pred-content">
<div class="pred-label">Khả năng lên trending</div>
<div class="pred-value" style="color:var(--accent-green)">${m.viralProbability}%</div>
</div>
</div>
<div class="pred-item">
<div class="pred-icon" style="background:rgba(59,130,246,0.1);color:var(--accent-blue)"><i class="fas fa-users"></i></div>
<div class="pred-content">
<div class="pred-label">Người xem tiềm năng</div>
<div class="pred-value" style="color:var(--accent-blue)">${Utils.formatNumber(Math.floor(m.views * (1 + m.viralProbability / 100)))}</div>
</div>
</div>
<div class="pred-item">
<div class="pred-icon" style="background:rgba(139,92,246,0.1);color:var(--accent-purple)"><i class="fas fa-clock"></i></div>
<div class="pred-content">
<div class="pred-label">Thời gian đạt đỉnh viral</div>
<div class="pred-value" style="color:var(--accent-purple)">${viralPercent > 10 ? '12-24 giờ' : viralPercent > 5 ? '1-3 ngày' : '5-7 ngày'}</div>
</div>
</div>
</div>
</div>

<div class="formula-box" style="margin-top:28px">
<div class="formula-title"><i class="fas fa-flask"></i> Công thức khoa học</div>
<div class="formula">Chỉ số Viral = (Chia sẻ × 5 + Bình luận × 3 + Thích × 1) / Lượt xem</div>
<div style="margin-top:12px;font-size:13px;color:var(--text-muted)">
Đây là chỉ số đo lường khả năng lan truyền dựa trên tương tác sâu (shares, comments) so với lượt xem.
</div>
</div>
</div>
</div>
</div>
`;

this.animate(viralPercent);
},

renderFactor(icon, color, label, score, views) {
const percent = Math.min(score * 100, 100);
return `
<div class="factor-item">
<div class="factor-bar">
<div class="factor-progress" style="width:${percent}%;background:${color}"></div>
</div>
<div class="factor-info">
<div class="factor-name"><i class="fas fa-${icon}" style="color:${color}"></i> ${label}</div>
<div class="factor-score">${score.toFixed(3)}</div>
</div>
</div>
`;
},

animate(viralPercent) {
setTimeout(() => {
document.getElementById('viralFill').style.width = viralPercent + '%';

let current = 0;
const target = viralPercent;
const el = document.getElementById('viralPercent');
const timer = setInterval(() => {
current += target / (2000 / 16);
if (current >= target) {
current = target;
clearInterval(timer);
}
el.textContent = current.toFixed(2) + '%';
}, 16);
}, 100);
}
};
