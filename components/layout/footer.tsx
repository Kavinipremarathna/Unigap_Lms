import Link from "next/link";
import { Logo } from "./logo";

const columns = [
  {
    title: "Learn",
    links: [
      { href: "/courses", label: "Browse Courses" },
      { href: "/pricing", label: "Pricing" },
      { href: "/achievements", label: "Achievements" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/", label: "About" },
      { href: "/", label: "Careers" },
      { href: "/", label: "Partners" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/", label: "Help Center" },
      { href: "/", label: "Contact" },
      { href: "/", label: "Status" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface text-ink transition-colors">
      <div className="container-app grid grid-cols-2 gap-10 py-14 md:grid-cols-5">
        <div className="col-span-2">
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-ink-muted">
            Learning is a journey, not a task. UNIGAP helps you build real skills
            and keep going.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-mono text-xs uppercase tracking-wider text-ink-muted font-semibold">{col.title}</h4>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-ink-muted hover:text-ink transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-6">
        <p className="container-app text-xs font-mono text-ink-muted">
          © {new Date().getFullYear()} UNIGAP. All rights reserved.
        </p>
      </div>
    </footer>
  );
}


