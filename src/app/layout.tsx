import type { Metadata } from "next";
import { Exo, Work_Sans } from "next/font/google";
import { organizationJsonLd, SITE_URL, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

const exo = Exo({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const workSans = Work_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "YINGLITECH - EV Charging Solutions",
    template: "%s | YINGLITECH",
  },
  description:
    "Professional EV charging station manufacturer. Full-range products from 3.5KW portable to 720KW DC fast chargers. ODM & OEM for global markets.",
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${exo.variable} ${workSans.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        {children}
      </body>
    </html>
  );
}
