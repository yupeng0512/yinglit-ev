import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, Zap } from "lucide-react";
import { getProvider } from "@/lib/provider";
import { getGeoPageContent } from "@/lib/geo-content";
import { getSeoPageBySlug, getSeoPages } from "@/lib/seo-pages";
import type { Product } from "@/lib/types";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildResourceMetadata,
  localizedPath,
  localizedText,
  productDescription,
  productImage,
  productName,
  toLocale,
} from "@/lib/seo";

export function generateStaticParams() {
  return getSeoPages().flatMap((page) => [
    { locale: "en", slug: page.slug },
    { locale: "zh", slug: page.slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getSeoPageBySlug(slug);

  if (!page) {
    return {};
  }

  return buildResourceMetadata(page, locale);
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const safeLocale = toLocale(locale);
  const page = getSeoPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const geoContent = getGeoPageContent(page);
  const provider = await getProvider();
  const [categories, relatedProductResults] = await Promise.all([
    provider.getCategories(safeLocale),
    Promise.all(
      page.relatedProductSlugs.map((productSlug) =>
        provider.getProductBySlug(productSlug, safeLocale)
      )
    ),
  ]);
  const relatedProducts = relatedProductResults.filter(Boolean) as Product[];
  const relatedCategories = categories.filter((category) =>
    page.relatedCategorySlugs.includes(category.slug)
  );
  const resourcePath = `/resources/${page.slug}`;
  const title = localizedText(page.title, safeLocale);
  const description = localizedText(page.description, safeLocale);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    {
      name: safeLocale === "zh" ? "首页" : "Home",
      item: localizedPath("/", safeLocale),
    },
    {
      name: safeLocale === "zh" ? "资源中心" : "Resources",
      item: localizedPath("/resources", safeLocale),
    },
    {
      name: title,
      item: localizedPath(resourcePath, safeLocale),
    },
  ]);
  const articleJsonLd = buildArticleJsonLd({
    locale: safeLocale,
    path: resourcePath,
    title,
    description,
    image: "/images/hero-products.jpg",
    datePublished: page.publishedAt,
    dateModified: page.updatedAt,
  });
  const itemListJsonLd = buildItemListJsonLd(
    relatedProducts.map((product) => ({
      name: productName(product, safeLocale),
      description: productDescription(product, safeLocale),
      url: localizedPath(`/products/${product.slug}`, safeLocale),
    }))
  );
  const evidenceRows = buildManufacturerEvidenceRows(relatedProducts, safeLocale);
  const quoteRequirements = buildQuoteRequirements(safeLocale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {relatedProducts.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <article className="pt-24 lg:pt-28 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
                <BookOpen className="w-4 h-4" />
                {safeLocale === "zh" ? "采购与技术指南" : "Buying and Technical Guide"}
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                {title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                {localizedText(page.hero, safeLocale)}
              </p>
              <div className="mt-4 text-sm text-muted-foreground">
                {safeLocale === "zh" ? "更新时间：" : "Updated: "}
                <time dateTime={page.updatedAt}>
                  {formatDisplayDate(page.updatedAt, safeLocale)}
                </time>
              </div>

              <section className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <h2 className="font-heading text-xl font-semibold mb-3">
                  {safeLocale === "zh" ? "直接答案" : "Direct Answer"}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {localizedText(geoContent.directAnswer, safeLocale)}
                </p>
              </section>

              <div className="mt-10 space-y-8">
                {page.sections.map((section) => (
                  <section key={localizedText(section.heading, "en")}>
                    <h2 className="font-heading text-2xl font-bold mb-3">
                      {localizedText(section.heading, safeLocale)}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {localizedText(section.body, safeLocale)}
                    </p>
                  </section>
                ))}
              </div>

              <section className="mt-14 border-t border-border pt-10">
                <h2 className="font-heading text-2xl font-bold mb-3">
                  {safeLocale === "zh" ? "采购判断标准" : "Buyer Criteria"}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {safeLocale === "zh"
                    ? "AI搜索和人工采购都会优先提取清晰的判断标准。以下维度用于把询价需求从泛泛描述变成可验证的项目条件。"
                    : "AI search systems and human buyers both extract clear decision criteria. Use the following points to turn a broad inquiry into verifiable project requirements."}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {geoContent.buyerCriteria.map((criterion) => (
                    <div
                      key={localizedText(criterion.label, "en")}
                      className="rounded-xl border border-border bg-card p-5"
                    >
                      <h3 className="font-heading text-lg font-semibold mb-2">
                        {localizedText(criterion.label, safeLocale)}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {localizedText(criterion.guidance, safeLocale)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-14 border-t border-border pt-10">
                <h2 className="font-heading text-2xl font-bold mb-3">
                  {safeLocale === "zh" ? "规格快照" : "Spec Snapshot"}
                </h2>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full min-w-[720px] border-collapse bg-card text-sm">
                    <thead className="bg-muted/60 text-left">
                      <tr>
                        <th className="px-4 py-3 font-semibold">
                          {safeLocale === "zh" ? "维度" : "Dimension"}
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          {safeLocale === "zh" ? "建议范围" : "Recommended Scope"}
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          {safeLocale === "zh" ? "采购备注" : "Buyer Note"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {geoContent.specSnapshot.map((row) => (
                        <tr
                          key={localizedText(row.label, "en")}
                          className="border-t border-border"
                        >
                          <td className="px-4 py-3 font-medium text-foreground">
                            {localizedText(row.label, safeLocale)}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {localizedText(row.value, safeLocale)}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {localizedText(row.note, safeLocale)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {evidenceRows.length > 0 && (
                <section className="mt-14 border-t border-border pt-10">
                  <h2 className="font-heading text-2xl font-bold mb-3">
                    {safeLocale === "zh"
                      ? "厂家一手产品证据"
                      : "Manufacturer Evidence"}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {safeLocale === "zh"
                      ? "以下信息来自 YINGLITECH 当前产品数据，用于把采购指南和真实型号、功率、接口、认证及使用场景对应起来。"
                      : "The table below is drawn from current YINGLITECH product data, connecting the guide to real SKUs, power levels, connector options, certifications, and use cases."}
                  </p>
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full min-w-[860px] border-collapse bg-card text-sm">
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
                            {safeLocale === "zh" ? "典型场景" : "Typical Use"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {evidenceRows.map((row) => (
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
                              {row.useCase}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              <section className="mt-14 border-t border-border pt-10">
                <h2 className="font-heading text-2xl font-bold mb-3">
                  {safeLocale === "zh"
                    ? "报价需要提供的信息"
                    : "What to send for quotation"}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {safeLocale === "zh"
                    ? "为了减少反复确认，请在询盘里尽量提供以下项目条件。信息越完整，YINGLITECH 越容易给出匹配型号、认证路径和项目报价。"
                    : "To reduce back-and-forth, include the following project conditions in the inquiry. Clear inputs help YINGLITECH match models, certification paths, and quotation scope."}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quoteRequirements.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-border bg-card p-5"
                    >
                      <h3 className="font-heading text-base font-semibold mb-2">
                        {item.label}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.guidance}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-14 border-t border-border pt-10">
                <h2 className="font-heading text-2xl font-bold mb-6">
                  {safeLocale === "zh" ? "常见问题" : "Common Questions"}
                </h2>
                <div className="space-y-4">
                  {geoContent.faqs.map((faq) => (
                    <div
                      key={localizedText(faq.question, "en")}
                      className="rounded-xl border border-border bg-card p-5"
                    >
                      <h3 className="font-heading text-lg font-semibold mb-2">
                        {localizedText(faq.question, safeLocale)}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {localizedText(faq.answer, safeLocale)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-14 rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <h2 className="font-heading text-2xl font-bold mb-3">
                  {safeLocale === "zh" ? "YINGLITECH 适配说明" : "YINGLITECH Fit"}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {localizedText(geoContent.yinglitechFit, safeLocale)}
                </p>
                <Link
                  href={`/${safeLocale}/contact`}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {safeLocale === "zh" ? "提交项目询盘" : "Send Project Inquiry"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </section>

              {relatedProducts.length > 0 && (
                <section className="mt-14 border-t border-border pt-10">
                  <div className="mb-6">
                    <h2 className="font-heading text-2xl font-bold">
                      {safeLocale === "zh" ? "相关产品" : "Related Products"}
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      {safeLocale === "zh"
                        ? "从指南继续进入具体型号，查看参数并提交项目询盘。"
                        : "Move from the guide to specific models, specifications, and project inquiry."}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {relatedProducts.map((product) => (
                      <RelatedProductCard
                        key={product.slug}
                        product={product}
                        locale={safeLocale}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="lg:sticky lg:top-28 space-y-5">
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="font-heading text-lg font-semibold mb-3">
                  {safeLocale === "zh" ? "相关分类" : "Related Categories"}
                </h2>
                <div className="space-y-2">
                  {relatedCategories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/${safeLocale}/products/category/${category.slug}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm hover:border-primary/30 hover:text-primary transition-colors"
                    >
                      <span>{localizedText(category.name, safeLocale)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <h2 className="font-heading text-lg font-semibold mb-3">
                  {safeLocale === "zh" ? "需要项目报价？" : "Need a Project Quote?"}
                </h2>
                <ul className="space-y-2 text-sm text-muted-foreground mb-5">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {safeLocale === "zh" ? "支持ODM/OEM沟通" : "ODM/OEM cooperation"}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {safeLocale === "zh" ? "24小时内响应询盘" : "Inquiry response within 24 hours"}
                  </li>
                </ul>
                <Link
                  href={`/${safeLocale}/contact`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {safeLocale === "zh" ? "发送询盘" : "Send Inquiry"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}

type EvidenceRow = {
  slug: string;
  sku: string;
  name: string;
  power: string;
  connectorProtocol: string;
  certifications: string;
  useCase: string;
};

function buildManufacturerEvidenceRows(
  products: Product[],
  locale: string
): EvidenceRow[] {
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
    const connectorProtocol = [connector, protocol].filter(Boolean).join(" / ");
    const installation = pickSpecification(product, ["installation"]);

    return {
      slug: product.slug,
      sku: product.sku,
      name: productName(product, locale),
      power: power || "-",
      connectorProtocol: connectorProtocol || "-",
      certifications: product.certifications.slice(0, 5).join(" / ") || "-",
      useCase:
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

function buildQuoteRequirements(locale: string) {
  if (locale === "zh") {
    return [
      {
        label: "国家/地区与车辆接口",
        guidance: "说明目的市场、车辆类型、接口标准，例如 Type 2、CCS2、CCS1、NACS、GB/T 或 CHAdeMO。",
      },
      {
        label: "功率、数量与安装场景",
        guidance: "提供目标功率、预计数量、墙装/立柱/公共站点/车队场站等安装方式，以及是否需要后续扩容。",
      },
      {
        label: "认证与并网要求",
        guidance: "列明 CE、UKCA、IEC、MID、OCPP、当地电网或客户项目要求，便于提前确认文件路径。",
      },
      {
        label: "CMS/OCPP 与运营方式",
        guidance: "说明是否需要接入第三方平台、RFID、支付、远程启动、负载管理或运营商自有 App。",
      },
      {
        label: "ODM/OEM 范围",
        guidance: "如需品牌、外壳、线缆、包装、说明书、语言或固件定制，请在询盘中明确范围。",
      },
      {
        label: "时间线与交付条件",
        guidance: "提供样品时间、试点时间、批量交付目标、目标港口或贸易条款，便于估算供货节奏。",
      },
    ];
  }

  return [
    {
      label: "Country and connector",
      guidance:
        "Share the destination market, vehicle base, and connector standard such as Type 2, CCS2, CCS1, NACS, GB/T, or CHAdeMO.",
    },
    {
      label: "Power, quantity, and installation",
      guidance:
        "State the target power, expected quantity, wall-mounted or pedestal installation, public site or fleet depot use, and future expansion needs.",
    },
    {
      label: "Certification and grid requirements",
      guidance:
        "List CE, UKCA, IEC, MID, OCPP, local grid, or project-specific documentation requirements before samples are selected.",
    },
    {
      label: "CMS/OCPP operation model",
      guidance:
        "Confirm whether the charger must connect to a third-party CMS, RFID, payment flow, remote start, load management, or an operator app.",
    },
    {
      label: "ODM/OEM scope",
      guidance:
        "For private label projects, specify branding, enclosure, cable, packaging, manual language, firmware, or app customization needs.",
    },
    {
      label: "Timeline and delivery terms",
      guidance:
        "Share sample timing, pilot timing, mass-delivery target, destination port, and preferred trade terms for a realistic quotation.",
    },
  ];
}

function formatDisplayDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));
}

function RelatedProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: string;
}) {
  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
    >
      <div className="relative aspect-[6/5] border-b border-border/60 bg-[linear-gradient(180deg,rgba(244,250,255,0.92)_0%,#ffffff_62%)]">
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap className="w-14 h-14 text-primary/10" />
        </div>
        <Image
          src={productImage(product)}
          alt={productName(product, locale)}
          fill
          className="object-contain p-3 group-hover:scale-[1.03] transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
        />
      </div>
      <div className="p-4">
        <div className="text-xs text-muted-foreground font-mono mb-1">
          {product.sku}
        </div>
        <h3 className="font-heading font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {productName(product, locale)}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {productDescription(product, locale)}
        </p>
      </div>
    </Link>
  );
}
