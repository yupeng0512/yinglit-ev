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
    path: "/oem-odm",
    title: locale === "zh" ? "电动汽车充电桩 ODM/OEM 服务" : "EV Charger ODM & OEM Services",
    description:
      locale === "zh"
        ? "盈利科技为全球客户提供电动汽车充电桩ODM/OEM服务，覆盖品牌定制、硬件改型、软件平台、认证支持和批量生产。"
        : "YINGLITECH provides EV charger ODM and OEM services covering branding, hardware customization, software platforms, certification support, and scalable production.",
    image: "/images/oem/factory-tour.jpg",
  });
}

export default function OemOdmSeoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
