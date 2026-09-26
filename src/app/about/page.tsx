import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section, Bullets, Ext } from "@/components/LegalPage";
import { AUTHOR, CONTACT_EMAIL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: "About us",
  description:
    "LoanCalcly is a free, independent loan payment calculator. Learn how our calculator works, how we verify its accuracy, and who is behind it.",
});

const LAST_UPDATED = "September 26, 2026";

export default function AboutPage() {
  return (
    <LegalPage
      title="About LoanCalcly"
      updated={LAST_UPDATED}
      intro={
        <p>
          LoanCalcly is a free, independent loan payment calculator. You type in
          a loan amount, an interest rate and a term, and you immediately see
          your monthly payment, the total interest you will pay, and a
          month-by-month amortization schedule. No signup, no email address, no
          sales call.
        </p>
      }
    >
      <Section title="Why we built it">
        <p>
          Most loan calculators online are lead-capture forms wearing a
          calculator costume. They hide the amortization schedule behind a
          form, or they quote a teaser rate that no borrower actually gets. We
          wanted the opposite: a page that opens on the tool, shows the full
          breakdown, and lets you leave without giving up your phone number.
        </p>
        <p>
          We also wanted the arithmetic to be right. A payment estimate is only
          useful if you can trust it, so the formula and its implementation are
          documented publicly rather than treated as a black box.
        </p>
      </Section>

      <Section title="How the calculator works">
        <p>
          The calculator uses the standard fixed-rate amortization formula used
          by lenders:
        </p>
        <p className="rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm text-gray-800">
          M = P × [ r(1 + r)<sup>n</sup> ] / [ (1 + r)<sup>n</sup> − 1 ]
        </p>
        <p>
          where <strong>P</strong> is the principal, <strong>r</strong> is the
          monthly interest rate (annual rate ÷ 12) and <strong>n</strong> is the
          total number of monthly payments. The monthly payment is constant;
          what changes month to month is the split between interest and
          principal, which is what the amortization table shows.
        </p>
        <p>
          Every figure on the page is derived from that single formula — the
          monthly payment, the total interest, the total cost and each row of
          the schedule. Nothing is cached from a third-party quote service.
        </p>
      </Section>

      <Section title="How we keep the numbers accurate">
        <Bullets
          items={[
            <>
              The payment, interest and schedule figures are recomputed
              independently and cross-checked against published worked examples
              before release.
            </>,
            <>
              Each calculation page carries a visible review date, so you can
              see when the content was last checked.
            </>,
            <>
              We publish the formula above rather than describing the maths
              vaguely, so anyone can verify the output themselves.
            </>,
            <>
              If you find a figure that looks wrong,{" "}
              <Link
                href="/contact"
                className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
              >
                tell us
              </Link>{" "}
              and we will correct it.
            </>,
          ]}
        />
      </Section>

      <Section title="What this calculator is not">
        <p>
          It is an estimator, not a loan offer and not financial advice. Real
          payments can differ because of origination fees, discount points,
          mortgage insurance, property taxes, homeowners insurance, escrow
          adjustments and the exact day interest starts accruing. Your lender&apos;s
          Loan Estimate and Closing Disclosure are the documents that govern
          your actual loan. See our{" "}
          <Link
            href="/disclaimer"
            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
          >
            Disclaimer
          </Link>{" "}
          for the full details.
        </p>
      </Section>

      <Section title="How the site is funded">
        <p>
          LoanCalcly is free to use and funded by advertising and, where
          relevant, affiliate links. Advertising never influences the
          calculator&apos;s output — the maths is the maths. Sponsored links, when
          they appear, are labelled, and our{" "}
          <Link
            href="/disclaimer"
            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
          >
            Disclaimer
          </Link>{" "}
          explains exactly how that works.
        </p>
      </Section>

      <Section title="Who is behind it">
        <p>
          LoanCalcly is built and maintained independently. It is not a lender,
          a broker or a lead-generation company, and your information is never
          sold — because it is never collected in the first place.
        </p>
        <p>{AUTHOR.bio[0]}</p>
        <p>{AUTHOR.bio[1]}</p>
        <p>
          Calculator content and the explanatory guides carry the byline of{" "}
          {AUTHOR.name} ({AUTHOR.shortRole}), and every page lists the date it was
          last checked. Our{" "}
          <Link
            href="/methodology"
            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
          >
            methodology page
          </Link>{" "}
          sets out exactly how each figure is produced and verified.
        </p>
      </Section>

      <Section title="Get in touch">
        <p>
          Questions, corrections and suggestions are genuinely welcome. Email{" "}
          <Ext href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Ext> or
          use the{" "}
          <Link
            href="/contact"
            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
          >
            contact page
          </Link>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
