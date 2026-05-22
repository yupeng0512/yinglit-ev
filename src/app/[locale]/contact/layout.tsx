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
    title:
      locale === "zh"
        ? "联系 YINGLITECH 获取电动汽车充电项目报价"
        : "Contact YINGLITECH for EV Charger Project Quotation",
    description:
      locale === "zh"
        ? "联系深圳市盈利科技有限公司，提交电动汽车充电桩、直流快充、商用交流桩、储能充电和ODM/OEM项目询盘。"
        : "Contact Shenzhen Yingli Technology Co., Ltd. for EV charger, DC fast charger, commercial AC charger, energy storage charging, and ODM/OEM project inquiries.",
    image: "/images/hero-products.jpg",
  });
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
