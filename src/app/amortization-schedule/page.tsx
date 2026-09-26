import type { Metadata } from "next";
import AmortizationTool from "@/components/AmortizationTool";
import { SITE_URL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import {
  A,
  Byline,
  CalculatorFooter,
  Callout,
  DataTable,
  Formula,
  H2,
  H3,
  JsonLd,
  P,
  UL,
} from "@/components/Prose";

export const metadata: Metadata = pageMetadata({
  path: "/amortization-schedule",
  title: "Amortization Schedule Calculator — Monthly and Yearly Breakdown",
  description:
    "Generate a full amortization schedule for any fixed-rate loan: month by month, year by year, and with extra payments included. See exactly how much interest each extra dollar removes.",
});

const REVIEWED = "September 20, 2026";

const FAQ = [
  {
    q: "What is an amortization schedule?",
    a: "A table showing every payment on a fixed-rate loan split into its two parts — the interest charged that period and the principal it reduces — and the balance remaining afterwards. Because the payment stays the same while the balance falls, the interest portion shrinks and the principal portion grows over the life of the loan.",
  },
  {
    q: "Why is so much of my early payment interest?",
    a: "Because interest is charged on the balance and the balance is still large. On a $300,000 loan at 6.5%, the first payment of $1,896.20 contains $1,625 of interest and only $271.20 of principal. There is nothing unfair about it: the interest is simply the rate applied to what you still owe. It also means payments made early are the most powerful ones you will ever make.",
  },
  {
    q: "How much does an extra payment save?",
    a: "More than most people expect, because the saving compounds over the remaining term. On a $300,000 30-year loan at 6.5%, an extra $200 a month finishes the loan about seven years early and removes roughly $103,000 of interest. The same $200 paid in year 25 would save a fraction of that.",
  },
  {
    q: "Do extra payments reduce my monthly payment?",
    a: "Normally no — they shorten the term instead. On a standard fixed-rate instalment loan the scheduled payment is fixed by the contract; extra principal simply moves the payoff date forward. Some lenders offer to recast the loan and reduce the payment instead, which usually requires a fee and an application.",
  },
  {
    q: "Can I use this for any type of loan?",
    a: "Yes, for any fixed-rate fully amortising loan — mortgages, car loans, personal loans, student loans. It does not model interest-only periods, adjustable rates, or loans where the payment is recalculated each year. For a mortgage payment including tax and insurance, use the mortgage calculator instead.",
  },
];

// $300,000 @6.5%/30 年 —— 前 12 期，逐期数字来自本站引擎
const FIRST_YEAR = [
  ["1", "$1,896.20", "$271.20", "$1,625.00", "$299,728.80"],
  ["2", "$1,896.20", "$272.67", "$1,623.53", "$299,456.12"],
  ["3", "$1,896.20", "$274.15", "$1,622.05", "$299,181.97"],
  ["4", "$1,896.20", "$275.64", "$1,620.57", "$298,906.34"],
  ["5", "$1,896.20", "$277.13", "$1,619.08", "$298,629.21"],
  ["6", "$1,896.20", "$278.63", "$1,617.57", "$298,350.58"],
  ["7", "$1,896.20", "$280.14", "$1,616.07", "$298,070.44"],
  ["8", "$1,896.20", "$281.66", "$1,614.55", "$297,788.79"],
  ["9", "$1,896.20", "$283.18", "$1,613.02", "$297,505.60"],
  ["10", "$1,896.20", "$284.72", "$1,611.49", "$297,220.89"],
  ["11", "$1,896.20", "$286.26", "$1,609.95", "$296,934.63"],
  ["12", "$1,896.20", "$287.81", "$1,608.40", "$296,646.82"],
];

const YEAR_BANDS = [
  ["1", "$3,353", "$19,401", "$296,647"],
  ["5", "$4,346", "$18,409", "$280,833"],
  ["10", "$6,009", "$16,745", "$254,328"],
  ["15", "$8,310", "$14,445", "$217,677"],
  ["20", "$11,491", "$11,263", "$166,996"],
  ["25", "$15,890", "$6,864", "$96,912"],
  ["30", "$21,973", "$781", "$0"],
];

const EXTRA = [
  ["$0", "360", "30 years", "$382,633", "—", "—"],
  ["$100", "312", "26 years", "$321,639", "$60,995", "4 years"],
  ["$200", "277", "23 years 1 month", "$279,185", "$103,449", "6 years 11 months"],
  ["$500", "210", "17 years 6 months", "$202,874", "$179,759", "12 years 6 months"],
];

export default function AmortizationSchedulePage() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "LoanCalcly Amortization Schedule Calculator",
      url: `${SITE_URL}/amortization-schedule`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      description:
        "Free amortization schedule calculator producing a month-by-month and year-by-year breakdown of any fixed-rate loan, with optional extra payments.",
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
          Amortization Schedule Calculator
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          Every payment on a fixed-rate loan, split into interest and principal,
          month by month and year by year — plus the extra payment box that shows
          what happens to the end date when you pay ahead.
        </p>
      </section>

      <div className="mt-10">
        <AmortizationTool />
      </div>

      <article className="mx-auto mt-14 max-w-3xl">
        <Byline published={REVIEWED} />

        <H2>What the table is actually showing</H2>
        <P>
          A fixed-rate loan has a constant payment, which hides a moving
          structure. Interest is charged as the rate applied to the balance you
          still owe, so it is largest at the start and falls every month. The
          payment is fixed, so whatever is left after interest goes to principal
          — which means the principal portion grows every month.
        </P>
        <Formula>Monthly payment = Interest on the current balance + Principal reduction</Formula>
        <P>
          That single sentence explains everything the table shows. Here is the
          first year of a $300,000 loan at 6.5% over 30 years:
        </P>
        <DataTable
          head={["Month", "Payment", "Principal", "Interest", "Balance"]}
          align={["r", "r", "r", "r", "r"]}
          rows={FIRST_YEAR}
          caption="Payment $1,896.20 throughout. The principal column grows by a little more each month, the interest column falls by the same amount."
        />
        <P>
          Notice what twelve months of $1,896.20 payments achieved:{" "}
          <strong>$22,754 paid, $19,401 of it interest, and a balance down by
          $3,353.</strong> After a year of paying on time, 85% of the money went
          to interest and 1.1% of the loan was repaid. This is not a malfunction
          — it is what a 6.5% rate on a large balance does in year one.
        </P>

        <H2>Thirty years in seven lines</H2>
        <P>
          The same loan, summarised year by year. Read down the interest column:
          it falls slowly at first, then collapses.
        </P>
        <DataTable
          head={["Year", "Principal repaid that year", "Interest that year", "Balance at year end"]}
          align={["r", "r", "r", "r"]}
          rows={YEAR_BANDS}
          caption="$300,000 at 6.5% over 30 years. Figures rounded to the nearest dollar."
        />
        <P>
          Two things stand out. First, total interest of <strong>$382,633</strong>{" "}
          — on a $300,000 loan, you pay more in interest than you borrowed. That
          is the arithmetic of 6.5% over thirty years, and it is why term choice
          dominates rate shopping;{" "}
          <A href="/how-to-compare-loan-offers">comparing offers</A> on rate alone
          will miss it.
        </P>
        <P>
          Second, look at the pacing. By the end of year 10 you still owe{" "}
          <strong>$254,328</strong> — five-sixths of the loan after a third of the
          term. The principal overtakes interest for the first time in{" "}
          <strong>month 233</strong>, more than nineteen years in. If you plan to
          sell or refinance inside five years, year one of this table is close to
          the whole story, which is exactly why{" "}
          <A href="/refinance-break-even-point">break-even maths</A> matters more
          than the headline saving.
        </P>

        <H2>What an extra payment does</H2>
        <P>
          Extra money paid to principal does not reduce the scheduled payment. It
          removes months from the end of the loan, and every month removed is a
          month of interest that never gets charged:
        </P>
        <DataTable
          head={["Extra per month", "Months", "Loan ends", "Total interest", "Interest saved", "Time saved"]}
          align={["r", "r", "l", "r", "r", "r"]}
          rows={EXTRA}
          caption="$300,000 at 6.5% over 30 years, no lump sums. Assumes no prepayment penalty."
        />
        <Callout>
          <strong>Look at the last column against the first.</strong> $500 a month
          extra removes 150 months — twelve and a half years — and $179,759 of
          interest. The payments themselves total $105,000, so the arithmetic of
          paying early returns roughly $1.70 of avoided interest for every extra
          dollar, before considering that the money would otherwise have earned
          little in a savings account. The earlier the payments, the stronger the
          effect; the same $500 starting in year 20 would save a small fraction.
        </Callout>

        <H2>Three ways to use a schedule before you commit</H2>
        <H3>Check the balance at your realistic exit point</H3>
        <P>
          Most loans are not held to term. Find the row for the month you expect
          to sell or refinance and read the balance. That is what you would need
          to clear from the sale — and it is the number, not the monthly payment,
          that determines whether the deal was a good one. On the loan above,
          selling in year five leaves $280,833 outstanding.
        </P>
        <H3>Test the term before you choose it</H3>
        <P>
          Change the term and watch two things: the payment, and the year the
          principal column overtakes the interest column. A 15-year loan reaches
          that crossover far earlier, which is the mechanical reason shorter
          loans build equity so quickly —{" "}
          <A href="/how-loan-amortization-works">the amortization guide</A> works
          through the full comparison.
        </P>
        <H3>Price the prepayment decision honestly</H3>
        <P>
          Extra payments produce a guaranteed return equal to your interest rate
          and are irreversible once made. That is a real trade against keeping the
          cash liquid, and it deserves to be made deliberately rather than as a
          reflex. Before committing, check three things:
        </P>
        <UL>
          <li>
            <strong>No prepayment penalty.</strong> Most fixed-rate instalment
            loans do not have one, but the minority that do can make
            overpayment counterproductive.
          </li>
          <li>
            <strong>An emergency fund in place first.</strong> Money paid to
            principal is hard to get back; money in a savings account is not.
          </li>
          <li>
            <strong>Whether forgiveness is in play.</strong> On a loan heading for
            an income-driven forgiveness, extra payments reduce what would have
            been forgiven and can return nothing at all.
          </li>
        </UL>
        <P>
          For a mortgage payment that includes tax and insurance rather than
          principal and interest alone, use the{" "}
          <A href="/mortgage-calculator">mortgage calculator</A>.
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

        <CalculatorFooter currentSlug="amortization-schedule" />
      </article>
    </main>
  );
}
