// eslint-disable-next-line @typescript-eslint/no-require-imports -- next-sitemap loads this CommonJS config directly.
const products = require("./src/data/products.json");
// eslint-disable-next-line @typescript-eslint/no-require-imports -- next-sitemap loads this CommonJS config directly.
const categories = require("./src/data/categories.json");
// eslint-disable-next-line @typescript-eslint/no-require-imports -- next-sitemap loads this CommonJS config directly.
const seoPages = require("./src/data/seo-pages.json");

const siteUrl = (process.env.SITE_URL || "https://www.yinglitech.com").replace(/\/+$/, "");
const locales = ["en", "zh"];
const staticPaths = [
  "",
  "/about",
  "/certifications",
  "/contact",
  "/oem-odm",
  "/products",
  "/resources",
  "/solutions",
];

function localizedPath(locale, path) {
  return `/${locale}${path}`;
}

function buildPaths() {
  const productPaths = products
    .filter((product) => product.status === "active")
    .map((product) => `/products/${product.slug}`);
  const categoryPaths = categories.map((category) => `/products/category/${category.slug}`);
  const resourcePaths = seoPages.map((page) => `/resources/${page.slug}`);

  return locales.flatMap((locale) =>
    [...staticPaths, ...categoryPaths, ...resourcePaths, ...productPaths].map((path) =>
      localizedPath(locale, path)
    )
  );
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  autoLastmod: false,
  generateIndexSitemap: false,
  generateRobotsTxt: true,
  additionalPaths: async () =>
    buildPaths().map((loc) => ({
      loc,
      changefreq: loc.includes("/products/") ? "weekly" : "monthly",
      priority:
        loc === "/en" || loc === "/zh"
          ? 1.0
          : loc.includes("/products/category/") || loc.includes("/resources/")
            ? 0.85
            : loc.includes("/products/")
              ? 0.8
              : 0.7,
    })),
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/api/", "/_next/", "/admin/"] },
    ],
  },
  exclude: ["/", "/admin/*", "/api/*"],
};
