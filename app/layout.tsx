import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteContentProvider } from "@/lib/context/site-content-context";
import { ThemeProvider } from "@/lib/context/theme-context";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});


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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${outfit.variable} ${lora.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-bg text-ink min-h-screen antialiased">
        <ThemeProvider>
          <SiteContentProvider>{children}</SiteContentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}




