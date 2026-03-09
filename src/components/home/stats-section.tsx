"use client";

import { useTranslations, useLocale } from "next-intl";
import { Award, Globe, Lightbulb, Layers, Zap } from "lucide-react";

const STAT_ICONS: Record<string, React.ElementType> = {
  founded: Award,
  countries: Globe,
  patents: Lightbulb,
  productLines: Layers,
  maxPower: Zap,
};

const STAT_LABELS: Record<string, Record<string, string>> = {
  founded: { en: "Year Founded", zh: "成立年份" },
  countries: { en: "Export Countries", zh: "出口国家" },
  patents: { en: "Patents & Copyrights", zh: "专利与著作权" },
  productLines: { en: "Product Series", zh: "产品系列" },
  maxPower: { en: "Max Charging Power", zh: "最大充电功率" },
};

export function StatsSection({ stats }: { stats: Record<string, string> }) {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="py-16 lg:py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-center mb-12">
          {t("statsTitle")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {Object.entries(stats).map(([key, value]) => {
            const Icon = STAT_ICONS[key] || Zap;
            const label = STAT_LABELS[key]?.[locale] || key;
            return (
              <div key={key} className="text-center group">
                <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  {value}
                </div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
