import Link from "next/link";
import { relatedGuides, type Guide } from "@/lib/guides";

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

export function Byline({ published }: { published: string }) {
  return (
    <p className="mt-3 text-sm text-gray-500">
      Reviewed by{" "}
      <span className="font-medium text-gray-700">LoanCalcly Editorial</span> ·
      Published {published}
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
}: {
  headline: string;
  description: string;
  path: string;
  siteUrl: string;
  datePublished: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    author: { "@type": "Organization", name: "LoanCalcly Editorial" },
    publisher: { "@type": "Organization", name: "LoanCalcly", url: siteUrl },
    datePublished,
    dateModified: datePublished,
    mainEntityOfPage: `${siteUrl}${path}`,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** 指南底部：内链 + 免责 */
export function ArticleFooter({ currentSlug }: { currentSlug: string }) {
  const related: Guide[] = relatedGuides(currentSlug, 4);
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
