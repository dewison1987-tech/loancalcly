import type { Metadata } from "next";
import AutoLoanCalculator from "@/components/AutoLoanCalculator";
import { SITE_URL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import {
  A,
  Byline,
  CalculatorFooter,
  Callout,
  DataTable,
  H2,
  H3,
  JsonLd,
  P,
  UL,
} from "@/components/Prose";

export const metadata: Metadata = pageMetadata({
  path: "/auto-loan-calculator",
  title: "Auto Loan Calculator — Monthly Payment with Tax and Trade-In",
  description:
    "Calculate your car payment from the vehicle price, down payment, trade-in value and sales tax. Compare 48, 60 and 72-month terms and see what the longer term really costs.",
});

const REVIEWED = "September 20, 2026";

const FAQ = [
  {
    q: "How is the amount financed calculated?",
    a: "Vehicle price, less your down payment, less the trade-in allowance, plus sales tax and any fees you roll in. That total is what the lender actually advances and what interest is charged on — which is why a change to the trade-in allowance moves the monthly payment even though the price on the windscreen did not change.",
  },
  {
    q: "Does sales tax apply before or after the trade-in?",
    a: "It depends where you live. Many states tax only the difference between the price and the trade-in allowance, which is a real saving; others tax the full purchase price. Some states also vary the rate by county or city. Enter the rate that applies to you and switch the toggle to match your state's rule.",
  },
  {
    q: "Is a 72-month car loan a bad idea?",
    a: "Not automatically, but it is more expensive and riskier. The payment is lower, the total interest is higher, and because a new vehicle loses value fastest in its first years, a longer loan keeps more borrowers in negative equity — owing more than the car is worth — for longer. If you need 72 months to make the payment work, the more useful question is whether a cheaper vehicle would serve.",
  },
  {
    q: "Should I use dealer financing or arrange my own?",
    a: "Get a pre-approval from a bank or credit union before you go anywhere near the dealership, then treat dealer financing as a competing offer. A pre-approval converts the finance conversation from a negotiation about monthly payment into a comparison of two rates, and it gives you a real option to walk away from a bad one.",
  },
  {
    q: "What is not included here?",
    a: "Dealer documentation fees, title and registration, extended warranties, gap insurance, and any negative equity rolled over from a previous loan. All of them increase the amount financed. If you are carrying negative equity, add it to the vehicle price so the payment reflects it.",
  },
];

// $35,000 车价、$5,000 首付、$3,000 置换、6.5% 销售税（按车价减置换价计征）
// → 融资额 $29,080。下面只改期限与利率。
const TERMS = [
  ["48 months", "7.50%", "$703.12", "$4,670", "$33,750"],
  ["60 months", "7.50%", "$582.70", "$5,882", "$34,962"],
  ["72 months", "7.25%", "$499.28", "$6,868", "$35,948"],
];

export default function AutoLoanCalculatorPage() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "LoanCalcly Auto Loan Calculator",
      url: `${SITE_URL}/auto-loan-calculator`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      description:
        "Free car payment calculator: amount financed from price, down payment, trade-in and sales tax, with term comparison and amortization schedule.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-12">
      <JsonLd data={schema} />

      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          Auto Loan Calculator
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          Start from what you will actually borrow, not the price on the
          windscreen — the amount financed is built from the price, your down
          payment, the trade-in allowance and sales tax.
        </p>
      </section>

      <div className="mt-10">
        <AutoLoanCalculator />
      </div>

      <article className="mx-auto mt-14 max-w-3xl">
        <Byline published={REVIEWED} />

        <H2>The number to negotiate is the amount financed</H2>
        <P>
          Car deals are argued in monthly payments because that is the figure
          most people anchor on. But a monthly payment is an output, and it has
          four inputs: the price, the down payment, the trade-in allowance and
          the rate. A dealer who moves any one of them while holding the payment
          steady has changed the deal without changing the number you are
          watching.
        </P>
        <P>
          The <strong>amount financed</strong> is the input that ties them
          together. It is what the lender advances, what interest is charged on,
          and the only figure that lets you compare two deals honestly. Get the
          price down, get the trade-in up, and the amount financed falls. Every
          $1,000 off that number is roughly $20 a month off a 60-month loan — and
          every $1,000 of it, unlike a discount, is money you do not owe.
        </P>

        <H2>Where the amount financed comes from</H2>
        <P>
          This is the arithmetic behind the calculator, for a $35,000 vehicle
          with $5,000 down, a $3,000 trade-in and 6.5% sales tax charged on the
          price after the trade-in credit:
        </P>
        <DataTable
          head={["Line", "Amount"]}
          align={["l", "r"]}
          rows={[
            ["Vehicle price", "$35,000"],
            ["Less down payment", "− $5,000"],
            ["Less trade-in allowance", "− $3,000"],
            ["Sales tax at 6.5% on $32,000", "+ $2,080"],
            ["Amount financed", "$29,080"],
          ]}
        />
        <Callout>
          <strong>The trade-in credit is worth more than it looks.</strong> Where
          a state taxes only the difference, a $3,000 trade-in also removes $195
          of sales tax — so it is really worth $3,195 against the loan. Change
          the toggle to full-price taxation and the amount financed rises to
          $29,275, which is $195 of extra interest-bearing debt created purely by
          where you live.
        </Callout>

        <H2>What the term does to the cost</H2>
        <P>
          Same vehicle, same amount financed, same down payment — only the term
          and the rate attached to it change:
        </P>
        <DataTable
          head={["Term", "Rate", "Monthly", "Total interest", "Total of payments"]}
          align={["l", "r", "r", "r", "r"]}
          rows={TERMS}
          caption="Amount financed $29,080. Longer terms commonly carry a slightly lower rate, which is reflected here. Figures rounded to the nearest dollar for totals."
        />
        <P>
          Stretching from 48 months to 72 months lowers the payment by{" "}
          <strong>$203.84</strong> and adds <strong>$2,199</strong> of interest.
          That is the trade in plain numbers: about $204 a month of breathing
          room, bought for $2,199.
        </P>
        <P>
          Whether it is worth it depends on something the table cannot tell you.
          A car is a depreciating asset, and depreciation is front-loaded — the
          earliest years remove the most value. A longer loan therefore keeps
          more borrowers in negative equity for longer, meaning if the car is
          written off or you need to sell, the settlement may not clear the
          balance. Gap insurance exists precisely for that gap, and if you take a
          72-month term it is worth pricing.
        </P>

        <H2>Four things that decide the rate you get</H2>
        <UL>
          <li>
            <strong>Your credit score.</strong> It is the largest single input on
            an auto loan, and the difference between tiers is measured in
            percentage points rather than fractions. Checking your own score
            before you shop does not affect it.
          </li>
          <li>
            <strong>Whether the car is new or used.</strong> Used-car rates are
            typically higher for the same borrower, because the collateral
            depreciates from a lower base and the lender carries more risk.
          </li>
          <li>
            <strong>Term length.</strong> Longer terms are often priced slightly
            higher on the same vehicle — the rate in the table above falls
            because it is an illustrative comparison, not a rule.
          </li>
          <li>
            <strong>Whether a manufacturer is subsidising the rate.</strong>{" "}
            Promotional financing is real, and it is usually funded by giving up
            a cash rebate. Ask what the rebate would be if you paid cash, then
            compare it with the interest you would save.{" "}
            <A href="/how-to-compare-loan-offers">
              The same break-even logic
            </A>{" "}
            as discount points on a mortgage applies.
          </li>
        </UL>

        <H2>Before you sign anything</H2>
        <H3>Separate the three negotiations</H3>
        <P>
          Price, trade-in and financing are three separate conversations that
          dealers are trained to merge. Merging them is what makes a bad deal
          feel acceptable — a generous-looking trade-in allowance can hide a
          price that was never discounted. Settle the price of the new car first,
          then the trade-in as a cash figure, then the financing. Written down,
          one at a time.
        </P>
        <H3>Check the total, not the payment</H3>
        <P>
          Ask for the out-the-door figure: price, tax, title, registration,
          documentation fee, everything. That is the number to compare between
          two dealerships, and it is the number to enter here as the vehicle
          price if you want the payment to reflect reality. Then look at{" "}
          <A href="/amortization-schedule">the schedule</A> and check how much
          you still owe after two years — that is the balance you would have to
          clear if you traded it in.
        </P>
        <P>
          For the interest-rate arithmetic underneath all of this,{" "}
          <A href="/apr-vs-interest-rate">APR versus interest rate</A> explains
          why the advertised rate and the cost of the loan are not the same
          figure.
        </P>

        <H2>Frequently asked questions</H2>
        <div className="mt-4 space-y-4">
          {FAQ.map((f) => (
            <div
              key={f.q}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <p className="font-medium text-gray-900">{f.q}</p>
              <p className="mt-1.5 leading-relaxed text-gray-600">{f.a}</p>
            </div>
          ))}
        </div>

        <CalculatorFooter currentSlug="auto-loan-calculator" />
      </article>
    </main>
  );
}
