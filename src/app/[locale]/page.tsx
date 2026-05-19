import type { Metadata } from "next";
import { getProvider } from "@/lib/provider";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { SolutionsOverview } from "@/components/home/solutions-overview";
import { WhyUsSection } from "@/components/home/why-us-section";
import { CtaSection } from "@/components/home/cta-section";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    path: "/",
    title:
      locale === "zh"
        ? "盈利科技电动汽车充电桩解决方案制造商"
        : "EV Charger Manufacturer & Charging Solutions",
    description:
      locale === "zh"
        ? "盈利科技提供3.5KW便携式充电器、7-22KW交流充电桩、30-720KW直流快充、储能充电和ODM/OEM服务。"
        : "YINGLITECH manufactures full-range EV charging solutions from 3.5KW portable chargers to 720KW DC fast chargers, with ODM and OEM services for global markets.",
    image: "/images/hero-home.jpg",
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const provider = await getProvider();
  const categories = await provider.getCategories(locale);
  const settings = await provider.getSiteSettings();

  return (
    <>
      <HeroSection />
      <StatsSection stats={settings.stats} />
      <CategoriesSection categories={categories} />
      <SolutionsOverview />
      <WhyUsSection />
      <CtaSection />
    </>
  );
}
