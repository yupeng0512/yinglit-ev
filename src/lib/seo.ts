import type { Metadata } from "next";
import settings from "@/data/settings.json";
import { routing } from "@/i18n/routing";
import type { Product } from "@/lib/types";

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

export function productName(product: Product, locale: string) {
  return product.name[locale] || product.name.en || Object.values(product.name)[0] || product.sku;
}

export function productDescription(product: Product, locale: string) {
  return (
    product.seo?.description ||
    product.description[locale] ||
    product.description.en ||
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
