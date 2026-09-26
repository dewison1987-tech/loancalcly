import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS } from "@/lib/calculators";
import { GUIDES } from "@/lib/guides";
import { A, JsonLd, P } from "@/components/Prose";
import { SITE_URL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/calculators",
  title: "Free Loan Calculators — Mortgage, Auto, Personal and Student",
  description:
    "Five free loan calculators: mortgage with tax and insurance, auto loans with trade-in and sales tax, personal loans with fee arithmetic, student loans and full amortization schedules.",
});

const REVIEWED = "September 20, 2026";

export default function CalculatorsIndex() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Loan Calculators",
    url: `${SITE_URL}/calculators`,
    description:
      "Free loan calculators for mortgages, car loans, personal loans, student loans and amortization schedules.",
    hasPart: CALCULATORS.map((c) => ({
      "@type": "WebApplication",
      name: c.title,
      url: `${SITE_URL}/${c.slug}`,
      description: c.summary,
      applicationCategory: "FinanceApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    })),
  };

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <JsonLd data={schema} />

      <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
        Loan calculators
      </h1>
      <P>
        Five calculators, one shared calculation engine and one shared set of{" "}
        <A href="/how-loan-amortization-works">explainers</A>. Each one covers a
        different kind of borrowing rather than a different cosmetic preset — the
        mortgage calculator folds in property tax, insurance and mortgage
        insurance; the auto calculator builds the amount financed from a trade-in
        and sales tax; the personal loan page starts from the fee that never
        appears in the headline rate.
      </P>
      <P>
        Every figure on every page comes from the same code, and every number
        quoted in the explanatory text was recomputed independently before
        publication. Nothing here asks for an email address or a signup.
      </P>

      <div className="mt-8 space-y-4">
        {CALCULATORS.map((c) => (
          <Link
            key={c.slug}
            href={`/${c.slug}`}
            className="block rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
          >
            <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              {c.tag}
            </span>
            <h2 className="mt-2 text-lg font-semibold text-gray-900">
              {c.title}
            </h2>
            <p className="mt-1.5 leading-relaxed text-gray-600">{c.summary}</p>
            <p className="mt-2 text-sm font-medium text-emerald-700">
              Open the calculator →
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-12 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Start with the general loan calculator
        </h2>
        <p className="mt-2 leading-relaxed text-gray-600">
          If you just want a payment figure and a full schedule for a
          fixed-rate loan, the{" "}
          <A href="/">general loan calculator</A> does that in one screen. The
          five calculators above add the parts that differ by product — tax
          treatment, trade-ins, origination fees and the like.
        </p>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Then read the guide that goes with it
        </h2>
        <p className="mt-2 leading-relaxed text-gray-600">
          A calculator answers &ldquo;how much&rdquo;. These answer
          &ldquo;should I&rdquo; — each one works through real figures rather
          than rules of thumb.
        </p>
        <ul className="mt-3 space-y-2 leading-relaxed text-gray-600">
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <A href={`/${g.slug}`}>{g.title}</A>
              <span className="text-gray-500"> — {g.summary}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-gray-500">
          <A href="/guides">See all guides</A>
        </p>
      </section>

      <p className="mt-10 border-t border-gray-200 pt-5 text-sm text-gray-500">
        Reviewed by{" "}
        <span className="font-medium text-gray-700">LoanCalcly Editorial</span> ·
        Last reviewed {REVIEWED}. Every calculator here produces an estimate and
        nothing on this site is financial advice. Spot an error?{" "}
        <A href="/contact">Tell us</A> — see also our{" "}
        <A href="/disclaimer">disclaimer</A>.
      </p>
    </main>
  );
}
