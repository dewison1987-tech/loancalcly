import type { Metadata } from "next";
import AffordabilityCalculator from "@/components/AffordabilityCalculator";
import { SITE_URL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import {
  A,
  Byline,
  CalculatorFooter,
  DataTable,
  Faq,
  H2,
  JsonLd,
  P,
  UL,
} from "@/components/Prose";

export const metadata: Metadata = pageMetadata({
  path: "/home-affordability-calculator",
  title: "Home Affordability Calculator — What Price Can You Carry?",
  description:
    "Work the mortgage question backwards: from your income, monthly debts and down payment to the home price you can actually carry, using the debt-to-income limits lenders apply.",
});

const REVIEWED = "September 26, 2026";

const FAQ = [
  {
    q: "How much house can I afford on $100,000 a year?",
    a: "On a $100,000 income with $500 of monthly debt payments, $60,000 down and a 6.5% rate, the 28/36 convention supports a home price of about $334,400 — of which roughly $274,400 is borrowed. The same numbers under the wider 36/43 limits support about $420,600. The gap between those two figures is the whole point of this page: affordability depends on which ceiling you choose to live under, not only on your salary.",
  },
  {
    q: "What is the 28/36 rule?",
    a: "It is a long-standing convention in mortgage underwriting. The first number is the share of gross monthly income that housing costs may take — principal, interest, property tax, insurance, mortgage insurance and HOA dues combined. The second is the share that all debt may take, housing included. A lender comparing your file to 28/36 is asking whether a third of your income is already committed before you buy anything else.",
  },
  {
    q: "Should I put 20% down?",
    a: "Twenty percent is the point at which mortgage insurance normally stops applying, so the monthly cost falls and the amount you can borrow rises. The worked example on this page shows what that is worth: adding $20,000 to a $60,000 down payment raises the affordable price by about $32,900, which is far more than the $20,000 itself. Below 20% the benefit of each extra dollar is smaller, so the strongest reason to keep saving is the threshold, not the ratio.",
  },
  {
    q: "Why does a larger down payment let me afford a more expensive house?",
    a: "Two effects compound. The obvious one is that you borrow less for the same price, so the payment is smaller. The less obvious one is that crossing 20% removes mortgage insurance, which was consuming part of the debt-to-income allowance you could otherwise spend on the loan. Because the down payment also changes the price ceiling itself, the relationship is not linear — it is steep right around the 20% line.",
  },
  {
    q: "Does this calculator include closing costs?",
    a: "No. Closing costs — origination fees, appraisal, title insurance, recording fees and prepaid tax and insurance — are typically 2% to 5% of the purchase price and are paid in cash at closing, on top of the down payment. If you spend every available dollar on the down payment there is nothing left for them, which is one reason to hold back a reserve rather than maximising the number this page produces.",
  },
];

/** 全部数字由 src/lib/loan.ts 的 affordableHomePrice() 生成，并经独立第二实现复算比对 */
const DTI_COMPARE = [
  [
    "28% housing / 36% total debt",
    "$334,427",
    "$274,427",
    "$1,734.56",
    "$2,333.33",
  ],
  [
    "36% housing / 43% total debt",
    "$420,589",
    "$360,589",
    "$2,279.17",
    "$3,000.00",
  ],
];

const BREAKDOWN = [
  ["Principal and interest", "$1,734.56", "74.3%"],
  ["Property tax (1.2% a year)", "$334.43", "14.3%"],
  ["Home insurance ($1,800 a year)", "$150.00", "6.4%"],
  ["HOA fee", "$0.00", "0.0%"],
  ["Mortgage insurance (0.5% a year)", "$114.34", "4.9%"],
];

const DOWN_PAYMENT_EFFECT = [
  ["$40,000", "12.6%", "Yes", "$317,011"],
  ["$60,000", "17.9%", "Yes", "$334,427"],
  ["$80,000", "21.8%", "No", "$367,314"],
  ["$100,000", "26.0%", "No", "$384,582"],
];

export default function HomeAffordabilityCalculatorPage() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "LoanCalcly Home Affordability Calculator",
      url: `${SITE_URL}/home-affordability-calculator`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      description:
        "Free calculator that works the mortgage question backwards — from household income, monthly debts and down payment to the home price you can carry at a given debt-to-income limit.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    // ⚠️ 这里**不要**再手写一份 FAQPage。本页底部用的是共享的 `<Faq>` 组件，
    // 它已经从同一份 `FAQ` 数组产出了一份 FAQPage —— 两边都写会让同一个 URL
    // 出现两个 FAQPage 实体（2026-09-26 逐页抓取实测：本页 FAQPage=2、其余
    // 页面均为 1）。指南页统一只用 `<Faq>`；旧计算器页是手写 schema + 手写
    // 可见问答，也自洽。唯独本页曾两边都上，属于重复标注。
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-12">
      <JsonLd data={schema} />

      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          Home Affordability Calculator
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          Start from what you earn and what you already owe, and find the price you
          can carry — rather than starting from a listing price and hoping the
          payment works out.
        </p>
      </section>

      <div className="mt-10">
        <AffordabilityCalculator />
      </div>

      <article className="mx-auto mt-14 max-w-3xl">
        <Byline published={REVIEWED} />

        <H2>Why this one works backwards</H2>
        <P>
          Almost every mortgage calculator starts with a house price. That is the
          wrong end to start from, because at the moment you start looking you do
          not know the price — that is the thing you are trying to find out. If
          you begin with a listing, you have already made a decision about your
          budget without doing any of the arithmetic.
        </P>
        <P>
          The order that actually reflects the decision is: income, then the
          monthly payment you can commit to, then the price that payment
          supports. This calculator runs that sequence. It is the mirror image of
          the <A href="/mortgage-calculator">mortgage calculator</A>, which takes
          a price and tells you the payment that follows from it.
        </P>

        <H2>The two ceilings a lender applies</H2>
        <P>
          Mortgage underwriting works from ratios. The <strong>front-end</strong>{" "}
          ratio caps housing costs as a share of gross monthly income. The{" "}
          <strong>back-end</strong> ratio caps all debt — housing plus car loans,
          student loans, minimum card payments — as a share of the same income.
          The long-standing convention is 28% and 36%.
        </P>
        <P>
          Many loans are now underwritten to wider limits, commonly 36% and 43%,
          and some programmes go further. That difference is not small. On the
          same income of $100,000, the same $500 of monthly debts and the same
          $60,000 down payment:
        </P>
        <DataTable
          head={[
            "Ceiling",
            "Affordable price",
            "Loan",
            "Principal & interest",
            "Total housing cost",
          ]}
          align={["l", "r", "r", "r", "r"]}
          rows={DTI_COMPARE}
          caption="6.50% over 30 years, 1.2% property tax, $1,800 insurance a year, mortgage insurance at 0.5%. Produced by our calculator and independently recomputed."
        />
        <P>
          Moving from the conservative ceiling to the wider one adds{" "}
          <strong>$86,162</strong> to the price you can carry. Nothing about your
          circumstances changed — only the rule being applied. This is worth
          sitting with, because it means a figure described as &ldquo;how much
          you can afford&rdquo; is really a statement about a lender&apos;s
          appetite, not about your finances.
        </P>

        <H2>What the monthly number has to carry</H2>
        <P>
          The loan repayment is only one line in the payment. Taking the
          conservative case above — a $334,427 home with $60,000 down at 6.50% —
          here is what the $2,333.33 monthly housing cost is made of:
        </P>
        <DataTable
          head={["Component", "Per month", "Share of total"]}
          align={["l", "r", "r"]}
          rows={BREAKDOWN}
          caption="Property tax and insurance are inputs, not assumptions — substitute your own county's rate and your own premium."
        />
        <P>
          Principal and interest is under three-quarters of the bill, and the
          remaining quarter has nothing to do with the loan: it is the ongoing
          cost of owning the property. Two of those lines scale with the price
          rather than the loan, which is why a more expensive house costs more
          than the extra borrowing alone would suggest, and one — mortgage
          insurance — exists only because the down payment is below 20%.
        </P>

        <H2>The down payment has a cliff at 20%</H2>
        <P>
          It is tempting to think of down payments as a dial that moves
          affordability smoothly. They do not. Holding income at $100,000,
          monthly debts at $500 and the rate at 6.50%, and changing only the
          cash available:
        </P>
        <DataTable
          head={["Down payment", "As % of price", "PMI applies", "Affordable price"]}
          align={["r", "r", "l", "r"]}
          rows={DOWN_PAYMENT_EFFECT}
          caption="28/36 limits throughout. The loan term, rate, tax rate and insurance are held constant."
        />
        <P>
          Look at the middle two rows. Adding <strong>$20,000</strong> to a
          $60,000 down payment raises the affordable price from $334,427 to
          $367,314 — a gain of <strong>$32,887</strong>, which is{" "}
          <strong>1.6 times the money added</strong>. Now look at the first two
          rows: the same $20,000 added to a $40,000 down payment buys only{" "}
          <strong>$17,416</strong> of extra house.
        </P>
        <P>
          The reason is in the third column. Below 20% down, mortgage insurance
          is charged on the loan amount and consumes part of the debt-to-income
          allowance that would otherwise support borrowing. Crossing 20% removes
          that charge, and the freed allowance is spent on the loan instead. The
          benefit of saving is therefore concentrated at the threshold, which is
          the opposite of how most people plan for it — if you are already close
          to 20%, getting there is worth considerably more than the arithmetic
          suggests.
        </P>

        <H2>The lender&apos;s maximum is not your maximum</H2>
        <P>
          A lender approving a loan at 43% of gross income is making a statement
          about expected default risk, not about whether the payment leaves you
          with a life. Gross income is not spendable income — tax comes off
          first, and the ratio is calculated on the figure before it does.
        </P>
        <P>
          Twenty-eight percent of gross income on housing typically lands
          somewhere near a quarter of take-home pay. Anything approaching 36% of
          gross is a much larger share of what actually arrives in your account,
          and the remainder has to absorb food, transport, utilities, savings,
          insurance and everything unexpected. A useful discipline is to treat
          the number this calculator produces as a ceiling and to buy below it
          deliberately, because the payment is fixed for thirty years while
          almost everything else about your budget is not.
        </P>

        <H2>What this calculator leaves out</H2>
        <P>
          It models the monthly cost of the loan and the property. It does not
          model the cash you need on the day you buy, which is a separate and
          frequently under-planned number:
        </P>
        <UL>
          <li>
            <strong>Closing costs.</strong> Origination, appraisal, title
            insurance, recording and prepaid items commonly run 2% to 5% of the
            purchase price, paid in cash alongside the down payment.
          </li>
          <li>
            <strong>Moving and setup.</strong> Moving, a security deposit, blinds,
            a fridge, a mattress — the ordinary cost of making a house liveable is
            not part of any mortgage calculation.
          </li>
          <li>
            <strong>Maintenance.</strong> A common planning figure is around 1% of
            the property value a year. On a $334,000 home that is roughly $3,300
            annually, or $275 a month, on top of everything above.
          </li>
          <li>
            <strong>A cash reserve.</strong> Spending every available dollar on
            the down payment leaves nothing for a roof, a boiler or a change in
            income. Three to six months of expenses held back is the usual
            guidance, and it is not negotiable in the first year of ownership.
          </li>
        </UL>
        <P>
          If squeezing the down payment to its maximum leaves you without the
          reserve or the closing costs, the house is not affordable at that
          price — whatever a ratio says.
        </P>

        <H2>A worked example, end to end</H2>
        <P>
          Take a household earning <strong>$100,000</strong> with{" "}
          <strong>$500</strong> a month going to existing debts and{" "}
          <strong>$60,000</strong> in cash. Applying the conservative 28/36 limits
          at 6.50% over 30 years:
        </P>
        <UL>
          <li>
            Gross monthly income is $8,333.33; 28% of it is $2,333.33 a month for
            housing.
          </li>
          <li>
            Comparing the two ceilings, the housing limit binds first — the
            total-debt limit would have allowed more, so other debts are not the
            constraint here.
          </li>
          <li>
            Working backwards from $2,333.33 after property tax and insurance
            leaves room for a loan of about <strong>$274,400</strong>.
          </li>
          <li>
            With $60,000 down, the affordable price is about{" "}
            <strong>$334,400</strong> — and because that is 17.9% down, mortgage
            insurance of <strong>$114.34</strong> a month is included in the
            figure.
          </li>
          <li>
            Rerunning the same numbers under 36/43 gives roughly{" "}
            <strong>$420,600</strong>. Both answers are correct; they answer
            different questions.
          </li>
        </UL>
        <P>
          Change the rate, the term or the tax rate and the answer moves — those
          inputs are in the panel above precisely so you can see by how much,
          rather than trusting a single headline figure. To check what any
          resulting loan would cost month by month, take the numbers to the{" "}
          <A href="/amortization-schedule">amortization schedule</A>.
        </P>

        <section className="mt-10 rounded-xl border border-gray-200 bg-white p-5">
          <H2>Next steps</H2>
          <P>
            Once you have a price, the two remaining decisions are the term and
            the rate. The term changes both the payment and the total cost
            dramatically — see{" "}
            <A href="/15-vs-30-year-mortgage">15-year vs 30-year mortgages</A> for
            what that trade-off looks like on a worked loan, and{" "}
            <A href="/how-much-house-can-i-afford">how much house you can afford</A>{" "}
            for the parts of the decision a ratio cannot capture.
          </P>
        </section>

        <Faq items={FAQ} />

        <CalculatorFooter currentSlug="home-affordability-calculator" />
      </article>
    </main>
  );
}
