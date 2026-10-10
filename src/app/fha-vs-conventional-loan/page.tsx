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
  path: "/fha-vs-conventional-loan",
  title: "FHA vs Conventional Loan",
  description:
    "FHA's 3.5% down payment saves $5,250 at closing and raises the monthly payment by $72.95. Same-rate comparison on a $350,000 home.",
  type: "article",
});

const PUBLISHED = "October 3, 2026";

/**
 * 全部数字由 src/lib/loan.ts 生成（runAmortization / monthsToBalance），
 * 并经 Python / Node 两套独立实现 + 站点内核三方逐位复算。
 * 两种贷款**刻意使用同一个利率 6.50%** —— 让对比只反映产品结构，
 * 不掺进任何利率报价假设。
 */
const SIDE_BY_SIDE = [
  [
    "Down payment",
    "$12,250",
    "$17,500",
    "$70,000",
  ],
  [
    "Upfront mortgage insurance",
    <strong key="u" className="text-gray-900">
      $5,910.63
    </strong>,
    "—",
    "—",
  ],
  ["Amount borrowed", "$343,660.63", "$332,500", "$280,000"],
  ["Monthly principal and interest", "$2,172.17", "$2,101.63", "$1,769.79"],
  ["Monthly mortgage insurance", "$154.80", "$152.40", "none"],
  [
    <strong key="t" className="text-gray-900">
      Total monthly
    </strong>,
    <strong key="t1" className="text-gray-900">
      $2,326.97
    </strong>,
    "$2,254.02",
    "$1,769.79",
  ],
  ["Insurance runs until", "see below", "month 124", "—"],
  ["Interest over 30 years", "$438,320", "$424,085", "$357,125"],
];

const GAP_PARTS = [
  ["Because the loan is $11,160.63 larger", "$70.54"],
  ["Because the monthly insurance is higher", "$2.41"],
  [
    <strong key="s" className="text-gray-900">
      Total monthly gap
    </strong>,
    <strong key="s2" className="text-gray-900">
      $72.95
    </strong>,
  ],
];

const TEN_YEAR = [
  ["FHA, 3.5% down", "$279,236.52", "$12,250"],
  ["Conventional, 5% down", "$270,482.64", "$17,500"],
  [
    <strong key="d" className="text-gray-900">
      Difference
    </strong>,
    <strong key="d2" className="text-gray-900">
      +$8,753.88
    </strong>,
    "−$5,250",
  ],
];

const FAQ = [
  {
    q: "Is an FHA loan cheaper than a conventional loan?",
    a: "Not on this comparison. At the same 6.50% rate on a $350,000 home, FHA needs $5,250 less at closing but costs $72.95 more every month and $14,235 more in interest over thirty years. Over ten years the FHA route takes $8,753.88 more out of your account; netting off the smaller down payment still leaves it $3,503.88 worse off. What FHA genuinely offers is a route to approval, not a lower price.",
  },
  {
    q: "Why is the FHA payment higher when the down payment is smaller?",
    a: "Because the upfront mortgage insurance premium is added to the loan. On this home the 1.75% upfront premium is $5,910.63, none of which is paid in cash, so the FHA loan is $343,660.63 against $332,500 conventional. That $11,160.63 of extra borrowing costs $70.54 a month on its own. The remaining $2.41 of the gap is the difference between the two monthly insurance charges.",
  },
  {
    q: "Does the mortgage insurance ever go away?",
    a: "On the conventional side, yes: on a $332,500 loan at 6.50% the balance crosses 80% of the home value in month 124, and the $152.40 charge stops, having cost $18,897.08 in total. On the FHA side the annual premium generally lasts considerably longer, and how long depends on the loan-to-value ratio at origination and on HUD's current rules, which have changed more than once. Check the HUD handbook and your loan documents rather than relying on a rule of thumb.",
  },
  {
    q: "How long does it take before the smaller down payment stops paying?",
    a: "Divide the cash you save at closing by the extra you pay each month. Here that is $5,250 divided by $72.95, which is 71.97 months — a little under six years. After that the saving has been given back, and every further month is a cost. If you expect to sell or refinance before then, the calculation changes; if you expect to keep the loan for thirty years, it does not.",
  },
  {
    q: "Should I put 20% down instead and avoid mortgage insurance?",
    a: "It makes the loan cheaper per month, and it needs a lot more cash. On this home 20% down means $70,000 rather than $12,250 — $57,750 more — and brings the monthly payment down to $1,769.79, which is $557.18 below the FHA route. Whether that is available and whether it is the best use of the cash are two separate questions, and both are answered by your own balance sheet rather than by a general rule.",
  },
];

export default function FhaVsConventionalLoanGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="FHA vs Conventional Loan"
        description="A same-rate comparison of FHA and conventional financing on a $350,000 home, showing where the monthly gap comes from, how long the smaller down payment takes to give back, and what the insurance duration really costs."
        path="/fha-vs-conventional-loan"
        siteUrl={SITE_URL}
        datePublished="2026-10-03"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          FHA vs conventional loan
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          The case for an FHA loan is usually made in one number: 3.5% down.
          Conventional financing typically wants more, and the difference is
          real cash at closing. What that framing leaves out is the monthly
          arithmetic, and on a same-rate comparison the FHA loan turns out to be
          the more expensive one to carry — by a margin that is easy to measure.
        </P>
        <P>
          Below, a $350,000 home financed two ways.{" "}
          <strong>Both loans are priced at the same 6.50%</strong> so that the
          comparison isolates the structure of each product rather than a
          rate quote, and both run 30 years.
        </P>

        <H2>Side by side</H2>
        <DataTable
          head={["", "FHA, 3.5% down", "Conventional, 5% down", "Conventional, 20% down"]}
          align={["l", "r", "r", "r"]}
          rows={SIDE_BY_SIDE}
          caption="All three at 6.50% over 30 years on a $350,000 home. The FHA upfront premium of 1.75% is financed into the loan; the annual premium and the conventional PMI are both shown at 0.55% a year, an illustrative figure — actual pricing varies with the lender, the credit profile and the insurer. Produced by our calculator and independently recomputed."
        />
        <P>
          The first row and the last row are the point. FHA needs{" "}
          <strong>$5,250 less</strong> at closing and charges{" "}
          <strong>$72.95 more every month</strong>. Over thirty years the FHA
          route pays <strong>$14,235 more interest</strong> on a loan that
          started smaller in cash terms but ended up larger in debt.
        </P>
        <Callout>
          <strong>The counter-intuitive part:</strong> the smaller down payment
          does not reduce the monthly payment — it raises it. Putting less money
          in means borrowing more, and the FHA structure borrows more twice
          over: once for the smaller down payment, and again for an insurance
          premium that is financed rather than paid.
        </Callout>

        <H2>Where the $72.95 comes from</H2>
        <P>
          The gap is not one thing. It splits cleanly into two, and seeing the
          split tells you which part is negotiable and which is not:
        </P>
        <DataTable
          head={["Cause", "Monthly effect"]}
          align={["l", "r"]}
          rows={GAP_PARTS}
          caption="Same 6.50% rate and 30-year term on both loans, so the entire payment difference is explained by the loan amount and the insurance charge. Produced by our calculator and independently recomputed."
        />
        <P>
          Almost all of it is the financed premium. The FHA loan is{" "}
          <strong>$11,160.63</strong> larger than the conventional one — the
          difference between a $12,250 down payment and a $17,500 one, plus
          $5,910.63 of upfront insurance added to the balance — and every dollar
          of that is charged 6.50% for thirty years.
        </P>
        <P>
          The monthly insurance itself is not the problem: $154.80 on the FHA
          side against $152.40 on the conventional side — a difference of $2.41
          a month, taken from the unrounded figures so that the two parts add
          back to the $72.95 total. The two products are priced almost
          identically per month. What separates them is how long each one runs.
        </P>

        <H2>The insurance looks the same — the duration does not</H2>
        <P>
          On the conventional loan, the balance crosses{" "}
          <strong>80% of the home value in month 124</strong>. At that point the
          $152.40 monthly charge stops, having cost $18,897.08 in total over
          those ten years and four months:
        </P>
        <UL>
          <li>
            <strong>Conventional PMI:</strong> tied to the loan-to-value ratio,
            so it ends when the balance falls far enough — by scheduled
            payments, by extra payments, or by an increase in the appraised
            value. On this loan that is month 124, and{" "}
            <A href="/how-to-remove-pmi">the mechanics have their own guide</A>.
          </li>
          <li>
            <strong>FHA annual premium:</strong> generally lasts substantially
            longer.{" "}
            <strong>
              How long depends on the loan-to-value ratio at origination and on
              HUD&apos;s current rules, which have been changed more than once
            </strong>{" "}
            — so treat any fixed number you read as needing verification
            against the HUD handbook and your own loan documents.
          </li>
        </UL>
        <P>
          To size the asymmetric part without pretending to know the rule: if
          the FHA annual premium ran for eleven years, it would total{" "}
          <strong>$20,433.88</strong>, which is $1,537 more than the
          conventional charge over its whole life — and it would still be
          running while the conventional borrower was paying nothing.
        </P>

        <H2>How long the smaller down payment lasts</H2>
        <P>
          The cash saved at closing is not free money; it is money you will pay
          back through the monthly difference. Divide one by the other and you
          get the period over which the upfront saving is consumed:
        </P>
        <P>
          <strong>$5,250 ÷ $72.95 = 71.97 months</strong> — a little under six
          years. Before that point, the FHA route has genuinely left you better
          off in cash terms. After it, the saving has been repaid and each
          further month costs you $72.95. Over a full thirty-year term there are
          a further 288 such months.
        </P>
        <P>
          The ten-year view puts both effects in one place:
        </P>
        <DataTable
          head={["Over 120 months", "Cash out of pocket", "Cash at closing"]}
          align={["l", "r", "r"]}
          rows={TEN_YEAR}
          caption="Monthly principal, interest and mortgage insurance only, for the period both loans are charging insurance. Produced by our calculator and independently recomputed."
        />
        <P>
          Paying $8,753.88 more over ten years to save $5,250 at closing is a
          net cost of <strong>$3,503.88</strong> — before counting the extra
          interest still owed on the larger balance.
        </P>

        <H2>The third option nobody compares</H2>
        <P>
          The cheapest column in the table above is not either of the ones
          people usually weigh against each other. At 20% down the payment is{" "}
          <strong>$1,769.79</strong> with no mortgage insurance at all — $557.18
          a month below the FHA route and $484.23 below the 5% conventional. The
          trade is <strong>$57,750</strong> more cash up front, and whether that
          cash exists, and whether tying it up in a house is the best use for
          it, are questions about your own position rather than about the loan.
        </P>
        <P>
          If the cash is close to available, it is worth pricing all three
          rather than assuming the choice is between the first two. If it is
          not, the{" "}
          <A href="/home-affordability-calculator">
            home affordability calculator
          </A>{" "}
          works the constraint from the income side instead, which is usually
          the binding one.
        </P>

        <H2>What FHA is actually for</H2>
        <P>
          None of the above makes FHA a bad product. It makes it a{" "}
          <em>differently-priced</em> product, and the price buys access rather
          than a discount:
        </P>
        <UL>
          <li>
            <strong>A lower credit-score floor.</strong> Conventional pricing and
            eligibility both depend on the score; the FHA programme accepts
            profiles that conventional underwriting does not, which is the
            entire reason it exists.
          </li>
          <li>
            <strong>A smaller minimum down payment</strong>, with the down
            payment itself allowed to come from a gift or a grant in cases where
            a conventional loan would require it to be your own funds.
          </li>
          <li>
            <strong>More tolerance in the debt-to-income calculation</strong>,
            which matters if you are near the{" "}
            <A href="/debt-to-income-ratio">ratio ceiling</A> rather than near
            the cash limit.
          </li>
        </UL>
        <P>
          For a borrower who can qualify conventionally, the arithmetic above is
          the one that applies. For a borrower who cannot, the comparison is not
          between two prices — it is between a loan and no loan, and in that
          case the higher monthly cost is the cost of the access.
        </P>
        <P>
          One more honesty note: in practice FHA rates are often quoted slightly
          below conventional ones, which narrows the gap computed here. The
          reason this comparison holds the rate identical is that a rate quote
          is the product of a particular day, a particular lender and a
          particular credit profile, whereas the structural differences — the
          financed premium and the insurance duration — are the same for
          everyone.
        </P>
        <P>
          To price your own case, the{" "}
          <A href="/mortgage-calculator">mortgage calculator</A> handles the
          tax, insurance and premium lines together,{" "}
          <A href="/closing-costs-explained">closing costs explained</A> covers
          what has to be paid in cash at the table, and{" "}
          <A href="/how-much-house-can-i-afford">how much house can I afford</A>{" "}
          starts from the budget instead of the price.
        </P>

        <H2>The short version</H2>
        <P>
          FHA&apos;s 3.5% down payment saves $5,250 at closing on a $350,000
          home and costs $72.95 more every month. Most of that is the financed
          upfront premium making the loan $11,160.63 larger; the monthly
          insurance charges themselves are nearly identical. The upfront saving
          is used up after 71.97 months, and the conventional side&apos;s
          insurance ends at month 124 while the FHA side&apos;s generally does
          not. If you can qualify for conventional financing, the smaller down
          payment is a more expensive loan, not a cheaper one.
        </P>

        <Faq items={FAQ} />

        <ArticleFooter currentSlug="fha-vs-conventional-loan" />
      </article>
    </main>
  );
}
