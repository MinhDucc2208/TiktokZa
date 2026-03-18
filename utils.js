const Utils = {
formatNumber(num) {
if (!num || isNaN(num)) return '0';
if (num >= 1e9) return (num / 1e9).toFixed(2) + 'T';
if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
return num.toLocaleString('vi-VN');
},

formatDate(date) {
const d = new Date(date);
return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
},

formatRelativeTime(date) {
const diff = Date.now() - new Date(date);
const mins = Math.floor(diff / 60000);
const hours = Math.floor(diff / 3600000);
const days = Math.floor(diff / 86400000);
if (mins < 1) return 'Vừa xong';
if (mins < 60) return `${mins} phút trước`;
if (hours < 24) return `${hours} giờ trước`;
if (days < 7) return `${days} ngày trước`;
return this.formatDate(date);
},

copyText(text) {
navigator.clipboard.writeText(text).then(() => {
Components.notify('Đã sao chép!', 'success');
});
},

animateNumber(element, target, duration = 1500, suffix = '') {
let current = 0;
const step = target / (duration / 16);
const timer = setInterval(() => {
current += step;
if (current >= target) {
current = target;
clearInterval(timer);
}
element.textContent = (target > 1000 ? this.formatNumber(Math.floor(current)) : current.toFixed(2)) + suffix;
}, 16);
},

calculateMetrics(data) {
if (!data) return null;
const v = data.play_count || 0;
const l = data.digg_count || 0;
const c = data.comment_count || 0;
const s = data.share_count || 0;
const duration = data.duration || 0;

const engagement = v > 0 ? ((l + c + s) / v * 100) : 0;
const trendScore = v + l * 2 + c * 3 + s * 4;
const viralityScore = v > 0 ? ((s * 5 + c * 3 + l) / v) : 0;
const performanceScore = (v + l * 2 + c * 3 + s * 4) / 1000;
const qualityScore = Math.min(100, Math.round((l + c + s) / Math.max(v / 1000, 1)));
const viralProbability = Math.min(100, Math.round((s * 10 + c * 5 + l * 2) / Math.max(v / 100, 1)));

const caption = data.title || '';
const hashtags = (caption.match(/#\w+/g) || []);
const mentions = (caption.match(/@\w+/g) || []);

let seoScore = 0;
seoScore += Math.min(caption.length * 0.8, 40);
seoScore += hashtags.length * 8;
seoScore += mentions.length * 5;
seoScore += (caption.includes('?') || caption.includes('!')) ? 10 : 0;
seoScore += /[\u{1F300}-\u{1F9FF}]/u.test(caption) ? 5 : 0;
seoScore = Math.min(100, seoScore);

let audience = 'Người lớn (25+)';
if (engagement > 20) audience = 'Gen Z (13-17)';
else if (engagement > 12) audience = 'Gen Z/Young Millennial (18-24)';
else if (engagement > 8) audience = 'Millennial (25-34)';

const bestTime = engagement > 15 ? '19:00-21:00' : engagement > 10 ? '12:00-14:00' : '18:00-20:00';
const growthRate = engagement > 15 ? 'Tăng nhanh' : engagement > 8 ? 'Tăng ổn định' : 'Chậm';

return {
views: v,
likes: l,
comments: c,
shares: s,
duration,
engagement: engagement.toFixed(2),
trendScore,
trendScoreFormatted: this.formatNumber(trendScore),
viralityScore: viralityScore.toFixed(4),
performanceScore: performanceScore.toFixed(2),
qualityScore,
viralProbability,
growthRate,
seoScore,
audience,
bestTime,
hashtags,
mentions,
caption
};
},

debounce(fn, delay) {
let timeout;
return (...args) => {
clearTimeout(timeout);
timeout = setTimeout(() => fn(...args), delay);
},

isValidTikTokUrl(url) {
return url && typeof url === 'string' && url.includes('tiktok.com');
},

extractVideoId(url) {
const match = url.match(/\/video\/(\d+)/);
return match ? match[1] : null;
},

generateId() {
return Date.now() + Math.random().toString(36).substr(2, 9);
}
};
