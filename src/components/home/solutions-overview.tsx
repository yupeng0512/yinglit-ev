"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Home, Building2, Zap, ArrowRight } from "lucide-react";

const SOLUTIONS = [
  {
    key: "home" as const,
    icon: Home,
    color: "bg-green-500/10 text-green-600",
    features: ["7-22KW Wallbox", "Bluetooth APP", "Dynamic Load Balance", "KfW / UK EVHS"],
  },
  {
    key: "commercial" as const,
    icon: Building2,
    color: "bg-blue-500/10 text-blue-600",
    features: ["OCPP 1.6J/2.0", "MID Certified Meter", "RFID + Credit Card", "Twin & Pedestal"],
  },
  {
    key: "public" as const,
    icon: Zap,
    color: "bg-orange-500/10 text-orange-600",
    features: ["30-720KW DC", "CCS2/CCS1/NACS/GB/T", "Split + Liquid Cooling", "Energy Storage"],
  },
];

export function SolutionsOverview() {
  const t = useTranslations("solutions");
  const tHome = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            {tHome("solutionsTitle")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {tHome("solutionsSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SOLUTIONS.map((sol) => {
            const Icon = sol.icon;
            return (
              <div
                key={sol.key}
                className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${sol.color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3">
                  {t(`${sol.key}Title`)}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {t(`${sol.key}Desc`)}
                </p>
                <ul className="space-y-2 mb-6">
                  {sol.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${locale}/solutions`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {locale === "zh" ? "了解更多" : "Learn More"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
