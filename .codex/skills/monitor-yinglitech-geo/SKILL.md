---
name: monitor-yinglitech-geo
description: Monitor and optimize YINGLITECH SEO/GEO performance with a data-driven workflow. Use when the user asks to review SEO or GEO效果, evaluate Google indexing, AI search visibility, Search Console/Bing data, cited pages, sitemap health, resource-page performance, or decide the next content and technical optimization priorities.
---

# Monitor YINGLITECH GEO

## Principles

- Separate public signals from private analytics. Do not fabricate unavailable Search Console, Bing, Vercel, GA, or AI platform metrics.
- Collect public crawl/indexing surface first, then request private data from the user with exact instructions.
- Prioritize fixes in this order: production accessibility, sitemap/robots/canonical, indexing coverage, page impressions/citations, answer accuracy, conversion quality.
- Treat `https://www.yinglitech.com` as the canonical production domain.
- Do not expose credentials, tokens, project IDs, or raw private exports beyond the metrics needed for the analysis.

## Workflow

1. Run public signal collection:

```bash
bash .codex/skills/monitor-yinglitech-geo/scripts/collect-public-signals.sh https://www.yinglitech.com
```

2. If private metrics are needed, read `references/data-request.md` and ask the user for the smallest useful export or screenshot.
3. Use `references/query-set.md` for the weekly AI search query set.
4. Analyze metrics by page group:

- homepage
- product listing and product detail pages
- product category pages
- resource pages
- contact / inquiry path

5. Produce a prioritized optimization list with evidence:

- P0: blocks crawling, indexing, canonical, robots, production deploy, or sitemap
- P1: pages with impressions/citations but poor CTR, weak snippets, or answer mismatch
- P2: missing long-tail query pages or FAQ/table gaps
- P3: entity consistency, third-party profiles, and conversion improvements

## Output

Return:

- current state summary
- data used and data missing
- findings with evidence
- recommended next actions ranked by expected impact
- exact user data needed if analysis is blocked by private dashboards
