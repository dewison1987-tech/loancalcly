import type { Metadata } from "next";
import Link from "next/link";
import { Bullets, Ext, LegalPage, Section } from "@/components/LegalPage";
import { AUTHOR, CONTACT_EMAIL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/methodology",
  title: "How We Verify the Numbers — LoanCalcly Methodology",
  description:
    "Every figure on LoanCalcly comes from one published formula and is recomputed with a second, independent implementation before publication. The process, the standards, and what these figures are not.",
});

const LAST_UPDATED = "September 26, 2026";

export default function MethodologyPage() {
  return (
    <LegalPage
      title="How we verify the numbers"
      updated={LAST_UPDATED}
      intro={
        <p>
          A calculator is only as useful as its arithmetic, and &ldquo;trust
          us&rdquo; is not an argument. This page sets out how the figures on
          this site are produced, how they are checked before publication, and —
          just as importantly — what they are not.
        </p>
      }
    >
      <Section title="One formula, one implementation">
        <p>
          Every monthly payment shown anywhere on this site comes from a single
          equation, the standard fixed-rate amortisation formula:
        </p>
        <p className="rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm text-gray-800">
          M = P × [ r(1 + r)<sup>n</sup> ] / [ (1 + r)<sup>n</sup> − 1 ]
        </p>
        <p>
          where <strong>P</strong> is the amount borrowed,{" "}
          <strong>r</strong> is the monthly interest rate (the annual rate
          divided by twelve) and <strong>n</strong> is the number of monthly
          payments. The schedule, the total interest and every threshold month
          mentioned in the guides are derived from that same function, run
          period by period.
        </p>
        <p>
          This matters more than it sounds. A site with several calculators will
          eventually accumulate several copies of the same arithmetic, and the
          copies drift. When two pages of the same site disagree, there is no way
          for a reader to tell which one is right. Here, the calculators, the
          amortisation tables and the worked examples in the guides all call one
          implementation — so they cannot contradict each other.
        </p>
      </Section>

      <Section title="Every published figure is computed twice">
        <p>
          Getting the formula right is the easy part. The realistic failure modes
          are an error in the implementation and a typo introduced when a number
          is copied into prose. So every figure that appears in a worked example
          is produced twice, by two independent calculations — the site&apos;s
          own code, and a second implementation written separately — and the two
          results are compared before publication. A figure that fails the
          comparison does not go on the page.
        </p>
        <p>
          Where a number depends on a sequence rather than a formula — a complete
          amortisation schedule, a break-even curve, the month a balance crosses
          a threshold — both implementations run the whole sequence, not just the
          headline output. A correct monthly payment with a wrong schedule behind
          it is the kind of error a spot check will not catch.
        </p>
      </Section>

      <Section title="Assumptions are stated, not implied">
        <Bullets
          items={[
            <>
              <strong>Interest rates in examples are illustrative.</strong> A
              rate printed today is wrong next month, so every example fixes a
              rate explicitly and shows what follows from it. We do not publish a
              &ldquo;current average rate&rdquo;, because we cannot guarantee one
              stays current.
            </>,
            <>
              <strong>Tax, insurance and fees are inputs, not assumptions.</strong>{" "}
              Property tax rates, homeowners insurance, origination fees and
              mortgage insurance premiums vary by location, lender and borrower.
              You supply them, and the pages say plainly that you have.
            </>,
            <>
              <strong>Rounding is disclosed.</strong> Monthly payments are shown
              to the cent and lifetime totals are rounded to the dollar. Where a
              displayed input is itself rounded — a half-payment of $948.10
              standing in for $948.102… — the difference is small enough to move
              a lifetime total by a dollar or two, and the example stands on the
              exact value rather than the displayed one.
            </>,
          ]}
        />
      </Section>

      <Section title="What we do not claim">
        <p>
          The output of these calculators is an <strong>estimate</strong>. It is
          not a loan offer, not a quote, and not financial advice. It cannot be:
          your lender applies its own fees, its own rounding conventions, its own
          day-count rules and its own escrow schedule, none of which a general
          calculator can know.
        </p>
        <p>
          The documents that actually govern your loan are the ones your lender
          issues — the Loan Estimate, the Closing Disclosure and the promissory
          note. Where those differ from anything here, they win. See our{" "}
          <Link
            href="/disclaimer"
            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
          >
            disclaimer
          </Link>{" "}
          for the full statement.
        </p>
      </Section>

      <Section title="Where the answer depends on your own documents">
        <p>
          Some rules genuinely differ by jurisdiction or by contract, and
          presenting one version as a national fact would be a defect, not a
          simplification. These include how a trade-in affects sales tax, the
          threshold and the procedure for cancelling mortgage insurance,
          income-driven repayment formulas, prepayment penalties, and the
          treatment of fees in APR.
        </p>
        <p>
          On those points a page says so, describes the general shape of the
          rule, and points you at the document or the official guidance that
          settles it — rather than inventing a number that looks authoritative
          and is out of date.
        </p>
      </Section>

      <Section title="Corrections">
        <p>
          If a figure on this site is wrong, we would rather hear it from you
          than not hear it at all. Email{" "}
          <Ext href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Ext> with the
          page and the number. A reported correction is re-run through both
          implementations before anything is changed, and the page&apos;s review
          date is updated when the content genuinely changes — not on every
          deployment.
        </p>
      </Section>

      <Section title="Who writes and reviews this site">
        <p>{AUTHOR.bio[0]}</p>
        <p>{AUTHOR.bio[1]}</p>
        <p>
          The byline on every calculator and every guide links back to this page,
          and each of those pages carries the date it was last checked. What we
          will not do is attach a fabricated author, credential or testimonial to
          the site: a made-up expert is worse than no expert, and the whole point
          of this page is that the claims here can be checked.
        </p>
        <p>
          Software is involved in producing this site — the calculators are
          software, and drafting tools are used to prepare the explanatory text.
          The standards above apply regardless of how a first draft was created:
          figures are recomputed independently, statements about rules are
          checked against primary documents, and a named editor reviews what is
          published.
        </p>
      </Section>

      <Section title="How the site is funded">
        <p>
          LoanCalcly is free to use and funded by advertising and, where relevant,
          affiliate links. Advertising never influences a calculator&apos;s
          output — the arithmetic is the arithmetic. Sponsored or affiliate links
          are labelled where they appear, and our{" "}
          <Link
            href="/disclaimer"
            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
          >
            disclaimer
          </Link>{" "}
          explains how that works. We do not sell your information, because we do
          not collect it.
        </p>
      </Section>
    </LegalPage>
  );
}
