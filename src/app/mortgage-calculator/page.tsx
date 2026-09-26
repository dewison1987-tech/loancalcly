import type { Metadata } from "next";
import MortgageCalculator from "@/components/MortgageCalculator";
import { SITE_URL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import {
  A,
  Byline,
  CalculatorFooter,
  Callout,
  DataTable,
  H2,
  JsonLd,
  P,
  UL,
} from "@/components/Prose";

export const metadata: Metadata = pageMetadata({
  path: "/mortgage-calculator",
  title: "Mortgage Calculator — Payment with Tax, Insurance and PMI",
  description:
    "Work out your monthly mortgage payment including property tax, homeowners insurance, HOA fees and mortgage insurance. Full PITI breakdown plus a month-by-month amortization schedule.",
});

const REVIEWED = "September 20, 2026";

const FAQ = [
  {
    q: "What does PITI mean?",
    a: "PITI stands for principal, interest, taxes and insurance — the four components of a mortgage payment. Lenders use the term because the payment they assess you against is not just the loan repayment; it is everything the property costs you each month. HOA dues are sometimes added as a fifth item and written as PITIA.",
  },
  {
    q: "Why is my actual payment higher than this calculator shows?",
    a: "The usual reasons are closing costs financed into the loan, an escrow cushion the servicer is allowed to collect, mortgage insurance at a rate different from the one entered here, or lender fees added to the balance. The Loan Estimate your lender must issue is the authoritative figure; treat anything else as a planning estimate.",
  },
  {
    q: "How much do I need for a down payment?",
    a: "It depends on the loan programme. Conventional loans are commonly available from 3% down, and government-backed loans lower than that, but a down payment under 20% normally triggers mortgage insurance. The calculator shows what that costs per month and how long it lasts.",
  },
  {
    q: "Will my property tax and insurance stay the same?",
    a: "No. Both are outside the loan agreement. Tax assessments are reassessed periodically and insurance premiums have risen sharply in many markets, while your principal and interest payment stays fixed on a fixed-rate loan. That is why an escrow payment can rise even when your mortgage does not.",
  },
  {
    q: "Does this calculator include closing costs?",
    a: "No. Closing costs — origination fees, title insurance, appraisal, recording fees and prepaid tax and insurance — are typically 2% to 5% of the purchase price and are paid at closing rather than spread across the loan. If you finance them, add them to the home price to see the effect on the payment.",
  },
  {
    q: "When can mortgage insurance be removed?",
    a: "On a conventional loan, a borrower with a good payment history can normally ask the servicer to cancel it once the balance reaches 80% of the original purchase price, and it terminates automatically at 78%. Government-backed loans such as FHA follow separate rules, so check the loan documents rather than assuming these thresholds apply.",
  },
];

// 房价 $400,000、30 年、6.5%，逐年下调首付。
// 房产税按房价 1.2%/年、保险 $1,800/年；PMI 按贷款额年化，费率随首付下降而上升。
const DOWN_PAYMENT = [
  ["20%", "$80,000", "$320,000", "$2,022.62", "$400", "$150", "$0", "$2,572.62"],
  ["10%", "$40,000", "$360,000", "$2,275.44", "$400", "$150", "$150", "$2,975.44"],
  ["5%", "$20,000", "$380,000", "$2,401.86", "$400", "$150", "$269", "$3,221.03"],
];

const TERMS = [
  ["30 years", "6.50%", "$2,022.62", "$408,142"],
  ["20 years", "5.75%", "$2,246.67", "$219,200"],
  ["15 years", "6.00%", "$2,700.34", "$166,062"],
];

export default function MortgageCalculatorPage() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "LoanCalcly Mortgage Calculator",
      url: `${SITE_URL}/mortgage-calculator`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      description:
        "Free mortgage payment calculator showing principal, interest, property tax, insurance, HOA and mortgage insurance in one monthly figure.",
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
          Mortgage Calculator
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          The payment a mortgage actually takes out of your account each month —
          not just principal and interest, but property tax, homeowners
          insurance, HOA dues and mortgage insurance alongside it.
        </p>
      </section>

      <div className="mt-10">
        <MortgageCalculator />
      </div>

      <article className="mx-auto mt-14 max-w-3xl">
        <Byline published={REVIEWED} />

        <H2>Why principal and interest is the wrong number to budget with</H2>
        <P>
          Mortgage advertising is built on the principal-and-interest figure
          because it is the smallest honest number available. On a $400,000 home
          with 20% down, that figure is $2,022.62 a month — but the money leaving
          your account is $2,572.62, because property tax and homeowners
          insurance arrive with it. Over a year the difference is $6,600, and
          over five years it is a new car.
        </P>
        <P>
          Lenders have a word for the full figure: <strong>PITI</strong> —
          principal, interest, taxes and insurance. It is the number they
          underwrite against, and it is the number this calculator returns. HOA
          dues and mortgage insurance are added on top when they apply, which is
          why the fields for both are there.
        </P>

        <H2>The down payment decision</H2>
        <P>
          On a $400,000 purchase, moving the down payment down the ladder does
          three things at once: the loan grows, the payment grows faster than the
          loan does, and a new cost appears.
        </P>
        <DataTable
          head={[
            "Down",
            "Cash",
            "Loan",
            "Principal & interest",
            "Tax",
            "Insurance",
            "PMI",
            "Total monthly",
          ]}
          align={["l", "r", "r", "r", "r", "r", "r", "r"]}
          rows={DOWN_PAYMENT}
          caption="Home price $400,000, 30-year fixed at 6.50%. Property tax at 1.2% of the purchase price a year and insurance at $1,800 a year. PMI assumed at 0.5% of the loan a year for the 10% case and 0.85% for the 5% case — quoted rates rise as the down payment falls. Figures rounded."
        />
        <P>
          The jump from 20% down to 10% costs <strong>$402.82 a month</strong>,
          of which $150 is mortgage insurance. Put another way: the extra
          $40,000 you keep in the bank is being rented at an effective rate of
          about 12% a year, because that is what the additional payment comes to
          against the cash retained.
        </P>
        <Callout>
          <strong>Mortgage insurance is not a small line.</strong> On this loan
          $150 a month runs until the balance falls to 80% of the purchase price
          — month 95, or nearly eight years. That is roughly $14,250 paid for
          nothing but the right to have borrowed more. If you can reach 20% down
          without draining your emergency fund, it is usually the single most
          valuable move in the whole transaction.
        </Callout>

        <H2>Term moves the cost far more than rate does</H2>
        <P>
          Borrowers spend hours shopping for a quarter point off the rate and
          almost no time deciding the term. On the same $320,000 loan, that is
          backwards:
        </P>
        <DataTable
          head={["Term", "Rate", "Monthly", "Total interest"]}
          align={["l", "r", "r", "r"]}
          rows={TERMS}
          caption="Principal and interest only. Shorter terms commonly carry a lower rate, which is reflected here."
        />
        <P>
          Shortening to 15 years raises the payment by <strong>$677.72</strong>{" "}
          and removes <strong>$242,081</strong> of interest. Cutting half a point
          off the 30-year rate instead — from 6.50% to 6.00% — saves $104 a month
          and about $37,460 over the life of the loan. The term choice is worth
          roughly six and a half times as much, and unlike the rate it is
          entirely within your control.
        </P>
        <P>
          That is not an argument for a 15-year mortgage regardless of
          circumstances. The higher payment is a real constraint, and a payment
          you cannot sustain is worse than interest you would rather not pay. The
          honest way to decide is to compare the two payments against your income
          and pick the shorter term you can hold through a bad year. The{" "}
          <A href="/amortization-schedule">amortization schedule calculator</A>{" "}
          shows how the balance behaves under each.
        </P>

        <H2>What this calculator deliberately leaves out</H2>
        <UL>
          <li>
            <strong>Closing costs.</strong> Origination, title, appraisal and
            recording fees usually total 2–5% of the purchase price and are paid
            at closing. Financed into the loan, they add to every payment for
            thirty years.
          </li>
          <li>
            <strong>Escrow cushion.</strong> Servicers commonly hold one to two
            months of tax and insurance payments as a buffer, which appears as a
            slightly higher monthly figure than the arithmetic suggests.
          </li>
          <li>
            <strong>Adjustable rates.</strong> This calculator models fixed-rate
            loans. An adjustable-rate mortgage has a fixed opening period and
            then moves — sometimes a long way.
          </li>
          <li>
            <strong>Tax deductibility.</strong> Whether mortgage interest or
            property tax reduces your bill depends on your jurisdiction, your
            filing status and whether you itemise. It is a genuine effect and it
            belongs in a tax return, not in a payment estimate.
          </li>
        </UL>

        <H2>How much house you can actually carry</H2>
        <P>
          The long-standing guideline is that housing costs should stay within{" "}
          <strong>28% of gross monthly income</strong>, and all debt payments —
          housing, car, student loans, minimum card payments — within{" "}
          <strong>36%</strong>. Many lenders will approve up to roughly 43%
          total debt-to-income, which is a lending limit rather than a comfort
          limit.
        </P>
        <P>
          Run it backwards for a sanity check: at a $2,572.62 monthly payment,
          the 28% guideline implies gross income of about $9,188 a month, or
          roughly $110,000 a year. If the figure the calculator returns is
          comfortable against your income, the house is affordable. If you are
          stretching to reach the lending limit, the risk is not the mortgage —
          it is the first unexpected repair, which on a house is not a matter of
          if.
        </P>
        <P>
          Before committing, put the two offers side by side the way{" "}
          <A href="/how-to-compare-loan-offers">our guide to comparing offers</A>{" "}
          sets out, and understand what the APR is really telling you with{" "}
          <A href="/apr-vs-interest-rate">APR versus interest rate</A>.
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

        <CalculatorFooter currentSlug="mortgage-calculator" />
      </article>
    </main>
  );
}
