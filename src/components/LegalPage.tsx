import type { ReactNode } from "react";

/**
 * 政策/信息类页面的统一排版容器。
 * AdSense 审核会逐字阅读这些页面，所以内容必须完整、可读、有实质信息，
 * 不能是占位符或空壳。
 */
export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-sm text-gray-500">Last updated: {updated}</p>
      {intro && (
        <div className="mt-6 space-y-3 leading-relaxed text-gray-600">
          {intro}
        </div>
      )}
      <div className="mt-10 space-y-9">{children}</div>
    </main>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-gray-600">
        {children}
      </div>
    </section>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="ml-5 list-disc space-y-1.5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/** 外链（统一加 rel，避免权重外泄与安全问题） */
export function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
    >
      {children}
    </a>
  );
}
