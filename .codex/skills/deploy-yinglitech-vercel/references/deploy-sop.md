# YINGLITECH Vercel Deploy SOP

## What This Skill Deploys

- Next.js app in this repository.
- Production canonical domain: `https://www.yinglitech.com`.
- SEO/GEO-critical generated files: `public/sitemap.xml` and `public/robots.txt`.

## Preflight Rules

- Run `npm run lint`.
- Run `npm run build`; this must trigger `next-sitemap`.
- Verify sitemap count from repo data, not from a hard-coded number:
  - locales: `en`, `zh`
  - static paths from `next-sitemap.config.js`
  - active products from `src/data/products.json`
  - categories from `src/data/categories.json`
  - resource pages from `src/data/seo-pages.json`
- Verify sitemap has no `vercel.app` and no `/products?category=...`.
- Verify robots has the production sitemap and disallows `/api/` and `/admin/`.
- Verify robots does not disallow `/_next/`, `/_next/static`, or `/_next/image`; crawlers need those assets to render and understand the site.

## Vercel Environment

Required env names:

- `SITE_URL`
- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`

Optional env name:

- `INDEXNOW_KEY`

Expected production value for `SITE_URL`: `https://www.yinglitech.com`.

Do not print secret values. If a value is missing or unknown, ask the user to set it in Vercel Project Settings or with `vercel env add`.

## Deployment Commands

Preview deployment:

```bash
vercel deploy -y
```

Production deployment:

```bash
vercel deploy --prod -y
```

Only use production deployment when the user explicitly asks for it.

## Production Verification

After production deploy, verify:

- `https://www.yinglitech.com/en/resources/ocpp-ev-charger` returns `200`.
- `https://www.yinglitech.com/en/products/category/dc-charger` returns `200`.
- `https://www.yinglitech.com/en/resources/ev-charger-manufacturer` returns `200`.
- `https://www.yinglitech.com/en/products/super-dc-120kw` returns `200`.
- `https://www.yinglitech.com/en/contact` returns `200`.
- `https://www.yinglitech.com/sitemap.xml` contains only `https://www.yinglitech.com/...`.
- `https://www.yinglitech.com/robots.txt` points to `https://www.yinglitech.com/sitemap.xml`.
- Resource pages expose Direct Answer, Manufacturer Evidence, quotation requirements, visible FAQ, Article JSON-LD with dates, Breadcrumb, and ItemList JSON-LD.
- Category pages expose Category Specification Matrix, Breadcrumb, and ItemList JSON-LD.
- Product pages expose Product JSON-LD plus Breadcrumb JSON-LD and no fake `Offer` markup.

If `INDEXNOW_KEY` is configured, run after production deploy:

```bash
npm run seo:indexnow -- --submit
```

Without `INDEXNOW_KEY`, IndexNow is optional and must not block deployment.

If the official domain still returns old content, treat it as deployment drift and report:

- deployed URL
- official domain URL checked
- exact failing status or content symptom
- likely owner action: redeploy latest commit, fix domain binding, or fix `SITE_URL`
