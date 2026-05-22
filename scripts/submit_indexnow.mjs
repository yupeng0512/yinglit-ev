import fs from "node:fs/promises";

const args = process.argv.slice(2);
const shouldSubmit = args.includes("--submit");
const siteUrl = normalizeSiteUrl(
  process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.yinglitech.com"
);
const key = process.env.INDEXNOW_KEY?.trim();
const sitemapPath = "public/sitemap.xml";

function normalizeSiteUrl(value) {
  return value.replace(/\/+$/, "");
}

function readSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => match[1])
    .filter((url) => url.startsWith(`${siteUrl}/`));
}

if (!key) {
  console.log(
    JSON.stringify(
      {
        status: "skipped",
        reason: "INDEXNOW_KEY is not set",
        dryRun: !shouldSubmit,
      },
      null,
      2
    )
  );
  process.exit(0);
}

const sitemap = await fs.readFile(sitemapPath, "utf8");
const urlList = readSitemapUrls(sitemap);
const host = new URL(siteUrl).host;
const keyLocation = `${siteUrl}/indexnow-key.txt`;
const payload = {
  host,
  key,
  keyLocation,
  urlList,
};

if (!shouldSubmit) {
  console.log(
    JSON.stringify(
      {
        status: "dry-run",
        host,
        keyLocation,
        urlCount: urlList.length,
        sampleUrls: urlList.slice(0, 8),
        submitCommand: "npm run seo:indexnow -- --submit",
      },
      null,
      2
    )
  );
  process.exit(0);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});
const responseText = await response.text();
const report = {
  status: response.ok ? "submitted" : "failed",
  httpStatus: response.status,
  host,
  keyLocation,
  urlCount: urlList.length,
  response: responseText || null,
};

console.log(JSON.stringify(report, null, 2));

if (![200, 202].includes(response.status)) {
  process.exit(1);
}
