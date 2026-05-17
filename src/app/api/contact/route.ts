import { NextResponse } from "next/server";

type InquiryPayload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  country?: unknown;
  phone?: unknown;
  product?: unknown;
  quantity?: unknown;
  message?: unknown;
  locale?: unknown;
  website?: unknown;
};

const RESEND_API_URL = "https://api.resend.com/emails";
const DEFAULT_TO_EMAIL = "John@yinglitech.com";
const DEFAULT_FROM_EMAIL = "YingliTech Website <contact@yinglitech.com>";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildRow(label: string, value: string) {
  if (!value) {
    return "";
  }

  return `
    <tr>
      <td style="padding: 8px 12px; border: 1px solid #d9e2ec; font-weight: 600; background: #f8fafc;">${escapeHtml(label)}</td>
      <td style="padding: 8px 12px; border: 1px solid #d9e2ec;">${escapeHtml(value).replaceAll("\n", "<br />")}</td>
    </tr>
  `;
}

export async function POST(request: Request) {
  let payload: InquiryPayload;

  try {
    payload = (await request.json()) as InquiryPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (asString(payload.website)) {
    return NextResponse.json({ ok: true });
  }

  const inquiry = {
    name: truncate(asString(payload.name), 120),
    email: truncate(asString(payload.email), 160),
    company: truncate(asString(payload.company), 160),
    country: truncate(asString(payload.country), 120),
    phone: truncate(asString(payload.phone), 80),
    product: truncate(asString(payload.product), 160),
    quantity: truncate(asString(payload.quantity), 120),
    message: truncate(asString(payload.message), 3000),
    locale: truncate(asString(payload.locale), 20),
  };

  if (!inquiry.name || !inquiry.email || !inquiry.company || !inquiry.country || !inquiry.message) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  if (!isValidEmail(inquiry.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL;

  if (!resendApiKey) {
    console.error("Contact form email is not configured: missing RESEND_API_KEY.");
    return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
  }

  const submittedAt = new Date().toISOString();
  const subject = `Website inquiry from ${inquiry.name} - ${inquiry.company}`;
  const rows = [
    buildRow("Name", inquiry.name),
    buildRow("Email", inquiry.email),
    buildRow("Company", inquiry.company),
    buildRow("Country / Region", inquiry.country),
    buildRow("Phone", inquiry.phone),
    buildRow("Interested Product", inquiry.product),
    buildRow("Estimated Quantity", inquiry.quantity),
    buildRow("Message", inquiry.message),
    buildRow("Locale", inquiry.locale),
    buildRow("Submitted At", submittedAt),
  ].join("");

  const text = [
    "New website inquiry",
    "",
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Company: ${inquiry.company}`,
    `Country / Region: ${inquiry.country}`,
    inquiry.phone ? `Phone: ${inquiry.phone}` : "",
    inquiry.product ? `Interested Product: ${inquiry.product}` : "",
    inquiry.quantity ? `Estimated Quantity: ${inquiry.quantity}` : "",
    "",
    "Message:",
    inquiry.message,
    "",
    inquiry.locale ? `Locale: ${inquiry.locale}` : "",
    `Submitted At: ${submittedAt}`,
  ]
    .filter(Boolean)
    .join("\n");

  let response: Response;

  try {
    response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: inquiry.email,
        subject,
        text,
        html: `
          <div style="font-family: Arial, sans-serif; color: #1f2937;">
            <h2 style="margin: 0 0 16px;">New website inquiry</h2>
            <table style="border-collapse: collapse; width: 100%; max-width: 760px;">
              <tbody>${rows}</tbody>
            </table>
          </div>
        `,
      }),
    });
  } catch (error) {
    console.error("Resend email send request failed:", error);
    return NextResponse.json({ error: "Failed to send inquiry email." }, { status: 502 });
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Resend email send failed:", errorText);
    return NextResponse.json({ error: "Failed to send inquiry email." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
