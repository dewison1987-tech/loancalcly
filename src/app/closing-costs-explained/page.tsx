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
  path: "/closing-costs-explained",
  title: "Closing Costs Explained: What You Actually Pay",
  description:
    "One point costs $3,000 on a $300,000 loan and saves $49.05 a month, a 61-month break-even. What is on the closing bill and when buying the rate down is wrong.",
  type: "article",
});

const PUBLISHED = "September 26, 2026";

/**
 * 全部数字由 src/lib/loan.ts 的 calculateLoan 生成，并经 Python / Node
 * 两套独立实现逐位复算。贷款额固定 $300,000、30 年。
 * 点数与利率的对应（1 点 = 0.25%）是 illustrative 的线性定价假设 ——
 * 真实市场的点数价格随贷款人、时点与贷款规模变化。
 */
const GROUPS = [
  [
    "Lender fees",
    "Origination, underwriting, processing, application, discount points",
    "The lender, for making and servicing the loan",
  ],
  [
    "Third-party fees",
    "Appraisal, title search, title insurance, survey, flood certification, recording",
    "Independent providers, some chosen by you and some required by the lender",
  ],
  [
    "Prepaids and escrow",
    "Property tax and insurance collected in advance, per-diem interest, escrow funding at closing",
    "Nobody — these are your own future costs, collected early",
  ],
];

const NEGOTIABLE = [
  [
    "Usually negotiable",
    "Origination and lender fees, discount points, the rate itself, and title insurance where you are allowed to shop for the provider.",
  ],
  [
    "Sometimes negotiable",
    "Appraisal and other third-party fees, where the lender will let you select the provider; the timing and split of escrow funding.",
  ],
  [
    "Not negotiable",
    "Government recording and transfer taxes, prepaid interest calculated to the day, and prepaid property tax and insurance — these are your own costs arriving early, not charges anyone can waive.",
  ],
];

const RATES = [
  ["6.50%", "$1,896.20", "$382,633", "No points"],
  ["6.25%", "$1,847.15", "$364,975", "1 point — $3,000"],
  ["6.00%", "$1,798.65", "$347,515", "2 points — $6,000"],
];

const POINTS = [
  ["1 point — $3,000", "$49.05", "61 months", "$17,659"],
  ["2 points — $6,000", "$97.55", "62 months", "$35,119"],
];

const FAQ = [
  {
    q: "How much are closing costs on a $300,000 loan?",
    a: "There is no single number, because the bill is assembled from the lender&apos;s fees, third-party services and your own prepaid tax and insurance. What is worth knowing is that the largest single line is often a prepaid rather than a fee — money you would have spent anyway, collected early. Compare the fee portion on a like-for-like basis across lenders, and treat the total as a cash-flow question rather than a price.",
  },
  {
    q: "Is it worth buying discount points?",
    a: "It depends on one number: whether you will still have the loan when the break-even arrives. On a $300,000 loan, one point costs $3,000 and saves $49.05 a month, so the break-even is 61 months — a bit over five years. If you sell or refinance before then, the points are a loss rather than a saving, and the loss is exactly the difference between what you paid and what you recovered.",
  },
  {
    q: "Why is the break-even almost the same for one point and two points?",
    a: "Because the pricing is close to linear in this example: each point buys about 0.25% off the rate, so doubling the points doubles both the cost and the monthly saving, and a ratio with the same numerator and denominator twice over stays the same. The break-even is 61 months for one point and 62 for two. What does change is the size of the bet — $6,000 at risk instead of $3,000 — and the amount you lose if you move earlier than expected.",
  },
  {
    q: "Can the seller pay my closing costs?",
    a: "Often yes, as a credit negotiated into the price, and it is worth asking because it converts a cash requirement at closing into a slightly higher loan. The trade-off is that a seller who pays costs usually expects a higher price, so the credit is not free — it is financed. The amount of seller credit allowed is limited by the loan programme and by the loan-to-value ratio, so the ceiling varies.",
  },
  {
    q: "Should I roll closing costs into the loan?",
    a: "It lowers the cash you need today and raises the amount you borrow and the interest you pay on it, so the same $6,000 financed at 6.50% over 30 years costs far more than $6,000 in total. Whether that is a bad trade depends on what the cash would otherwise do and how thin your reserve would be without it — the answer is usually that financing the costs is reasonable only when the alternative is having no reserve at all.",
  },
];

export default function ClosingCostsExplainedGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="Closing Costs Explained: What You Actually Pay"
        description="The three groups on a closing bill, what can be negotiated and what cannot, and the arithmetic of discount points — including why buying twice as many points barely changes the break-even month."
        path="/closing-costs-explained"
        siteUrl={SITE_URL}
        datePublished="2026-09-26"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Closing costs explained
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          The down payment is the number everyone saves for, and closing costs
          are the number that ambushes them. They arrive at the same moment, on
          the same day, and they are not small — but they are also not a single
          kind of thing. Some are fees you can argue about, some are services
          with a market price, and some are not costs at all in the ordinary
          sense, just your own future bills collected early.
        </P>
        <P>
          Separating those three groups is most of what makes the bill
          manageable, so this guide starts there before getting to the one part
          with real arithmetic in it: buying the rate down.
        </P>

        <H2>Three groups, three different conversations</H2>
        <DataTable
          head={["Group", "Typical items", "Who is being paid"]}
          align={["l", "l", "l"]}
          rows={GROUPS}
          caption="Representative composition. Which items appear on your bill depends on the loan programme, the state and the lender."
        />
        <P>
          The third group is the one people misread. Prepaid property tax and
          insurance, and the initial escrow funding, are not fees charged for
          doing something — they are money you would have paid over the next
          twelve months, demanded early. They still have to be found in cash, and
          they still belong on the same page of your budget, but they are not
          part of what you are being charged for the loan. When you compare
          offers, compare the first two groups.
        </P>
        <P>
          The commonly quoted range for the whole bill — a few percent of the
          loan — is a useful planning figure and a poor comparison tool, because
          it mixes all three groups together and the mix shifts with the state,
          the time of year and the loan programme. Two lenders quoting the same
          percentage can be charging very different amounts.
        </P>

        <H2>What can be negotiated and what cannot</H2>
        <DataTable
          head={["Category", "Items"]}
          align={["l", "l"]}
          rows={NEGOTIABLE}
          caption="General orientation. State rules and programme guidance determine the details — in some states title insurance pricing is regulated, for example."
        />
        <P>
          The practical consequence: the group worth spending an afternoon on is
          the lender fees, and the largest lever inside it is usually the rate
          and the points, because those are the numbers that change what you pay
          every month rather than once. Everything else is a one-off argument
          about a few hundred dollars.
        </P>

        <H2>Buying the rate down</H2>
        <P>
          A discount point is a fee paid at closing in exchange for a lower rate.
          On a $300,000 loan, one point is $3,000 — 1% of the loan — and the
          mechanics are simple once you hold the loan amount and term fixed:
        </P>
        <DataTable
          head={["Rate", "Monthly payment", "Total interest", "What it costs to get there"]}
          align={["r", "r", "r", "l"]}
          rows={RATES}
          caption="$300,000 over 30 years. Produced by our calculator and independently recomputed. The 1 point = 0.25% mapping is illustrative; real pricing moves with the lender and the market."
        />
        <P>
          Now the part that decides whether points are worth it — how long the
          monthly saving takes to repay the upfront cost:
        </P>
        <DataTable
          head={["Cost", "Monthly saving", "Break-even", "Interest saved over the full term"]}
          align={["l", "r", "r", "r"]}
          rows={POINTS}
          caption="Break-even is the upfront cost divided by the monthly saving, measured from the first payment. Figures rounded to the nearest month and dollar."
        />
        <Callout>
          <strong>Look at the two break-even figures.</strong> One point breaks
          even in 61 months and two points in 62 — effectively the same number.
          The reason is that the pricing here is close to linear: each point buys
          roughly a quarter of a percent, so doubling the cost roughly doubles the
          monthly saving, and the ratio is unchanged. <strong>Buying more points
          does not make the decision more likely to pay off; it makes the same bet
          larger.</strong>
        </Callout>

        <H2>What that means in practice</H2>
        <P>
          Since the break-even month barely moves, the question is not how many
          points to buy but whether you will still be holding this loan in about
          five years. Three situations where the answer is no, and points are
          therefore a loss:
        </P>
        <UL>
          <li>
            <strong>You expect to move within the window.</strong> Selling means
            repaying the loan, and the unearned portion of the points does not
            come back. The loss is exactly what you paid minus the monthly savings
            you collected while you had the loan — nothing more, nothing less.
          </li>
          <li>
            <strong>You expect to refinance.</strong> Refinancing also repays the
            loan, so paid points are stranded the same way. If the rate outlook is
            the reason you are considering a refinance at all, paying to lower a
            rate you intend to replace is working against your own plan. See{" "}
            <A href="/refinance-break-even-point">the refinance break-even guide</A>{" "}
            for how that arithmetic runs.
          </li>
          <li>
            <strong>The cash is your reserve.</strong> The comparison above
            assumes the $3,000 was available. If paying it leaves you with nothing
            after closing, you have bought a lower payment with the ability to
            survive a bad month — a bad exchange, and one that a lender will also
            treat as a risk.
          </li>
        </UL>
        <P>
          The reverse case is straightforward: if you are confident you will hold
          the loan well past the break-even, the points are a real, quantifiable
          saving, and the full-term column shows how large it gets — $17,659 of
          interest removed for $3,000, on this example.
        </P>

        <H2>Seller credits: the same trade, financed</H2>
        <P>
          A seller credit pays some of your closing costs as part of the
          negotiation. It is attractive because it turns a cash requirement into a
          slightly larger loan, which matters a great deal to a buyer who has the
          income but not the savings.
        </P>
        <P>
          It is not free. A seller who agrees to cover costs generally expects a
          higher price to compensate, so the credit is usually financed rather
          than given — you borrow the closing costs and pay interest on them for
          thirty years. The programme also caps how much credit is allowed, and
          the cap depends on the loan type and the loan-to-value ratio. Worth
          asking about, worth modelling, and worth checking against the alternative
          of negotiating the price down instead.
        </P>

        <H2>How to compare two offers properly</H2>
        <P>
          Three steps, in this order:
        </P>
        <UL>
          <li>
            <strong>Isolate the lender fees.</strong> Ignore the prepaids and the
            third-party services you will pay either way. What is left is the one
            part that is genuinely different between offers.
          </li>
          <li>
            <strong>Compare rate and points together, not separately.</strong> A
            lower rate with more points is not a better offer on its face — it is
            the same offer with more prepaid. Convert each into a break-even month
            and compare those.
          </li>
          <li>
            <strong>Then apply your own horizon.</strong> The break-even is only
            meaningful against how long you expect to hold the loan. Five years
            is the figure on this example; yours is a fact about your life rather
            than about the loan.
          </li>
        </UL>
        <P>
          To see what a given rate costs monthly before points enter the picture,{" "}
          <A href="/mortgage-calculator">the mortgage calculator</A> shows the
          full monthly figure including tax, insurance and mortgage insurance, and{" "}
          <A href="/how-to-compare-loan-offers">how to compare loan offers</A>{" "}
          covers the wider question of which numbers to put side by side.
        </P>

        <H2>The short version</H2>
        <P>
          Closing costs are three different things wearing one label: negotiable
          lender fees, market-priced third-party services, and your own prepaid
          tax and insurance. Only the first group is worth arguing over, and the
          largest lever inside it is the rate. Points break even in about 61
          months on a $300,000 loan at these assumptions, and the number barely
          changes whether you buy one point or two — so the decision is about your
          horizon, not about the quantity. Buy them if you are staying put; skip
          them if the cash is your reserve or the loan is temporary.
        </P>

        <Faq items={FAQ} />

        <ArticleFooter currentSlug="closing-costs-explained" />
      </article>
    </main>
  );
}
