import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import {
  A,
  ArticleFooter,
  ArticleSchema,
  Byline,
  Callout,
  DataTable,
  Faq,
  H2,
  P,
  UL,
} from "@/components/Prose";

export const metadata: Metadata = pageMetadata({
  path: "/how-much-house-can-i-afford",
  title: "How Much House Can I Afford? Three Different Answers",
  description:
    "The price a lender approves, the price a ratio supports and the price you can actually carry are three different numbers. How each is calculated, and which one to build your budget on.",
  type: "article",
});

const PUBLISHED = "September 26, 2026";

/** 文中每一个金额都由 src/lib/loan.ts 生成，并经独立第二实现复算比对 */
const CEILINGS = [
  [
    <strong key="c1" className="text-gray-900">
      28% housing / 36% total debt
    </strong>,
    "$334,427",
    "$2,333.33",
    "28.0%",
  ],
  ["36% housing / 43% total debt", "$420,589", "$3,000.00", "36.0%"],
];

const PAYMENT_PARTS = [
  ["Principal and interest", "$1,734.56"],
  ["Property tax", "$334.43"],
  ["Home insurance", "$150.00"],
  ["Mortgage insurance", "$114.34"],
  ["HOA fee", "$0.00"],
];

const DOWN_PAYMENT_STEPS = [
  ["$40,000", "12.6%", "Yes", "$317,011"],
  ["$60,000", "17.9%", "Yes", "$334,427"],
  ["$80,000", "21.8%", "No", "$367,314"],
  ["$100,000", "26.0%", "No", "$384,582"],
];

const FAQ = [
  {
    q: "What is a safe debt-to-income ratio for a mortgage?",
    a: "There is no universally safe number, because the ratio is calculated on gross income while the payment is made from net income. The 28/36 convention is the conservative end and is a reasonable ceiling to plan against. The wider 36/43 limits that many loans are underwritten to describe what a lender will approve, not what a household should commit — and a household with childcare, student debt or irregular income is exposed at ratios well below either figure.",
  },
  {
    q: "Should I borrow the maximum the lender approves?",
    a: "Usually not. The maximum is set by a default-risk model applied to a gross-income ratio, and it is silent about your savings rate, your job security, your commute, your childcare costs and whether you want to retire before the loan ends. The approved figure is best read as the point past which a lender stops, not the point up to which you should go. Buying below it deliberately is the single most common piece of advice from people who have owned for decades.",
  },
  {
    q: "Why is my affordable price lower than what the bank says?",
    a: "Because the two numbers answer different questions. The bank applies one ratio to gross income. A fuller calculation also subtracts the closing costs, the maintenance the property will need, the reserve you should keep and the possibility that your income falls. In the worked example on this page a ratio-based ceiling comes out around $334,400, while a household that wants a twelve-month reserve and expects $3,000 a year of maintenance lands well below it.",
  },
  {
    q: "How much cash do I need beyond the down payment?",
    a: "Plan for closing costs of roughly 2% to 5% of the purchase price, paid at closing alongside the down payment, plus moving and immediate setup costs, plus a reserve of three to six months of expenses. On a $334,400 purchase, closing costs alone could be $6,700 to $16,700. Spending every available dollar on the down payment is a common mistake precisely because the down payment is the number everyone plans for.",
  },
  {
    q: "Does the 28/36 rule still apply in 2026?",
    a: "It remains the conventional reference point, but underwriting practice has shifted and many loans are approved against 36/43 or wider. That makes the rule less useful as a prediction of what you will be offered and more useful as a budgeting standard you choose deliberately — which is arguably what it always was.",
  },
];

export default function HowMuchHouseGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="How Much House Can I Afford? Three Different Answers"
        description="Why the price a lender approves, the price a debt-to-income ratio supports and the price a household can actually carry are three different numbers, and how to work out which one applies to you."
        path="/how-much-house-can-i-afford"
        siteUrl={SITE_URL}
        datePublished="2026-09-26"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          How much house can I afford?
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          Ask that question of a search engine and you will get a single confident
          number. Ask it properly and there are three, all defensible, all
          different — and knowing which one you are looking at is most of the
          work. This guide sets out where each comes from and which to build a
          budget on.
        </P>

        <H2>Three numbers, three questions</H2>
        <UL>
          <li>
            <strong>What a lender will approve.</strong> Derived from gross-income
            ratios and a default-risk model. It answers: how much will someone
            lend me?
          </li>
          <li>
            <strong>What a ratio supports.</strong> The 28/36 convention applied
            to your income and existing debts. It answers: what does the standard
            budgeting rule allow?
          </li>
          <li>
            <strong>What you can carry.</strong> The payment you can make for
            thirty years while still saving, covering the property and absorbing a
            bad year. It answers: what should I actually spend?
          </li>
        </UL>
        <P>
          The three are frequently quoted interchangeably, which is how people end
          up surprised. A household can easily qualify for a house it cannot
          comfortably own, and the gap is not small.
        </P>

        <H2>What the ratio actually measures</H2>
        <P>
          Underwriting runs on two ratios. The front-end ratio caps housing cost
          as a share of gross monthly income. The back-end ratio caps all debt —
          housing plus car loans, student loans and minimum card payments — as a
          share of the same figure. Take a household earning $100,000 with $500 of
          monthly debts and $60,000 in cash, borrowing at 6.50% over 30 years:
        </P>
        <DataTable
          head={["Ratio applied", "Affordable price", "Monthly housing cost", "Housing share of gross income"]}
          align={["l", "r", "r", "r"]}
          rows={CEILINGS}
          caption="1.2% property tax, $1,800 insurance a year, mortgage insurance at 0.5%. Produced by our calculator and independently recomputed."
        />
        <P>
          Nothing about the household changes between those two rows — the income,
          the debts and the savings are identical. Only the ceiling moves, and it
          moves the price by <strong>$86,162</strong>. That is the first reason to
          be suspicious of any single answer to the question in this page&apos;s
          title: the number is a function of a rule as much as of your finances.
        </P>

        <H2>The payment is not the loan payment</H2>
        <P>
          The second reason is what the monthly figure has to cover. On the
          conservative case above, the $2,333.33 monthly housing cost breaks down
          like this:
        </P>
        <DataTable
          head={["Component", "Per month"]}
          align={["l", "r"]}
          rows={PAYMENT_PARTS}
          caption="Property tax and insurance are inputs you supply, not national averages — they vary substantially by location."
        />
        <P>
          Loan repayment is under three-quarters of the bill. The rest is the
          ongoing cost of owning the property, and two of those lines scale with
          the price rather than the loan — which means the true cost of a more
          expensive house rises faster than the extra borrowing alone implies.
        </P>

        <H2>Costs no affordability calculator includes</H2>
        <P>
          Every calculator on this site models the monthly payment. None of them
          can model the cash you need on the day you buy or the bills that arrive
          afterwards, because those depend on your situation. They are still part
          of affordability:
        </P>
        <UL>
          <li>
            <strong>Closing costs.</strong> Commonly 2% to 5% of the purchase
            price — on a $334,400 home that is roughly $6,700 to $16,700, paid in
            cash alongside the down payment.
          </li>
          <li>
            <strong>Maintenance.</strong> A widely used planning figure is about
            1% of property value a year. On this house that is roughly $3,300
            annually, or $275 a month, and it does not arrive evenly — it arrives
            as a roof.
          </li>
          <li>
            <strong>A reserve.</strong> Three to six months of expenses held back
            is the ordinary guidance. In the first year of ownership, with
            unfamiliar systems and no landlord, it is closer to essential.
          </li>
          <li>
            <strong>Moving and setup.</strong> Moving costs, deposits, blinds,
            appliances, a mattress. Routinely several thousand dollars and
            routinely forgotten.
          </li>
        </UL>
        <P>
          A household that has spent every dollar on the down payment and has
          nothing left for these has not bought an affordable house, whatever the
          ratio said.
        </P>

        <H2>The down payment has a threshold, not a slope</H2>
        <P>
          Down payments are usually discussed as a percentage dial. They behave
          more like a step. Holding the income at $100,000, the debts at $500 and
          the rate at 6.50%, and changing only the cash available:
        </P>
        <DataTable
          head={["Down payment", "As % of price", "Mortgage insurance", "Affordable price"]}
          align={["r", "r", "l", "r"]}
          rows={DOWN_PAYMENT_STEPS}
          caption="28/36 limits throughout, with term, rate, tax rate and insurance held constant."
        />
        <P>
          From $60,000 to $80,000 — $20,000 more cash — the affordable price rises
          by <strong>$32,887</strong>. From $40,000 to $60,000, the same $20,000
          buys only <strong>$17,416</strong> of extra house. The difference is the
          third column: below 20% down, mortgage insurance consumes part of the
          debt-to-income allowance, and crossing the threshold releases it. The{" "}
          <A href="/home-affordability-calculator">affordability calculator</A>{" "}
          shows this on your own figures.
        </P>

        <H2>Gross income is not the money you have</H2>
        <P>
          Both ratios are computed on gross income, before tax is deducted. The
          payment, however, comes out of what actually reaches your account. This
          is why a ratio that reads as comfortable on paper can feel tight in
          practice, and why the same percentage means different things to two
          households with different tax positions and different fixed costs.
        </P>
        <Callout>
          A useful translation: 28% of gross income is typically somewhere near a
          quarter of take-home pay for a single earner with standard deductions.
          At 36% of gross the housing share of spendable income rises faster than
          the percentage suggests. Treat any ratio as an upper bound on a
          calculation, not as a description of your budget.
        </Callout>

        <H2>A defensible way to set your own ceiling</H2>
        <P>
          Rather than starting from what you can borrow, start from what you are
          willing to pay, then find the price that fits:
        </P>
        <UL>
          <li>
            <strong>Write down the monthly figure you would be comfortable with
            for the next five years</strong> — not the maximum you could survive
            this year. Assume it stays fixed while everything else rises.
          </li>
          <li>
            <strong>Check it against take-home pay, not gross.</strong> If it
            exceeds about a quarter of net income, be cautious even if a lender is
            willing.
          </li>
          <li>
            <strong>Subtract the non-loan costs from that figure first</strong> —
            property tax, insurance, HOA and any mortgage insurance. What remains
            is what you can devote to principal and interest.
          </li>
          <li>
            <strong>Fund the reserve and the closing costs before touching the
            down payment.</strong> They are not optional and they are not
            financed.
          </li>
          <li>
            <strong>Then translate back to a price</strong> using the{" "}
            <A href="/home-affordability-calculator">affordability calculator</A>,
            and check the resulting loan in the{" "}
            <A href="/amortization-schedule">amortization schedule</A> so you have
            seen the full term rather than just the first payment.
          </li>
        </UL>
        <P>
          That sequence usually produces a number below what a lender would
          approve. That is the intended outcome, not a sign you have done it
          wrong.
        </P>

        <H2>The short version</H2>
        <P>
          &ldquo;How much house can I afford&rdquo; has three answers: what a
          lender will approve, what a ratio supports, and what you can carry for
          thirty years while still saving. Only the third is a budget. The first
          is a risk threshold, and the second is a convention — both useful, and
          neither a substitute for deciding what you want to spend, subtracting
          the costs no calculator can see, and working backwards from there. On
          the example used throughout this guide, the difference between the
          conservative and wider ceilings alone is $86,162, which is a good
          measure of how much the answer depends on the rule rather than on you.
        </P>

        <Faq items={FAQ} />

        <ArticleFooter currentSlug="how-much-house-can-i-afford" />
      </article>
    </main>
  );
}
