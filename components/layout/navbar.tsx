"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/lib/context/site-content-context";

const links = [
  { href: "/courses", label: "Courses" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { landing } = useSiteContent();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-md">
      {landing.bannerActive && landing.bannerText && (
        <div className="bg-gradient-to-r from-[#520051] via-[#920090] to-[#d400d1] px-4 py-2 text-center text-xs font-semibold text-white shadow-sm">
          <Link
            href={landing.bannerLink || "/pricing"}
            className="inline-flex items-center justify-center gap-1.5 hover:underline"
          >
            <span>{landing.bannerText}</span>
            <ArrowRight size={13} className="shrink-0" />
          </Link>
        </div>
      )}

      <div className="container-app flex h-16 items-center justify-between">
        <Link href="/" aria-label="UNIGAP home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>

          <Link href="/register">
            <Button size="sm">Register</Button>
          </Link>
        </div>

        <button
          className="rounded-md p-2 text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-surface md:hidden">
          <nav className="container-app flex flex-col gap-1 py-3" aria-label="Mobile navigation">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-2 py-2.5 text-sm font-medium text-ink-muted hover:bg-surface-2 hover:text-ink"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 px-2">
              <Link href="/login" className="flex-1">
                <Button variant="secondary" size="sm" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button size="sm" className="w-full">
                  Register
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
