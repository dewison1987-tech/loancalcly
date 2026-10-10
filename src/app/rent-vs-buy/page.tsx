import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import {
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
  path: "/rent-vs-buy",
  title: "Rent vs Buy: the Break-Even Year",
  description:
    "On a $420,000 home against $2,300 rent, buying is $38,538 more expensive in year one and does not break even until year 11.",
  type: "article",
});

const PUBLISHED = "October 3, 2026";

/**
 * 全部数字由 src/lib/loan.ts 的 rentVsBuy() 生成，
 * 并经 Python / Node 两套独立实现 + 站点内核三方逐位复算。
 */
const YEARS = [
  ["1", "−$38,538"],
  ["2", "−$36,750"],
  ["3", "−$34,501"],
  ["4", "−$31,753"],
  ["5", "−$28,468"],
  ["6", "−$24,603"],
  ["7", "−$20,113"],
  ["8", "−$14,951"],
  ["9", "−$9,065"],
  ["10", "−$2,402"],
  [
    <strong key="y11" className="text-gray-900">
      11
    </strong>,
    <strong key="y11v" className="text-gray-900">
      +$5,097
    </strong>,
  ],
  ["12", "+$13,494"],
  ["13", "+$22,853"],
  ["14", "+$33,245"],
  ["15", "+$44,744"],
];

const BUY_COSTS = [
  ["Buying costs at the start (2.50%)", "$10,500"],
  ["Selling costs at the end (7.00%)", "$45,804"],
  ["Mortgage interest over 15 years", "$326,333"],
  ["Property tax", "$85,927"],
  ["Home insurance", "$33,478"],
  ["Maintenance and repairs (1.00% a year)", "$78,115"],
  [
    <strong key="t" className="text-gray-900">
      Total cost of owning
    </strong>,
    <strong key="t2" className="text-gray-900">
      $580,157
    </strong>,
  ],
  ["Less: the home is worth more", "−$234,346"],
  [
    <strong key="n" className="text-gray-900">
      Net cost of buying
    </strong>,
    <strong key="n2" className="text-gray-900">
      $345,811
    </strong>,
  ],
];

const SENSITIVITY = [
  ["0.00%", "−$173,198", "never"],
  ["1.00%", "−$110,324", "never"],
  ["2.00%", "−$38,102", "never"],
  [
    <strong key="a3" className="text-gray-900">
      3.00%
    </strong>,
    <strong key="a3v" className="text-gray-900">
      +$44,744
    </strong>,
    <strong key="a3b" className="text-gray-900">
      year 11
    </strong>,
  ],
  ["4.00%", "+$139,650", "year 6"],
  ["5.00%", "+$248,231", "year 4"],
];

const FAQ = [
  {
    q: "How many years does it take for buying to beat renting?",
    a: "In this model, eleven. On a $420,000 home with 10% down, against rent of $2,300 a month, buying costs $38,538 more than renting in the first year and is still $2,402 behind at the end of year ten. It crosses over in year 11 and is $44,744 ahead by year 15. The reason the break-even is that late is that transaction costs are paid up front, while the benefit accumulates month by month.",
  },
  {
    q: "Why is the first year so much more expensive?",
    a: "Two reasons, and the first is larger. Buying costs 2.50% of the price at the start and 7.00% at the end, so a round trip through a $420,000 house costs $56,304 before you have paid a single month of interest. Second, in the early years almost the whole payment is interest: over fifteen years this loan pays $326,333 of interest against $103,726 of principal, and the split is at its worst in the first years.",
  },
  {
    q: "Does the answer depend on house prices rising?",
    a: "Almost entirely, and that is the honest problem with the question. At 3.00% a year appreciation, buying ends up $44,744 ahead after fifteen years. At 2.00% it never catches up within fifteen years and finishes $38,102 behind. At 5.00% it breaks even by year four. Nobody can forecast this, so the useful output is not one number but the range: buying only wins here if appreciation stays above about 2.5% a year for the whole period.",
  },
  {
    q: "What does the comparison assume about the renter?",
    a: "That the difference in monthly cost is invested rather than spent. Owning costs $3,274.22 a month on this home against $2,300 in rent, so the model credits the renter with investing $974.22 a month at the same 5.00% return, and that assumption is worth $114,250 of contributions and $122,775 of investment gains over fifteen years. Drop it, and buying looks far better than the table above — which is exactly why it is stated rather than buried.",
  },
  {
    q: "Is the break-even the right way to decide?",
    a: "It answers the money question, not the whole question. If you expect to move within seven years, the arithmetic above already says renting is cheaper, and the case is stronger than the table suggests because it does not price the cost of a forced sale. If you expect to stay for twenty years, the arithmetic favours buying, but it does so through an appreciation assumption you cannot verify in advance. What the model cannot price is the part people usually decide on: control of the property, and the freedom to leave.",
  },
];

export default function RentVsBuyGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="Rent vs Buy: the Break-Even Year"
        description="A full cash-flow comparison of renting and buying a $420,000 home, the year the two cross over, what drives it, and how much the conclusion depends on an appreciation rate nobody can forecast."
        path="/rent-vs-buy"
        siteUrl={SITE_URL}
        datePublished="2026-10-03"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Rent vs buy: the break-even year
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          Rent versus buy is usually argued as a preference. It is not: it is a
          cash-flow comparison with one genuinely unknowable input, and the part
          that can be calculated is larger than most people assume. The useful
          output is not &ldquo;which is cheaper&rdquo; but{" "}
          <strong>how long you have to stay for buying to have been the cheaper
          choice</strong>.
        </P>
        <P>
          The example below is one house and one rent, carried through fifteen
          years month by month: a $420,000 home with 10% down at 6.50% over 30
          years, against renting the equivalent place for $2,300 a month. Every
          figure comes from the model described in this section, and the model
          is stated in full so you can disagree with a specific assumption
          rather than with the conclusion.
        </P>

        <H2>What the model assumes</H2>
        <P>
          Six assumptions do most of the work. All are inputs you can change in
          the calculator; none are facts.
        </P>
        <UL>
          <li>
            <strong>Rate 6.50%, term 30 years</strong> on a $378,000 loan. The
            monthly principal and interest is{" "}
            <strong>$2,389.22</strong>, fixed for the whole period.
          </li>
          <li>
            <strong>Property tax 1.10% a year</strong> of the purchase price,
            home insurance $1,800 a year, no HOA, and{" "}
            <strong>maintenance at 1.00% a year</strong> — the roof, the boiler,
            the things a landlord would otherwise pay for.
          </li>
          <li>
            <strong>Buying costs 2.50%</strong> of the price and{" "}
            <strong>selling costs 7.00%</strong> of the sale price.
          </li>
          <li>
            <strong>Home prices rise 3.00% a year</strong>, and{" "}
            <strong>rent rises 3.00% a year</strong>.
          </li>
          <li>
            <strong>The money you do not put into a house earns 5.00% a
            year.</strong> For the buyer that is nothing, since the cash is in
            the property. For the renter it is the whole point.
          </li>
          <li>
            <strong>A single inflation rate</strong> applies to rent, property
            tax, insurance, HOA and maintenance. Holding the owner&apos;s costs
            flat while rents rise — a common shortcut — tilts the answer toward
            buying for no good reason. The fixed mortgage payment is already a
            real advantage against rising rent; nothing extra is added.
          </li>
        </UL>
        <Callout>
          <strong>The assumption doing the most work is not the mortgage rate.</strong>{" "}
          It is the 3.00% appreciation rate, and it is the one input in this
          model that nobody can forecast. The sensitivity table further down
          shows what happens when it is wrong, which is the most important
          table on the page.
        </Callout>

        <H2>Fifteen years, month by month</H2>
        <P>
          Owning this home costs <strong>$3,274.22</strong> a month at the
          start, against <strong>$2,300</strong> in rent. The renter is therefore
          $974.22 a month better off in cash, and the model gives the renter
          credit for investing it. Both sides are then compared on the same
          basis — money out, minus what is still there at the end:
        </P>
        <DataTable
          head={["Over 15 years", "Buying", "Renting"]}
          align={["l", "r", "r"]}
          rows={[
            ["Paid out over the period", "$680,080", "$513,330"],
            ["Invested at the start", "—", "$52,500"],
            ["Still there at the end", "$334,269", "$289,525"],
            [
              <strong key="n" className="text-gray-900">
                Net cost
              </strong>,
              <strong key="n1" className="text-gray-900">
                $345,811
              </strong>,
              <strong key="n2" className="text-gray-900">
                $390,555
              </strong>,
            ],
          ]}
          caption="Buying includes the $52,500 paid at closing and every subsequent payment; what is still there is the sale proceeds after selling costs and repaying the mortgage. Renting includes the $52,500 invested instead, plus $974.22 a month as the cost difference, at 5.00%. Produced by our calculator and independently recomputed."
        />
        <P>
          After fifteen years, buying is <strong>$44,744</strong> ahead. That is
          a real number, and it is much smaller than the gap a mortgage rate
          comparison would suggest, because the renter&apos;s portfolio ends up
          worth <strong>$289,525</strong> — $114,250 of contributions and
          $122,775 of investment gains on money that never went near a house.
        </P>

        <H2>The break-even is year 11</H2>
        <P>
          The single number that answers the practical question is the year the
          two paths cross. Below, positive means buying has become the cheaper
          option up to that point:
        </P>
        <DataTable
          head={["Year", "Buying is ahead by"]}
          align={["l", "r"]}
          rows={YEARS}
          caption="Cumulative difference over the whole holding period, in favour of buying when positive. Produced by our calculator and independently recomputed."
        />
        <P>
          Seven years of losses, then a crossing in year 11. The first year
          alone costs <strong>$38,538</strong> relative to renting — more than a
          tenth of the purchase price, gone before any equity exists worth
          speaking of. Anyone who buys expecting to be better off within two or
          three years is working from a model that does not include transaction
          costs.
        </P>

        <H2>What actually drives it</H2>
        <P>
          The buying side can be written as a single sum, which is also how the
          calculator checks itself: transaction costs at both ends, plus
          interest, plus the costs of holding the property, minus the
          appreciation.
        </P>
        <DataTable
          head={["The cost of owning, over 15 years", "Amount"]}
          align={["l", "r"]}
          rows={BUY_COSTS}
          caption="The same total is reached two ways — by summing the month-by-month cash flows, and by the closed form shown here. Both agree to the cent, which is one of the checks run before publication. Produced by our calculator and independently recomputed."
        />
        <P>
          Two lines dominate. The first is <strong>$56,304</strong> of round-trip
          transaction costs — $10,500 to get in and $45,804 to get out — which
          is money that buys nothing and is why the early years are so
          expensive. The second is interest: <strong>$326,333</strong> against
          only <strong>$103,726</strong> of principal repaid in fifteen years.
          On a $378,000 loan, fifteen years of payments clears a little over a
          quarter of it.
        </P>
        <P>
          The rent side is simpler: <strong>$513,330</strong> of rent over
          fifteen years, rising with inflation, offset by{" "}
          <strong>$122,775</strong> of investment gains. Renting is not cheap;
          it is simply cheaper per month, and the difference is what the renter
          keeps.
        </P>

        <H2>The assumption that decides everything</H2>
        <P>
          Hold everything else fixed and vary only the annual rate of home price
          growth. The same fifteen years, the same house, the same rent:
        </P>
        <DataTable
          head={["Home prices grow at", "Buying ahead by (year 15)", "Break-even"]}
          align={["l", "r", "r"]}
          rows={SENSITIVITY}
          caption="All other inputs unchanged. Produced by our calculator and independently recomputed."
        />
        <P>
          This is the honest core of the rent-versus-buy question. Across a two
          percentage point range — 1% to 3% a year, both entirely plausible for
          the same city over the same decade — the answer moves from{" "}
          <strong>&ldquo;buying never catches up&rdquo;</strong> to{" "}
          <strong>&ldquo;buying is $44,744 ahead&rdquo;</strong>. Below roughly
          2.5% annual appreciation, buying loses on a fifteen-year view.
        </P>
        <Callout>
          <strong>What to take from the table:</strong> not a forecast, but a
          threshold. Buying wins here only if prices rise faster than about
          2.5% a year for the entire period. If you believe that, the case is
          strong. If you are not sure, the model is telling you that you are
          taking a leveraged position on house prices, and that this, rather
          than the mortgage rate, is the decision you are actually making.
        </Callout>

        <H2>What the model leaves out</H2>
        <P>
          Two omissions, both disclosed because both move the answer:
        </P>
        <UL>
          <li>
            <strong>Tenant insurance</strong> is not modelled. It is a small
            monthly amount and it would push slightly against renting.
          </li>
          <li>
            <strong>The renter&apos;s discipline is assumed, not observed.</strong>{" "}
            Crediting $974.22 a month to an investment account is the neutral
            assumption; a household that spends it instead is running the
            renting path without the offsetting benefit, and their real outcome
            looks nothing like the table. If that is the likely reality, the
            comparison above overstates renting.
          </li>
        </UL>
        <P>
          It also does not price the things that are not money: control of the
          property, security of tenure, and the ability to leave. A model can
          tell you that buying costs $38,538 more in the first year; it cannot
          tell you what you would pay to own the place.
        </P>

        <H2>The short version</H2>
        <P>
          On a $420,000 home with 10% down, against $2,300 a month in rent,
          buying costs $38,538 more than renting in year one and does not break
          even until year 11. It ends fifteen years $44,744 ahead — provided
          home prices rise about 3% a year. At 2% it never catches up. The
          round-trip transaction cost is $56,304, the interest over fifteen
          years is $326,333 against $103,726 of principal, and the renter ends
          with a $289,525 portfolio. The decision turns on the appreciation
          assumption, so work the range rather than the point.
        </P>

        <Faq items={FAQ} />

        <ArticleFooter currentSlug="rent-vs-buy" />
      </article>
    </main>
  );
}
