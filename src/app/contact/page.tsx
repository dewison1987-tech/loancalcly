import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section, Bullets, Ext } from "@/components/LegalPage";
import { CONTACT_EMAIL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: "Contact us",
  description:
    "Get in touch with LoanCalcly about calculator errors, content corrections, permissions or general questions.",
});

const LAST_UPDATED = "September 25, 2026";

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact us"
      updated={LAST_UPDATED}
      intro={
        <p>
          We read every message. Email is the fastest way to reach us — there is
          no phone line and no live chat, but there is a real person at the
          other end.
        </p>
      }
    >
      <Section title="Email">
        <p className="rounded-xl border border-gray-200 bg-white p-4 text-base">
          <Ext href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Ext>
        </p>
        <p>
          We aim to reply within two to three business days. Messages that
          report a specific problem with a specific page get answered fastest,
          so please include the page URL and, if relevant, the numbers you
          entered.
        </p>
      </Section>

      <Section title="What we can help with">
        <Bullets
          items={[
            <>
              <strong>A wrong number.</strong> If a calculation looks incorrect,
              send us the loan amount, interest rate, term and the result you
              expected. We will investigate and fix it.
            </>,
            <>
              <strong>A content correction.</strong> Factual errors, outdated
              information or unclear explanations — tell us where and we will
              update the page.
            </>,
            <>
              <strong>Permissions and licensing.</strong> Requests to reuse our
              content, figures or charts.
            </>,
            <>
              <strong>Accessibility problems.</strong> If any part of the site is
              hard to use with a screen reader, keyboard or on a small screen,
              we want to know.
            </>,
            <>
              <strong>General questions</strong> about how the calculator or the
              site works.
            </>,
          ]}
        />
      </Section>

      <Section title="What we cannot help with">
        <p>
          So that you do not waste time waiting on a reply we cannot give:
        </p>
        <Bullets
          items={[
            <>
              <strong>We are not a lender or broker.</strong> We cannot quote you
              a rate, approve an application, or influence a decision made by a
              lender.
            </>,
            <>
              <strong>We cannot give personal financial advice.</strong> We do
              not know your circumstances, and we are not licensed to advise you
              on a specific loan. Please speak to a qualified professional.
            </>,
            <>
              <strong>We do not hold customer accounts.</strong> There is
              nothing for us to look up, reset or unlock, because the site has
              no accounts.
            </>,
            <>
              <strong>We do not sell links or publish guest posts</strong> for
              payment, and we do not remove factual content in exchange for
              anything.
            </>,
          ]}
        />
      </Section>

      <Section title="Corrections policy">
        <p>
          When we get something wrong, we fix it and note the change with an
          updated review date on the page. We would rather publish a correction
          than leave a wrong number up. See our{" "}
          <Link
            href="/about"
            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
          >
            About page
          </Link>{" "}
          for how we verify calculations in the first place.
        </p>
      </Section>

      <Section title="Before you write">
        <p>
          Two pages answer most questions: the{" "}
          <Link
            href="/"
            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
          >
            home page
          </Link>{" "}
          explains what the calculator does and the{" "}
          <Link
            href="/disclaimer"
            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
          >
            Disclaimer
          </Link>{" "}
          explains the limits of the estimates. For data and cookie questions,
          see the{" "}
          <Link
            href="/privacy"
            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
          >
            Privacy policy
          </Link>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
