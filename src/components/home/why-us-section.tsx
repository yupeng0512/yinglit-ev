"use client";

import { useTranslations, useLocale } from "next-intl";
import { Cpu, Factory, Globe, Shield } from "lucide-react";

const REASONS = [
  {
    icon: Cpu,
    titleEn: "Product Innovation",
    titleZh: "产品创新",
    descEn: "Modular design for customization. Bluetooth Mesh, ISO15118, OCPP 1.6J+ technologies developed in-house.",
    descZh: "模块化设计便于定制。蓝牙Mesh、ISO15118、OCPP 1.6J+等技术自主研发。",
  },
  {
    icon: Factory,
    titleEn: "Flexible Production",
    titleZh: "柔性生产",
    descEn: "Own factory plus professional subcontract partners deliver flexible capacity with competitive pricing.",
    descZh: "自有工厂加专业代工合作伙伴，提供灵活产能和有竞争力的价格。",
  },
  {
    icon: Globe,
    titleEn: "Global Experience",
    titleZh: "全球经验",
    descEn: "Exported to 25+ countries since 2018. Deep understanding of CE, UL, KfW, and regional compliance.",
    descZh: "自2018年出口至25+国家。深入理解CE、UL、KfW等各地区合规要求。",
  },
  {
    icon: Shield,
    titleEn: "Total Solution",
    titleZh: "全套方案",
    descEn: "Hardware + Cloud Platform + Mobile APP. One-stop from design to manufacturing to after-sales support.",
    descZh: "硬件+云平台+移动APP。从设计到制造到售后的一站式服务。",
  },
];

export function WhyUsSection() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12">
          {t("whyUsTitle")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {REASONS.map((reason) => {
            const Icon = reason.icon;
            return (
              <div key={reason.titleEn} className="flex gap-5">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold mb-2">
                    {locale === "zh" ? reason.titleZh : reason.titleEn}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {locale === "zh" ? reason.descZh : reason.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
