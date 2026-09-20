import type { MetadataRoute } from "next";
import { GUIDES } from "@/lib/guides";
import { CALCULATORS } from "@/lib/calculators";

// 必须与站点实际返回 200 的主机名一致（Vercel 里把裸域设为 Primary Domain）
const BASE_URL = "https://loancalcly.com";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly";
};

const STATIC_PAGES: Entry[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/calculators", priority: 0.9, changeFrequency: "weekly" },
  { path: "/guides", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.3, changeFrequency: "monthly" },
  { path: "/disclaimer", priority: 0.3, changeFrequency: "monthly" },
];

// 指南与计算器页从注册表自动派生，新增页面无需改动本文件
const GUIDE_PAGES: Entry[] = GUIDES.map((g) => ({
  path: `/${g.slug}`,
  priority: 0.8,
  changeFrequency: "monthly" as const,
}));

const CALCULATOR_PAGES: Entry[] = CALCULATORS.map((c) => ({
  path: `/${c.slug}`,
  priority: 0.9,
  changeFrequency: "monthly" as const,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [...STATIC_PAGES, ...CALCULATOR_PAGES, ...GUIDE_PAGES].map((p) => ({
    url: `${BASE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
