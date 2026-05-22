import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProvider } from "@/lib/provider";
import { ProductDetailClient } from "@/components/product/product-detail-client";
import {
  buildBreadcrumbJsonLd,
  buildPageMetadata,
  buildProductJsonLd,
  localizedPath,
  localizedText,
  productDescription,
  productImage,
  productName,
  toLocale,
} from "@/lib/seo";

export async function generateStaticParams() {
  const provider = await getProvider();
  const products = await provider.getProducts();
  return products.flatMap((p) => [
    { locale: "en", slug: p.slug },
    { locale: "zh", slug: p.slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const provider = await getProvider();
  const product = await provider.getProductBySlug(slug, locale);

  if (!product) {
    return {};
  }

  return buildPageMetadata({
    locale,
    path: `/products/${product.slug}`,
    title: `${productName(product, locale)} - ${product.sku}`,
    description: productDescription(product, locale),
    image: productImage(product),
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const safeLocale = toLocale(locale);
  const provider = await getProvider();
  const product = await provider.getProductBySlug(slug, safeLocale);

  if (!product) {
    notFound();
  }

  const [categories, relatedProducts] = await Promise.all([
    provider.getCategories(safeLocale),
    provider.getProducts({
      category: product.category,
      locale: safeLocale,
      limit: 4,
    }),
  ]);
  const category = categories.find((item) => item.slug === product.category);
  const breadcrumbItems = [
    {
      name: safeLocale === "zh" ? "首页" : "Home",
      item: localizedPath("/", safeLocale),
    },
    {
      name: safeLocale === "zh" ? "产品中心" : "Products",
      item: localizedPath("/products", safeLocale),
    },
    ...(category
      ? [
          {
            name: localizedText(category.name, safeLocale),
            item: localizedPath(`/products/category/${category.slug}`, safeLocale),
          },
        ]
      : []),
    {
      name: productName(product, safeLocale),
      item: localizedPath(`/products/${product.slug}`, safeLocale),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd(breadcrumbItems)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildProductJsonLd(product, safeLocale)),
        }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts.filter((p) => p.slug !== product.slug).slice(0, 3)}
      />
    </>
  );
}
