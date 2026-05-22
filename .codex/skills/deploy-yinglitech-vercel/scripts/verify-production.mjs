const baseUrl = (process.argv[2] || "https://www.yinglitech.com").replace(/\/+$/, "");

const requiredPages = [
  "/en/resources/ocpp-ev-charger",
  "/en/products/category/dc-charger",
  "/en/resources/ev-charger-manufacturer",
];

async function fetchText(path) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "follow" });
  const text = await response.text();
  return { status: response.status, url: response.url, text };
}

const pageResults = [];
for (const path of requiredPages) {
  const result = await fetchText(path);
  pageResults.push({
    path,
    status: result.status,
    finalUrl: result.url,
    hasCanonical: result.text.includes(`rel="canonical" href="https://www.yinglitech.com${path}"`),
    hasGeoModule: /Direct Answer|直接答案/.test(result.text),
    hasFaqJsonLd: result.text.includes('"@type":"FAQPage"'),
  });
}

const sitemap = await fetchText("/sitemap.xml");
const robots = await fetchText("/robots.txt");
const sitemapUrls = [...sitemap.text.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

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
  },
  robots: {
    status: robots.status,
    hasProductionSitemap: robots.text.includes("Sitemap: https://www.yinglitech.com/sitemap.xml"),
    hasAiCrawlers: ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Claude-SearchBot"].every((agent) =>
      robots.text.includes(`User-agent: ${agent}`)
    ),
    hasBlockedInternalPaths: ["/api/", "/_next/", "/admin/"].every((path) =>
      robots.text.includes(`Disallow: ${path}`)
    ),
    hasVercel: robots.text.includes("vercel.app"),
  },
};

console.log(JSON.stringify(report, null, 2));

const failed =
  pageResults.some((result) => result.status !== 200 || !result.hasCanonical) ||
  report.sitemap.status !== 200 ||
  report.sitemap.hasVercel ||
  !report.sitemap.hasResourceUrls ||
  !report.sitemap.hasCategoryUrls ||
  report.robots.status !== 200 ||
  report.robots.hasVercel ||
  !report.robots.hasProductionSitemap ||
  !report.robots.hasAiCrawlers ||
  !report.robots.hasBlockedInternalPaths;

if (failed) {
  process.exit(1);
}
