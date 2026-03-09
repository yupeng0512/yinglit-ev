import { useTranslations } from "next-intl";
import { getProvider } from "@/lib/provider";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { SolutionsOverview } from "@/components/home/solutions-overview";
import { WhyUsSection } from "@/components/home/why-us-section";
import { CtaSection } from "@/components/home/cta-section";

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
