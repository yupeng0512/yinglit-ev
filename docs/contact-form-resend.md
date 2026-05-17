# Contact Form Email Setup

The contact form posts to the local Next.js API route at `/api/contact`. The API route sends the inquiry email through Resend. Keep the Resend API key on the server only; do not expose it with a `NEXT_PUBLIC_` variable.

## 1. Create a Resend Account

1. Open [Resend](https://resend.com/) and sign up.
2. Verify your login email.
3. In the Resend dashboard, open **Domains**.
4. Add the sending domain, for example `yinglitech.com`.
5. Add the DNS records Resend shows you. These records usually include DKIM, SPF, and DMARC-related entries.
6. Wait until Resend marks the domain as verified.

## 2. Create an API Key

1. In the Resend dashboard, open **API Keys**.
2. Click **Create API Key**.
3. Choose **Sending access**. If Resend asks for a domain scope, select the verified domain used by this website.
4. Copy the key once. It usually starts with `re_`.

## 3. Configure Local Development

Create `.env.local` in the project root:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_TO_EMAIL=John@yinglitech.com
CONTACT_FROM_EMAIL="YingliTech Website <contact@yinglitech.com>"
```

Notes:

- `RESEND_API_KEY` is required.
- `CONTACT_TO_EMAIL` is where inquiries are delivered.
- `CONTACT_FROM_EMAIL` must use a sender address under a domain verified in Resend.
- Do not commit `.env.local`.

Then run:

```bash
npm run dev
```

Submit the form at `http://localhost:3000/en/contact` or `http://localhost:3000/zh/contact`.

## 4. Configure Vercel Environment Variables

1. Open [Vercel Dashboard](https://vercel.com/dashboard).
2. Select the Yingli EV website project.
3. Open **Settings** -> **Environment Variables**.
4. Add these variables:

| Name | Value | Environment |
| --- | --- | --- |
| `RESEND_API_KEY` | Your Resend API key | Production, Preview, Development |
| `CONTACT_TO_EMAIL` | `John@yinglitech.com` | Production, Preview, Development |
| `CONTACT_FROM_EMAIL` | `YingliTech Website <contact@yinglitech.com>` | Production, Preview, Development |

5. Save the variables.
6. Redeploy the latest deployment. Existing deployments do not automatically pick up newly added environment variables.

## 5. Smoke Test After Deployment

1. Open the production contact page.
2. Submit a test inquiry with a real reply email.
3. Confirm that `John@yinglitech.com` receives the email.
4. If the form shows an error, check Vercel **Project** -> **Logs** for `/api/contact` and check the Resend dashboard activity.

## Common Issues

- **Email service is not configured**: `RESEND_API_KEY` is missing in Vercel or `.env.local`.
- **Failed to send inquiry email**: the API key, sender domain, or `CONTACT_FROM_EMAIL` is invalid. Check Vercel logs for the Resend error response.
- **Email lands in spam**: verify SPF, DKIM, and DMARC records in Resend and avoid using a generic sender name.
- **No email after adding variables**: redeploy the Vercel project after saving environment variables.
