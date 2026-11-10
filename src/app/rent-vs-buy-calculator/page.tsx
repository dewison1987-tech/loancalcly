import type { Metadata } from "next";
import RentVsBuyCalculator from "@/components/RentVsBuyCalculator";
import { SITE_URL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import {
  A,
  Byline,
  Callout,
  CalculatorFooter,
  DataTable,
  Faq,
  H2,
  JsonLd,
  P,
  UL,
} from "@/components/Prose";

export const metadata: Metadata = pageMetadata({
  path: "/rent-vs-buy-calculator",
  title: "Rent vs Buy Calculator — Break-Even Year",
  description:
    "Change the appreciation rate or the return on invested cash and the break-even year moves from four to never. See which assumption your answer rests on.",
});

const REVIEWED = "November 10, 2026";

/**
 * 全部数字由 src/lib/loan.ts 的 rentVsBuy() 生成，
 * 并经 Python / Node 两套独立实现 + 站点内核三方逐位复算。
 *
 * 默认参数与 /rent-vs-buy 指南页完全一致（$420,000 / 10% 首付 / 6.50% /
 * 30 年 / 3.00% 增值 / 3.00% 通胀 / 5.00% 投资回报 / 15 年持有），
 * 所以从指南跳过来的人看到的仍是第 11 年追平，不会出现两页答案打架。
 */
const APPRECIATION = [
  ["0.00% a year", "never", "−$139,290"],
  ["1.00% a year", "never", "−$3,420"],
  [
    <strong key="ap2" className="text-gray-900">
      2.00% a year
    </strong>,
    <strong key="ap2b" className="text-gray-900">
      year 21
    </strong>,
    <strong key="ap2c" className="text-gray-900">
      +$177,628
    </strong>,
  ],
  ["3.00% a year", "year 11", "+$418,199"],
  ["4.00% a year", "year 6", "+$736,981"],
  ["5.00% a year", "year 4", "+$1,158,261"],
];

const RETURNS = [
  ["0.00% a year", "year 6", "+$843,301"],
  ["2.00% a year", "year 7", "+$734,609"],
  ["4.00% a year", "year 9", "+$551,574"],
  [
    <strong key="r5" className="text-gray-900">
      5.00% a year
    </strong>,
    <strong key="r5b" className="text-gray-900">
      year 11
    </strong>,
    <strong key="r5c" className="text-gray-900">
      +$418,199
    </strong>,
  ],
  ["6.00% a year", "year 14", "+$246,292"],
  ["8.00% a year", "never", "−$258,799"],
];

const HOLDING = [
  ["3 years", "−$34,501", "never"],
  ["5 years", "−$28,468", "never"],
  ["7 years", "−$20,113", "never"],
  ["10 years", "−$2,402", "never"],
  [
    <strong key="h15" className="text-gray-900">
      15 years
    </strong>,
    <strong key="h15b" className="text-gray-900">
      +$44,744
    </strong>,
    <strong key="h15c" className="text-gray-900">
      year 11
    </strong>,
  ],
  ["20 years", "+$121,798", "year 11"],
  ["30 years", "+$418,199", "year 11"],
];

const FAQ = [
  {
    q: "How long does it take to break even on a house?",
    a: "In this model, eleven years. On a $420,000 home bought with 10% down at 6.50%, against $2,300 of rent, owning finishes year one $38,538 behind renting and is still $2,402 behind at the end of year ten. It crosses over during year 11 and is $44,744 ahead by year 15. The delay is structural rather than unlucky: $52,500 of cash goes out on day one and the benefit arrives monthly, so the early years are always the worst.",
  },
  {
    q: "Why does 2% appreciation give a different answer from 3%?",
    a: "Because the break-even is extremely sensitive to that one input. At 3.00% a year buying pulls ahead in year 11 and is $418,199 ahead after thirty years. At 2.00% it takes until year 21 and the thirty-year position drops to $177,628. At 1.00% it never catches up inside thirty years and finishes $3,420 behind. One percentage point of annual appreciation is worth roughly $181,048 of outcome over three decades, and nobody can forecast it.",
  },
  {
    q: "Should the renter be credited with investing the difference?",
    a: "It depends on whether the renter actually does it, and the model makes that assumption visible rather than burying it. Owning this home costs $3,274.22 a month in the first year against $2,300 of rent, so the renter is credited with investing $974.22 a month at 5.00%. Push that return to 8.00% and renting stays ahead for the entire thirty years, finishing $258,799 better off. Set it to zero and buying wins by year 6. The assumption is doing more work than most people expect.",
  },
  {
    q: "Is buying better if I plan to move in five years?",
    a: "On these numbers, no — and the gap is not marginal. Selling after five years leaves buying $28,468 behind renting, largely because a round trip through the property costs 2.50% upfront and 7.00% on exit, which is $10,500 plus a share of the sale price before any interest is counted. The model does not price the cost of a forced sale, so if there is any chance you move sooner than planned, the real number is worse than the one shown.",
  },
  {
    q: "Does the calculator include the cost of selling?",
    a: "Yes, and it has to, or the comparison flatters buying. The default assumes 7.00% of the sale price goes to agent commission and fees at exit, plus 2.50% of the purchase price in closing costs at entry. Selling costs are the single largest reason the break-even lands in year 11 rather than year 5. If you would sell through a flat-fee listing instead, lower the selling cost figure and watch the answer move.",
  },
];

export default function RentVsBuyCalculatorPage() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "LoanCalcly Rent vs Buy Calculator",
      url: `${SITE_URL}/rent-vs-buy-calculator`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      description:
        "Free calculator comparing the full cost of owning a home against renting and investing the difference, with a year-by-year break-even and a sensitivity check on appreciation and investment return.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    // ⚠️ 这里不要再手写 FAQPage —— 底部 `<Faq>` 组件已从同一份 FAQ 数组产出，
    // 两边都写会让本页出现两个 FAQPage 实体。
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-12">
      <JsonLd data={schema} />

      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          Rent vs Buy Calculator
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          Compare what each path actually consumes — including the cost of selling —
          and find the year owning overtakes renting, if it ever does.
        </p>
        <Byline published={REVIEWED} />
      </section>

      <div className="mt-10">
        <RentVsBuyCalculator />
      </div>

      <article className="mx-auto mt-14 max-w-3xl">
        <H2>Three assumptions decide this, and only one is about the house</H2>
        <P>
          Ask whether it is cheaper to rent or buy and the honest answer is that the
          question is under-specified. The same home, the same rent and the same loan can
          produce a break-even in year 4 or no break-even at all, depending on three
          numbers that are not properties of the property: how fast the home appreciates,
          what the renter earns on the money they did not spend, and how long you actually
          stay.
        </P>
        <P>
          Start with appreciation, because it is the one people argue about. Holding
          everything else at the defaults — $420,000 home, 10% down, 6.50% for 30 years,
          $2,300 rent — the outcome over thirty years looks like this:
        </P>

        <DataTable
          head={["Home price growth", "Break-even year", "Position at year 30"]}
          rows={APPRECIATION}
          align={["l", "r", "r"]}
          caption="Thirty-year window. Rent inflation 3.00%, investment return 5.00%, selling costs 7.00%."
        />

        <P>
          Two things stand out. The first is the size of the swing: the step from 1.00% to
          2.00% appreciation is worth <strong>$181,048</strong> over three decades, and the
          step from 3.00% to 4.00% is worth more still. The second is where the cliff sits.
          Between 1.00% and 2.00% the answer flips from never to year 21 — and 1.00% lands
          just <strong>$3,420</strong> short after thirty years, which is a rounding error
          against the size of the decision.
        </P>
        <P>
          This is why a single break-even figure should be treated as a range with a wide
          middle, not a fact. Anyone who tells you buying wins after seven years has
          picked an appreciation rate and is not showing you the column above.
        </P>

        <H2>The assumption nobody tests: what the renter earns on the money</H2>
        <P>
          Appreciation is unknowable. The return on invested cash is not — it is the only
          input in the whole comparison that the person asking the question controls
          directly, and it is the one almost every rent-versus-buy article omits.
        </P>
        <P>
          It matters because renting is not free; it is cheaper. Owning this home costs
          about <strong>$3,274.22</strong> a month in the first year against{" "}
          <strong>$2,300</strong> of rent, so the renter has{" "}
          <strong>$974.22</strong> a month left over. What that money does determines
          whether the comparison is close or not close at all.
        </P>

        <DataTable
          head={["Return on invested cash", "Break-even year", "Position at year 30"]}
          rows={RETURNS}
          align={["l", "r", "r"]}
          caption="Appreciation held at 3.00% a year. A 0% return means the difference sits in a current account."
        />

        <P>
          The range is wider than the appreciation table, and both ends are defensible. A
          saver who leaves the difference in cash wins the comparison in year 6. An
          investor who earns 8.00% a year never loses it — renting finishes thirty years
          <strong> $258,799</strong> ahead. Between those two accounts sits the same house,
          the same rent and the same mortgage.
        </P>
        <Callout>
          If you are going to compare renting against buying honestly, you have to state
          what happens to the difference. Leaving it out is not a neutral choice — it
          silently assumes the renter spends it, which makes buying look better than the
          arithmetic supports.
        </Callout>

        <H2>The break-even depends on the window you ask about</H2>
        <P>
          A break-even year is not an absolute property of a purchase; it is the answer to
          &ldquo;by when, if I hold that long.&rdquo; Change the holding period and both
          the position and the verdict move, even though nothing about the house changed.
        </P>

        <DataTable
          head={["Years held", "Position at exit", "Break-even within that window"]}
          rows={HOLDING}
          align={["l", "r", "r"]}
          caption="Appreciation 3.00%, investment return 5.00%. Position is the cumulative advantage of owning; negative means renting is ahead."
        />

        <P>
          The row worth staring at is 10 years: buying is <strong>$2,402</strong> behind,
          and it has not yet broken even. One more year of ownership turns that into
          <strong> +$5,097</strong>. The final column reads &ldquo;never&rdquo; for every
          holding period shorter than the true break-even, which is the correct answer to a
          narrower question — it does not mean buying is worse forever, only that it is
          worse if you leave before year 11.
        </P>
        <P>
          This is also the reason a fifteen-year and a thirty-year study of the same market
          can appear to contradict each other. Our{" "}
          <A href="/rent-vs-buy">rent versus buy walkthrough</A> tests a fifteen-year
          window and reports that 2.00% appreciation never catches up. That is true inside
          fifteen years. Over thirty it catches up in year 21. Both statements are correct;
          they answer different questions.
        </P>

        <H2>What this model does not price</H2>
        <P>
          The arithmetic above is complete for money, and money is not the whole decision.
          Five things sit outside it, and each one pushes in a known direction:
        </P>
        <UL>
          <li>
            <strong>The cost of a forced sale.</strong> The model assumes you sell in the
            year you chose. If a job moves you in year 3, you pay the selling costs early
            and forfeit the years that would have recovered them. Every early exit is worse
            than the table shows.
          </li>
          <li>
            <strong>Repairs are not evenly spread.</strong> Maintenance is modelled as
            1.00% of the price every year. In reality it arrives as a new roof in one year
            and nothing for the next four.
          </li>
          <li>
            <strong>Liquidity.</strong> A down payment and closing costs are locked into
            one asset in one place. The renter&rsquo;s portfolio is not. This is not a
            number and does not appear in any column, but it is a real cost of owning.
          </li>
          <li>
            <strong>Renters insurance.</strong> A modest monthly premium, and not counted
            here — it is small, but it is not zero, and leaving it out slightly flatters
            renting.
          </li>
          <li>
            <strong>A falling market.</strong> The model allows appreciation down to zero.
            Negative appreciation is possible and is covered by setting a negative figure
            only if the tool allows it; the honest way to read the 0.00% row is as the
            generous end of a bad scenario.
          </li>
        </UL>

        <H2>How to use the number</H2>
        <P>
          The useful move is not to read the break-even and act on it, but to invert the
          question: what would have to be true for this purchase to work? If the answer is
          &ldquo;the home appreciates 4% a year for six straight years,&rdquo; you now know
          how much of the decision rests on a forecast you cannot make, and the honest
          response is to plan to stay long enough that the forecast matters less.
        </P>
        <P>
          From here, two pages do the rest.{" "}
          <A href="/home-affordability-calculator">The affordability calculator</A> tells
          you what price your income supports, which is a separate question from whether
          that price is a good buy. And{" "}
          <A href="/amortization-schedule">the amortization schedule</A> shows how slowly
          the balance falls in the early years — the reason the first decade of owning is
          almost all interest, and the reason the break-even sits where it does.
        </P>

        <Faq items={FAQ} />

        <CalculatorFooter currentSlug="rent-vs-buy-calculator" />
      </article>
    </main>
  );
}
