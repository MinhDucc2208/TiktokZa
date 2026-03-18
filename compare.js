const CompareView = {
render() {
const data = State.getVideo();
const history = State.getHistory();
const hasHistory = history.length > 0;

const content = document.getElementById('content');

content.innerHTML = `
<div class="content-morph">
<div style="max-width:1200px;margin:0 auto">
<div style="text-align:center;margin-bottom:40px">
<div style="display:inline-flex;align-items:center;gap:16px;padding:20px 40px;background:linear-gradient(135deg,rgba(6,182,212,0.15),rgba(139,92,246,0.15));border:1px solid rgba(6,182,212,0.3);border-radius:30px">
<div style="width:64px;height:64px;background:linear-gradient(135deg,var(--accent-cyan),var(--accent-purple));border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:28px;color:white">
<i class="fas fa-code-compare"></i>
</div>
<div style="text-align:left">
<div style="font-size:24px;font-weight:800;color:var(--text-primary)">So Sánh Video</div>
<div style="font-size:14px;color:var(--text-muted)">Đối chiếu metrics giữa các video</div>
</div>
</div>
</div>

${data ? this.renderCurrentVideo(data) : this.renderEmptyCurrent()}

${hasHistory ? this.renderHistoryList(history, data) : ''}

${data && history.length > 1 ? `
<div style="margin-top:32px;text-align:center">
<button onclick="CompareView.showChart()" style="padding:18px 36px;background:linear-gradient(135deg,var(--accent-cyan),var(--accent-purple));border:none;border-radius:16px;color:white;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:12px;transition:all 0.3s" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 20px 50px rgba(6,182,212,0.4)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'">
<i class="fas fa-chart-simple"></i> Xem biểu đồ so sánh chi tiết
</button>
</div>
` : ''}
</div>
</div>
`;
},

renderCurrentVideo(data) {
const m = Utils.calculateMetrics(data);
return `
<div class="compare-current" style="background:var(--glass-bg);backdrop-filter:blur(20px);border:2px solid var(--accent-cyan);border-radius:24px;padding:28px;margin-bottom:24px;position:relative">
<div style="position:absolute;top:16px;right:16px;padding:8px 16px;background:var(--accent-cyan);color:white;border-radius:20px;font-size:12px;font-weight:700">
<i class="fas fa-check-circle" style="margin-right:6px"></i>Đang chọn
</div>
<div style="display:flex;align-items:center;gap:20px;margin-bottom:24px">
<div style="width:80px;height:80px;border-radius:20px;overflow:hidden;border:3px solid var(--accent-cyan);box-shadow:0 0 30px rgba(6,182,212,0.3)">
<img src="${data.cover || ''}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none';this.parentElement.innerHTML='<div style=\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-card);color:var(--accent-cyan);font-size:32px\'><i class=\'fas fa-video\'></i></div>'">
</div>
<div>
<div style="font-size:20px;font-weight:700;margin-bottom:6px">${data.title?.substring(0, 60) || 'Video hiện tại'}${data.title?.length > 60 ? '...' : ''}</div>
<div style="font-size:14px;color:var(--text-muted)">${data.author?.nickname || 'Không rõ'} • ${Utils.formatDate(new Date().toISOString())}</div>
</div>
</div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">
${this.renderStat('eye', 'var(--accent-cyan)', data.play_count || 0, 'Lượt xem')}
${this.renderStat('heart', 'var(--accent-pink)', data.digg_count || 0, 'Thích')}
${this.renderStat('comment', 'var(--accent-green)', data.comment_count || 0, 'Bình luận')}
${this.renderStat('share', 'var(--accent-purple)', data.share_count || 0, 'Chia sẻ')}
</div>
</div>
`;
},

renderEmptyCurrent() {
return `
<div style="background:var(--glass-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:24px;padding:48px;text-align:center;margin-bottom:24px">
<div style="width:100px;height:100px;margin:0 auto 24px;background:rgba(255,255,255,0.05);border-radius:30px;display:flex;align-items:center;justify-content:center;font-size:40px;color:var(--text-muted)">
<i class="fas fa-video-slash"></i>
</div>
<div style="font-size:22px;font-weight:700;margin-bottom:12px">Chưa có video để so sánh</div>
<div style="color:var(--text-muted);margin-bottom:24px">Phân tích video trước để thêm vào so sánh</div>
<button onclick="document.getElementById('urlInput').focus();document.getElementById('urlInput').scrollIntoView({behavior:'smooth'})" style="padding:14px 28px;background:var(--accent-cyan);color:white;border:none;border-radius:12px;font-weight:700;cursor:pointer;transition:all 0.3s" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 10px 30px rgba(6,182,212,0.3)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'">Phân tích video ngay</button>
</div>
`;
},

renderHistoryList(history, currentData) {
return `
<div class="compare-history" style="background:var(--glass-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:24px;padding:28px">
<div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
<div style="width:48px;height:48px;background:linear-gradient(135deg,var(--accent-purple),var(--accent-pink));border-radius:14px;display:flex;align-items:center;justify-content:center;color:white;font-size:20px">
<i class="fas fa-clock-rotate-left"></i>
</div>
<div>
<div style="font-size:18px;font-weight:700">Chọn video từ lịch sử</div>
<div style="font-size:13px;color:var(--text-muted)">Click để so sánh với video hiện tại</div>
</div>
</div>
<div class="history-list">
${history.slice(0, 6).map((item, i) => this.renderHistoryItem(item, currentData, i)).join('')}
</div>
</div>
`;
},

renderHistoryItem(item, currentData, index) {
const isActive = currentData && item.videoId === currentData.id;
return `
<div class="history-item ${isActive ? 'active' : ''}" onclick="App.loadFromHistory(${item.id})">
<div class="history-thumb">
<img src="${item.cover || ''}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none';this.parentElement.innerHTML='<div style=\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:24px\'><i class=\'fas fa-video\'></i></div>'">
</div>
<div class="history-info">
<div class="history-title">${item.title?.substring(0, 50) || 'Không có tiêu đề'}...</div>
<div class="history-meta">
<span><i class="fas fa-user" style="margin-right:6px"></i>${item.author}</span>
<span><i class="fas fa-calendar" style="margin-right:6px"></i>${Utils.formatDate(item.date)}</span>
</div>
</div>
<div class="history-stats">
<div class="history-views">${Utils.formatNumber(item.metrics?.views || 0)}</div>
<div class="history-views-label">views</div>
</div>
<div class="history-badge ${isActive ? 'active' : 'select'}">${isActive ? 'Đang chọn' : 'Chọn'}</div>
</div>
`;
},

renderStat(icon, color, value, label) {
return `
<div style="text-align:center;padding:20px;background:${color.replace(')', ',0.08)')};border-radius:16px">
<div style="font-size:28px;font-weight:800;color:${color}">${Utils.formatNumber(value)}</div>
<div style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px">${label}</div>
</div>
`;
},

showChart() {
const history = State.getHistory().slice(0, 5);
const content = document.getElementById('content');

content.innerHTML = `
<div class="content-morph">
<div style="max-width:1200px;margin:0 auto">
<div class="info-prism" style="padding:32px">
<div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
<div class="prism-icon"><i class="fas fa-chart-simple"></i></div>
<div>
<div class="prism-title">Biểu Đồ So Sánh</div>
<div class="prism-subtitle">5 video gần nhất</div>
</div>
</div>
<div style="height:500px">
<canvas id="compareChart"></canvas>
</div>
</div>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-top:24px">
${history.map((item, i) => `
<div style="padding:20px;background:var(--glass-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:16px;text-align:center">
<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">Video ${i + 1}</div>
<div style="font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:12px">${item.title?.substring(0, 30) || 'Không tên'}...</div>
<div style="font-size:24px;font-weight:800;color:var(--accent-cyan)">${Utils.formatNumber(item.metrics?.views || 0)}</div>
<div style="font-size:12px;color:var(--text-muted)">views</div>
</div>
`).join('')}
</div>

<div style="text-align:center;margin-top:32px">
<button onclick="App.showView('compare')" style="padding:14px 28px;background:var(--glass-bg);border:2px solid var(--accent-cyan);border-radius:12px;color:var(--accent-cyan);font-weight:700;cursor:pointer;transition:all 0.3s" onmouseover="this.style.background='var(--accent-cyan)';this.style.color='var(--bg-primary)'" onmouseout="this.style.background='transparent';this.style.color='var(--accent-cyan)'">
<i class="fas fa-arrow-left" style="margin-right:8px"></i>Quay lại
</button>
</div>
</div>
</div>
`;

setTimeout(() => {
const ctx = document.getElementById('compareChart').getContext('2d');
Charts.createLineChart(ctx,
history.map((_, i) => `Video ${i + 1}`),
[
{ label: 'Lượt xem', data: history.map(i => i.metrics?.views || 0), borderColor: '#06b6d4', backgroundColor: 'rgba(6,182,212,0.1)' },
{ label: 'Thích', data: history.map(i => i.metrics?.likes || 0), borderColor: '#ec4899', backgroundColor: 'rgba(236,72,153,0.1)' },
{ label: 'Bình luận', data: history.map(i => i.metrics?.comments || 0), borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)' },
{ label: 'Chia sẻ', data: history.map(i => i.metrics?.shares || 0), borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.1)' }
]
);
}, 100);
}
};
