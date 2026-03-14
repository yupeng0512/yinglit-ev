"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Paintbrush,
  Cpu,
  Factory,
  Shield,
  Truck,
  HeadphonesIcon,
  ArrowRight,
  Wrench,
  Package,
  Globe,
  Gauge,
  Boxes,
} from "lucide-react";
import siteSettings from "@/data/settings.json";

const STEPS = [
  { icon: HeadphonesIcon, key: "step1" },
  { icon: Cpu, key: "step2" },
  { icon: Wrench, key: "step3" },
  { icon: Factory, key: "step4" },
  { icon: Shield, key: "step5" },
  { icon: Truck, key: "step6" },
];

const CAPABILITIES = [
  {
    titleEn: "Custom Branding",
    titleZh: "品牌定制",
    descEn: "Logo, color, packaging, UI customization for your brand identity.",
    descZh: "Logo、颜色、包装、UI界面定制，打造您的品牌形象。",
    icon: Paintbrush,
  },
  {
    titleEn: "Hardware Modification",
    titleZh: "硬件改型",
    descEn: "Custom enclosure design, connector configuration, and power rating adjustments.",
    descZh: "定制外壳设计、接口配置和功率调整。",
    icon: Wrench,
  },
  {
    titleEn: "Software Customization",
    titleZh: "软件定制",
    descEn: "ODM of cloud platform, mobile APP, and OCPP backend with your branding.",
    descZh: "云平台、移动APP和OCPP后端的ODM定制。",
    icon: Cpu,
  },
  {
    titleEn: "Compliance Support",
    titleZh: "合规支持",
    descEn: "CE, UL, KfW, MID, and regional certification assistance for your target markets.",
    descZh: "CE、UL、KfW、MID等目标市场的认证支持。",
    icon: Shield,
  },
  {
    titleEn: "Flexible MOQ",
    titleZh: "灵活起订量",
    descEn: "Scalable production from small trial batches to large volume orders.",
    descZh: "从小批量试产到大批量订单的灵活生产。",
    icon: Package,
  },
  {
    titleEn: "After-Sales Support",
    titleZh: "售后支持",
    descEn: "Technical training, spare parts supply, and remote diagnosis support.",
    descZh: "技术培训、备件供应和远程诊断支持。",
    icon: HeadphonesIcon,
  },
];

const READINESS_SIGNALS = [
  {
    titleEn: "Certification Pathway",
    titleZh: "认证落地支持",
    descEn: "Prepare CE, UL, MID, KfW and other regional compliance packages for your target market.",
    descZh: "面向目标市场准备 CE、UL、MID、KfW 等认证与合规支持。",
    icon: Shield,
  },
  {
    titleEn: "Hardware + Software ODM",
    titleZh: "软硬件一体 ODM",
    descEn: "Branding, enclosure, UI, cloud platform and OCPP backend can be coordinated in one workflow.",
    descZh: "品牌、外观、UI、云平台与 OCPP 后端可在同一流程中协同定制。",
    icon: Cpu,
  },
  {
    titleEn: "Global Market Experience",
    titleZh: "全球市场经验",
    descEn: "Projects and product programs have supported customers across multiple international markets.",
    descZh: "项目与产品方案已服务多个海外市场客户，具备国际交付经验。",
    icon: Globe,
  },
  {
    titleEn: "Flexible Production Ramp",
    titleZh: "柔性扩产能力",
    descEn: "Pilot runs, packaging customization and scale-up production can be arranged based on order stage.",
    descZh: "可按订单阶段安排试产、包装定制与规模化交付。",
    icon: Factory,
  },
] as const;

const DELIVERY_STATS = [
  {
    value: siteSettings.stats.founded,
    labelEn: "Founded",
    labelZh: "成立年份",
    icon: Factory,
  },
  {
    value: siteSettings.stats.countries,
    labelEn: "Countries Served",
    labelZh: "服务国家",
    icon: Globe,
  },
  {
    value: siteSettings.stats.patents,
    labelEn: "Patents",
    labelZh: "专利数量",
    icon: Boxes,
  },
  {
    value: siteSettings.stats.maxPower,
    labelEn: "Max System Power",
    labelZh: "最大系统功率",
    icon: Gauge,
  },
] as const;

export default function OemOdmPage() {
  const locale = useLocale();
  const t = useTranslations("oem");

  return (
    <section className="pt-24 lg:pt-28 pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="mb-20">
          <h2 className="font-heading text-2xl font-bold text-center mb-10">
            {t("capability")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              return (
                <div key={cap.titleEn} className="p-6 bg-card border border-border rounded-xl hover:border-primary/20 transition-colors">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2">
                    {locale === "zh" ? cap.titleZh : cap.titleEn}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {locale === "zh" ? cap.descZh : cap.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Process Timeline */}
        <div className="mb-20">
          <h2 className="font-heading text-2xl font-bold text-center mb-10">
            {t("process")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.key} className="text-center">
                  <div className="relative">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-3">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </div>
                  </div>
                  <p className="text-sm font-medium">{t(step.key)}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Market Readiness */}
        <div className="mb-20">
          <h2 className="font-heading text-2xl font-bold text-center mb-6">
            {locale === "zh" ? "项目落地支持" : "Go-to-Market Support"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {READINESS_SIGNALS.map((signal) => {
              const Icon = signal.icon;
              return (
                <div
                  key={signal.titleEn}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2">
                    {locale === "zh" ? signal.titleZh : signal.titleEn}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {locale === "zh" ? signal.descZh : signal.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Confidence */}
        <div className="mb-20">
          <h2 className="font-heading text-2xl font-bold text-center mb-6">
            {locale === "zh" ? "交付信心" : "Delivery Confidence"}
          </h2>
          <div className="rounded-2xl border border-border bg-secondary/40 p-8 lg:p-10">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {DELIVERY_STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.labelEn} className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="font-heading text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {locale === "zh" ? stat.labelZh : stat.labelEn}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="font-heading text-lg font-semibold mb-2">
                  {locale === "zh" ? "从试样到量产" : "From Sample to Volume"}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {locale === "zh"
                    ? "适合品牌试销、小批量验证到持续出货，避免用弱截图替代真实产品能力。"
                    : "Support pilot batches, validation samples and repeat production without relying on weak marketing screenshots."}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="font-heading text-lg font-semibold mb-2">
                  {locale === "zh" ? "适配多市场需求" : "Built for Multi-Market Requests"}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {locale === "zh"
                    ? "可围绕认证、接口制式、包装和后台能力做组合配置，更适合 B2B 询盘沟通。"
                    : "Configuration can be aligned around compliance, connector standards, packaging and backend requirements for B2B programs."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-secondary rounded-2xl p-10 lg:p-16">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">
            {locale === "zh" ? "开启您的OEM/ODM合作" : "Start Your OEM/ODM Partnership"}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            {locale === "zh"
              ? "告诉我们您的需求，我们的团队将在24小时内回复您。"
              : "Tell us your requirements and our team will respond within 24 hours."}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            {locale === "zh" ? "联系我们" : "Contact Us"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
