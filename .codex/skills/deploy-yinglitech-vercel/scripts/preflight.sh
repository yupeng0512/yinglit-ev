#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-$(pwd)}"
cd "$ROOT"

npm run lint
npm run build

node <<'NODE'
const fs = require("fs");
const products = require("./src/data/products.json");
const categories = require("./src/data/categories.json");
const seoPages = require("./src/data/seo-pages.json");

const locales = ["en", "zh"];
const staticPaths = ["", "/about", "/certifications", "/contact", "/oem-odm", "/products", "/resources", "/solutions"];
const expected = locales.length * (
  staticPaths.length +
  products.filter((product) => product.status === "active").length +
  categories.length +
  seoPages.length
);

const sitemap = fs.readFileSync("public/sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const robots = fs.readFileSync("public/robots.txt", "utf8");

const requiredRobots = [
  "Sitemap: https://www.yinglitech.com/sitemap.xml",
  "User-agent: OAI-SearchBot",
  "User-agent: ChatGPT-User",
  "User-agent: PerplexityBot",
  "User-agent: Claude-SearchBot",
  "Disallow: /api/",
  "Disallow: /_next/",
  "Disallow: /admin/",
];

const report = {
  expected,
  sitemapCount: urls.length,
  uniqueUrls: new Set(urls).size,
  hasVercelUrl: urls.some((url) => url.includes("vercel.app")) || robots.includes("vercel.app"),
  hasQueryCategoryUrl: urls.some((url) => url.includes("/products?category=")),
  missingRobots: requiredRobots.filter((item) => !robots.includes(item)),
};

console.log(JSON.stringify(report, null, 2));

if (
  report.sitemapCount !== expected ||
  report.uniqueUrls !== expected ||
  report.hasVercelUrl ||
  report.hasQueryCategoryUrl ||
  report.missingRobots.length
) {
  process.exit(1);
}
NODE
