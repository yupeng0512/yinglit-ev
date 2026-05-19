import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    path: "/certifications",
    title: locale === "zh" ? "认证与合规资质" : "EV Charger Certifications",
    description:
      locale === "zh"
        ? "查看盈利科技电动汽车充电桩相关CE、IEC、OCPP、MID、KfW、UK EVHS等认证和合规能力。"
        : "Review YINGLITECH EV charger certifications and compliance support, including CE, IEC, OCPP, MID, KfW, UK EVHS, and regional standards.",
    image: "/images/certs/certificates.jpg",
  });
}

export default function CertificationsSeoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
