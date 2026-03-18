const API = {
async fetchVideoData(url) {
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), CONFIG.API.TIMEOUT);

try {
const apiUrl = `${CONFIG.API.BASE_URL}/?url=${encodeURIComponent(url)}`;
const response = await fetch(apiUrl, { signal: controller.signal });
clearTimeout(timeoutId);

if (!response.ok) {
throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}

const result = await response.json();

if (!result.data) {
throw new Error('Video private, đã xóa hoặc không tồn tại');
}

return result.data;
} catch (error) {
clearTimeout(timeoutId);
if (error.name === 'AbortError') {
throw new Error('Hết thời gian kết nối. Vui lòng thử lại.');
}
throw error;
}
},

async analyze(url) {
if (!Utils.isValidTikTokUrl(url)) {
throw new Error('Link TikTok không hợp lệ');
}

const data = await this.fetchVideoData(url);
return data;
}
};
