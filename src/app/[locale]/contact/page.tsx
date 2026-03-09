"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Mail, Phone, MapPin, MessageSquare, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const locale = useLocale();
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="pt-24 lg:pt-28 pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="text-center py-20 bg-secondary rounded-xl">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h2 className="font-heading text-2xl font-bold mb-2">
                  {locale === "zh" ? "感谢您的询盘！" : "Thank You!"}
                </h2>
                <p className="text-muted-foreground">{t("success")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">{t("name")} *</label>
                    <input required type="text" className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">{t("email")} *</label>
                    <input required type="email" className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">{t("company")} *</label>
                    <input required type="text" className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">{t("country")} *</label>
                    <input required type="text" className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">{t("phone")}</label>
                    <input type="tel" className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">{t("quantity")}</label>
                    <input type="text" placeholder={locale === "zh" ? "如：100台/月" : "e.g. 100 units/month"} className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t("product")}</label>
                  <input type="text" placeholder={locale === "zh" ? "如：7KW 家用壁挂充电桩" : "e.g. 7KW Home Wallbox"} className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t("message")} *</label>
                  <textarea required rows={5} className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  {t("submit")}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="font-heading text-xl font-semibold mb-6">{t("info")}</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <a href="mailto:John@yinglitech.com" className="text-sm text-primary hover:underline">
                    John@yinglitech.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Tel / WhatsApp / WeChat</div>
                  <a href="tel:+8613410015126" className="text-sm text-primary hover:underline">
                    +86 134 100 15126
                  </a>
                  <div className="text-sm text-muted-foreground">John Zhong</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">{locale === "zh" ? "地址" : "Address"}</div>
                  <p className="text-sm text-muted-foreground">
                    {locale === "zh"
                      ? "中国广东省深圳市坪山区龙田街道33号格兰达装备产业园3栋3楼"
                      : "Building 3, 3rd Floor, Granda Equipment Industrial Park, No. 33 Longtian Street, Pingshan District, Shenzhen, China"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
