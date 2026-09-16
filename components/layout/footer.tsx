import Link from "next/link";
import { ShieldCheck, Award, Sparkles, Heart } from "lucide-react";
import { Logo } from "./logo";

const columns = [
  {
    title: "Learning Tracks",
    links: [
      { href: "/courses", label: "All Courses" },
      { href: "/courses", label: "Free Courses" },
      { href: "/courses", label: "Premium Paid Courses" },
      { href: "/pricing", label: "Certificates & Pricing" },
    ],
  },
  {
    title: "Learner Portal",
    links: [
      { href: "/dashboard", label: "Student Dashboard" },
      { href: "/achievements", label: "Gamified XP & Badges" },
      { href: "/certificates", label: "Verified Certificates" },
      { href: "/notifications", label: "Course Updates" },
    ],
  },
  {
    title: "Platform",
    links: [
      { href: "/login", label: "Account Login" },
      { href: "/register", label: "Create Account" },
      { href: "/admin/login", label: "Admin Console" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-surface/90 text-ink transition-colors">
      <div className="container-app grid grid-cols-1 gap-10 py-16 md:grid-cols-5">
        <div className="md:col-span-2 space-y-4">
          <Logo />
          <p className="max-w-sm text-sm text-ink-muted leading-relaxed">
            UNIGAP Learn is a modern learning platform designed for ambitious learners. Master industry-ready skills with free and premium courses, interactive quizzes, and verified completion certificates.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#520051]/10 px-3 py-1 text-xs font-semibold text-[#520051] border border-[#520051]/20 dark:bg-[#520051] dark:text-white">
              <ShieldCheck size={14} className="text-[#920090]" /> 100% Verified Content
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-500/20 dark:text-emerald-300">
              <Award size={14} className="text-emerald-600" /> Shareable Certificates
            </span>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#920090]">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm font-medium text-ink-muted hover:text-ink hover:underline transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border/80 py-6 bg-surface-2/40">
        <div className="container-app flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} UNIGAP Learn. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Empowering modern learners worldwide <Sparkles size={12} className="text-[#920090]" />
          </p>
        </div>
      </div>
    </footer>
  );
}


