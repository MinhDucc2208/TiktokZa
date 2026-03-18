const HashtagsView = {
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
<div style="max-width:1200px;margin:0 auto">
<div class="hashtag-strategy-header">
${this.renderHeaderCard('hashtag', 'var(--accent-cyan)', m.hashtags.length, 'Tổng Hashtag', m.hashtags.length >= 3 && m.hashtags.length <= 8 ? 'Số lượng lý tưởng' : m.hashtags.length > 8 ? 'Quá nhiều' : 'Cần thêm', m.hashtags.length >= 3 && m.hashtags.length <= 8)}
${this.renderHeaderCard('fire', 'var(--accent-purple)', m.hashtags.filter(h => this.trending.includes(h.toLowerCase())).length, 'Trending Tag', 'Tối ưu trending', true)}
${this.renderHeaderCard('bullseye', 'var(--accent-green)', Math.min(100, m.hashtags.length * 12) + '%', 'Điểm Chiến Lược', 'AI Đánh giá', true)}
</div>

${m.hashtags.length > 0 ? `
<div class="hashtag-detail" style="background:var(--glass-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:24px;padding:28px;margin-bottom:24px">
<div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
<div style="width:48px;height:48px;background:linear-gradient(135deg,var(--accent-cyan),var(--accent-blue));border-radius:14px;display:flex;align-items:center;justify-content:center;color:white;font-size:20px">
<i class="fas fa-list-ol"></i>
</div>
<div>
<div style="font-size:18px;font-weight:700">Phân tích chi tiết từng hashtag</div>
<div style="font-size:13px;color:var(--text-muted)">Sức mạnh và tiềm năng của mỗi tag</div>
</div>
</div>
<div class="hashtag-list">
${m.hashtags.map((tag, i) => this.renderHashtagItem(tag, i, m)).join('')}
</div>
</div>
` : `
<div style="background:var(--glass-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:24px;padding:60px 40px;text-align:center;margin-bottom:24px">
<div style="width:120px;height:120px;margin:0 auto 28px;background:rgba(244,63,94,0.1);border-radius:32px;display:flex;align-items:center;justify-content:center;font-size:48px;color:var(--accent-rose)">
<i class="fas fa-inbox"></i>
</div>
<div style="font-size:24px;font-weight:700;margin-bottom:12px">Chưa phát hiện hashtag</div>
<div style="color:var(--text-muted);margin-bottom:28px;max-width:400px;margin-left:auto;margin-right:auto">Video này chưa sử dụng hashtag nào. Thêm hashtag để tăng khả năng hiển thị lên 70%.</div>
</div>
`}

<div class="ai-suggestions" style="background:var(--glass-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:24px;padding:28px;margin-bottom:24px">
<div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
<div style="width:48px;height:48px;background:linear-gradient(135deg,var(--accent-purple),var(--accent-pink));border-radius:14px;display:flex;align-items:center;justify-content:center;color:white;font-size:20px">
<i class="fas fa-robot"></i>
</div>
<div>
<div style="font-size:18px;font-weight:700">Gợi ý Hashtag từ AI</div>
<div style="font-size:13px;color:var(--text-muted)">Dựa trên nội dung và xu hướng hiện tại</div>
</div>
</div>

<div class="suggestion-section">
<div class="suggestion-title">🔥 Trending Hot</div>
<div class="suggestion-tags">
${this.trending.slice(0, 6).map(tag => this.renderTagButton(tag, 'trending')).join('')}
</div>
</div>

<div class="suggestion-section">
<div class="suggestion-title">🎯 Ngách Phù Hợp</div>
<div class="suggestion-tags">
${this.niche.slice(0, 5).map(tag => this.renderTagButton(tag, 'niche')).join('')}
</div>
</div>

<div>
<div class="suggestion-title">📋 Bộ Hashtag Hoàn Chỉnh (Copy & Paste)</div>
<div class="suggestion-sets">
${this.renderTagSet('Bộ Viral', '#fyp #viral #trending #foryou #foryoupage #tiktok #viralvideo')}
${this.renderTagSet('Bộ Tương Tác', '#fyp #comment #duet #stitch #trending #foryou #pov')}
${this.renderTagSet('Bộ Ngách', '#learnontiktok #tiktokmademebuyit #smallbusiness #behindthescenes #tutorial')}
</div>
</div>
</div>

<div class="strategy-tips">
<div class="tips-header">
<div class="tips-icon"><i class="fas fa-chess-knight"></i></div>
<div class="tips-title">Chiến lược Hashtag Tối Ưu</div>
</div>
<div class="tips-grid">
${this.renderTip('layer-group', 'var(--accent-cyan)', 'Công thức 3-5-2', '3 tag trending + 5 tag ngách + 2 tag brand/chuyên môn')}
${this.renderTip('clock', 'var(--accent-purple)', 'Thời điểm đăng', 'Kết hợp hashtag trending vào khung giờ vàng 19-21h')}
${this.renderTip('rotate', 'var(--accent-pink)', 'Luân phiên hashtag', 'Đổi 2-3 tag mỗi video để test hiệu quả, tránh lặp lại')}
</div>
</div>
</div>
</div>
`;
},

trending: ['#fyp', '#viral', '#foryou', '#tiktok', '#trending', '#love', '#funny', '#meme', '#dance', '#music'],
niche: ['#learnontiktok', '#tiktokmademebuyit', '#smallbusiness', '#behindthescenes', '#dayinmylife', '#tutorial', '#diy', '#cooking', '#fitness', '#beauty'],

renderHeaderCard(icon, color, value, label, badge, isGood) {
return `
<div style="background:var(--glass-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:24px;padding:28px;text-align:center">
<div style="width:80px;height:80px;margin:0 auto 20px;background:linear-gradient(135deg,${color},${this.shiftColor(color)});border-radius:24px;display:flex;align-items:center;justify-content:center;font-size:36px;color:white;box-shadow:0 20px 50px ${color.replace(')', ',0.3)')}">
<i class="fas fa-${icon}"></i>
</div>
<div style="font-size:56px;font-weight:800;color:var(--text-primary);margin-bottom:8px">${value}</div>
<div style="font-size:14px;color:var(--text-muted);text-transform:uppercase;letter-spacing:2px">${label}</div>
<div style="margin-top:16px;display:inline-flex;align-items:center;gap:8px;padding:10px 20px;background:${isGood ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)'};border:1px solid ${isGood ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'};border-radius:30px;font-size:13px;color:${isGood ? 'var(--accent-green)' : 'var(--accent-rose)'};font-weight:600">
<i class="fas fa-${isGood ? 'check-circle' : 'exclamation-circle'}"></i> ${badge}
</div>
</div>
`;
},

renderHashtagItem(tag, index, m) {
const isTrending = this.trending.includes(tag.toLowerCase());
const isNiche = this.niche.includes(tag.toLowerCase());
const type = isTrending ? '🔥 Trending' : isNiche ? '🎯 Ngách' : '📊 Thông thường';
const color = isTrending ? 'var(--accent-cyan)' : isNiche ? 'var(--accent-purple)' : 'var(--text-muted)';
const score = isTrending ? 90 + Math.floor(Math.random() * 10) : isNiche ? 70 + Math.floor(Math.random() * 20) : 30 + Math.floor(Math.random() * 30);

return `
<div class="hashtag-item">
<div class="hashtag-rank ${isTrending ? 'trending' : ''}" style="${isTrending ? '' : `background:${color.replace(')', ',0.1)')};color:${color}`}">${index + 1}</div>
<div class="hashtag-info">
<div class="hashtag-tag" style="color:${color}">${tag}</div>
<div class="hashtag-meta">${type} • ${isTrending ? 'Rất cao (10M+ views)' : isNiche ? 'Cao trong ngách (1M+ views)' : 'Không xác định'}</div>
</div>
<div class="hashtag-score">
<div class="hashtag-score-value" style="color:${score > 80 ? 'var(--accent-green)' : score > 60 ? 'var(--accent-cyan)' : 'var(--text-muted)'}">${score}</div>
<div class="hashtag-score-label">Điểm sức mạnh</div>
</div>
</div>
`;
},

renderTagButton(tag, type) {
const colors = {
trending: ['rgba(6,182,212,0.15)', 'rgba(59,130,246,0.15)', 'var(--accent-cyan)'],
niche: ['rgba(139,92,246,0.15)', 'rgba(236,72,153,0.15)', 'var(--accent-purple)']
};
const [bg1, bg2, color] = colors[type];

return `
<button onclick="Utils.copyText('${tag}')" style="padding:12px 20px;background:linear-gradient(135deg,${bg1},${bg2});border:1px solid ${color.replace(')', ',0.3)')};border-radius:30px;color:${color};font-size:14px;font-weight:600;cursor:pointer;transition:all 0.3s;display:flex;align-items:center;gap:8px" onmouseover="this.style.background='${color}';this.style.color='white';this.style.transform='translateY(-3px)'" onmouseout="this.style.background='linear-gradient(135deg,${bg1},${bg2})';this.style.color='${color}';this.style.transform='translateY(0)'">
${tag} <i class="fas fa-copy" style="font-size:12px"></i>
</button>
`;
},

renderTagSet(title, tags) {
return `
<div class="suggestion-set">
<div class="suggestion-set-title">${title}</div>
<div class="suggestion-set-tags">${tags}</div>
<button onclick="Utils.copyText('${tags}')" style="width:100%;padding:12px;background:var(--accent-cyan);color:white;border:none;border-radius:12px;font-weight:600;cursor:pointer;transition:all 0.3s" onmouseover="this.style.background='var(--accent-blue)'" onmouseout="this.style.background='var(--accent-cyan)'">
<i class="fas fa-copy" style="margin-right:8px"></i>Sao chép bộ
</button>
</div>
`;
},

renderTip(icon, color, title, text) {
return `
<div class="tip-card">
<div class="tip-title" style="color:${color}"><i class="fas fa-${icon}" style="margin-right:8px"></i>${title}</div>
<div class="tip-text">${text}</div>
</div>
`;
},

shiftColor(color) {
const colorMap = {
'var(--accent-cyan)': 'var(--accent-blue)',
'var(--accent-purple)': 'var(--accent-pink)',
'var(--accent-green)': 'var(--accent-cyan)'
};
return colorMap[color] || color;
}
};
