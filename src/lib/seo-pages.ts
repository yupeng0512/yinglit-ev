import seoPagesData from "@/data/seo-pages.json";
import type { SeoPage } from "@/lib/types";

const seoPages = seoPagesData as SeoPage[];

export function getSeoPages() {
  return seoPages;
}

export function getSeoPageBySlug(slug: string) {
  return seoPages.find((page) => page.slug === slug) || null;
}
