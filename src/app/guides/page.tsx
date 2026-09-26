import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { A, AuthorLink, DataTable, H2, P } from "@/components/Prose";
import { SITE_URL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/guides",
  title: "Loan Guides — Plain-English Explainers on Borrowing Costs",
  description:
    "Plain-English guides to how loans work: amortization, APR versus interest rate, PMI, closing costs, debt-to-income and paying a loan off early.",
});

const REVIEWED = "September 26, 2026";

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

      <H2>Where to start</H2>
      <P>
        The eleven guides are not a course to be read in order — they answer
        eleven different questions. Find the one closest to your situation:
      </P>
      <DataTable
        head={["If your question is…", "Start here"]}
        align={["l", "l"]}
        rows={[
          [
            "Why has my balance barely moved after three years of payments?",
            <A key="q1" href="/how-loan-amortization-works">
              How loan amortization works
            </A>,
          ],
          [
            "Two lenders quoted me the same rate — why are the APRs different?",
            <A key="q2" href="/apr-vs-interest-rate">
              APR vs interest rate
            </A>,
          ],
          [
            "Is it worth paying points to get a lower rate?",
            <A key="q3" href="/how-to-compare-loan-offers">
              How to compare loan offers
            </A>,
          ],
          [
            "Someone is selling me a biweekly payment plan — is the fee worth it?",
            <A key="q4" href="/biweekly-payments-guide">
              Biweekly payments: what they really save
            </A>,
          ],
          [
            "Will refinancing actually save me money, or just lower the payment?",
            <A key="q5" href="/refinance-break-even-point">
              Refinance break-even point
            </A>,
          ],
          [
            "Should I take the 15-year term or the 30-year one?",
            <A key="q6" href="/15-vs-30-year-mortgage">
              15-year vs 30-year mortgage
            </A>,
          ],
          [
            "How much can I borrow without stretching myself?",
            <A key="q7" href="/how-much-house-can-i-afford">
              How much house can I afford?
            </A>,
          ],
          [
            "What debt-to-income ratio are lenders actually looking for?",
            <A key="q8" href="/debt-to-income-ratio">
              Debt-to-income ratio
            </A>,
          ],
          [
            "When can I stop paying mortgage insurance?",
            <A key="q9" href="/how-to-remove-pmi">
              How to remove PMI from your mortgage
            </A>,
          ],
          [
            "What do all the fees at closing actually pay for?",
            <A key="q10" href="/closing-costs-explained">
              Closing costs explained
            </A>,
          ],
          [
            "Does paying extra now really save that much more than paying later?",
            <A key="q11" href="/how-to-pay-off-a-loan-early">
              How to pay off a loan early
            </A>,
          ],
        ]}
        caption="Each guide is self-contained, and each links to the others where they overlap."
      />

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

      <H2>How these guides are written</H2>
      <P>
        Every figure in these guides comes from the same calculator code that
        runs on this site, and each one is then recomputed with a second,
        independent implementation before publication. Where the two disagreed,
        the guide was rewritten rather than averaged — which is why the worked
        examples carry exact totals like $1,896.20 and $382,633 instead of round
        numbers. You can reproduce any of them yourself in the{" "}
        <A href="/">loan calculator</A>.
      </P>
      <P>
        Two things you will deliberately not find here. First, no &ldquo;current
        average rate&rdquo;: a rate printed today is wrong next month, so each
        example fixes a rate explicitly as an illustration and shows what follows
        from it. Second, no advice about your particular loan — the guides
        explain how the arithmetic works and which numbers to collect, then leave
        the decision to you.
      </P>
      <P>
        Some rules genuinely do depend on where you live or on the terms of your
        own contract: state sales tax treatment, the threshold at which mortgage
        insurance can be cancelled, income-driven repayment formulas. On those
        points a guide says so and points you to the document that governs,
        rather than presenting a national generalisation as though it were a
        fact. Every guide is reviewed by <AuthorLink /> and lists the date it
        was last checked.
      </P>

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
        Reviewed by <AuthorLink /> · Last reviewed {REVIEWED}. These guides are
        educational and are not financial advice. Spot an error?{" "}
        <A href="/contact">Tell us</A> — see also our{" "}
        <A href="/disclaimer">disclaimer</A>.
      </p>
    </main>
  );
}
