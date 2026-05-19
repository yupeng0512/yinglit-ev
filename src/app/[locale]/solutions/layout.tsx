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
    path: "/solutions",
    title: locale === "zh" ? "电动汽车充电解决方案" : "EV Charging Solutions",
    description:
      locale === "zh"
        ? "盈利科技提供家用充电、商用停车场充电、公共直流快充、储能充电和云平台管理解决方案。"
        : "YINGLITECH provides home charging, commercial parking charging, public DC fast charging, energy storage charging, and cloud management solutions.",
    image: "/images/solutions/commercial.jpg",
  });
}

export default function SolutionsSeoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
