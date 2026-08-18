import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteContentProvider } from "@/lib/context/site-content-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "UNIGAP — Learn Smarter. Stay Motivated. Go Further.",
    template: "%s | UNIGAP",
  },
  description:
    "UNIGAP is a modern learning platform combining professional courses, AI-guided motivation, and gamified progress to help you build real, lasting skills.",
  openGraph: {
    title: "UNIGAP — Learn Smarter. Stay Motivated. Go Further.",
    description:
      "Courses, personalized learning, AI engagement, and achievements — all in one platform.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <SiteContentProvider>{children}</SiteContentProvider>
      </body>
    </html>
  );
}
