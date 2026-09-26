import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import SiteAnalytics from "@/components/SiteAnalytics";
import AdSense from "@/components/AdSense";
import { AUTHOR, CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/Prose";
import { CALCULATORS } from "@/lib/calculators";
import { GUIDES } from "@/lib/guides";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Loan Calculator — Free Monthly Payment & Amortization Calculator",
    template: "%s | LoanCalcly",
  },
  description:
    "Free loan calculators for mortgages, car loans, personal loans and student loans. Work out the monthly payment, total interest and full amortization schedule. No signup required.",
  // ⚠️ 这里**不要**设 `openGraph.url`：根 layout 的值会被所有内页继承，
  // 导致 18 页的 og:url 全指向首页（2026-09-26 自检实测踩过）。
  // 每页的 og:url 由 `pageMetadata()` 与本页 canonical 同源生成。
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
  },
  // 分享图由 app/opengraph-image.tsx 提供，这里只需要声明卡片形态。
  twitter: {
    card: "summary_large_image",
  },
  ...(ADSENSE_CLIENT
    ? { other: { "google-adsense-account": ADSENSE_CLIENT } }
    : {}),
};

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Loan calculator" },
  { href: "/calculators", label: "Calculators" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** 页脚分三组：计算器 / 指南 / 站点。前两组直接由注册表派生。 */
const FOOTER_CALCULATORS: { href: string; label: string }[] = [
  { href: "/calculators", label: "All calculators" },
  ...CALCULATORS.map((c) => ({ href: `/${c.slug}`, label: c.title })),
];

const FOOTER_GUIDES: { href: string; label: string }[] = [
  { href: "/guides", label: "All guides" },
  ...GUIDES.map((g) => ({ href: `/${g.slug}`, label: g.title })),
];

const FOOTER_SITE: { href: string; label: string }[] = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

function FooterGroup({
  heading,
  links,
}: {
  heading: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="min-w-0">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {heading}
      </h2>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-gray-700 transition-colors hover:text-emerald-700 hover:underline"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * 站点级实体。E-E-A-T 的地基：Google 需要知道「这个站是谁做的」，
 * 而不仅仅是有哪些页面。两个实体用 @id 互相引用，避免被解析成两个无关主体。
 *
 * ⚠️ 刻意**不加** `SearchAction`：本站没有站内搜索。在结构化数据里声明
 * 一个不存在的能力属于不实描述，比缺字段更糟 —— 同理，没有真实社交账号
 * 就不写 `sameAs`。
 */
const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  email: CONTACT_EMAIL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
  description:
    "Independent loan payment and amortisation calculators with a published verification method.",
  founder: { "@type": "Person", name: AUTHOR.name, url: `${SITE_URL}/methodology` },
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "en",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const year = new Date().getFullYear();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <JsonLd data={[ORGANIZATION_SCHEMA, WEBSITE_SCHEMA]} />
        <header className="border-b border-gray-200 bg-white">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-y-2 px-4 py-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold tracking-tight text-gray-900"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, #059669, #0d9488)" }}
              >
                LC
              </span>
              {SITE_NAME}
            </Link>
            <div className="flex flex-wrap items-center justify-end gap-1 text-sm">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>

        {children}

        <footer className="mt-auto border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-gray-600">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <FooterGroup heading="Calculators" links={FOOTER_CALCULATORS} />
              <FooterGroup heading="Guides" links={FOOTER_GUIDES} />
              <FooterGroup heading="Site" links={FOOTER_SITE} />
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <p className="leading-relaxed text-gray-500">
                <span className="font-medium text-gray-700">
                  Estimates only.
                </span>{" "}
                LoanCalcly is not a lender or a financial adviser, and nothing on
                this site is financial advice. Figures are illustrative and your
                lender&apos;s Loan Estimate governs your actual loan.{" "}
                <Link
                  href="/disclaimer"
                  className="text-gray-700 underline underline-offset-2 hover:text-emerald-700"
                >
                  Read the full disclaimer
                </Link>
                .
              </p>

              <p className="mt-3 leading-relaxed text-gray-500">
                <span className="font-medium text-gray-700">
                  Advertising disclosure:
                </span>{" "}
                this site is supported by advertising and may contain affiliate
                links. Third-party vendors, including Google, may use cookies to
                serve ads based on your prior visits to this and other websites.
                See the{" "}
                <Link
                  href="/privacy"
                  className="text-gray-700 underline underline-offset-2 hover:text-emerald-700"
                >
                  Privacy policy
                </Link>{" "}
                for details and opt-out options.
              </p>

              <p className="mt-3 text-xs text-gray-500">
                © {year} {SITE_NAME} · Calculator content reviewed by{" "}
                <Link
                  href="/methodology"
                  className="font-medium text-gray-700 underline underline-offset-2 hover:text-emerald-700"
                >
                  {AUTHOR.name}
                </Link>
                . All trademarks are the property of their respective owners.
              </p>
            </div>
          </div>
        </footer>

        <SiteAnalytics />
        <AdSense />
      </body>
    </html>
  );
}
