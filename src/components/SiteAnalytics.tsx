import Script from "next/script";

/**
 * Google Analytics 4（环境变量驱动）
 * 在 Vercel 项目里设置 NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX 即自动生效；
 * 未设置时组件不渲染任何东西，不会污染 HTML。
 */
export default function SiteAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
