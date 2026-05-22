const baseUrl = (process.argv[2] || "https://www.yinglitech.com").replace(/\/+$/, "");

const pages = [
  "/en",
  "/en/resources/ocpp-ev-charger",
  "/en/resources/ac-vs-dc-ev-charger",
  "/en/products/category/dc-charger",
  "/en/products/super-dc-120kw",
  "/en/contact",
];

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

const pageResults = [];
for (const path of pages) {
  const result = await fetchText(path);
  pageResults.push({
    path,
    status: result.status,
    finalUrl: result.finalUrl,
    ms: result.ms,
    title: result.text.match(/<title>(.*?)<\/title>/)?.[1] || null,
    canonicalOk: result.text.includes(`rel="canonical" href="https://www.yinglitech.com${path}"`),
    hasHrefLang: result.text.includes('rel="alternate"') || result.text.includes('hrefLang='),
    hasArticleJsonLd: result.text.includes('"@type":"Article"'),
    hasFaqJsonLd: result.text.includes('"@type":"FAQPage"'),
    hasProductJsonLd: result.text.includes('"@type":"Product"'),
    hasDirectAnswer: /Direct Answer|直接答案/.test(result.text),
    hasEntityFacts: /Brand Entity Facts|品牌实体信息/.test(result.text),
    error: result.error,
  });
}

const sitemap = await fetchText("/sitemap.xml");
const robots = await fetchText("/robots.txt");
const sitemapUrls = [...sitemap.text.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  pages: pageResults,
  sitemap: {
    status: sitemap.status,
    count: sitemapUrls.length,
    unique: new Set(sitemapUrls).size,
    hasVercel: sitemapUrls.some((url) => url.includes("vercel.app")),
    resourceUrls: sitemapUrls.filter((url) => url.includes("/resources")).length,
    categoryUrls: sitemapUrls.filter((url) => url.includes("/products/category/")).length,
  },
  robots: {
    status: robots.status,
    hasProductionSitemap: robots.text.includes("Sitemap: https://www.yinglitech.com/sitemap.xml"),
    hasAiCrawlers: ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Claude-SearchBot"].every((agent) =>
      robots.text.includes(`User-agent: ${agent}`)
    ),
    blocksInternalPaths: ["/api/", "/_next/", "/admin/"].every((path) =>
      robots.text.includes(`Disallow: ${path}`)
    ),
    hasVercel: robots.text.includes("vercel.app"),
  },
  privateDataNeeded: [
    "Google Search Console query and page performance exports",
    "Google Search Console indexing and sitemap status",
    "Bing Webmaster Tools search and AI Performance screenshots or exports",
    "Manual AI answer test table for the query set",
  ],
};

console.log(JSON.stringify(report, null, 2));
