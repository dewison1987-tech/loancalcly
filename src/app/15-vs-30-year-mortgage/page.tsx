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
  path: "/15-vs-30-year-mortgage",
  title: "15-Year vs 30-Year Mortgage: The Real Trade-Off",
  description:
    "The same $300,000 loan on both terms: $212,235 less interest against $717.12 a month more, when principal overtakes interest on each, and the affordability test that decides it.",
  type: "article",
});

const PUBLISHED = "September 26, 2026";

/** 文中每一个金额都由 src/lib/loan.ts 生成，并经独立第二实现复算比对 */
const COMPARISON = [
  [
    <strong key="15" className="text-gray-900">
      15 years
    </strong>,
    <strong key="15m" className="text-gray-900">
      $2,613.32
    </strong>,
    "$170,398",
    "$470,398",
    <strong key="15c" className="text-gray-900">
      Month 53
    </strong>,
  ],
  [
    "30 years",
    "$1,896.20",
    "$382,633",
    "$682,633",
    "Month 233",
  ],
];

const EXTRA_PAYMENTS = [
  ["$0 (as scheduled)", "360 months — 30 years", "$382,633", "—"],
  ["$250", "262 months — 21 yr 10 mo", "$262,297", "$120,337"],
  ["$500", "210 months — 17 yr 6 mo", "$202,874", "$179,759"],
  ["$700", "183 months — 15 yr 3 mo", "$172,555", "$210,078"],
];

const AFFORDABILITY = [
  ["$80,000", "$230,596", "$286,300", "$55,704"],
  ["$100,000", "$278,651", "$334,427", "$55,776"],
  ["$120,000", "$315,733", "$394,740", "$79,007"],
  ["$140,000", "$361,811", "$455,054", "$93,242"],
];

const FAQ = [
  {
    q: "Is a 15-year mortgage always better than a 30-year?",
    a: "It is cheaper in total interest and more expensive every month, and which of those matters more depends on your income stability rather than your discipline. The 30-year payment is $1,896.20 on the example in this guide and the 15-year is $2,613.32. If the higher payment would leave you without a reserve, the lower interest bill is not worth the risk of missing a payment — and the 30-year can always be paid down faster, while a 15-year payment cannot be reduced without refinancing.",
  },
  {
    q: "How much interest does a 15-year mortgage save?",
    a: "On a $300,000 loan at 6.50%, the 15-year term costs $170,398 of interest and the 30-year term costs $382,633. The difference is $212,235. Note that this comparison holds the rate constant; in practice a 15-year loan is often quoted at a slightly lower rate because the lender carries less risk for less time, which widens the gap further.",
  },
  {
    q: "When does principal exceed interest on each term?",
    a: "Month 53 on the 15-year loan and month 233 on the 30-year loan. That single number explains most of the interest difference: for the first four and a half years of the shorter loan, and the first nineteen years of the longer one, more than half of every payment is interest rather than principal. Shortening the term compresses that front-loaded period.",
  },
  {
    q: "Can I get the 15-year benefit on a 30-year loan?",
    a: "Largely yes, by paying extra — and you keep the option to stop. Adding $500 a month to the 30-year loan clears it in 210 months instead of 360 and saves $179,759 of interest, which is most of the way to the 15-year result. The catch is that the extra payment only happens if you actually make it every month, whereas the 15-year contract makes it for you.",
  },
  {
    q: "Does a shorter term mean I can afford less house?",
    a: "Yes, and by more than most people expect. On a $100,000 income and $60,000 down, the 30-year term supports about $334,400 of house while the 15-year term supports about $278,700 — a difference of roughly $55,800, or about one bedroom in many markets. The term is not just a repayment choice; it changes the price you can consider.",
  },
];

export default function FifteenVsThirtyGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="15-Year vs 30-Year Mortgage: The Real Trade-Off"
        description="The same $300,000 loan on both terms, side by side, with the interest difference, the principal crossover month and the affordability test that decides which to take."
        path="/15-vs-30-year-mortgage"
        siteUrl={SITE_URL}
        datePublished="2026-09-26"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          15-year vs 30-year mortgage
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          Both terms buy the same house. The property does not change, the
          interest rate is often similar, and the lender is the same. Everything
          that differs comes from one thing: how long the balance is allowed to
          sit there. This guide puts the same $300,000 at 6.50% on both clocks and
          works through what each one costs — monthly, in total, and in what it
          lets you buy.
        </P>

        <H2>The same loan on two clocks</H2>
        <DataTable
          head={[
            "Term",
            "Monthly principal & interest",
            "Total interest",
            "Total repaid",
            "Principal overtakes interest",
          ]}
          align={["l", "r", "r", "r", "l"]}
          rows={COMPARISON}
          caption="$300,000 at 6.50% held constant across both terms. Produced by our calculator and independently recomputed."
        />
        <P>
          The 15-year payment is <strong>$717.12 a month higher</strong>. In
          exchange it removes <strong>$212,235</strong> of interest. Put those two
          numbers next to each other and the shape of the decision becomes clear:
          you are buying a $212,235 discount with $717.12 of monthly cash flow, and
          the purchase only completes if you can make every one of the 180
          payments.
        </P>

        <H2>Where the $212,235 comes from</H2>
        <P>
          The interest difference is not a penalty charged for borrowing longer.
          It is the mechanical result of how amortisation front-loads interest,
          and the last column of the table is the clearest way to see it.
        </P>
        <P>
          On the 30-year loan at 6.50%, the first payment is{" "}
          <strong>$1,625.00 of interest</strong> and only $271.20 of principal.
          That ratio persists for nineteen years: principal does not overtake
          interest until <strong>month 233</strong>. By the time you are finally
          paying down more than you are paying for the privilege of borrowing,
          two-thirds of the loan term is gone.
        </P>
        <P>
          The 15-year loan starts with the identical <strong>$1,625.00</strong> of
          interest — the rate and balance are the same — but the larger payment
          means $988.32 goes to principal in the first month instead of $271.20.
          Principal overtakes interest at <strong>month 53</strong>. Compression,
          not thrift, is where the saving comes from.
        </P>
        <Callout>
          <strong>What this means practically:</strong> principal and interest
          are not interchangeable dollars. A payment made in year one of a
          30-year loan is mostly rent on the money; the same payment in year
          twenty-five is mostly equity. This is why{" "}
          <A href="/how-loan-amortization-works">amortisation</A> rewards early
          overpayment so heavily, and why the{" "}
          <A href="/biweekly-payments-guide">biweekly approach</A> — which only
          adds the equivalent of one extra payment a year — moves the payoff date
          by years.
        </Callout>

        <H2>Buying the 30-year and paying it like a 15</H2>
        <P>
          The 30-year contract does not oblige you to take 30 years. Extra payments
          go straight against principal, which shortens the term rather than
          reducing the payment. Here is what that looks like on the same
          $300,000 at 6.50%, starting from the 30-year schedule:
        </P>
        <DataTable
          head={["Extra each month", "Paid off in", "Total interest", "Saved against the base"]}
          align={["r", "l", "r", "r"]}
          rows={EXTRA_PAYMENTS}
          caption="Extra payments assumed to begin with the first payment. Interest saved is measured against the $382,633 of the unaccelerated 30-year loan."
        />
        <P>
          An extra <strong>$500 a month</strong> retires the loan in 210 months
          and saves <strong>$179,759</strong>. That is most of the 15-year
          benefit — $212,235 — without signing a contract that requires it. An
          extra <strong>$700</strong> gets closer still, clearing the balance in
          183 months with $210,078 saved.
        </P>
        <P>
          The asymmetry is the point. A 30-year loan with voluntary overpayments
          can be slowed to the minimum in a bad year; a 15-year loan cannot. If
          you lose income, the 15-year obligation is the one that defaults. The
          price of that flexibility is the discipline required to keep paying —
          and, realistically, many borrowers who intend to overpay do not.
        </P>

        <H2>The term changes what you can buy</H2>
        <P>
          This is the part that rarely makes it into the comparison, and it is
          frequently decisive. Lenders assess you against a payment, so a larger
          required payment reduces the loan you qualify for. Holding the down
          payment at $60,000 and the rate at 6.50%, and applying the 28/36
          limits:
        </P>
        <DataTable
          head={["Household income", "Affordable at 15 years", "Affordable at 30 years", "Difference"]}
          align={["r", "r", "r", "r"]}
          rows={AFFORDABILITY}
          caption="28% housing / 36% total debt, $500 of existing monthly debts, 1.2% property tax, $1,800 insurance a year. Computed by our affordability calculator and independently recomputed."
        />
        <P>
          At $100,000 of income the difference is about{" "}
          <strong>$55,800</strong> — in many markets that is the difference
          between a two-bedroom and a three-bedroom. Choosing the 15-year term is
          therefore not only a decision about how to repay a loan you have
          already chosen; it is a decision about which houses are available to
          you at all.
        </P>
        <P>
          To see the reverse direction — what price a given income supports at
          each term — use the{" "}
          <A href="/home-affordability-calculator">affordability calculator</A>,
          which runs this arithmetic on your own numbers.
        </P>

        <H2>What the shorter term does not do</H2>
        <UL>
          <li>
            <strong>It does not make you wealthier by itself.</strong> The saving
            is real but it arrives as the absence of a cost, spread across
            fifteen years. It is not a return on investment; it is a reduction in
            what you pay.
          </li>
          <li>
            <strong>It does not leave room for a bad year.</strong> The payment is
            fixed and the obligation is contractual. A 15-year loan taken at the
            limit of affordability converts a temporary income problem into a
            default risk.
          </li>
          <li>
            <strong>It ties up money that had other uses.</strong> Whether that
            matters depends on what else the money would have done — paying down
            higher-rate debt, building a reserve, or simply covering a period of
            reduced income.
          </li>
          <li>
            <strong>It does not eliminate the cost of the house.</strong> Property
            tax, insurance and maintenance cost the same on both terms. See{" "}
            <A href="/mortgage-calculator">the mortgage calculator</A> for the
            full monthly figure.
          </li>
        </UL>

        <H2>How to decide</H2>
        <P>
          Work through these in order, because each one can settle the question
          before the next:
        </P>
        <UL>
          <li>
            <strong>Can you make the 15-year payment with the same ease as the
            30-year payment, after the reserve is funded?</strong> If not, the
            question is answered — take the 30-year and overpay when you can.
          </li>
          <li>
            <strong>Is the higher payment more than about a quarter of your
            take-home pay?</strong> That is a warning sign regardless of what a
            ratio says.
          </li>
          <li>
            <strong>Does the 15-year term price you out of the house you
            need?</strong> Compare the two rows in the affordability table above
            with the market you are actually shopping in.
          </li>
          <li>
            <strong>If you take the 30-year, will the overpayment actually
            happen?</strong> The honest answer is found in your last twelve months
            of bank statements, not your intentions.
          </li>
        </UL>
        <P>
          Run both scenarios through the{" "}
          <A href="/amortization-schedule">amortization schedule</A> before
          deciding, so you are looking at your own figures rather than this
          guide&apos;s.
        </P>

        <H2>The short version</H2>
        <P>
          On a $300,000 loan at 6.50%, the 15-year term costs $717.12 more a month
          and $212,235 less in interest, and clears the balance 180 months sooner.
          The 30-year term can reproduce most of that saving through extra
          payments while keeping the option to stop. The tie-breaker is rarely the
          mathematics — which is unambiguous — but whether your income can carry
          the higher fixed payment through a bad year, and whether the larger
          permitted loan at 30 years is what gets you the house you need.
        </P>

        <Faq items={FAQ} />

        <ArticleFooter currentSlug="15-vs-30-year-mortgage" />
      </article>
    </main>
  );
}
