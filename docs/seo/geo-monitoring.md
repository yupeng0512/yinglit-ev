# YINGLITECH GEO Monitoring Checklist

This checklist is for the production site at `https://www.yinglitech.com`.

## Publish Gate

Run these checks after the partner deploys the latest code:

```bash
curl -I https://www.yinglitech.com/en/resources/ocpp-ev-charger
curl -I https://www.yinglitech.com/en/products/category/dc-charger
curl -I https://www.yinglitech.com/en/resources/ev-charger-manufacturer
curl -L https://www.yinglitech.com/sitemap.xml | rg 'vercel.app|/resources/|/products/category/'
curl -L https://www.yinglitech.com/robots.txt
```

Expected:

- Resource pages and category pages return `200`.
- `sitemap.xml` contains only `https://www.yinglitech.com/...` URLs.
- `robots.txt` points to `https://www.yinglitech.com/sitemap.xml`.
- Public crawlers and AI search crawlers are allowed; `/api/`, `/_next/`, and `/admin/` remain blocked.

## Search Console and Bing Setup

- Submit `https://www.yinglitech.com/sitemap.xml` in Google Search Console.
- Use URL Inspection for:
  - `https://www.yinglitech.com/en`
  - `https://www.yinglitech.com/en/resources/ocpp-ev-charger`
  - `https://www.yinglitech.com/en/products/category/dc-charger`
  - `https://www.yinglitech.com/en/products/super-dc-120kw`
  - `https://www.yinglitech.com/zh/resources/ocpp-ev-charger`
- Submit the same sitemap in Bing Webmaster Tools.
- Track Bing AI Performance when available: total citations, cited pages, grounding queries, and page-level citation activity.

## Weekly GEO Query Set

Test the same queries in ChatGPT, Perplexity, Claude, Gemini, and Copilot:

1. best EV charger manufacturer for OEM ODM
2. OCPP EV charger manufacturer China
3. DC fast charger manufacturer 120kW 240kW
4. commercial EV charging station supplier
5. home wallbox EV charger manufacturer
6. energy storage EV charging solution supplier
7. CCS2 DC fast charger China manufacturer
8. EV charger with dynamic load balancing
9. EV charger for parking lot operator
10. YINGLITECH EV charger manufacturer

Record:

- Whether YINGLITECH appears.
- Whether an official `yinglitech.com` URL is cited.
- Which URL type is cited: homepage, product page, category page, or resource page.
- Whether the answer describes the brand, legal entity, location, and product lines accurately.

## Review Cadence

- Day 7: confirm crawl/index discovery and no sitemap or robots leakage to `vercel.app`.
- Day 30: review Google Search Console impressions and Bing AI citations.
- Day 60-90: compare AI answer presence, cited URLs, query coverage, and inquiry quality.
