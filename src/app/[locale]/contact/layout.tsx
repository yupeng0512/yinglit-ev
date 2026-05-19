import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    path: "/contact",
    title: locale === "zh" ? "联系盈利科技" : "Contact YINGLITECH",
    description:
      locale === "zh"
        ? "联系盈利科技获取电动汽车充电桩、直流快充、储能充电和ODM/OEM项目报价。"
        : "Contact YINGLITECH for EV charger quotations, DC fast charging projects, energy storage charging systems, and ODM/OEM cooperation.",
    image: "/images/hero-products.jpg",
  });
}

export default function ContactSeoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
