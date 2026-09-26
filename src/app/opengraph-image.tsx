import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_HOST } from "@/lib/site";

/**
 * 全站社交分享图（1200×630）。
 *
 * 用 `next/og` 在构建期动态生成，因此**不需要任何静态图片文件**，
 * 也不存在图片过期问题。放在 app 根目录 → 所有页面自动继承；
 * 某页需要专属图时，在那一级的目录里再放一个 `opengraph-image.tsx` 即可覆盖。
 *
 * ⚠️ satori 的排版约束：一个 div 有**两个及以上子节点**时必须显式写
 * `display: "flex"`，否则构建期直接报错。所有容器都按这条写。
 * 不要引用站点未打包的字体（Geist 是 next/font 动态注入的，这里拿不到），
 * 统用 satori 自带的默认字体。
 */

export const alt = `${SITE_NAME} — see what a loan actually costs`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** 首页那张图上引用的示例数字（$300,000 @ 6.50% / 30yr），与站内其余页面同源 */
const MONTHLY = "$1,896.20";
const TOTAL_INTEREST = "$382,633";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* 品牌行 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #059669, #0d9488)",
              color: "#ffffff",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            LC
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 600,
              color: "#111827",
              letterSpacing: "-0.02em",
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: 8,
              padding: "6px 14px",
              borderRadius: 999,
              background: "#ecfdf5",
              color: "#047857",
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            Free · No signup
          </div>
        </div>

        {/* 主标题 */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 62,
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
            }}
          >
            See what a loan actually costs
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 28,
              color: "#4b5563",
              lineHeight: 1.4,
            }}
          >
            Monthly payment, total interest and the full amortization schedule.
          </div>
        </div>

        {/* 数字条：本站的真实算例 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid #d1fae5",
            background: "#f0fdfa",
            borderRadius: 20,
            padding: "24px 32px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 20, color: "#047857" }}>
              $300,000 · 6.50% · 30 years
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 6,
                fontSize: 40,
                fontWeight: 700,
                color: "#065f46",
                letterSpacing: "-0.02em",
              }}
            >
              {MONTHLY} / month
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <div style={{ display: "flex", fontSize: 20, color: "#047857" }}>
              Total interest
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 6,
                fontSize: 40,
                fontWeight: 700,
                color: "#065f46",
                letterSpacing: "-0.02em",
              }}
            >
              {TOTAL_INTEREST}
            </div>
          </div>
        </div>

        {/* 页脚 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#6b7280",
          }}
        >
          <div style={{ display: "flex" }}>
            Mortgage · Auto · Personal · Student · Amortization
          </div>
          <div style={{ display: "flex", fontWeight: 600, color: "#059669" }}>
            {SITE_HOST}
          </div>
        </div>
      </div>
    ),
    size
  );
}
