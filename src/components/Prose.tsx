import Link from "next/link";
import type { Guide } from "@/lib/guides";
import type { Calculator } from "@/lib/calculators";
import { relatedCalculators, relatedGuides } from "@/lib/related";
import { AUTHOR, SITE_NAME } from "@/lib/site";

/* ── 排版原子 ─────────────────────────────────────────────── */

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 text-xl font-semibold text-gray-900 sm:text-2xl">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-6 text-lg font-medium text-gray-900">{children}</h3>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 leading-relaxed text-gray-600">{children}</p>;
}

export function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="ml-5 mt-4 list-disc space-y-2 leading-relaxed text-gray-600">
      {children}
    </ul>
  );
}

export function Formula({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm text-gray-800">
      {children}
    </p>
  );
}

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-sm leading-relaxed text-amber-900">
      {children}
    </div>
  );
}

/** 站内链接（正文里用） */
export function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
    >
      {children}
    </Link>
  );
}

/* ── 数据表 ───────────────────────────────────────────────── */

export function DataTable({
  head,
  rows,
  align = [],
  caption,
}: {
  head: React.ReactNode[];
  rows: React.ReactNode[][];
  /** 每列对齐：'l' 左（默认）| 'r' 右。数字列建议右对齐 */
  align?: ("l" | "r")[];
  caption?: string;
}) {
  const cls = (i: number) =>
    align[i] === "r" ? "px-4 py-2.5 text-right" : "px-4 py-2.5";
  return (
    <div className="mt-5">
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm tabular-nums">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              {head.map((h, i) => (
                <th
                  key={i}
                  className={`${cls(i)} font-medium whitespace-nowrap`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`${cls(ci)} whitespace-nowrap`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <p className="mt-2 text-sm text-gray-500">{caption}</p>
      )}
    </div>
  );
}

/* ── 文章框架 ─────────────────────────────────────────────── */

/**
 * 作者署名链接。指向 /methodology —— 那里有作者简介与数字验证流程，
 * 是本站 E-E-A-T 的落点。署名来源是 site.ts 的 AUTHOR 常量（单点可改）。
 */
export function AuthorLink() {
  return (
    <Link
      href="/methodology"
      className="font-medium text-gray-700 underline underline-offset-2 hover:text-emerald-700"
    >
      {AUTHOR.name}
    </Link>
  );
}

export function Byline({ published }: { published: string }) {
  return (
    <p className="mt-3 text-sm text-gray-500">
      By <AuthorLink /> · Published {published}
    </p>
  );
}

/** Article 结构化数据 */
export function ArticleSchema({
  headline,
  description,
  path,
  siteUrl,
  datePublished,
  dateModified,
}: {
  headline: string;
  description: string;
  path: string;
  siteUrl: string;
  datePublished: string;
  /** 内容实际改动的日期（留空则等于 datePublished）。补 FAQ 这类真实内容变更要传 */
  dateModified?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    // E-E-A-T：author 用**真人**（Person），不是机构。本站属 YMYL（金融），
    // 「一个没有人的金融站」正是最容易被判低价值的形态。
    author: {
      "@type": "Person",
      name: AUTHOR.name,
      jobTitle: AUTHOR.shortRole,
      url: `${siteUrl}/methodology`,
    },
    reviewedBy: {
      "@type": "Person",
      name: AUTHOR.name,
      jobTitle: AUTHOR.shortRole,
    },
    // publisher 带上 layout 里 Organization 的 @id，让「文章的出版方」与
    // 站点级组织实体在知识图谱里指向同一个节点，而不是每页各造一个匿名组织。
    // 同时保留 name/url/logo —— Article 富媒体结果要求 publisher 自带这些字段，
    // 只写 @id 引用有被判「publisher 缺失」的风险。
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: SITE_NAME,
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/icon.svg` },
    },
    datePublished,
    dateModified: dateModified ?? datePublished,
    mainEntityOfPage: `${siteUrl}${path}`,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** 结构化数据。传数组或单个对象都行。 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** FAQ 的一组问答 */
export type FaqItem = { q: string; a: string };

/**
 * 指南页 FAQ —— **可见问答与 FAQPage schema 出自同一份数据**。
 *
 * 2026-09-26 全站自检发现 `/apr-vs-interest-rate` 有完整的 FAQ 区块却只输出了
 * `Article` schema：手工维护「页面文案」和「schema 数组」两份必然漂移。
 * 所以这里把两者绑成一个组件——写一次问答，可见内容与结构化数据同时产出。
 *
 * ⚠️ 答案刻意用**纯字符串**而非 JSX：Google 要求 FAQPage 的文本必须在页面上
 * 可见，允许在答案里插链接就会出现「页面上有、schema 里没有」的偏差。
 * 需要内链时写在 FAQ 前后的正文里。
 */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <H2>Frequently asked questions</H2>
      {items.map((f) => (
        <div key={f.q}>
          <H3>{f.q}</H3>
          <P>{f.a}</P>
        </div>
      ))}
    </>
  );
}

/** 指南底部：内链 + 免责 */
export function ArticleFooter({ currentSlug }: { currentSlug: string }) {
  const related: Guide[] = relatedGuides(currentSlug, 4);
  const calculators: Calculator[] = relatedCalculators(currentSlug, 3);
  return (
    <>
      <section className="mt-12 border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold text-gray-900">Related guides</h2>
        <ul className="mt-3 space-y-2 text-gray-600">
          {related.map((g) => (
            <li key={g.slug}>
              <A href={`/${g.slug}`}>{g.title}</A>
              <span className="text-gray-500"> — {g.summary}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-gray-500">
          Run your own numbers in the <A href="/">loan calculator</A>.
        </p>
      </section>

      {/* 指南 → 计算器这一跳此前是缺的（全文只有页脚一条「loan calculator」）。
          对「读完一篇文章想算自己的数」的读者，这是最有效的一次点击。 */}
      <section className="mt-10 border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Calculators for this topic
        </h2>
        <ul className="mt-3 space-y-2 text-gray-600">
          {calculators.map((c) => (
            <li key={c.slug}>
              <A href={`/${c.slug}`}>{c.title}</A>
              <span className="text-gray-500"> — {c.summary}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-gray-500">
          <A href="/calculators">See all calculators</A>
        </p>
      </section>

      <p className="mt-10 border-t border-gray-200 pt-5 text-sm text-gray-500">
        This guide is educational and is not financial advice. Figures were
        produced by our calculator and independently recomputed before
        publication; your lender&apos;s own documents govern your loan. Spot an
        error? <A href="/contact">Tell us</A> — see also our{" "}
        <A href="/disclaimer">disclaimer</A>.
      </p>
    </>
  );
}

/**
 * 计算器页底部：横向内链（其他计算器）+ 纵向内链（相关指南）+ 免责。
 * 注册表驱动，新增计算器或指南自动出现在这里。
 */
export function CalculatorFooter({ currentSlug }: { currentSlug: string }) {
  const calculators: Calculator[] = relatedCalculators(currentSlug, 4);
  const guides: Guide[] = relatedGuides(currentSlug, 3);

  return (
    <>
      <section className="mt-12 border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Other calculators
        </h2>
        <ul className="mt-3 space-y-2 text-gray-600">
          {calculators.map((c) => (
            <li key={c.slug}>
              <A href={`/${c.slug}`}>{c.title}</A>
              <span className="text-gray-500"> — {c.summary}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-gray-500">
          <A href="/calculators">See all calculators</A>
        </p>
      </section>

      <section className="mt-10 border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Guides that go with it
        </h2>
        <ul className="mt-3 space-y-2 text-gray-600">
          {guides.map((g) => (
            <li key={g.slug}>
              <A href={`/${g.slug}`}>{g.title}</A>
              <span className="text-gray-500"> — {g.summary}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 border-t border-gray-200 pt-5 text-sm text-gray-500">
        This calculator is educational and is not financial advice, and its
        output is an estimate — lenders apply their own fees, rounding rules and
        day-count conventions. Every figure was produced by the same calculator
        code and independently recomputed before publication. Spot an error?{" "}
        <A href="/contact">Tell us</A> — see also our{" "}
        <A href="/disclaimer">disclaimer</A>.
      </p>
    </>
  );
}
