/**
 * Umami 访问统计
 *
 * 相关环境变量（配置在 .env.development / .env.production 等文件中）：
 * - VUE_APP_UMAMI_SCRIPT_URL  埋点脚本地址，自托管如 http://10.12.58.53:3000/script.js
 * - VUE_APP_UMAMI_WEBSITE_ID  网站 ID（Umami 后台添加网站后生成）
 * - VUE_APP_UMAMI_API_BASE    统计接口前缀：
 *                             自托管走本地代理填 /umami-api/api；
 *                             Umami Cloud 填 https://api.umami.is/v1
 * - VUE_APP_UMAMI_USERNAME    自托管账号（用于换取 token）
 * - VUE_APP_UMAMI_PASSWORD    自托管密码
 * - VUE_APP_UMAMI_TOKEN       可选，已有的长期 token（与账号密码二选一）
 * - VUE_APP_UMAMI_API_KEY     可选，Umami Cloud 的 API Key
 */
import axios from "axios";

const SCRIPT_URL = process.env.VUE_APP_UMAMI_SCRIPT_URL || "";
const WEBSITE_ID = process.env.VUE_APP_UMAMI_WEBSITE_ID || "";
const API_BASE = (process.env.VUE_APP_UMAMI_API_BASE || "").replace(/\/+$/, "");
const USERNAME = process.env.VUE_APP_UMAMI_USERNAME || "";
const PASSWORD = process.env.VUE_APP_UMAMI_PASSWORD || "";
const TOKEN = process.env.VUE_APP_UMAMI_TOKEN || "";
const API_KEY = process.env.VUE_APP_UMAMI_API_KEY || "";

// 脚本地址与网站 ID 都配置后才启用统计
export const umamiEnabled = Boolean(SCRIPT_URL && WEBSITE_ID);

let scriptInjected = false;

/**
 * 注入 Umami 埋点脚本（全局只注入一次）
 */
export function initUmami() {
  if (!umamiEnabled || scriptInjected) return;
  scriptInjected = true;
  const script = document.createElement("script");
  script.defer = true;
  script.src = SCRIPT_URL;
  script.setAttribute("data-website-id", WEBSITE_ID);
  document.head.appendChild(script);
}

/**
 * 手动上报一次页面浏览，用于 vue-router hash 模式的路由切换
 */
export function trackPageview() {
  if (window.umami && typeof window.umami.track === "function") {
    window.umami.track();
  }
}

let tokenCache = { value: "", expireAt: 0 };

// 从 JWT 中解析过期时间，解析失败时按 1 小时处理
function decodeExpireAt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(base64));
    return payload.exp ? payload.exp * 1000 : Date.now() + 60 * 60 * 1000;
  } catch (error) {
    return Date.now() + 60 * 60 * 1000;
  }
}

async function getAuthToken(force) {
  // Cloud 模式使用 API Key，无需 token
  if (API_KEY) return "";
  if (TOKEN) return TOKEN;
  if (!force && tokenCache.value && tokenCache.expireAt > Date.now() + 60 * 1000) {
    return tokenCache.value;
  }
  // 未配置账号密码时返回空，认证可由 Nginx 代理在服务端注入
  if (!USERNAME || !PASSWORD) return "";
  const { data } = await axios.post(
    `${API_BASE}/auth/login`,
    { username: USERNAME, password: PASSWORD },
    { timeout: 8000 }
  );
  tokenCache = { value: data.token, expireAt: decodeExpireAt(data.token) };
  return tokenCache.value;
}

function buildAuthHeaders(token) {
  if (token) return { Authorization: `Bearer ${token}` };
  if (API_KEY) return { "x-umami-api-key": API_KEY };
  // 无认证信息时不带 header，交由代理注入
  return {};
}

async function requestActiveVisitors(token) {
  const { data } = await axios.get(
    `${API_BASE}/websites/${WEBSITE_ID}/active`,
    { headers: buildAuthHeaders(token), timeout: 8000 }
  );
  const visitors = Number(data && data.visitors);
  return Number.isFinite(visitors) ? visitors : 0;
}

/**
 * 获取实时访问数（Umami 统计口径：最近 5 分钟内的独立访客数）
 * 未配置统计时返回 null
 */
export async function fetchActiveVisitors() {
  if (!umamiEnabled || !API_BASE) return null;
  const token = await getAuthToken(false);
  try {
    return await requestActiveVisitors(token);
  } catch (error) {
    // token 过期时重新登录一次
    const needRetry =
      error.response &&
      error.response.status === 401 &&
      !API_KEY &&
      !TOKEN &&
      USERNAME &&
      PASSWORD;
    if (!needRetry) throw error;
    const freshToken = await getAuthToken(true);
    return await requestActiveVisitors(freshToken);
  }
}
