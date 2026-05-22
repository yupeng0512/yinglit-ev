# Private Data Request Guide

Ask for only the smallest dataset needed. If the user cannot provide it, continue with public signals and mark the analysis as limited.

## Google Search Console

Request either screenshots or CSV exports for the last 7, 28, and 90 days:

- Performance > Search results > Queries: query, clicks, impressions, CTR, position.
- Performance > Search results > Pages: page, clicks, impressions, CTR, position.
- Indexing > Pages: indexed count, not indexed reasons, affected URLs.
- Sitemaps: submitted sitemap URL, status, discovered URLs, last read date.
- URL Inspection for:
  - `https://www.yinglitech.com/en`
  - `https://www.yinglitech.com/en/resources/ocpp-ev-charger`
  - `https://www.yinglitech.com/en/products/category/dc-charger`
  - `https://www.yinglitech.com/en/products/super-dc-120kw`

## Bing Webmaster Tools

Request screenshots or exports for:

- Search performance: pages and queries.
- Indexing status for sitemap and key pages.
- AI Performance if available: total citations, cited pages, grounding queries, and page-level citation activity.

## AI Search Manual Tests

Ask the user to run the query set in `query-set.md` in the AI products they use. Request a simple table:

| Date | Platform | Query | YINGLITECH mentioned? | Official URL cited? | Cited URL | Answer accurate? | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |

Do not ask for account credentials or session cookies. Screenshots are acceptable if exports are unavailable.

## Inquiry Quality

If the user wants business impact analysis, request only aggregated data:

- number of inquiry emails by week
- source or landing page if available
- country / product interest / quantity where available
- spam vs qualified split

Do not request raw personal data unless the user explicitly needs lead-level debugging.
