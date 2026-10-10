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
  path: "/how-much-down-payment-do-i-need",
  title: "How Much Down Payment Do I Need?",
  description:
    "Keeping $40,000 instead of putting it down costs 10.72% a year over seven years. What each down payment does to the payment, the PMI and the lifetime cost.",
  type: "article",
});

const PUBLISHED = "October 9, 2026";

/**
 * 全部数字由 src/lib/loan.ts 的 downPaymentPlan / downPaymentTradeoff 生成，
 * 并经 Python / Node 两套独立实现 + 站点内核三方逐位复算（263 个值逐字节一致）。
 * 场景：$400,000 房价，6.50%，30 年，按揭保险按原始贷款额的 0.50%/年计。
 * PMI 费率只作 illustrative —— 真实报价随 LTV、信用分与承保方浮动；
 * 高 LTV 的实际费率通常**高于** 0.50%，所以真实差距比下表更大。
 */
const MONTHLY = [
  [
    <strong key="a" className="text-gray-900">
      3.5% — $14,000
    </strong>,
    "$386,000",
    "$2,439.78",
    "$160.83",
    <strong key="a2" className="text-gray-900">
      $2,600.62
    </strong>,
    "Month 131",
    "$21,069",
  ],
  ["5% — $20,000", "$380,000", "$2,401.86", "$158.33", "$2,560.19", "Month 124", "$19,633"],
  ["10% — $40,000", "$360,000", "$2,275.44", "$150.00", "$2,425.44", "Month 95", "$14,250"],
  [
    <strong key="d" className="text-gray-900">
      20% — $80,000
    </strong>,
    "$320,000",
    "$2,022.62",
    "$0",
    "$2,022.62",
    "—",
    "$0",
  ],
];

const LIFETIME = [
  ["3.5%", "$913,391", "+$105,249"],
  ["5%", "$904,302", "+$96,160"],
  ["10%", "$873,410", "+$65,268"],
  [
    <strong key="d" className="text-gray-900">
      20%
    </strong>,
    <strong key="d2" className="text-gray-900">
      $808,142
    </strong>,
    "—",
  ],
];

const SEVEN_YEAR = [
  [
    <strong key="a" className="text-gray-900">
      3.5% against 20%
    </strong>,
    "$66,000",
    "$417.16",
    "$42,227",
    <strong key="a2" className="text-gray-900">
      9.14%
    </strong>,
    "7.32%",
  ],
  ["5% against 20%", "$60,000", "$379.24", "$39,406", "9.38%", "7.48%"],
  [
    <strong key="c" className="text-gray-900">
      10% against 20%
    </strong>,
    "$40,000",
    "$252.82",
    "$30,004",
    <strong key="c2" className="text-gray-900">
      10.72%
    </strong>,
    "8.32%",
  ],
];

const HORIZON = [
  ["5 years", "$21,614", "10.81%"],
  ["7 years", "$30,004", "10.72%"],
  ["10 years", "$38,500", "9.62%"],
  ["15 years", "$48,783", "8.13%"],
];

const FAQ = [
  {
    q: "How much down payment do I actually need?",
    a: "It depends on the loan programme rather than on a single national rule. Conventional loans have low-down-payment options — Fannie Mae's 97% loan-to-value programme allows as little as 3% down on an eligible one-unit primary residence — and government-backed loans have their own minimums. A 20% down payment is the point at which mortgage insurance is normally not required on a conventional loan rather than a requirement for qualifying. The useful question is not the minimum you qualify for but what the smaller down payment costs you, and that number is computable.",
  },
  {
    q: "Is 20% down always the right answer?",
    a: "No, and the arithmetic here shows why it is not automatic. Putting 20% down on a $400,000 purchase means finding another $40,000 compared with 10% down, and doing so saves $30,004 over the first seven years of interest and mortgage insurance. That is an effective return of 10.72% a year on the cash. Whether that beats your alternatives depends on what the money would otherwise earn and on how thin the larger down payment leaves your reserves.",
  },
  {
    q: "What does a smaller down payment really cost?",
    a: "Two things, and only one of them is visible. The visible one is the monthly payment: 10% down costs $252.82 a month more than 20% down on this example. The invisible one is that the difference compounds. Over the first seven years the smaller down payment costs $30,004 in extra interest and mortgage insurance on $40,000 of cash left in your pocket, which is an effective annual cost of 10.72%.",
  },
  {
    q: "How long do I pay mortgage insurance with a small down payment?",
    a: "Until the balance falls to the threshold in your loan documents, which is usually expressed as a percentage of the original price or original appraised value. On this example 10% down reaches the 80% line in month 95, so that is 95 payments of $150.00 — $14,250. At 3.5% down the same line arrives in month 131 and the bill is $21,069. The threshold is defined by your documents, not by the market, so it is worth reading that clause before assuming appreciation will end it.",
  },
  {
    q: "Should I put down less and invest the difference?",
    a: "That is the right question, and the number to compare against is the one on this page: on these assumptions the cash you keep is costing you 10.72% a year over seven years. An investment would have to beat that after tax, and it would have to do so with money you might need — a down payment reserve is not the same thing as a portfolio. The comparison is real rather than rhetorical, but it should start from the cost, not from an expected return.",
  },
];

export default function HowMuchDownPaymentDoINeedGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="How Much Down Payment Do I Need?"
        description="What four different down payments do to the monthly payment, how long mortgage insurance runs, what the lifetime cost comes to, and the effective annual cost of the cash you decide not to put down."
        path="/how-much-down-payment-do-i-need"
        siteUrl={SITE_URL}
        datePublished="2026-10-09"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          How much down payment do I need?
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          The down payment question is usually asked as a minimum: what is the
          least I can put down and still get the loan. That is a real question
          with a real answer, but it is not the one that decides how much the
          house costs. The down payment is cash you either hand over now or keep,
          and the loan you take instead has a price. Both sides of that trade can
          be computed, and the answer is more lopsided than most buyers expect.
        </P>
        <P>
          Everything below is one house: <strong>$400,000</strong>, at{" "}
          <strong>6.50%</strong> over <strong>30 years</strong>, with mortgage
          insurance modelled at 0.50% a year on the original loan amount. The
          only thing that changes between the rows is how much cash goes down.
        </P>

        <H2>Four down payments, side by side</H2>
        <DataTable
          head={[
            "Down payment",
            "Loan amount",
            "Monthly P&I",
            "Monthly PMI",
            "Total monthly",
            "PMI ends",
            "PMI paid",
          ]}
          align={["l", "r", "r", "r", "r", "l", "r"]}
          rows={MONTHLY}
          caption="$400,000 purchase at 6.50% over 30 years, mortgage insurance modelled at 0.50% a year on each loan amount. The 3.5% row is priced under the same conventional insurance model so the rows are comparable; government-backed loans have their own insurance structure. Produced by our calculator and independently recomputed."
        />
        <P>
          Read the first and last rows together. Putting $66,000 more down
          removes <strong>$417.16</strong> of principal and interest and{" "}
          <strong>$160.83</strong> of insurance from the monthly bill, and it
          removes them permanently, because the insurance line does not exist on
          the 20% row. The other rows sit on a curve rather than a straight line:
          the 3.5% to 5% step saves $40.43 a month, while the 10% to 20% step
          saves <strong>$402.82</strong> — and the second step involves $40,000 of
          cash against $6,000 for the first.
        </P>
        <P>
          The insurance figures in the last column come with a caveat worth
          stating plainly. Mortgage insurance is priced off loan-to-value and
          credit, so a 96.5% loan normally carries a higher rate than the 0.50%
          used here. Holding the rate flat is what makes the rows comparable, and
          it means the real gap between the top and bottom rows is wider than the
          table shows, not narrower.
        </P>

        <H2>The honest total: price, plus interest, plus insurance</H2>
        <P>
          A down payment is not a cost. It is cash converted into equity. What a
          down payment changes is how much interest and insurance you pay, so
          that is what a fair comparison has to measure — and the reason it is
          fair is that the down payment and the principal you repay cancel out
          on both sides:
        </P>
        <DataTable
          head={["Down payment", "Lifetime cost", "Against 20% down"]}
          align={["l", "r", "r"]}
          rows={LIFETIME}
          caption="Lifetime cost = price + interest + mortgage insurance over the full 30 years. Down payment and repaid principal cancel out of both sides, so they are excluded. Produced by our calculator and independently recomputed."
        />
        <P>
          The 3.5% row ends up costing <strong>$105,249</strong> more than the 20%
          row across the life of the loan, on a house that was the same price
          either way. Some of that is insurance, which stops at month 131. Most of
          it is interest, which does not stop until the loan does.
        </P>

        <H2>The number that actually decides it</H2>
        <P>
          A lifetime figure spread over thirty years is hard to act on, because
          almost nobody holds the same loan for thirty years. The useful version
          is to stop the clock at the point you might realistically sell, and ask
          what the cash you kept actually cost while you kept it. That gives a
          rate — and a rate can be compared with something.
        </P>
        <DataTable
          head={[
            "Cash kept instead of putting it down",
            "Cash kept",
            "Extra monthly",
            "Extra cost over 7 years",
            "Simple annual",
            "Compound annual",
          ]}
          align={["l", "r", "r", "r", "r", "r"]}
          rows={SEVEN_YEAR}
          caption="Seven-year holding period. Extra cost is the additional interest plus mortgage insurance paid by the smaller down payment over that window, on the same $400,000 purchase. The 20% row is the baseline in each pair. Produced by our calculator and independently recomputed."
        />
        <Callout>
          <strong>The finding in one line:</strong> leaving $40,000 in your
          pocket instead of putting it down costs{" "}
          <strong>10.72% a year</strong> over seven years. That is the rate the
          loan behind that decision is charging you, and it is a number you can
          hold up against anything else you might do with the money. Notice too
          that the smallest down payment has the <em>cheapest</em> implied rate —
          because a $66,000 shortfall spreads the same fixed costs thinner.
        </Callout>
        <P>
          Two things about that table are easy to misread. The first is that the
          rate falls as the holding period lengthens: on the 10% row, 10.81% over
          five years becomes 8.13% over fifteen. That is not the cost of the money
          falling over time — it is the closing cost of the decision being
          amortised across more years. The second is that the smallest down
          payment has the lowest implied rate of the three. That is not an
          argument for putting less down; it is what a fixed cost looks like when
          you divide it by a bigger pile of cash.
        </P>

        <H2>The same comparison at different exit points</H2>
        <P>
          If you know roughly when you might move or refinance, the number moves
          with it. Using the 10% against 20% decision:
        </P>
        <DataTable
          head={["If you hold for", "Extra cost vs 20% down", "Simple annual"]}
          align={["l", "r", "r"]}
          rows={HORIZON}
          caption="The 10% versus 20% down decision on a $400,000 purchase, $40,000 of cash kept. Extra cost is additional interest plus mortgage insurance within each window. Produced by our calculator and independently recomputed."
        />
        <P>
          The total grows and the annual figure shrinks. Both are useful: the
          total tells you what the decision costs if you stay, the annual figure
          tells you what it costs per year. The figure that should drive the
          decision is the annual one, because it is the one that competes with
          alternative uses of the money.
        </P>

        <H2>What this arithmetic leaves out, on purpose</H2>
        <UL>
          <li>
            <strong>Your reserve.</strong> The largest down payment you can
            afford is not the same as the largest you should make. Cash in the
            house is not available when the roof fails or someone loses a job,
            and borrowing it back later is expensive. The tables above price the
            cash you keep; they say nothing about whether you can afford to give
            it up.
          </li>
          <li>
            <strong>What the insurance actually costs you.</strong> The rate used
            here is a single illustrative number applied to every row. Real
            pricing depends on loan-to-value, credit score and lender, and it is
            quoted rather than published — so the input to check first is the
            quote you are given, not this table.
          </li>
          <li>
            <strong>Whether your loan documents allow early cancellation.</strong>{" "}
            The end dates above assume the threshold is defined against the
            original price and that the servicer acts on it. Government-backed
            loans have their own rules, and some loans allow a borrower-requested
            cancellation earlier than the automatic date. Those clauses are in
            the documents, and they change the insurance half of every table
            here. See{" "}
            <A href="/how-to-remove-pmi">how to remove PMI</A> for the mechanics.
          </li>
          <li>
            <strong>Tax treatment.</strong> Whether mortgage interest or
            insurance is deductible, and at what income level, depends on where
            you are and on your own position, and it has changed more than once.
            Nothing on this page assumes any deduction.
          </li>
        </UL>

        <H2>How to use this for your own numbers</H2>
        <UL>
          <li>
            <strong>Find your two candidate down payments.</strong> Usually the
            smallest you qualify for and the largest you could manage without
            emptying your savings.
          </li>
          <li>
            <strong>Compare the two payments</strong> with{" "}
            <A href="/mortgage-calculator">the mortgage calculator</A>, which
            prices the tax, insurance and mortgage insurance alongside principal
            and interest. The payment difference is the visible half.
          </li>
          <li>
            <strong>Check the two against your income</strong> with{" "}
            <A href="/home-affordability-calculator">the affordability
            calculator</A> and{" "}
            <A href="/debt-to-income-ratio">the debt-to-income guide</A>. A larger
            down payment is only available if it does not leave you borrowing
            elsewhere at a worse rate.
          </li>
          <li>
            <strong>Then decide what the kept cash has to earn.</strong> The
            annual figures above are that hurdle rate. If nothing you hold is
            plausibly returning that after tax and after the risk you are taking,
            the arithmetic points at the larger down payment.
          </li>
        </UL>
        <P>
          One more comparison worth making before deciding: whether a
          government-backed loan with a different down payment minimum and its
          own insurance structure changes the ranking.{" "}
          <A href="/fha-vs-conventional-loan">FHA versus conventional</A> works
          through that on the same basis, holding the rate constant so the
          comparison is about structure rather than pricing.
        </P>

        <H2>The short version</H2>
        <P>
          On a $400,000 house at 6.50% over 30 years, putting 20% down instead of
          10% costs $40,000 today and saves $30,004 over seven years, an effective
          return of 10.72% a year. Across the full life of the loan the difference
          is $65,268. The 3.5% row costs $105,249 more than the 20% row, and its
          insurance alone runs to $21,069. The minimum down payment is a
          qualification question; what to actually put down is a return question,
          and on these numbers the money you keep is not free.
        </P>

        <Faq items={FAQ} />

        <ArticleFooter currentSlug="how-much-down-payment-do-i-need" />
      </article>
    </main>
  );
}
