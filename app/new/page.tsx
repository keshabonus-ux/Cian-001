"use client";

import { NewListingForm } from "./NewListingForm";
import { useApp } from "@/components/I18nProvider";

export default function NewListingPage() {
  const { t } = useApp();
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
        {t("new.title")}
      </h1>
      <p className="text-slate-700 dark:text-slate-200 mt-1 mb-6">{t("new.subtitle")}</p>
      <NewListingForm />
    </div>
  );
}
