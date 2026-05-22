import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Search, Zap } from "lucide-react";
import { getProvider } from "@/lib/provider";
import { getSeoPages } from "@/lib/seo-pages";
import type { Product } from "@/lib/types";
import {
  buildBreadcrumbJsonLd,
  buildCategoryMetadata,
  buildItemListJsonLd,
  localizedPath,
  localizedText,
  productDescription,
  productImage,
  productName,
  toLocale,
} from "@/lib/seo";

export async function generateStaticParams() {
  const provider = await getProvider();
  const categories = await provider.getCategories();

  return categories.flatMap((category) => [
    { locale: "en", category: category.slug },
    { locale: "zh", category: category.slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category: categorySlug } = await params;
  const provider = await getProvider();
  const categories = await provider.getCategories(locale);
  const category = categories.find((item) => item.slug === categorySlug);

  if (!category) {
    return {};
  }

  return buildCategoryMetadata(category, locale);
}

export default async function ProductCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category: categorySlug } = await params;
  const safeLocale = toLocale(locale);
  const provider = await getProvider();
  const categories = await provider.getCategories(safeLocale);
  const category = categories.find((item) => item.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const products = await provider.getProducts({
    locale: safeLocale,
    status: "active",
    category: category.slug,
  });
  const relatedResources = getSeoPages().filter((page) =>
    page.relatedCategorySlugs.includes(category.slug)
  );
  const categoryMatrixRows = buildCategoryMatrixRows(products, safeLocale);
  const categoryPath = `/products/category/${category.slug}`;
  const categoryTitle = localizedText(category.name, safeLocale);
  const categoryDescription = localizedText(category.description, safeLocale);
  const selectionGuidance = getCategorySelectionGuidance(category.slug, safeLocale);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    {
      name: safeLocale === "zh" ? "首页" : "Home",
      item: localizedPath("/", safeLocale),
    },
    {
      name: safeLocale === "zh" ? "产品中心" : "Products",
      item: localizedPath("/products", safeLocale),
    },
    {
      name: categoryTitle,
      item: localizedPath(categoryPath, safeLocale),
    },
  ]);
  const itemListJsonLd = buildItemListJsonLd(
    products.map((product) => ({
      name: productName(product, safeLocale),
      description: productDescription(product, safeLocale),
      url: localizedPath(`/products/${product.slug}`, safeLocale),
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
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
                <Search className="w-4 h-4" />
                {safeLocale === "zh" ? "产品分类" : "Product Category"}
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                {categoryTitle}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {categoryDescription}
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">
                {selectionGuidance}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {products.length} {safeLocale === "zh" ? "款可选产品" : "active products"}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {safeLocale === "zh" ? "支持ODM/OEM询盘" : "ODM/OEM inquiry support"}
                </span>
              </div>
            </div>

            <div className="relative min-h-[260px] rounded-2xl border border-border bg-[linear-gradient(180deg,rgba(244,250,255,0.95)_0%,#ffffff_72%)] overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(19,160,255,0.18),transparent_70%)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-20 h-20 text-primary/10" />
              </div>
              {category.image && (
                <Image
                  src={category.image}
                  alt={categoryTitle}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  priority
                />
              )}
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              href={`/${safeLocale}/products`}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card text-muted-foreground hover:border-primary/30 transition-colors"
            >
              {safeLocale === "zh" ? "全部产品" : "All Products"}
            </Link>
            {categories.map((item) => (
              <Link
                key={item.slug}
                href={`/${safeLocale}/products/category/${item.slug}`}
                className={
                  item.slug === category.slug
                    ? "px-4 py-2 text-sm font-medium rounded-lg border border-primary bg-primary text-primary-foreground transition-colors"
                    : "px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card text-muted-foreground hover:border-primary/30 transition-colors"
                }
              >
                {localizedText(item.name, safeLocale)}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {products.map((product) => (
              <CategoryProductCard
                key={product.slug}
                product={product}
                locale={safeLocale}
              />
            ))}
          </div>

          {categoryMatrixRows.length > 0 && (
            <section className="mb-14 border-t border-border pt-10">
              <div className="mb-6">
                <h2 className="font-heading text-2xl font-bold">
                  {safeLocale === "zh"
                    ? "分类规格矩阵"
                    : "Category Specification Matrix"}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {safeLocale === "zh"
                    ? "用真实 SKU 对比功率、接口/协议、认证和适用场景，便于搜索引擎、AI 回答和采购方直接理解该分类。"
                    : "Compare real SKUs by power, connector/protocol, certification, and use case so search engines, AI answers, and buyers can understand this category directly."}
                </p>
              </div>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[900px] border-collapse bg-card text-sm">
                  <thead className="bg-muted/60 text-left">
                    <tr>
                      <th className="px-4 py-3 font-semibold">
                        {safeLocale === "zh" ? "型号" : "SKU"}
                      </th>
                      <th className="px-4 py-3 font-semibold">
                        {safeLocale === "zh" ? "产品" : "Product"}
                      </th>
                      <th className="px-4 py-3 font-semibold">
                        {safeLocale === "zh" ? "功率" : "Power"}
                      </th>
                      <th className="px-4 py-3 font-semibold">
                        {safeLocale === "zh" ? "接口/协议" : "Connector / Protocol"}
                      </th>
                      <th className="px-4 py-3 font-semibold">
                        {safeLocale === "zh" ? "认证" : "Certifications"}
                      </th>
                      <th className="px-4 py-3 font-semibold">
                        {safeLocale === "zh" ? "适用场景" : "Best Fit"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryMatrixRows.map((row) => (
                      <tr key={row.slug} className="border-t border-border align-top">
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {row.sku}
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">
                          <Link
                            href={`/${safeLocale}/products/${row.slug}`}
                            className="hover:text-primary transition-colors"
                          >
                            {row.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {row.power}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {row.connectorProtocol}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {row.certifications}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {row.bestFit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {relatedResources.length > 0 && (
            <section className="border-t border-border pt-10">
              <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-heading text-2xl font-bold">
                    {safeLocale === "zh" ? "相关采购指南" : "Related Buying Guides"}
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    {safeLocale === "zh"
                      ? "继续了解选型、协议、场景和OEM/ODM合作要点。"
                      : "Continue with selection, protocol, use-case, and OEM/ODM guidance."}
                  </p>
                </div>
                <Link
                  href={`/${safeLocale}/resources`}
                  className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary"
                >
                  {safeLocale === "zh" ? "查看资源中心" : "View Resources"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedResources.slice(0, 4).map((page) => (
                  <Link
                    key={page.slug}
                    href={`/${safeLocale}/resources/${page.slug}`}
                    className="group rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
                  >
                    <h3 className="font-heading text-lg font-semibold group-hover:text-primary transition-colors">
                      {localizedText(page.title, safeLocale)}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {localizedText(page.description, safeLocale)}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </>
  );
}

type CategoryMatrixRow = {
  slug: string;
  sku: string;
  name: string;
  power: string;
  connectorProtocol: string;
  certifications: string;
  bestFit: string;
};

function buildCategoryMatrixRows(
  products: Product[],
  locale: string
): CategoryMatrixRow[] {
  return products.map((product) => {
    const power = pickSpecification(product, [
      "power",
      "max power",
      "max input power",
      "rated power",
      "output power",
    ]);
    const connector = pickSpecification(product, [
      "connector",
      "charging connector",
      "output connector",
      "interface",
    ]);
    const protocol = pickSpecification(product, ["ocpp", "communication", "software"]);
    const installation = pickSpecification(product, ["installation"]);

    return {
      slug: product.slug,
      sku: product.sku,
      name: productName(product, locale),
      power: power || "-",
      connectorProtocol: [connector, protocol].filter(Boolean).join(" / ") || "-",
      certifications: product.certifications.slice(0, 5).join(" / ") || "-",
      bestFit:
        installation ||
        localizedText(product.description, locale) ||
        productDescription(product, locale),
    };
  });
}

function pickSpecification(product: Product, keys: string[]) {
  const normalizedKeys = keys.map((key) => key.toLowerCase());
  const match = Object.entries(product.specifications).find(([key]) =>
    normalizedKeys.includes(key.toLowerCase())
  );

  return match?.[1] || "";
}

function getCategorySelectionGuidance(categorySlug: string, locale: string) {
  const guidance: Record<string, { en: string; zh: string }> = {
    "portable-charger": {
      en: "For portable chargers, prioritize target plug type, adjustable current, cable length, IP protection, and local safety documentation before comparing price.",
      zh: "便携式充电器应先确认目标插头、可调电流、线长、防护等级和本地安全文件，再比较价格。",
    },
    "home-ac-charger": {
      en: "For home wallbox projects, choose by phase, current, connector, load-balancing needs, enclosure design, and residential certification path.",
      zh: "家用壁挂项目应按相数、电流、接口、动态负载、外壳设计和住宅认证路径选型。",
    },
    "commercial-ac-charger": {
      en: "For commercial AC charging, validate OCPP, MID metering, RFID/payment flow, communication method, and installation model with the target operator platform.",
      zh: "商用交流桩需结合目标运营平台验证 OCPP、MID 计量、RFID/支付流程、通信方式和安装形态。",
    },
    "dc-charger": {
      en: "For DC fast charging, match power module range, connector mix, cooling, grid capacity, OCPP backend, and maintenance access before selecting cabinet size.",
      zh: "直流快充应先匹配功率模块范围、接口组合、散热、电网容量、OCPP 后台和维护空间，再确定柜体规格。",
    },
    "energy-storage": {
      en: "For energy storage charging, assess battery capacity, EMS logic, solar or V2G integration, peak-shaving goals, and site electrical constraints together.",
      zh: "储能充电需综合评估电池容量、EMS 逻辑、光伏或 V2G 接入、削峰目标和站点电力约束。",
    },
  };

  const item = guidance[categorySlug];
  return item?.[locale === "zh" ? "zh" : "en"] || "";
}

function CategoryProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: string;
}) {
  const maxPower =
    product.specifications["Max Power"] ||
    product.specifications["Max Input Power"] ||
    "";
  const certsList = product.certifications.slice(0, 3).join(" · ");
  const image = productImage(product);

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
    >
      <div className="aspect-[6/5] bg-[linear-gradient(180deg,rgba(244,250,255,0.92)_0%,#ffffff_62%)] relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(19,160,255,0.16),transparent_72%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap className="w-16 h-16 text-primary/10" />
        </div>
        <Image
          src={image}
          alt={productName(product, locale)}
          fill
          className="object-contain p-2 sm:p-3 group-hover:scale-[1.03] transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {maxPower && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-navy/80 backdrop-blur-sm text-electric text-xs font-semibold rounded-md">
            {maxPower}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="text-xs text-muted-foreground font-mono mb-1.5">
          {product.sku}
        </div>
        <h2 className="font-heading text-base font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {productName(product, locale)}
        </h2>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {productDescription(product, locale)}
        </p>
        {certsList && (
          <div className="text-xs text-muted-foreground/70 mb-3">
            {certsList}
          </div>
        )}
        <div className="flex items-center gap-1 text-sm font-medium text-primary">
          {locale === "zh" ? "查看详情" : "View Details"}
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
