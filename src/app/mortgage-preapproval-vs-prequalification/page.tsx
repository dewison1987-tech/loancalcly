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
  path: "/mortgage-preapproval-vs-prequalification",
  title: "Mortgage Preapproval vs Prequalification",
  description:
    "A $39,600 bonus only half recognised costs $60,361 of buying power, and a 0.75-point rate rise costs another $20,652. The arithmetic behind both numbers.",
  type: "article",
});

const PUBLISHED = "October 11, 2026";

/**
 * 全部数字由 src/lib/loan.ts 的 preapprovalGap / approvalRateSweep 生成，
 * 并经 Python / Node 两套独立实现 + 站点内核三方逐位复算（170 个值逐字节一致）。
 *
 * 场景：申报收入 $132,000（其中 30% 为奖金/佣金），承保端只认可其中 50%，
 * 即 $112,200。其他债务 $650/月，首付 $60,000，6.50% / 30 年，
 * 房产税 1.10%/年，保险 $1,800/年，PMI 0.50%/年，前端 DTI 上限 28%、后端 43%。
 *
 * ⚠️ 「承保端认可多少」完全是显式入参，不是内置经验值 —— 它因贷款机构与
 * 收入类型而异。这里取 50% 只是为了让差额可复算，不代表任何机构的标准。
 */

const INCOME = [
  ["Base salary", "$92,400", "Counted in full", "$92,400"],
  ["Bonus and commission", "$39,600", "Half counted", "$19,800"],
  [
    <strong key="t" className="text-gray-900">
      Total used for DTI
    </strong>,
    <strong key="t2" className="text-gray-900">
      $132,000
    </strong>,
    "—",
    <strong key="t3" className="text-gray-900">
      $112,200
    </strong>,
  ],
];

const GAP = [
  [
    <strong key="a" className="text-gray-900">
      Prequalification letter
    </strong>,
    "$132,000",
    "$435,620",
    "$375,620",
    "$3,080.00",
  ],
  [
    <strong key="b" className="text-gray-900">
      Underwritten preapproval
    </strong>,
    "$112,200",
    "$375,259",
    "$315,259",
    "$2,618.00",
  ],
  [
    <strong key="d" className="text-gray-900">
      Difference
    </strong>,
    <strong key="d2" className="text-gray-900">
      $19,800
    </strong>,
    <strong key="d3" className="text-gray-900">
      $60,361
    </strong>,
    <strong key="d4" className="text-gray-900">
      $60,361
    </strong>,
    <strong key="d5" className="text-gray-900">
      $462.00
    </strong>,
  ],
];

const RATES = [
  ["6.00%", "$389,247", "$329,247", "$2,618.00", "—"],
  ["6.25%", "$382,141", "$322,141", "$2,618.00", "−$7,106"],
  ["6.50%", "$375,259", "$315,259", "$2,618.00", "−$13,988"],
  [
    <strong key="c" className="text-gray-900">
      6.75%
    </strong>,
    <strong key="c2" className="text-gray-900">
      $368,595
    </strong>,
    <strong key="c3" className="text-gray-900">
      $308,595
    </strong>,
    "$2,618.00",
    <strong key="c4" className="text-gray-900">
      −$20,652
    </strong>,
  ],
  ["7.00%", "$362,140", "$302,140", "$2,618.00", "−$27,107"],
];

const FAQ = [
  {
    q: "What is the difference between prequalification and preapproval?",
    a: "Prequalification is an estimate produced from figures you supply; preapproval is a decision produced from figures the lender has verified. Both are usually expressed through the same debt-to-income rules, so the difference is not the method — it is what counts as income. Bonus, commission and overtime are frequently counted at a discount, and any discount is applied before the ratios are calculated, which means it propagates straight through to the maximum loan. On the example here, $19,800 of income that is not recognised costs $60,361 of buying power.",
  },
  {
    q: "Does a preapproval guarantee the loan?",
    a: "No. A preapproval is an assessment of your finances at a point in time, conditional on the property appraising, on your circumstances not changing, and on the terms in the eventual commitment letter. Its value is that it converts an estimate into a documented borrowing ceiling, which is what sellers are reading when they compare offers. It is not a commitment to lend on any particular property.",
  },
  {
    q: "Why does the monthly payment stay the same when rates rise?",
    a: "Because the constraint is the ratio, not the payment. Lenders cap housing costs as a share of monthly income, so the budget for housing is fixed by your income before any rate is considered. A higher rate does not raise the budget — it reduces the loan that fits inside it, and therefore the price you can offer. On this example the housing budget is $2,618.00 a month at every rate from 6.00% to 7.00%, while the price it supports falls from $389,247 to $362,140.",
  },
  {
    q: "How much does a rate change cost between prequalification and closing?",
    a: "On this example, a move from 6.00% to 6.75% removes $20,652 from the price you can finance at the same monthly budget, and a full point to 7.00% removes $27,107. Rate movements of that size over a two-month shopping period are ordinary rather than unusual, which is why the gap between what a letter says and what a rate lock fixes is worth understanding before you make an offer.",
  },
  {
    q: "What should I do with a prequalification letter?",
    a: "Treat it as a shopping range rather than a budget, and ask which income figures were used to produce it. If any part of your pay is variable, ask how much of it was counted, because that single input explains most of the difference between the two numbers on this page. Then work out your own ceiling from your own budget rather than adopting the lender's, because the lender's ceiling is limited by a ratio rather than by what you want to spend.",
  },
];

export default function PreapprovalVsPrequalificationGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="Mortgage Preapproval vs Prequalification"
        description="The same debt-to-income rules applied to two different definitions of income, what the difference does to the price you can shop for, and how a rate move between prequalification and closing changes it again."
        path="/mortgage-preapproval-vs-prequalification"
        siteUrl={SITE_URL}
        datePublished="2026-10-11"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Mortgage preapproval vs prequalification
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          The two words get used interchangeably in conversation and they are
          not the same document. Prequalification is an estimate built from
          numbers you supply; preapproval is a decision built from numbers the
          lender has checked. Both are usually expressed through the same
          debt-to-income ratios, so the method is not what differs. What differs
          is the single input those ratios divide: <strong>income</strong>.
        </P>
        <P>
          That sounds like a small distinction until you follow it through the
          arithmetic. A lending decision is roughly income divided by a payment
          coefficient, and anything that shrinks the numerator gets multiplied on
          the way out. On the example below, a $19,800 reduction in recognised
          income removes <strong>$60,361</strong> from the price you can finance —
          three times the income itself.
        </P>

        <H2>Two definitions of the same payslip</H2>
        <P>
          Suppose you earn <strong>$132,000</strong> a year, and 30% of that
          arrives as bonus or commission rather than salary. Stating your income
          as $132,000 is accurate. Whether a lender will use all of it is a
          separate question, because variable pay has to be evidenced over time,
          and the portion that is accepted is often discounted.
        </P>
        <DataTable
          head={["Income", "Stated", "How it is treated", "Recognised"]}
          align={["l", "r", "l", "r"]}
          rows={INCOME}
          caption="A worked example: $132,000 stated, of which 30% is variable pay counted at half. How much of a variable component is recognised is set by the lender and the income type, not by a general rule — the discount is an input here, not a finding."
        />
        <P>
          The gap is <strong>$19,800</strong> a year, or 15.00% of the stated
          figure. Nothing about your finances has changed; the difference is
          entirely in which of two equally defensible definitions of income is
          being used.
        </P>

        <H2>What that gap does to the price you can shop for</H2>
        <P>
          Now put both incomes through the same ratios, with the same debts, the
          same down payment and the same rate. Everything except the income is
          held constant, so every dollar of difference in the outcome is the
          income definition:
        </P>
        <DataTable
          head={[
            "Basis",
            "Income used",
            "Maximum price",
            "Maximum loan",
            "Housing budget",
          ]}
          align={["l", "r", "r", "r", "r"]}
          rows={GAP}
          caption="$60,000 down, 6.50% over 30 years, $650 of other monthly debt, property tax at 1.10% a year, insurance at $1,800 a year, mortgage insurance at 0.50% a year. Front-end ratio 28%, back-end 43%. Produced by our calculator and independently recomputed."
        />
        <Callout>
          <strong>The finding in one line:</strong> losing $19,800 of recognised
          income costs <strong>$60,361</strong> of buying power and{" "}
          <strong>$462.00</strong> of monthly housing budget. Buying power is a
          leveraged quantity, so an income haircut is never paid at par.
        </Callout>
        <P>
          Both rows in that table are the same person on the same day. The
          difference between them is not a change in circumstances — it is the
          difference between shopping with a letter produced from stated income
          and shopping with one produced from verified income. If you make an
          offer on the strength of the first row and the second row turns out to
          be the binding one, the shortfall arrives at the worst possible moment.
        </P>

        <H2>The second gap: the rate is not locked yet</H2>
        <P>
          Even a properly underwritten preapproval has a shelf life, because it
          is calculated at a rate you have not locked. Hold the income at the
          verified figure and move only the rate:
        </P>
        <DataTable
          head={[
            "Rate",
            "Maximum price",
            "Maximum loan",
            "Housing budget",
            "Against 6.00%",
          ]}
          align={["l", "r", "r", "r", "r"]}
          rows={RATES}
          caption="Verified income of $112,200 held constant; only the rate changes. The housing budget is identical in every row because it is set by the front-end ratio against income, not by the rate. Produced by our calculator and independently recomputed."
        />
        <P>
          Three-quarters of a point removes{" "}
          <strong>$20,652</strong> from the price you can finance; a full point
          removes <strong>$27,107</strong>. And notice the column that does not
          move: the housing budget is <strong>$2,618.00</strong> in every row.
          That is the whole mechanism in one table. A lender does not decide what
          you can pay and then find a house — it caps what you may pay as a share
          of income, and the rate decides how much loan fits underneath that cap.
        </P>

        <H2>What this arithmetic leaves out, on purpose</H2>
        <UL>
          <li>
            <strong>The lender’s ceiling is not your budget.</strong> Both rows
            above are the maximum a ratio permits, not the maximum you should
            spend. A ratio ceiling leaves nothing for the months when the roof,
            the car and the boiler all fail together, and it says nothing about
            what you actually want to spend on housing.
          </li>
          <li>
            <strong>How much variable pay gets recognised.</strong> The half
            used here is an example, not a rule. It varies by lender and by
            income type, and it is normally documented somewhere in the loan
            file — worth asking about explicitly rather than inferring from the
            letter.
          </li>
          <li>
            <strong>Everything else in the file.</strong> Assets, credit history,
            employment history and the property itself all feed the eventual
            decision. The ratios modelled here are the part that has a
            computable relationship with the price, which is why they are the
            part on this page.
          </li>
          <li>
            <strong>Programme-specific rules.</strong> Loan limits, insurance
            requirements and allowable ratios differ between conventional and
            government-backed programmes, and between lenders within a
            programme. See{" "}
            <A href="/fha-vs-conventional-loan">FHA versus conventional</A> for
            how the structure changes on the same rate.
          </li>
        </UL>

        <H2>How to use this</H2>
        <UL>
          <li>
            <strong>Ask which income figure was used.</strong> That single
            question explains most of the distance between a prequalification
            estimate and an underwritten decision. If any part of your pay is
            variable, ask how much of it was counted.
          </li>
          <li>
            <strong>Work out your own ceiling</strong> with{" "}
            <A href="/home-affordability-calculator">the affordability
            calculator</A> and keep the result for use as a budget rather than a
            target. Then read{" "}
            <A href="/how-much-house-can-i-afford">how much house you can
            afford</A> for why the approved figure and the sensible figure are
            rarely the same.
          </li>
          <li>
            <strong>Understand the ratio you are being measured against</strong>{" "}
            with <A href="/debt-to-income-ratio">the debt-to-income guide</A>,
            including which debts count, because paying down a small instalment
            debt can move the ceiling more than saving the same money.
          </li>
          <li>
            <strong>Lock when you are ready to commit, not before.</strong> The
            rate table above is the cost of leaving it open; a lock has its own
            cost. The trade is between a known ceiling and a fee, and it is worth
            making deliberately.
          </li>
        </UL>
        <P>
          One more check worth running before you offer: the appraisal, not the
          price, is what the loan is eventually measured against.{" "}
          <A href="/what-if-the-appraisal-is-low">What if the appraisal comes in
          low</A> prices the gap between the two, because that gap arrives in cash
          and it is not in any preapproval letter.
        </P>

        <H2>The short version</H2>
        <P>
          Prequalification and preapproval run the same ratios on different
          definitions of income. On a $132,000 income with 30% variable pay, being
          credited with 50% of the variable portion takes the recognised figure to
          $112,200, which takes the maximum price from $435,620 to $375,259 — a
          difference of $60,361, or three times the income in dispute. A further
          0.75 points on the rate removes $20,652 more, while the monthly housing
          budget stays fixed at $2,618.00 throughout. The letter is a range; the
          ratio is the constraint; and the rate decides how much house fits
          inside it.
        </P>

        <Faq items={FAQ} />

        <ArticleFooter currentSlug="mortgage-preapproval-vs-prequalification" />
      </article>
    </main>
  );
}
