export type MediaAsset = {
  src: string;
  alt: string;
  role?: "listing" | "pdp" | "gallery" | "variant";
};

export type ProductMedia = {
  listing?: MediaAsset;
  pdp?: MediaAsset;
  gallery?: MediaAsset[];
  variants?: Record<string, MediaAsset>;
};

export type Product = {
  slug: string;
  sku: string;
  name: Record<string, string>;
  category: string;
  description: Record<string, string>;
  features: string[];
  images: { src: string; alt: string }[];
  media?: ProductMedia;
  specifications: Record<string, string>;
  variants: { name: string; value: string }[];
  certifications: string[];
  status: "active" | "draft" | "archived";
  price?: { amount: number; currency: string; moq?: number };
  seo?: { title?: string; description?: string };
  moq?: number;
};

export type LocalizedText = {
  en: string;
  zh: string;
  [locale: string]: string;
};

export type Category = {
  slug: string;
  name: Record<string, string>;
  description: Record<string, string>;
  icon: string;
  order: number;
  image?: string;
  productCount?: number;
};

export type SeoPageSection = {
  heading: LocalizedText;
  body: LocalizedText;
};

export type GeoBuyerCriterion = {
  label: LocalizedText;
  guidance: LocalizedText;
};

export type GeoSpecRow = {
  label: LocalizedText;
  value: LocalizedText;
  note: LocalizedText;
};

export type GeoFaq = {
  question: LocalizedText;
  answer: LocalizedText;
};

export type GeoPageContent = {
  directAnswer: LocalizedText;
  buyerCriteria: GeoBuyerCriterion[];
  specSnapshot: GeoSpecRow[];
  faqs: GeoFaq[];
  yinglitechFit: LocalizedText;
};

export type SeoPage = {
  slug: string;
  intent: string;
  publishedAt: string;
  updatedAt: string;
  title: LocalizedText;
  description: LocalizedText;
  hero: LocalizedText;
  sections: SeoPageSection[];
  relatedProductSlugs: string[];
  relatedCategorySlugs: string[];
};

export type SiteSettings = {
  siteName: string;
  companyName: string;
  siteUrl: string;
  logo: string;
  mode: "b2b" | "b2c" | "hybrid";
  defaultLocale: string;
  locales: string[];
  contact: {
    email: string;
    phone: string;
    wechat?: string;
    whatsapp?: string;
    salesPerson?: string;
    address: Record<string, string>;
  };
  features: Record<string, boolean>;
  stats: Record<string, string>;
  seo: {
    titleTemplate: string;
    defaultDescription: string;
  };
};

export interface DataProvider {
  getProducts(options?: {
    category?: string;
    locale?: string;
    status?: string;
    limit?: number;
  }): Promise<Product[]>;
  getProductBySlug(slug: string, locale?: string): Promise<Product | null>;
  getCategories(locale?: string): Promise<Category[]>;
  getSiteSettings(): Promise<SiteSettings>;
}
