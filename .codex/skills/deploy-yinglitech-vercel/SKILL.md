---
name: deploy-yinglitech-vercel
description: Deploy the YINGLITECH Next.js site through the user's authenticated Vercel CLI, with local lint/build/sitemap/robots preflight and production SEO/GEO verification. Use when the user asks to deploy YINGLITECH, publish the site, verify a Vercel deployment, fix production domain deployment drift, or hand off a safe deployment SOP to a teammate.
---

# Deploy YINGLITECH Vercel

## Guardrails

- Do not ask the user to paste Vercel tokens, Resend API keys, project IDs, org IDs, or `.vercel/project.json` contents into chat.
- Use the teammate's existing `vercel` CLI session. If unauthenticated, ask them to run `vercel login` locally, then resume.
- For production deploys, require an explicit user request such as "deploy production" or "push live". Otherwise deploy preview only.
- Do not print secret env values. It is acceptable to confirm that required env names exist.
- Preserve unrelated dirty work. For production deploys, prefer a clean, pushed commit.

## Workflow

1. Read `references/deploy-sop.md` for the full SOP.
2. Run local preflight:

```bash
bash .codex/skills/deploy-yinglitech-vercel/scripts/preflight.sh
```

3. Check Vercel CLI:

```bash
command -v vercel
vercel whoami
```

If `vercel whoami` fails, stop and ask the user to authenticate locally with `vercel login`.

4. Confirm env names without exposing values:

```bash
vercel env ls
```

Required production names: `SITE_URL`, `RESEND_API_KEY`, `CONTACT_EMAIL_FROM`, `CONTACT_EMAIL_TO`.

5. Deploy:

```bash
# Preview unless production was explicitly requested
vercel deploy -y

# Production only after explicit request
vercel deploy --prod -y
```

6. Verify production surface after a production deploy:

```bash
bash .codex/skills/deploy-yinglitech-vercel/scripts/verify-production.sh https://www.yinglitech.com
```

## Output

Report:

- commit or working-tree state deployed
- preview or production URL
- preflight result
- production verification result
- any user-owned actions still needed, such as adding Vercel env vars or submitting sitemap in Search Console
