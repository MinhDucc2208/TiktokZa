const DashboardView = {
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
<div class="stats-holo">
${this.renderStatCards(m)}
</div>

<div class="chart-deep">
<div class="chart-header-deep">
<div class="chart-title-deep">
<i class="fas fa-chart-column" style="color:var(--accent-cyan)"></i>
<span>Phân tích tương tác chi tiết</span>
</div>
<span class="chart-live-badge"><i class="fas fa-satellite-dish"></i> Dữ liệu thời gian thực</span>
</div>
<div style="height:380px;position:relative">
<canvas id="mainChart"></canvas>
</div>
</div>

<div class="info-prism">
<div class="prism-header">
<div class="prism-icon"><i class="fas fa-circle-info"></i></div>
<div>
<div class="prism-title">Thông tin chi tiết video</div>
<div class="prism-subtitle">Metadata và phân tích AI</div>
</div>
</div>
<div class="prism-grid">
${Components.prismItem('heading', 'var(--accent-cyan)', 'Tiêu đề video', data.title || 'Không có tiêu đề')}
${Components.prismItem('user-circle', 'var(--accent-purple)', 'Người tạo', `${data.author?.nickname || 'Không rõ'} (@${data.author?.unique_id || 'unknown'})`)}
${Components.prismItem('clock', 'var(--accent-green)', 'Thời lượng', `${m.duration} giây • ${Math.floor(m.duration/60)}:${(m.duration%60).toString().padStart(2,'0')}`)}
${Components.prismItem('music', 'var(--accent-pink)', 'Âm thanh', `${data.music_info?.title || 'Âm thanh gốc'} ${data.music_info?.author ? '- ' + data.music_info.author : ''}`)}
${Components.prismItem('users', 'var(--accent-blue)', 'Đối tượng chính', m.audience)}
${Components.prismItem('calendar-check', 'var(--accent-orange)', 'Thời điểm đăng tốt nhất', m.bestTime)}
</div>
</div>

<div style="display:flex;gap:16px;margin-top:32px;flex-wrap:wrap">
${Components.button('Tạo nội dung AI', 'wand-sparkles', `App.showView('hashtags')`, 'primary')}
${Components.button('Lưu yêu thích', 'star', `App.addToFavorites()`, 'secondary')}
${Components.button('So sánh video', 'code-compare', `App.showView('compare')`, 'secondary')}
</div>
</div>
`;

this.renderChart(m);
this.animateNumbers();
},

renderStatCards(m) {
const cards = [
{ icon: 'eye', label: 'Lượt xem', value: m.views, trend: { up: true, text: m.growthRate }, color: 'views' },
{ icon: 'heart', label: 'Thích', value: m.likes, trend: `Tỷ lệ: ${(m.likes/m.views*100).toFixed(1)}%`, color: 'likes' },
{ icon: 'comment-dots', label: 'Bình luận', value: m.comments, trend: 'Tương tác sâu', color: 'comments' },
{ icon: 'share-nodes', label: 'Chia sẻ', value: m.shares, trend: 'Lan truyền', color: 'shares' },
{ icon: 'arrow-trend-up', label: 'Điểm Xu Hướng', value: m.trendScoreFormatted, trend: { up: m.trendScore > 500000, text: m.trendScore > 500000 ? 'Bùng nổ' : 'Bình thường' }, color: 'trend' },
{ icon: 'percent', label: 'Tỷ Lệ Tương Tác', value: m.engagement + '%', trend: { up: m.engagement > 10, text: m.engagement > 10 ? 'Xuất sắc' : m.engagement > 5 ? 'Tốt' : 'Cần cải thiện' }, color: 'engagement' }
];

return cards.map(c => Components.statCard(c.icon, c.label, c.value, c.trend, c.color)).join('');
},

renderChart(m) {
setTimeout(() => {
const ctx = document.getElementById('mainChart').getContext('2d');
const g1 = Charts.getGradient(ctx, 'rgba(6,182,212,0.9)', 'rgba(6,182,212,0.1)');
const g2 = Charts.getGradient(ctx, 'rgba(236,72,153,0.9)', 'rgba(236,72,153,0.1)');
const g3 = Charts.getGradient(ctx, 'rgba(16,185,129,0.9)', 'rgba(16,185,129,0.1)');
const g4 = Charts.getGradient(ctx, 'rgba(249,115,22,0.9)', 'rgba(249,115,22,0.1)');

Charts.createBarChart(ctx, 
['Lượt xem', 'Thích', 'Bình luận', 'Chia sẻ'],
[{
label: 'Số liệu',
data: [m.views, m.likes, m.comments, m.shares],
backgroundColor: [g1, g2, g3, g4],
borderColor: ['#06b6d4', '#ec4899', '#10b981', '#f97316']
}]
);
}, 100);
},

animateNumbers() {
setTimeout(() => {
document.querySelectorAll('.stat-holo-value[data-value]').forEach(el => {
const final = parseInt(el.dataset.value);
if (!isNaN(final)) {
Utils.animateNumber(el, final, 1500);
}
});
}, 200);
}
};
