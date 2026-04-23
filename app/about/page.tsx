"use client";

import { useApp } from "@/components/I18nProvider";

export default function AboutPage() {
  const { t } = useApp();
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
        {t("about.title")}
      </h1>
      <p className="text-slate-700 dark:text-slate-200 leading-relaxed mb-4">{t("about.p1")}</p>
      <p className="text-slate-700 dark:text-slate-200 leading-relaxed mb-4">{t("about.p2")}</p>
      <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{t("about.p3")}</p>
    </div>
  );
}
