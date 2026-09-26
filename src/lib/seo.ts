import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

/**
 * 页面 metadata 的唯一出口。
 *
 * ⚠️ canonical 与 og:url 必须是**同一个值**。此前根 layout 把 `openGraph.url`
 * 静态写死成 SITE_URL，于是全部内页都继承了首页地址 —— 分享出去时平台拿到的
 * 是首页 URL，预览图与统计全部失真（2026-09-26 全站自检实测：18 页里 17 页的
 * og:url 指向首页）。所以这里把两者绑在一起生成，从结构上消除不一致的可能。
 *
 * 分享图不用在这里声明：`src/app/opengraph-image.tsx` 会按目录继承，
 * 每页自动带上 1200×630 的品牌图。
 *
 * @param path 站内路径，必须以 `/` 开头。同时用作 canonical 与 og:url，
 *             Next 会拿根 layout 的 `metadataBase` 把它拼成绝对 URL。
 * @param type 指南类文章页传 `"article"`，其余页面用默认的 `"website"`。
 */
export function pageMetadata({
  path,
  title,
  description,
  type = "website",
}: {
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
}): Metadata {
  return {
    alternates: { canonical: path },
    title,
    description,
    openGraph: {
      type,
      url: path,
      siteName: SITE_NAME,
      // ⚠️ 这一行不能省。Next 的 `openGraph` 在页面级是**整体替换、不是深合并**：
      // 页面一旦自己声明 openGraph，根目录 `app/opengraph-image.tsx` 那张图
      // 就不会继承下来 —— 实测首页有 og:image、其余 17 个内页全部为空
      // （2026-09-26 本地构建逐页抓取确认）。显式声明才稳。
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — see what a loan actually costs`,
        },
      ],
    },
  };
}
