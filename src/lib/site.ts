/**
 * 站点规范主机名（唯一来源）。
 *
 * 重要：在 Vercel 里必须把 loancalcly.com 设为 Primary Domain，
 * 让 www.loancalcly.com 308 跳转到裸域。否则 sitemap / canonical 里
 * 写的 URL 会变成重定向，Google 判为「网页已重定向」而不予收录。
 * （aiscoutly.com 就是踩了这个坑，2026-09-20 才发现并修复。）
 */
export const SITE_URL = "https://loancalcly.com";

export const SITE_NAME = "LoanCalcly";

export const CONTACT_EMAIL = "hello@loancalcly.com";

export const EDITORIAL_BYLINE = "LoanCalcly Editorial";
