const SEOView = {
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
<div style="max-width:1100px;margin:0 auto">
<div class="seo-header-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:24px;margin-bottom:32px">
${this.renderScoreCard(m.seoScore)}
${this.renderInfoCard('users', 'var(--accent-cyan)', 'Đối tượng chính', m.audience)}
${this.renderInfoCard('clock', 'var(--accent-purple)', 'Thời điểm vàng', m.bestTime)}
${this.renderInfoCard('hashtag', 'var(--accent-green)', 'Hashtag', `${m.hashtags.length} tag`)}
${this.renderInfoCard('text-width', 'var(--accent-pink)', 'Độ dài', `${m.caption.length} ký tự`)}
</div>

<div class="seo-checklist" style="background:var(--glass-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:24px;padding:28px;margin-bottom:24px">
<div class="checklist-title">
<div style="width:48px;height:48px;background:linear-gradient(135deg,var(--accent-cyan),var(--accent-blue));border-radius:14px;display:flex;align-items:center;justify-content:center;color:white;font-size:20px">
<i class="fas fa-list-check"></i>
</div>
<div>
<div style="font-size:18px;font-weight:700">Checklist Tối Ưu SEO</div>
<div style="font-size:13px;color:var(--text-muted)">Hoàn thành các mục để tăng điểm</div>
</div>
</div>
<div class="checklist-grid">
${this.renderCheckItem('heading', 'Tiêu đề đủ dài (50-150)', m.caption.length >= 50, m.caption.length >= 100 ? 'Tốt' : m.caption.length >= 50 ? 'Đạt' : 'Thiếu')}
${this.renderCheckItem('hashtag', '3-8 hashtag phù hợp', m.hashtags.length >= 3 && m.hashtags.length <= 8, m.hashtags.length.toString())}
${this.renderCheckItem('at', 'Mention người liên quan', m.mentions.length > 0, m.mentions.length > 0 ? 'Có' : 'Không')}
${this.renderCheckItem('question', 'CTA (kêu gọi hành động)', /follow|like|comment|share/i.test(m.caption), /follow|like|comment|share/i.test(m.caption) ? 'Có' : 'Thiếu')}
${this.renderCheckItem('face-smile', 'Sử dụng emoji', /[\u{1F300}-\u{1F9FF}]/u.test(m.caption), /[\u{1F300}-\u{1F9FF}]/u.test(m.caption) ? 'Có' : 'Không')}
${this.renderCheckItem('clock', 'Thời điểm đăng tối ưu', true, m.bestTime)}
</div>
</div>

<div style="background:var(--glass-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:24px;padding:28px">
<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
<div style="width:48px;height:48px;background:linear-gradient(135deg,var(--accent-purple),var(--accent-pink));border-radius:14px;display:flex;align-items:center;justify-content:center;color:white;font-size:20px">
<i class="fas fa-align-left"></i>
</div>
<div>
<div style="font-size:18px;font-weight:700">Caption Gốc</div>
<div style="font-size:13px;color:var(--text-muted)">Phân tích nội dung thực tế</div>
</div>
</div>
<div style="background:rgba(3,7,18,0.7);padding:24px;border-radius:16px;color:var(--text-secondary);line-height:1.8;font-size:15px;white-space:pre-wrap;word-break:break-word">
${m.caption || 'Không có caption'}
</div>
${m.hashtags.length > 0 ? `
<div style="margin-top:20px">
<div style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Hashtag phát hiện</div>
<div style="display:flex;flex-wrap:wrap;gap:8px">
${m.hashtags.map(tag => `<span style="padding:8px 16px;background:linear-gradient(135deg,rgba(6,182,212,0.1),rgba(139,92,246,0.1));border:1px solid rgba(6,182,212,0.2);border-radius:20px;color:var(--accent-cyan);font-size:13px;font-weight:500;cursor:pointer;transition:all 0.3s" onmouseover="this.style.background='var(--accent-cyan)';this.style.color='white'" onmouseout="this.style.background='linear-gradient(135deg,rgba(6,182,212,0.1),rgba(139,92,246,0.1))';this.style.color='var(--accent-cyan)'">${tag}</span>`).join('')}
</div>
</div>
` : ''}
</div>
</div>
</div>
`;

this.animate(m.seoScore);
},

renderScoreCard(score) {
const status = score >= 80 ? 'Xuất sắc' : score >= 60 ? 'Cần tối ưu' : 'Thiếu sót nhiều';
const color = score >= 80 ? 'var(--accent-green)' : score >= 60 ? 'var(--accent-cyan)' : 'var(--accent-rose)';

return `
<div class="seo-score-main" style="background:var(--glass-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:24px;padding:32px;text-align:center;position:relative;overflow:hidden;grid-column:1/-1">
<div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--accent-cyan),var(--accent-blue),var(--accent-purple))"></div>
<div style="font-size:72
