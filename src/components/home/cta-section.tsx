"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, MessageSquare } from "lucide-react";

export function CtaSection() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="py-16 lg:py-24 bg-navy relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-electric/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-electric-light/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <MessageSquare className="w-12 h-12 mx-auto mb-6 text-electric" />
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          {t("ctaTitle")}
        </h2>
        <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
          {t("ctaSubtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/contact`}
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-electric text-navy font-semibold rounded-lg hover:bg-electric-light transition-colors text-lg"
          >
            {locale === "zh" ? "立即联系" : "Contact Us Now"}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href={`/${locale}/oem-odm`}
            className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-medium rounded-lg hover:bg-white/5 transition-colors text-lg"
          >
            {locale === "zh" ? "了解OEM/ODM" : "OEM/ODM Services"}
          </Link>
        </div>
      </div>
    </section>
  );
}
