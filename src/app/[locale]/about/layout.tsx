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
    path: "/about",
    title: locale === "zh" ? "关于盈利科技" : "About YINGLITECH",
    description:
      locale === "zh"
        ? "了解深圳市盈利科技有限公司的发展历程、研发能力、生产体系和全球电动汽车充电桩项目经验。"
        : "Learn about Shenzhen Yingli Technology, an EV charging station manufacturer with R&D, production, certification, and global project experience since 2017.",
    image: "/images/about/factory.jpg",
  });
}

export default function AboutSeoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
