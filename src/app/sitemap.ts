import type { MetadataRoute } from "next";
import { GUIDES } from "@/lib/guides";
import { CALCULATORS } from "@/lib/calculators";
import { SITE_URL } from "@/lib/site";

// 主机名唯一来源是 lib/site.ts，避免同一个域名在多个文件里各写一份而改漏
const BASE_URL = SITE_URL;

/**
 * ⚠️ `lastModified` 用**每页内容真实的变更日**，不要用 `new Date()`。
 *
 * 旧实现是 `const now = new Date()`，于是每次构建都刷新全部条目的 lastmod。
 * 对 Google 来说「全站每次构建都同时更新」等于这个字段没有信息量 ——
 * 结果是**整站 lastmod 被忽略**，抓取调度回退到纯经验值。
 *
 * 日期来源：
 *   - 指南 / 计算器页 → 各自注册表的 `updated` 字段（内容实质变更日）
 *   - 静态页 → 下表的字面值
 * 改动页面内容时记得同步这两个来源，否则这个字段会重新变得不可信。
 */
type Entry = {
  path: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly";
  lastModified: string;
};

const STATIC_PAGES: Entry[] = [
  // 首页与 /calculators 在 09-26 那天真的改过（署名链接换成 AuthorLink、
  // 计算器清单从 Five 改 Six 并补上 affordability）—— 日期必须跟着走。
  // 留着旧日期就等于这个字段又开始说假话，而 lastmod 一旦不可信，
  // Google 会连整站一起忽略。
  { path: "", priority: 1, changeFrequency: "weekly", lastModified: "2026-09-26" },
  { path: "/calculators", priority: 0.9, changeFrequency: "weekly", lastModified: "2026-09-26" },
  { path: "/guides", priority: 0.8, changeFrequency: "weekly", lastModified: "2026-09-26" },
  { path: "/methodology", priority: 0.6, changeFrequency: "monthly", lastModified: "2026-09-26" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly", lastModified: "2026-09-26" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly", lastModified: "2026-09-25" },
  { path: "/privacy", priority: 0.3, changeFrequency: "monthly", lastModified: "2026-09-25" },
  { path: "/terms", priority: 0.3, changeFrequency: "monthly", lastModified: "2026-09-25" },
  { path: "/disclaimer", priority: 0.3, changeFrequency: "monthly", lastModified: "2026-09-25" },
];

// 指南与计算器页从注册表自动派生，新增页面无需改动本文件
const GUIDE_PAGES: Entry[] = GUIDES.map((g) => ({
  path: `/${g.slug}`,
  priority: 0.8,
  changeFrequency: "monthly" as const,
  lastModified: g.updated,
}));

const CALCULATOR_PAGES: Entry[] = CALCULATORS.map((c) => ({
  path: `/${c.slug}`,
  priority: 0.9,
  changeFrequency: "monthly" as const,
  lastModified: c.updated,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  return [...STATIC_PAGES, ...CALCULATOR_PAGES, ...GUIDE_PAGES].map((p) => ({
    url: `${BASE_URL}${p.path}`,
    lastModified: p.lastModified,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
