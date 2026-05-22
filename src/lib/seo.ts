import type { Metadata } from "next";
import settings from "@/data/settings.json";
import { routing } from "@/i18n/routing";
import type { Category, GeoFaq, Product, SeoPage } from "@/lib/types";

export type Locale = (typeof routing.locales)[number];

export const SITE_URL = normalizeSiteUrl(
  process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    settings.siteUrl ||
    "https://www.yinglitech.com"
);

export const DEFAULT_LOCALE = routing.defaultLocale as Locale;

export function normalizeSiteUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export function toLocale(value: string): Locale {
  return routing.locales.includes(value as Locale)
    ? (value as Locale)
    : DEFAULT_LOCALE;
}

export function localizedPath(path: string, locale: Locale) {
  const normalizedPath = path === "/" ? "" : path.replace(/^\/?/, "/");
  return `/${locale}${normalizedPath}`;
}

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function localizedUrl(path: string, locale: Locale) {
  return absoluteUrl(localizedPath(path, locale));
}

export function languageAlternates(path: string) {
  return {
    en: localizedUrl(path, "en"),
    zh: localizedUrl(path, "zh"),
    "x-default": localizedUrl(path, DEFAULT_LOCALE),
  };
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  image = "/images/hero-home.jpg",
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const safeLocale = toLocale(locale);
  const url = localizedUrl(path, safeLocale);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "YINGLITECH",
      images: [{ url: imageUrl }],
      locale: safeLocale === "zh" ? "zh_CN" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function localizedText(value: Record<string, string>, locale: string) {
  return value[locale] || value.en || Object.values(value)[0] || "";
}

export function buildCategoryMetadata(category: Category, locale: string): Metadata {
  const title =
    locale === "zh"
      ? `${localizedText(category.name, locale)} - 盈利科技电动汽车充电产品`
      : `${localizedText(category.name, locale)} - YINGLITECH EV Charger Products`;
  const description =
    locale === "zh"
      ? `${localizedText(category.description, locale)} 查看盈利科技${localizedText(category.name, locale)}产品、技术参数和ODM/OEM询盘方案。`
      : `${localizedText(category.description, locale)} Compare YINGLITECH ${localizedText(category.name, locale)} products, specifications, and ODM/OEM inquiry options.`;

  return buildPageMetadata({
    locale,
    path: `/products/category/${category.slug}`,
    title,
    description,
    image: category.image || "/images/hero-products.jpg",
  });
}

export function buildResourceMetadata(page: SeoPage, locale: string): Metadata {
  return buildPageMetadata({
    locale,
    path: `/resources/${page.slug}`,
    title: localizedText(page.title, locale),
    description: localizedText(page.description, locale),
    image: "/images/hero-products.jpg",
  });
}

export function productName(product: Product, locale: string) {
  return localizedText(product.name, locale) || product.sku;
}

export function productDescription(product: Product, locale: string) {
  return (
    product.seo?.description ||
    localizedText(product.description, locale) ||
    product.features.join(". ")
  );
}

export function productImage(product: Product) {
  return product.media?.pdp?.src || product.images[0]?.src || "/images/hero-products.jpg";
}

export function buildProductJsonLd(product: Product, locale: string) {
  const safeLocale = toLocale(locale);
  const path = `/products/${product.slug}`;
  const images = product.images.map((image) => absoluteUrl(image.src));
  const primaryImage = absoluteUrl(productImage(product));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName(product, safeLocale),
    description: productDescription(product, safeLocale),
    sku: product.sku,
    category: product.category,
    image: images.length ? images : [primaryImage],
    url: localizedUrl(path, safeLocale),
    brand: {
      "@type": "Brand",
      name: "YINGLITECH",
    },
    manufacturer: {
      "@type": "Organization",
      name: settings.companyName,
      url: SITE_URL,
    },
    additionalProperty: Object.entries(product.specifications).map(([name, value]) => ({
      "@type": "PropertyValue",
      name,
      value,
    })),
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; item: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.item),
    })),
  };
}

export function buildItemListJsonLd(
  items: Array<{ name: string; url: string; description?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(item.url),
      name: item.name,
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

export function buildArticleJsonLd({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
}) {
  const safeLocale = toLocale(locale);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: safeLocale,
    mainEntityOfPage: localizedUrl(path, safeLocale),
    author: {
      "@type": "Organization",
      name: "YINGLITECH",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "YINGLITECH",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo-yingli.png"),
      },
    },
  };
}

export function buildFaqJsonLd(faqs: GeoFaq[], locale: string) {
  const safeLocale = toLocale(locale);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: safeLocale,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: localizedText(faq.question, safeLocale),
      acceptedAnswer: {
        "@type": "Answer",
        text: localizedText(faq.answer, safeLocale),
      },
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "YINGLITECH",
    legalName: settings.companyName,
    url: SITE_URL,
    logo: absoluteUrl("/logo-yingli.png"),
    email: settings.contact.email,
    telephone: settings.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Building 3, 3rd Floor, Granda Equipment Industrial Park, No. 33 Longtian Street",
      addressLocality: "Shenzhen",
      addressRegion: "Guangdong",
      addressCountry: "CN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: settings.contact.email,
      telephone: settings.contact.phone,
      availableLanguage: ["English", "Chinese"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "YINGLITECH",
    url: SITE_URL,
    inLanguage: ["en", "zh"],
  };
}
