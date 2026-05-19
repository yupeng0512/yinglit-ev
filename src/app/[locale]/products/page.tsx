import type { Metadata } from "next";
import { getProvider } from "@/lib/provider";
import { ProductsPageClient } from "@/components/product/products-page-client";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    path: "/products",
    title: locale === "zh" ? "电动汽车充电桩产品" : "EV Charger Products",
    description:
      locale === "zh"
        ? "浏览盈利科技便携式充电器、家用交流桩、商用交流桩、直流快充和储能充电产品，覆盖3.5KW至720KW。"
        : "Explore YINGLITECH portable EV chargers, home AC wallboxes, commercial AC chargers, DC fast chargers, and energy storage charging systems from 3.5KW to 720KW.",
    image: "/images/hero-products.jpg",
  });
}

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
