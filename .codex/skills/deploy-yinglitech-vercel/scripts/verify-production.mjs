const baseUrl = (process.argv[2] || "https://www.yinglitech.com").replace(/\/+$/, "");

const requiredPages = [
  { path: "/en/resources/ocpp-ev-charger", type: "resource" },
  { path: "/en/resources/ev-charger-manufacturer", type: "resource" },
  { path: "/en/products/category/dc-charger", type: "category" },
  { path: "/en/products/super-dc-120kw", type: "product" },
  { path: "/en/contact", type: "contact" },
];

async function fetchText(path) {
  try {
    const response = await fetch(`${baseUrl}${path}`, { redirect: "follow" });
    const text = await response.text();
    return { ok: true, status: response.status, url: response.url, text };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      url: `${baseUrl}${path}`,
      text: "",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function hasCanonical(text, path) {
  return text.includes(`rel="canonical" href="https://www.yinglitech.com${path}"`);
}

function hasHrefLang(text) {
  return text.includes('rel="alternate"') || text.includes("hreflang=");
}

function hasJsonLdType(text, type) {
  return text.includes(`"@type":"${type}"`) || text.includes(`"@type":["${type}"`);
}

function inspectPage({ path, type }, result) {
  const common = {
    path,
    type,
    status: result.status,
    finalUrl: result.url,
    hasCanonical: hasCanonical(result.text, path),
    hasHrefLang: hasHrefLang(result.text),
    hasOrganizationJsonLd: hasJsonLdType(result.text, "Organization"),
    error: result.error,
  };

  if (type === "resource") {
    return {
      ...common,
      hasArticleJsonLd: hasJsonLdType(result.text, "Article"),
      hasArticleDates:
        result.text.includes('"datePublished"') && result.text.includes('"dateModified"'),
      hasDirectAnswer: /Direct Answer|直接答案/.test(result.text),
      hasManufacturerEvidence: /Manufacturer Evidence|厂家一手产品证据/.test(result.text),
      hasQuotationRequirements: /What to send for quotation|报价需要提供的信息/.test(
        result.text
      ),
      hasVisibleFaq: /Common Questions|常见问题/.test(result.text),
      hasItemListJsonLd: hasJsonLdType(result.text, "ItemList"),
    };
  }

  if (type === "category") {
    return {
      ...common,
      hasBreadcrumbJsonLd: hasJsonLdType(result.text, "BreadcrumbList"),
      hasItemListJsonLd: hasJsonLdType(result.text, "ItemList"),
      hasCategoryMatrix: /Category Specification Matrix|分类规格矩阵/.test(result.text),
      hasRelatedGuides: /Related Buying Guides|相关采购指南/.test(result.text),
    };
  }

  if (type === "product") {
    return {
      ...common,
      hasProductJsonLd: hasJsonLdType(result.text, "Product"),
      hasBreadcrumbJsonLd: hasJsonLdType(result.text, "BreadcrumbList"),
      hasOfferMarkup: result.text.includes('"offers"'),
    };
  }

  return common;
}

function pageFailed(page) {
  if (
    page.status !== 200 ||
    !page.hasCanonical ||
    !page.hasHrefLang ||
    !page.hasOrganizationJsonLd
  ) {
    return true;
  }

  if (page.type === "resource") {
    return (
      !page.hasArticleJsonLd ||
      !page.hasArticleDates ||
      !page.hasDirectAnswer ||
      !page.hasManufacturerEvidence ||
      !page.hasQuotationRequirements ||
      !page.hasVisibleFaq ||
      !page.hasItemListJsonLd
    );
  }

  if (page.type === "category") {
    return !page.hasBreadcrumbJsonLd || !page.hasItemListJsonLd || !page.hasCategoryMatrix;
  }

  if (page.type === "product") {
    return !page.hasProductJsonLd || !page.hasBreadcrumbJsonLd || page.hasOfferMarkup;
  }

  return false;
}

const pageResults = [];
for (const page of requiredPages) {
  const result = await fetchText(page.path);
  pageResults.push(inspectPage(page, result));
}

const sitemap = await fetchText("/sitemap.xml");
const robots = await fetchText("/robots.txt");
const sitemapUrls = [...sitemap.text.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => match[1]
);
const robotsBlocksNext =
  robots.text.includes("Disallow: /_next/") ||
  robots.text.includes("Disallow: /_next/static") ||
  robots.text.includes("Disallow: /_next/image");

const report = {
  baseUrl,
  pageResults,
  sitemap: {
    status: sitemap.status,
    count: sitemapUrls.length,
    unique: new Set(sitemapUrls).size,
    hasVercel: sitemapUrls.some((url) => url.includes("vercel.app")),
    hasResourceUrls: sitemapUrls.some((url) => url.includes("/resources/")),
    hasCategoryUrls: sitemapUrls.some((url) => url.includes("/products/category/")),
    hasQueryCategoryUrls: sitemapUrls.some((url) => url.includes("/products?category=")),
    looksDrifted: sitemapUrls.length <= 1,
  },
  robots: {
    status: robots.status,
    hasProductionSitemap: robots.text.includes("Sitemap: https://www.yinglitech.com/sitemap.xml"),
    hasAiCrawlers: [
      "Googlebot",
      "bingbot",
      "OAI-SearchBot",
      "ChatGPT-User",
      "PerplexityBot",
      "Claude-SearchBot",
      "Claude-User",
      "GPTBot",
      "ClaudeBot",
      "Google-Extended",
    ].every((agent) => robots.text.includes(`User-agent: ${agent}`)),
    blocksApiAdmin: ["/api/", "/admin/"].every((path) =>
      robots.text.includes(`Disallow: ${path}`)
    ),
    blocksNextAssets: robotsBlocksNext,
    hasVercel: robots.text.includes("vercel.app"),
  },
};

console.log(JSON.stringify(report, null, 2));

const failed =
  pageResults.some(pageFailed) ||
  report.sitemap.status !== 200 ||
  report.sitemap.hasVercel ||
  report.sitemap.hasQueryCategoryUrls ||
  report.sitemap.looksDrifted ||
  !report.sitemap.hasResourceUrls ||
  !report.sitemap.hasCategoryUrls ||
  report.robots.status !== 200 ||
  report.robots.hasVercel ||
  !report.robots.hasProductionSitemap ||
  !report.robots.hasAiCrawlers ||
  !report.robots.blocksApiAdmin ||
  report.robots.blocksNextAssets;

if (failed) {
  process.exit(1);
}
