import fs from "node:fs/promises";

const args = process.argv.slice(2);
const wantsJson = args.includes("--json");
const baseUrl = (args.find((arg) => !arg.startsWith("--")) || "https://www.yinglitech.com").replace(
  /\/+$/,
  ""
);

const pageTargets = [
  { path: "/en", group: "homepage" },
  { path: "/en/resources/ocpp-ev-charger", group: "resource" },
  { path: "/en/resources/dc-fast-charger-site-planning", group: "resource" },
  { path: "/en/products/category/dc-charger", group: "category" },
  { path: "/en/products/super-dc-120kw", group: "product" },
  { path: "/en/contact", group: "contact" },
];

async function computeExpectedSitemapCount() {
  const [productsRaw, categoriesRaw, seoPagesRaw] = await Promise.all([
    fs.readFile("src/data/products.json", "utf8"),
    fs.readFile("src/data/categories.json", "utf8"),
    fs.readFile("src/data/seo-pages.json", "utf8"),
  ]);
  const products = JSON.parse(productsRaw);
  const categories = JSON.parse(categoriesRaw);
  const seoPages = JSON.parse(seoPagesRaw);
  const locales = ["en", "zh"];
  const staticPathCount = 8;
  const activeProductCount = products.filter((product) => product.status === "active").length;

  return locales.length * (staticPathCount + activeProductCount + categories.length + seoPages.length);
}

async function fetchText(path) {
  try {
    const started = Date.now();
    const response = await fetch(`${baseUrl}${path}`, { redirect: "follow" });
    const text = await response.text();
    return {
      ok: true,
      status: response.status,
      finalUrl: response.url,
      ms: Date.now() - started,
      text,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      finalUrl: `${baseUrl}${path}`,
      ms: 0,
      error: error instanceof Error ? error.message : String(error),
      text: "",
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
  return text.includes(`"@type":"${type}"`);
}

function inspectContent(target, result) {
  const text = result.text;
  return {
    path: target.path,
    group: target.group,
    status: result.status,
    finalUrl: result.finalUrl,
    ms: result.ms,
    title: text.match(/<title>(.*?)<\/title>/)?.[1] || null,
    canonicalOk: hasCanonical(text, target.path),
    hasHrefLang: hasHrefLang(text),
    hasOrganizationJsonLd: hasJsonLdType(text, "Organization"),
    hasArticleJsonLd: hasJsonLdType(text, "Article"),
    hasArticleDates: text.includes('"datePublished"') && text.includes('"dateModified"'),
    hasProductJsonLd: hasJsonLdType(text, "Product"),
    hasBreadcrumbJsonLd: hasJsonLdType(text, "BreadcrumbList"),
    hasItemListJsonLd: hasJsonLdType(text, "ItemList"),
    hasDirectAnswer: /Direct Answer|直接答案/.test(text),
    hasManufacturerEvidence: /Manufacturer Evidence|厂家一手产品证据/.test(text),
    hasCategoryMatrix: /Category Specification Matrix|分类规格矩阵/.test(text),
    hasQuotationRequirements: /What to send for quotation|报价需要提供的信息/.test(text),
    hasVisibleFaq: /Common Questions|常见问题/.test(text),
    hasEntityFacts: /Brand Entity Facts|品牌实体信息/.test(text),
    hasOfferMarkup: text.includes('"offers"'),
    error: result.error,
  };
}

const expectedSitemapCount = await computeExpectedSitemapCount().catch(() => 132);
const pages = [];
for (const target of pageTargets) {
  const result = await fetchText(target.path);
  pages.push(inspectContent(target, result));
}

const sitemap = await fetchText("/sitemap.xml");
const robots = await fetchText("/robots.txt");
const sitemapUrls = [...sitemap.text.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const missingSeoRoutes = pages
  .filter((page) => ["resource", "category"].includes(page.group) && page.status !== 200)
  .map((page) => page.path);
const hasVercelLeak =
  sitemapUrls.some((url) => url.includes("vercel.app")) || robots.text.includes("vercel.app");
const robotsBlocksNext =
  robots.text.includes("Disallow: /_next/") ||
  robots.text.includes("Disallow: /_next/static") ||
  robots.text.includes("Disallow: /_next/image");

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  expectedSitemapCount,
  productionDrift: {
    latestSeoLikelyLive:
      sitemap.status === 200 &&
      sitemapUrls.length === expectedSitemapCount &&
      !hasVercelLeak &&
      missingSeoRoutes.length === 0,
    staleSitemap: sitemap.status !== 200 || sitemapUrls.length !== expectedSitemapCount,
    sitemapLooksLikePreviewOnly: sitemapUrls.length <= 1 || hasVercelLeak,
    missingSeoRoutes,
    blockers:
      sitemapUrls.length <= 1 || missingSeoRoutes.length > 0
        ? [
            "Official domain has not served the latest SEO/GEO route set yet. Deploy latest code before judging content effectiveness.",
          ]
        : [],
  },
  crawlability: {
    pages: pages.map((page) => ({
      path: page.path,
      group: page.group,
      status: page.status,
      ms: page.ms,
      canonicalOk: page.canonicalOk,
      hasHrefLang: page.hasHrefLang,
      hasOrganizationJsonLd: page.hasOrganizationJsonLd,
      error: page.error,
    })),
    sitemap: {
      status: sitemap.status,
      count: sitemapUrls.length,
      unique: new Set(sitemapUrls).size,
      expected: expectedSitemapCount,
      hasVercel: sitemapUrls.some((url) => url.includes("vercel.app")),
      hasQueryCategoryUrls: sitemapUrls.some((url) => url.includes("/products?category=")),
      resourceUrls: sitemapUrls.filter((url) => url.includes("/resources")).length,
      categoryUrls: sitemapUrls.filter((url) => url.includes("/products/category/")).length,
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
  },
  contentExtraction: {
    resources: pages
      .filter((page) => page.group === "resource")
      .map((page) => ({
        path: page.path,
        hasDirectAnswer: page.hasDirectAnswer,
        hasManufacturerEvidence: page.hasManufacturerEvidence,
        hasQuotationRequirements: page.hasQuotationRequirements,
        hasVisibleFaq: page.hasVisibleFaq,
        hasArticleJsonLd: page.hasArticleJsonLd,
        hasArticleDates: page.hasArticleDates,
        hasItemListJsonLd: page.hasItemListJsonLd,
      })),
    categories: pages
      .filter((page) => page.group === "category")
      .map((page) => ({
        path: page.path,
        hasCategoryMatrix: page.hasCategoryMatrix,
        hasBreadcrumbJsonLd: page.hasBreadcrumbJsonLd,
        hasItemListJsonLd: page.hasItemListJsonLd,
      })),
    products: pages
      .filter((page) => page.group === "product")
      .map((page) => ({
        path: page.path,
        hasProductJsonLd: page.hasProductJsonLd,
        hasBreadcrumbJsonLd: page.hasBreadcrumbJsonLd,
        hasOfferMarkup: page.hasOfferMarkup,
      })),
    contact: pages
      .filter((page) => page.group === "contact")
      .map((page) => ({
        path: page.path,
        hasEntityFacts: page.hasEntityFacts,
      })),
  },
  businessSignal: {
    unavailableFromPublicCrawl: true,
    requestedUserInputs: [
      "Google Search Console 7/28/90 day Queries export: query, clicks, impressions, CTR, position",
      "Google Search Console 7/28/90 day Pages export: page, clicks, impressions, CTR, position",
      "Google Search Console Indexing > Pages and Sitemaps screenshots or CSV",
      "Bing Webmaster Tools Search Performance and AI Performance exports or screenshots",
      "Weekly AI answer test table for ChatGPT, Perplexity, Claude, Gemini, and Copilot",
      "Aggregated inquiry volume, landing page/source if available, country/product/quantity, and qualified/spam split",
    ],
  },
};

if (!wantsJson) {
  console.error(
    "Public SEO/GEO signal collection finished. Use --json to indicate machine-readable consumption; JSON is printed below for compatibility."
  );
}

console.log(JSON.stringify(report, null, 2));
