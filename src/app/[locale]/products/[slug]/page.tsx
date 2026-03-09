import { notFound } from "next/navigation";
import { getProvider } from "@/lib/provider";
import { ProductDetailClient } from "@/components/product/product-detail-client";

export async function generateStaticParams() {
  const provider = await getProvider();
  const products = await provider.getProducts();
  return products.flatMap((p) => [
    { locale: "en", slug: p.slug },
    { locale: "zh", slug: p.slug },
  ]);
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
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts.filter((p) => p.slug !== product.slug).slice(0, 3)}
    />
  );
}
