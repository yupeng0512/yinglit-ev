import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Layers3 } from "lucide-react";
import { getProvider } from "@/lib/provider";
import { getSeoPages } from "@/lib/seo-pages";
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildPageMetadata,
  localizedPath,
  localizedText,
  toLocale,
} from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    path: "/resources",
    title:
      locale === "zh"
        ? "电动汽车充电桩采购与技术资源"
        : "EV Charging Buying Guides and Technical Resources",
    description:
      locale === "zh"
        ? "阅读盈利科技电动汽车充电桩采购指南，覆盖制造商选择、OEM/ODM、OCPP、直流快充、商用充电站、家用壁挂桩和储能充电。"
        : "Read YINGLITECH EV charging resources for manufacturer selection, OEM/ODM, OCPP, DC fast charging, commercial stations, home wallboxes, and energy storage charging.",
    image: "/images/hero-products.jpg",
  });
}

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = toLocale(locale);
  const provider = await getProvider();
  const categories = await provider.getCategories(safeLocale);
  const pages = getSeoPages();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    {
      name: safeLocale === "zh" ? "首页" : "Home",
      item: localizedPath("/", safeLocale),
    },
    {
      name: safeLocale === "zh" ? "资源中心" : "Resources",
      item: localizedPath("/resources", safeLocale),
    },
  ]);
  const itemListJsonLd = buildItemListJsonLd(
    pages.map((page) => ({
      name: localizedText(page.title, safeLocale),
      description: localizedText(page.description, safeLocale),
      url: localizedPath(`/resources/${page.slug}`, safeLocale),
    }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <section className="pt-24 lg:pt-28 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
              <BookOpen className="w-4 h-4" />
              {safeLocale === "zh" ? "资源中心" : "Resource Center"}
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {safeLocale === "zh"
                ? "电动汽车充电桩采购与技术资源"
                : "EV Charging Buying Guides and Technical Resources"}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {safeLocale === "zh"
                ? "围绕海外采购、充电桩制造、OEM/ODM、OCPP、直流快充和典型部署场景，整理可索引、可内链的主题入口页。"
                : "Topic pages for overseas buyers researching EV charger manufacturing, OEM/ODM, OCPP, DC fast charging, and common deployment scenarios."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
            {pages.map((page) => (
              <Link
                key={page.slug}
                href={`/${safeLocale}/resources/${page.slug}`}
                className="group rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Layers3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-semibold group-hover:text-primary transition-colors">
                      {localizedText(page.title, safeLocale)}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {localizedText(page.description, safeLocale)}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      {safeLocale === "zh" ? "阅读指南" : "Read Guide"}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <section className="border-t border-border pt-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="font-heading text-2xl font-bold">
                  {safeLocale === "zh" ? "按产品分类继续浏览" : "Continue by Product Category"}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {safeLocale === "zh"
                    ? "资源页会继续指向具体产品和分类页，方便搜索引擎理解主题关系，也方便采购方继续询盘。"
                    : "Resource pages link back to product categories and product detail pages so buyers can move from research to inquiry."}
                </p>
              </div>
              <Link
                href={`/${safeLocale}/contact`}
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {safeLocale === "zh" ? "提交项目询盘" : "Send Project Inquiry"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/${safeLocale}/products/category/${category.slug}`}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
                >
                  {localizedText(category.name, safeLocale)}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
