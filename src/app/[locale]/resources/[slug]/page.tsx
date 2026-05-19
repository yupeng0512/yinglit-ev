import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, Zap } from "lucide-react";
import { getProvider } from "@/lib/provider";
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
  });
  const itemListJsonLd = buildItemListJsonLd(
    relatedProducts.map((product) => ({
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
