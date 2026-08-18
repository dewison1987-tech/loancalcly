import type { MetadataRoute } from "next";

// TODO: 独立域名注册后替换为正式域名
const BASE_URL = "https://loan-calculator.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
  ];
}
