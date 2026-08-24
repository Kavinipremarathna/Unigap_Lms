import { Check } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pricingPlans } from "@/lib/mock/misc";

export default function PricingPage() {
  return (
    <div className="bg-bg text-ink min-h-screen flex flex-col transition-colors">
      <Navbar />
      <main className="container-app py-16 flex-1">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="font-serif text-3xl font-medium text-ink sm:text-4xl">Simple, transparent pricing</h1>
          <p className="mt-3 text-sm text-ink-muted">
            Start free, upgrade when you&apos;re ready for certificates and full course access.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "flex flex-col p-6 rounded-[4px] border border-border bg-surface relative",
                plan.highlighted && "border-primary shadow-lg bg-surface-2"
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-[4px] bg-primary px-3 py-0.5 text-xs font-mono font-bold text-primary-fg uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              <h3 className="font-serif text-xl font-medium text-ink">{plan.name}</h3>
              <p className="mt-1 text-xs text-ink-muted">{plan.description}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-mono text-4xl font-bold text-ink">${plan.price}</span>
                {plan.period !== "forever" && (
                  <span className="font-mono text-xs text-ink-muted">/{plan.period}</span>
                )}
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-xs text-ink">
                    <Check size={16} className="mt-0.5 shrink-0 text-accent" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                variant={plan.highlighted ? "primary" : "secondary"}
                className="mt-6 w-full"
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        <p className="mt-10 text-center text-xs font-mono text-ink-muted">
          Prices shown are illustrative mock data for this preview.
        </p>
      </main>
      <Footer />
    </div>
  );
}


