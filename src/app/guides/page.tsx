import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { A, P } from "@/components/Prose";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/guides" },
  title: "Loan Guides — Plain-English Explainers on Borrowing Costs",
  description:
    "Plain-English guides to how loans actually work: amortization, comparing offers, APR versus interest rate, biweekly payments and refinance break-even.",
};

const REVIEWED = "September 20, 2026";

export default function GuidesIndex() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Loan Guides",
    url: `${SITE_URL}/guides`,
    description:
      "Plain-English guides to how borrowing costs accumulate and how to compare loan offers.",
    hasPart: GUIDES.map((g) => ({
      "@type": "Article",
      headline: g.title,
      url: `${SITE_URL}/${g.slug}`,
      description: g.summary,
    })),
  };

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
        Loan guides
      </h1>
      <P>
        Plain-English explainers on how borrowing actually costs money. Each
        guide works through real numbers rather than rules of thumb, because the
        arithmetic of a loan is where the money is. Everything below was
        produced by our <A href="/">loan calculator</A> and independently
        recomputed before publication.
      </P>

      <div className="mt-8 space-y-4">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/${g.slug}`}
            className="block rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
          >
            <h2 className="text-lg font-semibold text-gray-900">{g.title}</h2>
            <p className="mt-1.5 leading-relaxed text-gray-600">{g.summary}</p>
            <p className="mt-2 text-sm font-medium text-emerald-700">
              Read the guide →
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-12 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Start with the calculator
        </h2>
        <p className="mt-2 leading-relaxed text-gray-600">
          The quickest way to understand any of these guides is to watch the
          numbers move. Enter your own loan amount, rate and term in the{" "}
          <A href="/">loan calculator</A>, then change one input at a time and
          watch the total interest line.
        </p>
      </section>

      <p className="mt-10 border-t border-gray-200 pt-5 text-sm text-gray-500">
        Reviewed by{" "}
        <span className="font-medium text-gray-700">LoanCalcly Editorial</span> ·
        Last reviewed {REVIEWED}. These guides are educational and are not
        financial advice. Spot an error? <A href="/contact">Tell us</A> — see
        also our <A href="/disclaimer">disclaimer</A>.
      </p>
    </main>
  );
}
