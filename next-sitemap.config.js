const siteUrl = process.env.SITE_URL || "https://yinglit-ev.vercel.app";

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/api/", "/_next/", "/admin/"] },
    ],
  },
  exclude: ["/admin/*", "/api/*"],
};
