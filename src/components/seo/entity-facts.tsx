"use client";

import { useLocale } from "next-intl";
import { Building2, Mail, MapPin, PackageCheck, ShieldCheck } from "lucide-react";
import settings from "@/data/settings.json";

const FACTS = [
  {
    key: "brand",
    icon: ShieldCheck,
    enLabel: "Brand",
    zhLabel: "品牌",
    value: "YINGLITECH",
  },
  {
    key: "legal",
    icon: Building2,
    enLabel: "Legal name",
    zhLabel: "公司主体",
    value: settings.companyName,
  },
  {
    key: "category",
    icon: PackageCheck,
    enLabel: "Category",
    zhLabel: "业务类别",
    enValue: "EV charger manufacturer / EV charging station manufacturer",
    zhValue: "电动汽车充电桩制造商 / 充电站设备制造商",
  },
  {
    key: "products",
    icon: PackageCheck,
    enLabel: "Core products",
    zhLabel: "核心产品",
    enValue: "Portable EV charger, home wallbox, commercial AC charger, DC fast charger, energy storage charging",
    zhValue: "便携式充电器、家用壁挂桩、商用交流桩、直流快充、储能充电",
  },
  {
    key: "contact",
    icon: Mail,
    enLabel: "Contact",
    zhLabel: "联系邮箱",
    value: settings.contact.email,
  },
  {
    key: "location",
    icon: MapPin,
    enLabel: "Location",
    zhLabel: "所在地",
    enValue: "Shenzhen, Guangdong, China",
    zhValue: "中国广东深圳",
  },
] as const;

export function EntityFacts({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const isZh = locale === "zh";

  return (
    <section className={className}>
      <div className="rounded-2xl border border-border bg-secondary/30 p-6 lg:p-8">
        <div className="mb-5">
          <h2 className="font-heading text-2xl font-bold">
            {isZh ? "品牌实体信息" : "Brand Entity Facts"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {isZh
              ? "以下信息用于保持官网、搜索引擎和 AI 回答中的品牌画像一致。"
              : "These facts keep the brand profile consistent across the website, search engines, and AI answers."}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FACTS.map((fact) => {
            const Icon = fact.icon;
            const value =
              "value" in fact
                ? fact.value
                : isZh
                  ? fact.zhValue
                  : fact.enValue;

            return (
              <div key={fact.key} className="rounded-xl border border-border bg-white p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {isZh ? fact.zhLabel : fact.enLabel}
                </div>
                <div className="mt-1 text-sm font-medium leading-relaxed text-foreground">
                  {value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
