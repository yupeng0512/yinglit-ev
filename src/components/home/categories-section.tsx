"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { PlugZap, Home, Building2, Zap, BatteryCharging, ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "portable-charger": PlugZap,
  "home-ac-charger": Home,
  "commercial-ac-charger": Building2,
  "dc-charger": Zap,
  "energy-storage": BatteryCharging,
};

export function CategoriesSection({ categories }: { categories: Category[] }) {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            {t("categoriesTitle")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("categoriesSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug] || Zap;
            return (
              <Link
                key={cat.slug}
                href={`/${locale}/products?category=${cat.slug}`}
                className="group relative p-6 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                      {cat.name[locale] || cat.name.en}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {cat.description[locale] || cat.description.en}
                    </p>
                    <div className="flex items-center gap-1 text-sm font-medium text-primary">
                      {cat.productCount} {locale === "zh" ? "个产品" : "Products"}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
