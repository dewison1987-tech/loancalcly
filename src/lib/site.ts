/**
 * 站点规范主机名（唯一来源）。
 *
 * 2026-09-25 最终决定：使用**独立域名**，规范主机名 = 裸域 loancalcly.com。
 * （当天先评估过「挂在已有 aiscoutly.com 的子域名下、省一次注册」的方案，
 *   后来改回独立域名：aiscoutly.com 带程序化 SEO 历史包袱，AdSense 的拒批
 *   记录会跟着子域名走，省下的 $10 换不来干净的抓取历史。
 *   架构上没有任何返工 —— 主机名只在这一个常量里声明。）
 *
 * ⚠️ 与 aiscoutly 主站**相反**：主站规范主机名是带 www 的
 * `https://www.aiscoutly.com`，本站是裸域 `https://loancalcly.com`。
 * 因此 Vercel 里**必须把裸域 loancalcly.com 设为 Primary Domain**，
 * 让 www.loancalcly.com 308 跳转到裸域。若设反，sitemap 和 canonical 里
 * 写的 URL 会全部变成重定向，Google 判为「网页已重定向」而不予收录
 * （aiscoutly 主站踩过这个坑，2026-09-20 才发现并修复）。
 *
 * 改动 SITE_HOST 时请一并确认：Vercel 项目已绑定该域名、DNS 已解析、
 * 线上 `curl -sI` 返回 200 而非 308。
 */
export const SITE_HOST = "loancalcly.com";

export const SITE_URL = `https://${SITE_HOST}`;

export const SITE_NAME = "LoanCalcly";

/**
 * 联系邮箱。挂在 loancalcly.com 上。
 * ⚠️ 需要用户在 Namecheap 配置邮件转发，把 hello@loancalcly.com 转到自己的
 * Gmail，否则 contact / privacy / terms 页上的这个地址收不到信。
 */
export const CONTACT_EMAIL = "hello@loancalcly.com";

export const EDITORIAL_BYLINE = "LoanCalcly Editorial";
