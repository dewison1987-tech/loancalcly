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
  //
  // ⚠️ 2026-10-03 第三处：首页、/calculators、/guides 三个页面的可见内容
  // 都随第 4 批指南一起变了 —— 首页与 /calculators 的指南清单从 11 条变
  // 15 条（`GUIDES.map` 直接渲染），/guides 新增 4 行问句表并把导语改成
  // "fifteen guides"。三个页面的日期同步到 10-03。
  // 注意：6 个计算器页的 `updated` **没有**跟着改 —— 它们的正文一字未动，
  // 变的只是页脚内链。批量刷新 lastmod 会让这个字段重新失去信息量。
  //
  // ⚠️ 2026-10-09 第四处（第 5 批）：同样是这三个页面。
  //   首页 / /calculators —— 指南清单 15 条变 19 条（`GUIDES.map` 渲染，
  //     卡片与链接标题都是可见文本）→ 正文确实变了。
  //   /guides —— 问句表 15 行变 19 行，导语 "fifteen" 改 "nineteen"。
  // 与 10-03 一样：既有 15 篇指南的 `updated` 一律**不动**。第 5 批只改了
  // 它们的 `related`（页脚内链），正文一字未改 —— 判据是「不看页脚，
  // 读者在这一页看到的东西变了吗」。动了就等于这个字段又开始说假话。
  //
  // 另外注意三个页面的 `REVIEWED`（"Last reviewed"）常量与这里不同步：
  // 首页与 /calculators 的 REVIEWED 停在 September 20 —— 变的是自动派生的
  // 清单，不是这两页自己的文字，所以不算一次「复阅」。/guides 的导语与
  // 表格确实重写过，REVIEWED 才跟着走到 10-09。
  //
  // ⚠️ 2026-10-10 第五处（同意横幅 CMP）：**只有 /privacy 一个页面动日期。**
  //   同意横幅挂在全站 34 个页面上，页脚也多了一个 "Cookie preferences" 按钮 ——
  //   但它们都**不是页面内容**：
  //     - 横幅在服务端渲染时带 `hidden`（是否显示取决于 localStorage），
  //       对爬虫而言它不存在，且 fixed 定位不进文档流。
  //     - 页脚变化按既定判据不计入（「不看页脚，读者在这一页看到的东西变了吗」）。
  //   只有 /privacy 的第 2、6 节真的新增了「如何更改/撤回同意」的段落，
  //   而这两段正是为了兑现原第 3、6 节「可随时撤回」那句承诺 —— 那才算内容变更。
  //   给全站刷一遍日期就是又一次把 lastmod 变成噪声，前面特意去掉
  //   `new Date()` 的收益会全部作废。
  //
  // ⚠️ 2026-10-10 同日：压短了 16 个页面的 `<title>`，连同 layout 的
  //   `title.default`（只有 404 页会用到），并把 21 个页面的
  //   `<meta description>` 与 layout 的兜底 description 收到 160 字符内
  //   （SERP 约在 60 / 160 字符处截断，超出部分读者看不到）。
  //   **这些一律不动 lastmod**。理由：这个字段跟踪的是「页面内容有没有实质
  //   变化」，而标题与摘要是 SERP 呈现层的调整，没有新增任何读者能读到的东西；
  //   20 多个页面在同一天因为同一次批量改动全部变成同一天，正好就是我们
  //   前面花力气消除的那种噪声形态。代价最多是标题更新晚一次自然抓取，
  //   远小于 lastmod 整站失信的代价。
  { path: "", priority: 1, changeFrequency: "weekly", lastModified: "2026-10-09" },
  { path: "/calculators", priority: 0.9, changeFrequency: "weekly", lastModified: "2026-10-09" },
  { path: "/guides", priority: 0.8, changeFrequency: "weekly", lastModified: "2026-10-09" },
  { path: "/methodology", priority: 0.6, changeFrequency: "monthly", lastModified: "2026-09-26" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly", lastModified: "2026-09-26" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly", lastModified: "2026-09-25" },
  { path: "/privacy", priority: 0.3, changeFrequency: "monthly", lastModified: "2026-10-10" },
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
