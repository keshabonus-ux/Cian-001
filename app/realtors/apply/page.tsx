"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/I18nProvider";
import { CITIES } from "@/lib/cities";
import type { TKey } from "@/lib/i18n";
import type { Specialization } from "@/lib/realtors";

const SPECS: Specialization[] = [
  "sale_apartments",
  "rent_apartments",
  "houses",
  "commercial",
  "land",
];

export default function RealtorApplyPage() {
  const { t } = useApp();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center">
          <div className="text-4xl mb-3">🤝</div>
          <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
            {t("realtors.apply.success")}
          </h2>
          <Link href="/realtors" className="btn-outline mt-4 inline-flex">
            {t("realtors.profile.back")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/realtors" className="text-sm text-brand-700 hover:underline">
        {t("realtors.profile.back")}
      </Link>
      <h1 className="text-2xl md:text-3xl font-bold mt-3 text-slate-900 dark:text-slate-100">
        {t("realtors.apply.title")}
      </h1>
      <p className="text-slate-700 dark:text-slate-200 mt-1 mb-6">
        {t("realtors.apply.subtitle")}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("realtors.apply.fullname")} <span className="text-red-600">*</span>
          </label>
          <input name="fullname" className="input" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("realtors.apply.agency")}
          </label>
          <input name="agency" className="input" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("realtors.city")}
            </label>
            <select name="city" className="input" defaultValue="ashgabat">
              {CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("realtors.apply.experience")}
            </label>
            <input
              name="experience"
              type="number"
              min={0}
              defaultValue={1}
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("realtors.apply.spec")}
          </label>
          <select name="spec" className="input" defaultValue="sale_apartments">
            {SPECS.map((s) => (
              <option key={s} value={s}>
                {t(`realtors.spec.${s}` as TKey)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("auth.phone")} <span className="text-red-600">*</span>
            </label>
            <input name="phone" type="tel" className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("auth.email")}
            </label>
            <input name="email" type="email" className="input" />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full sm:w-auto">
          {t("realtors.apply.submit")}
        </button>
      </form>
    </div>
  );
}
