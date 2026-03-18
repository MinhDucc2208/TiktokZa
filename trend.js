const TrendView = {
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
<div style="max-width:800px;margin:0 auto">
<div class="score-container-premium">
<div class="score-header">
<div class="score-badge"><i class="fas fa-fire"></i> Điểm Xu Hướng</div>
<div class="score-rank" style="color:${m.trendScore > 1000000 ? 'var(--accent-green)' : m.trendScore > 500000 ? 'var(--accent-cyan)' : 'var(--text-muted)'}">
${m.trendScore > 1000000 ? '🔥 Xu hướng bùng nổ' : m.trendScore > 500000 ? '⭐ Tiềm năng cao' : '📈 Đang phát triển'}
</div>
</div>

<div class="score-display-main">
<div class="score-circle-advanced">
<svg class="score-svg" viewBox="0 0 260 260">
<defs>
<linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
<stop offset="0%" style="stop-color:#06b6d4" />
<stop offset="100%" style="stop-color:#8b5cf6" />
</linearGradient>
</defs>
<circle class="score-track" cx="130" cy="130" r="120"/>
<circle class="score-progress" id="trendProgress" cx="130" cy="130" r="120" 
stroke="url(#scoreGrad)" stroke-dasharray="754" stroke-dashoffset="754"/>
</svg>
<div class="score-value-main" id="trendValue">0</div>
</div>
</div>

<div class="score-breakdown">
<div class="breakdown-title">Phân tích thành phần điểm</div>
<div class="breakdown-grid">
<div class="break-item">
<div class="break-icon" style="background:rgba(6,182,212,0.1);color:var(--accent-cyan)"><i class="fas fa-eye"></i></div>
<div class="break-info">
<div class="break-label">Lượt xem cơ bản</div>
<div class="break-value">+${Utils.formatNumber(m.views)}</div>
</div>
</div>
<div class="break-item">
<div class="break-icon" style="background:rgba(236,72,153,0.1);color:var(--accent-pink)"><i class="fas fa-heart"></i></div>
<div class="break-info">
<div class="break-label">Thích ×2</div>
<div class="break-value">+${Utils.formatNumber(m.likes * 2)}</div>
</div>
</div>
<div class="break-item">
<div class="break-icon" style="background:rgba(16,185,129,0.1);color:var(--accent-green)"><i class="fas fa-comment"></i></div>
<div class="break-info">
<div class="break-label">Bình luận ×3</div>
<div class="break-value">+${Utils.formatNumber(m.comments * 3)}</div>
</div>
</div>
<div class="break-item">
<div class="break-icon" style="background:rgba(139,92,246,0.1);color:var(--accent-purple)"><i class="fas fa-share"></i></div>
<div class="break-info">
<div class="break-label">Chia sẻ ×4</div>
<div class="break-value">+${Utils.formatNumber(m.shares * 4)}</div>
</div>
</div>
</div>

<div class="formula-box">
<div class="formula-title"><i class="fas fa-calculator"></i> Công thức tính</div>
<div class="formula">Điểm Xu Hướng = Lượt xem + (Thích × 2) + (Bình luận × 3) + (Chia sẻ × 4)</div>
</div>
</div>
</div>

<div style="margin-top:32px;display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px">
<div class="info-prism" style="padding:24px;text-align:center">
<div style="font-size:14px;color:var(--text-muted);margin-bottom:8px">Xu hướng tương tự</div>
<div style="font-size:18px;font-weight:700;color:var(--accent-cyan)">#${['dance','comedy','viral','trending'][Math.floor(Math.random()*4)]}</div>
<div style="font-size:13px;color:var(--text-muted);margin-top:4px">Hashtag phổ biến</div>
</div>
<div class="info-prism" style="padding:24px;text-align:center">
<div style="font-size:14px;color:var(--text-muted);margin-bottom:8px">Tốc độ lan truyền</div>
<div style="font-size:18px;font-weight:700;color:var(--accent-green)">${m.viralProbability > 50 ? 'Nhanh' : 'Trung bình'}</div>
<div style="font-size:13px;color:var(--text-muted);margin-top:4px">Dự đoán từ AI</div>
</div>
<div class="info-prism" style="padding:24px;text-align:center">
<div style="font-size:14px;color:var(--text-muted);margin-bottom:8px">Thời gian đạt đỉnh</div>
<div style="font-size:18px;font-weight:700;color:var(--accent-purple)">${m.engagement > 15 ? '24-48 giờ' : '3-5 ngày'}</div>
<div style="font-size:13px;color:var(--text-muted);margin-top:4px">Ước tính từ metrics</div>
</div>
</div>
</div>
</div>
`;

this.animate(m);
},

animate(m) {
setTimeout(() => {
const progress = document.getElementById('trendProgress');
const maxScore = CONFIG.SCORING.TREND_MAX;
const percent = Math.min(m.trendScore / maxScore, 1);
const offset = 754 - (754 * percent);
progress.style.strokeDashoffset = offset;

Utils.animateNumber(document.getElementById('trendValue'), m.trendScore, 2000);
}, 100);
}
};
