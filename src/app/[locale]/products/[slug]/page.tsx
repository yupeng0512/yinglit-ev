import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProvider } from "@/lib/provider";
import { ProductDetailClient } from "@/components/product/product-detail-client";
import {
  buildPageMetadata,
  buildProductJsonLd,
  productDescription,
  productImage,
  productName,
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
  const provider = await getProvider();
  const product = await provider.getProductBySlug(slug, locale);

  if (!product) {
    notFound();
  }

  const relatedProducts = await provider.getProducts({
    category: product.category,
    locale,
    limit: 4,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildProductJsonLd(product, locale)),
        }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts.filter((p) => p.slug !== product.slug).slice(0, 3)}
      />
    </>
  );
}
