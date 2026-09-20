import Script from "next/script";

/**
 * Google AdSense 加载器（环境变量驱动）
 * 在 Vercel 项目里设置 NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX 即自动生效；
 * 未设置时组件不渲染任何东西。
 */
export default function AdSense() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) return null;

  return (
    <Script
      id="adsbygoogle-init"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
    />
  );
}
