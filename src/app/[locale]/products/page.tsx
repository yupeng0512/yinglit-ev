import { getProvider } from "@/lib/provider";
import { ProductsPageClient } from "@/components/product/products-page-client";

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  const provider = await getProvider();
  const products = await provider.getProducts({
    locale,
    status: "active",
    ...(category ? { category } : {}),
  });
  const categories = await provider.getCategories(locale);

  return (
    <ProductsPageClient
      products={products}
      categories={categories}
      activeCategory={category || ""}
    />
  );
}
