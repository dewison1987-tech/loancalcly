import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section, Bullets, Ext } from "@/components/LegalPage";
import { CONTACT_EMAIL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/disclaimer",
  title: "Disclaimer",
  description:
    "LoanCalcly provides estimates, not financial advice. Read our full disclaimer on accuracy, borrowing decisions, advertising and affiliate relationships.",
});

const LAST_UPDATED = "September 25, 2026";

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      updated={LAST_UPDATED}
      intro={
        <p>
          Please read this page before acting on anything you see on
          LoanCalcly. It explains what our numbers are, what they are not, and
          the limits of what we can tell you.
        </p>
      }
    >
      <Section title="Not financial advice">
        <p>
          The information and calculations on this site are provided for general
          informational and educational purposes only. They do <strong>not</strong>{" "}
          constitute financial, investment, legal, tax or credit advice, and they
          are not a recommendation, solicitation or offer to lend, borrow, or
          enter into any financial product.
        </p>
        <p>
          LoanCalcly is not a lender, mortgage broker, loan originator, credit
          repair organisation or licensed financial adviser, and we have no
          relationship with your lender. Before making any borrowing decision —
          especially a mortgage, a refinance, or a debt-consolidation loan — you
          should speak with a qualified professional who can review your full
          financial situation.
        </p>
      </Section>

      <Section title="Estimates only — verify with your lender">
        <p>
          Every figure produced by our calculator is an <em>estimate</em>. Real
          loan payments differ from a simple amortization calculation for many
          reasons, including:
        </p>
        <Bullets
          items={[
            <>
              <strong>Fees rolled in or paid up front</strong> — origination
              fees, discount points, closing costs and processing charges.
            </>,
            <>
              <strong>Escrow items</strong> — property taxes, homeowners
              insurance and, for many mortgages, mortgage insurance (PMI/MIP).
            </>,
            <>
              <strong>Rate type</strong> — adjustable-rate and variable-rate
              loans change over time, so a single fixed rate cannot describe
              them.
            </>,
            <>
              <strong>Day-count and rounding conventions</strong> — lenders may
              accrue interest daily, apply different rounding, or set the first
              payment date differently.
            </>,
            <>
              <strong>Payment frequency</strong> — biweekly or accelerated
              schedules produce different totals.
            </>,
            <>
              <strong>Your credit profile</strong> — the rate you are actually
              offered depends on your creditworthiness, down payment and the
              lender&apos;s own criteria.
            </>,
          ]}
        />
        <p>
          The rate shown in our calculator is whatever <em>you</em> type in. It
          is not a quote from any lender, and it is not an offer of credit.
        </p>
      </Section>

      <Section title="No guarantee of accuracy or availability">
        <p>
          We take accuracy seriously and review our calculators and content
          periodically, but we make no warranty — express or implied — that the
          site is error-free, that calculations are correct for every loan
          structure, or that the site will always be available. Financial
          products and regulations also change; content that was correct when
          written may become outdated.
        </p>
        <p>
          To the fullest extent permitted by law, we disclaim liability for any
          loss or damage arising from reliance on the site&apos;s content or output.
          See the{" "}
          <Link
            href="/terms"
            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
          >
            Terms of service
          </Link>{" "}
          for the full limitation of liability.
        </p>
      </Section>

      <Section title="Advertising disclosure">
        <p>
          This site is supported by advertising. Third-party vendors, including
          Google, may use cookies to serve ads based on your prior visits to
          this and other websites. You can opt out of personalised advertising
          via{" "}
          <Ext href="https://www.google.com/settings/ads">Google Ads Settings</Ext>{" "}
          or{" "}
          <Ext href="https://www.aboutads.info/choices/">www.aboutads.info</Ext>
          . Full details are in our{" "}
          <Link
            href="/privacy"
            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
          >
            Privacy policy
          </Link>
          .
        </p>
        <p>
          Advertisers do not see your calculator inputs, they do not influence
          the calculator&apos;s output, and they have no say in our editorial
          content.
        </p>
      </Section>

      <Section title="Affiliate disclosure">
        <p>
          Some outbound links on this site may be affiliate links. If you click
          one and subsequently take out a product or sign up for a service, we
          may receive a commission. This comes at no additional cost to you, and
          it never affects the calculation results or our editorial judgement.
          Where a link is a paid placement, it is labelled as such.
        </p>
        <p>
          We do not accept payment in exchange for a favourable review, and we
          do not publish content we believe to be misleading in order to earn
          commission.
        </p>
      </Section>

      <Section title="External links">
        <p>
          Links to third-party sites are provided for convenience and reference.
          We do not control those sites and are not responsible for their
          content, accuracy, products or privacy practices. Following an
          external link means you leave LoanCalcly and become subject to that
          site&apos;s terms.
        </p>
      </Section>

      <Section title="Your responsibility">
        <p>
          You are responsible for your own financial decisions. LoanCalcly
          provides a tool; it does not know your income, debts, credit score,
          tax position or goals, and it cannot tell you whether a particular
          loan is affordable or suitable for you. If you are unsure, seek
          independent advice from a qualified professional before signing
          anything.
        </p>
      </Section>

      <Section title="Changes to this disclaimer">
        <p>
          We may update this disclaimer as the site or applicable rules change.
          The &ldquo;last updated&rdquo; date at the top of this page reflects
          the most recent revision.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about this disclaimer:{" "}
          <Ext href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Ext>.
        </p>
      </Section>
    </LegalPage>
  );
}
