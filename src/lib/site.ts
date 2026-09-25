/**
 * 站点规范主机名（唯一来源）。
 *
 * 2026-09-25 决定：不单独注册域名，本站部署在 aiscoutly.com 的子域名下。
 *
 * 子域名没有 www / 裸域两个变体，所以不存在 aiscoutly 主站那种
 * 「Vercel 里 Primary Domain 设反 → 整份 sitemap 变重定向」的问题。
 * 但同样的铁律仍然适用：SITE_URL 必须与站点实际返回 200 的主机名完全一致，
 * 否则 sitemap 和 canonical 里写的 URL 全都会变成重定向，Google 会判为
 * 「网页已重定向」而不予收录（aiscoutly 主站踩过这个坑，2026-09-20 才修复）。
 *
 * 改动 SITE_HOST 时请一并确认：Vercel 项目已绑定该域名、DNS 已解析、
 * 线上 curl -I 返回 200 而非 308。
 */
export const SITE_HOST = "loancalcly.aiscoutly.com";

export const SITE_URL = `https://${SITE_HOST}`;

export const SITE_NAME = "LoanCalcly";

/**
 * 联系邮箱。原值挂在 loancalcly.com 上 —— 该域名已决定不注册，
 * 邮箱会变成死信箱，故换成同域名体系下可用的地址。
 * ⚠️ 需要用户在 Namecheap 给 aiscoutly.com 配置邮件转发，
 * 把 hello@aiscoutly.com 转到他自己的 Gmail，否则用户来信收不到。
 */
export const CONTACT_EMAIL = "hello@aiscoutly.com";

export const EDITORIAL_BYLINE = "LoanCalcly Editorial";
