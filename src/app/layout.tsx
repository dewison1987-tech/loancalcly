import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Loan Calculator — Free Monthly Payment Calculator",
    template: "%s | Loan Calculator",
  },
  description:
    "Calculate your monthly loan payment, total interest and full amortization schedule. Free, instant and accurate for mortgages, car loans, personal loans and more.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <header className="border-b border-gray-200 bg-white">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <span className="flex items-center gap-2 font-semibold tracking-tight text-gray-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #059669, #0d9488)" }}>
                LC
              </span>
              Loan Calculator
            </span>
          </nav>
        </header>
        {children}
        <footer className="mt-auto border-t border-gray-200 py-6">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 text-sm text-gray-500">
            <span>© {new Date().getFullYear()} Loan Calculator</span>
            <span>Estimates only — always confirm with your lender</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
