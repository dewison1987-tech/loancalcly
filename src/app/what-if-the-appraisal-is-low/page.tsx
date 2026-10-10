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
  Formula,
  H2,
  P,
  UL,
} from "@/components/Prose";

export const metadata: Metadata = pageMetadata({
  path: "/what-if-the-appraisal-is-low",
  title: "What If the Appraisal Comes In Low?",
  description:
    "A $405,000 appraisal on a $420,000 contract leaves a $13,500 cash gap — and that gap is LTV × the shortfall, so a smaller down payment costs more.",
  type: "article",
});

const PUBLISHED = "October 11, 2026";

/**
 * 全部数字由 src/lib/loan.ts 的 lowAppraisal 生成，并经 Python / Node 两套
 * 独立实现 + 站点内核三方逐位复算（175 个值逐字节一致）。
 *
 * 场景：合同价 $420,000，评估价 $405,000，首付 $42,000（LTV 90%），
 * 6.50% / 30 年，PMI 0.55%/年，定金 $8,400，已花检查与评估费 $950。
 *
 * ⚠️ 只建模一条放款规则：**LTV 按「合同价与评估价中较低的那个」计算**。
 * 合同里的评估条款、能否重谈价格、定金能否退回，都因合同而异 ——
 * 页面只把「有条款 / 无条款」两种情形的代价都列出来，不替读者判断哪一条适用。
 */

const PATHS = [
  [
    <strong key="a" className="text-gray-900">
      A — pay the gap in cash
    </strong>,
    "$420,000",
    "$364,500",
    "$55,500",
    <strong key="a2" className="text-gray-900">
      +$13,500
    </strong>,
    "$2,470.95",
  ],
  [
    <strong key="b" className="text-gray-900">
      B — renegotiate to $405,000
    </strong>,
    "$405,000",
    "$364,500",
    "$40,500",
    <strong key="b2" className="text-gray-900">
      −$1,500
    </strong>,
    "$2,470.95",
  ],
  [
    <strong key="c" className="text-gray-900">
      C — walk away
    </strong>,
    "—",
    "—",
    "—",
    "−$950",
    "—",
  ],
];

const LTV_ROWS = [
  ["5% down — $21,000", "95%", "$384,750", "$14,250", "$176.34"],
  [
    <strong key="a" className="text-gray-900">
      10% down — $42,000
    </strong>,
    <strong key="a2" className="text-gray-900">
      90%
    </strong>,
    <strong key="a3" className="text-gray-900">
      $364,500
    </strong>,
    <strong key="a4" className="text-gray-900">
      $14,250 → $13,500
    </strong>,
    "$167.06",
  ],
  ["20% down — $84,000", "80%", "$324,000", "$12,000", "$148.50"],
];

const RELIEF = [
  ["Principal and interest", "$2,389.22", "$2,303.89", "$85.33"],
  ["Mortgage insurance", "$173.25", "$167.06", "$6.19"],
  [
    <strong key="t" className="text-gray-900">
      Monthly total
    </strong>,
    <strong key="t2" className="text-gray-900">
      $2,562.47
    </strong>,
    <strong key="t3" className="text-gray-900">
      $2,470.95
    </strong>,
    <strong key="t4" className="text-gray-900">
      $91.52
    </strong>,
  ],
];

const FAQ = [
  {
    q: "Can a seller be forced to lower the price to the appraisal?",
    a: "No. An appraisal is evidence, not an instruction. What the appraisal changes is the maximum loan the lender will make against the property, so the practical effect is that the buyer has to fund the difference in cash or the two parties have to renegotiate. Whether either has an obligation to do so depends entirely on the contract, and on what contingencies it contains.",
  },
  {
    q: "What happens if I simply cannot cover the gap?",
    a: "The transaction does not close on the original terms. That is why the appraisal contingency matters more than most buyers realise at the point of signing: it is what converts a failed appraisal into a recoverable position rather than a lost deposit. Where it applies, a buyer can typically exit and recover the earnest money; where it does not, the deposit is at risk. The costs already incurred — the appraisal fee, inspection and any legal work — are not usually recoverable either way, which is the $950 shown here.",
  },
  {
    q: "Why is the gap LTV times the shortfall rather than the whole shortfall?",
    a: "Because the loan amount is a percentage of the lower of the two values, and the down payment is the rest of the contract price. Subtract the one from the other and the difference works out to the loan ratio applied to the price-to-appraisal gap. That is why a larger down payment produces a smaller cash gap: at 80% the lender is only financing four fifths of the difference between the two values.",
  },
  {
    q: "Does a low appraisal mean the house is overpriced?",
    a: "It means one appraiser, working for one lender and against one set of comparable sales, arrived at a lower figure on that day. Appraisals are opinions with a documented method rather than measurements, and they can differ between lenders and between months. The honest reading is that the price is not supported by that particular appraisal, which is a narrower statement than saying the price is wrong.",
  },
  {
    q: "Does the appraisal change what I should offer?",
    a: "It does not change the price, but it changes the cash the offer requires, which is a different number and often the binding one. A buyer who has $42,000 available for a down payment does not have $55,500 available merely because the appraisal came in low. Working out the cash requirement at the appraisal you actually expect — rather than the price you are offering — is a cheap piece of preparation for an expensive surprise.",
  },
];

export default function LowAppraisalGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="What If the Appraisal Comes In Low?"
        description="Why a low appraisal creates a cash gap rather than a smaller loan, why the gap is the loan ratio applied to the shortfall, and what each of the three ways out costs."
        path="/what-if-the-appraisal-is-low"
        siteUrl={SITE_URL}
        datePublished="2026-10-11"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          What if the appraisal comes in low?
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          A low appraisal is usually described as a problem between the buyer and
          the seller. Arithmetic-wise it is a problem between the buyer and the
          lender, and the mechanism is narrower than the description suggests. The
          lender does not lend against the price you agreed; it lends against{" "}
          <strong>the lower of that price and the appraised value</strong>. When
          those two numbers differ, the loan shrinks but the price does not, and
          the difference lands in cash.
        </P>
        <P>
          The example below is a <strong>$420,000</strong> contract with a{" "}
          <strong>$405,000</strong> appraisal and a 10% down payment. The gap is
          $15,000, but the cash you need is not $15,000 — it is{" "}
          <strong>$13,500</strong>, and the relationship between those two figures
          is the one worth understanding.
        </P>

        <H2>The rule that creates the gap</H2>
        <P>
          Everything follows from a single calculation. The loan is capped at the
          loan-to-value ratio applied to the lower value, so on a 10% down
          payment the ceiling is 90% of the appraised figure rather than 90% of
          the contract:
        </P>
        <Formula>
          90% × $405,000 = $364,500 maximum loan, against a $420,000 price
        </Formula>
        <P>
          That leaves <strong>$55,500</strong> to be found at closing, in
          comparison with the <strong>$42,000</strong> the plan assumed. The gap
          is <strong>$13,500</strong> — 32.14% of the down payment the buyer had
          arranged, arriving at the point when the money is least flexible.
        </P>

        <H2>Two ways to close it, and one way out</H2>
        <DataTable
          head={[
            "Route",
            "Purchase price",
            "Loan",
            "Cash at closing",
            "Against plan",
            "Monthly",
          ]}
          align={["l", "r", "r", "r", "r", "r"]}
          rows={PATHS}
          caption="6.50% over 30 years, mortgage insurance at 0.55% a year on the loan amount. Route C shows the costs already incurred; without an appraisal contingency the $8,400 deposit is also at risk, which would make the loss $9,350. Produced by our calculator and independently recomputed."
        />
        <P>
          Route B is the cheapest of the three by some distance: the price falls
          to the appraised figure, the loan and the monthly payment are identical
          to Route A, and the cash requirement <em>drops</em> by $1,500 because
          the down payment is a percentage of a smaller price. Route B is also
          the one that requires the other party’s agreement.
        </P>
        <Callout>
          <strong>The finding in one line:</strong> Route A and Route B produce
          the same loan and the same $2,470.95 monthly payment. The difference is
          entirely $13,500 of cash against a negotiation — and $13,500 is 32.14%
          of the down payment the buyer had already assembled.
        </Callout>

        <H2>The gap is the loan ratio times the shortfall</H2>
        <P>
          The number moves with the down payment, and in the direction that is
          easy to get backwards. Because the lender finances a fixed percentage
          of the shortfall, a smaller down payment means a <em>larger</em> cash
          gap:
        </P>
        <DataTable
          head={["Down payment", "Loan ratio", "Maximum loan", "Cash gap", "Monthly PMI"]}
          align={["l", "r", "r", "r", "r"]}
          rows={LTV_ROWS}
          caption="The same $420,000 contract against the same $405,000 appraisal, with only the down payment changed. Cash gap = loan ratio × the $15,000 shortfall. Put the other way round: the buyer contributes the rest of the price directly. Produced by our calculator and independently recomputed."
        />
        <P>
          Read the cash gap column against the ratio column. At 95% the lender is
          financing nineteen twentieths of the shortfall, so the buyer funds
          $14,250 of it. At 80% the lender’s share falls and the buyer’s gap falls
          with it, to <strong>$12,000</strong>. A buyer putting more down needs
          less extra cash, even though the loan itself is smaller and the monthly
          payment drops as well — which is why the monthly payment columns move
          the same way.
        </P>

        <H2>The cash is not lost, but the reserve is</H2>
        <P>
          It is important to be accurate about what Route A costs. The $13,500 is
          not a fee and it does not disappear; it becomes equity, and the loan is
          $13,500 smaller, so the monthly payment falls. What changes is where the
          money sits:
        </P>
        <DataTable
          head={["Monthly line", "As planned", "Route A", "Difference"]}
          align={["l", "r", "r", "r"]}
          rows={RELIEF}
          caption="The planned column assumes the appraisal had confirmed the $420,000 price. Route A leaves a $364,500 loan instead of a $378,000 one. Produced by our calculator and independently recomputed."
        />
        <P>
          The payment falls by <strong>$91.52</strong> a month, of which $85.33 is
          principal and interest and $6.19 is mortgage insurance, because a
          smaller loan carries a smaller insurance charge. Divide $13,500 by
          $91.52 and the cash takes 148 months to come back through the payment.
          That framing is misleading, because the money was never spent — but the
          reserve it came from is genuinely gone, and a reserve is the thing that
          absorbs the next problem.
        </P>

        <H2>What this arithmetic leaves out, on purpose</H2>
        <UL>
          <li>
            <strong>What your contract actually says.</strong> Whether a low
            appraisal lets you recover the deposit, renegotiate or walk away is
            decided by the contingencies in the agreement you signed. The $950
            and $9,350 figures above span that range rather than resolving it,
            because the document does the resolving.
          </li>
          <li>
            <strong>Whether the appraisal is right.</strong> The figure is one
            appraiser’s opinion on comparable sales at a point in time, produced
            for one lender. Sometimes it is defensible and the price is not;
            sometimes the comparables were poor. The arithmetic here treats the
            number as given, because that is how the loan decision treats it.
          </li>
          <li>
            <strong>Programme rules on maximum loan ratio.</strong> How far a
            lender will go above 80% is set by the programme, not by this page,
            which is why the table is presented as a range of routes rather than
            a recommended one. Where the ratio ceiling sits is in the loan
            paperwork.
          </li>
          <li>
            <strong>Fees you still pay if you walk.</strong> Appraisal and
            inspection fees are normally spent by the time the number arrives.
            Legal and other costs may be incurred too. The $950 used here is a
            single illustrative figure for that category, not a quote.
          </li>
        </UL>

        <H2>How to use this</H2>
        <UL>
          <li>
            <strong>Price the gap before you offer,</strong> not after the
            appraisal arrives. Take the loan ratio you are applying for and
            multiply it by the shortfall you could realistically face; that is
            the cash you would need. The{" "}
            <A href="/mortgage-calculator">mortgage calculator</A> prices the
            resulting payment.
          </li>
          <li>
            <strong>Check the cash against your reserve,</strong> not just against
            your closing balance.{" "}
            <A href="/how-much-down-payment-do-i-need">How much down payment you
            need</A> works through what a thinner reserve costs, and the numbers
            there are the reason the smallest down payment is not automatically
            the best one.
          </li>
          <li>
            <strong>Understand what the appraisal fee is part of.</strong> It sits
            on the closing statement alongside everything else, which{" "}
            <A href="/closing-costs-explained">closing costs explained</A> breaks
            into groups and marks as negotiable or not.
          </li>
          <li>
            <strong>If the appraisal does come in low,</strong> re-run the payment
            before deciding. A smaller loan is cheaper every month, so Route A is
            not simply a penalty — it is a different purchase with a different
            mortgage attached, and the{" "}
            <A href="/amortization-schedule">amortization schedule</A> shows how
            the two versions compare over time.
          </li>
        </UL>

        <H2>The short version</H2>
        <P>
          A $405,000 appraisal on a $420,000 contract with 10% down leaves a
          $364,500 maximum loan and a <strong>$13,500</strong> cash gap, because
          the gap is the loan ratio applied to the $15,000 shortfall rather than
          the shortfall itself. Renegotiating the price to $405,000 removes the
          gap entirely and reduces the cash requirement by $1,500. Walking away
          costs $950 in spent fees, or $9,350 if there is no appraisal contingency
          and the deposit goes with it. Paying the gap leaves a smaller loan and a
          payment $91.52 lower — the money is not lost, but the reserve it came
          from is, and that is the part no closing statement records.
        </P>

        <Faq items={FAQ} />

        <ArticleFooter currentSlug="what-if-the-appraisal-is-low" />
      </article>
    </main>
  );
}
