"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/I18nProvider";
import type { TKey } from "@/lib/i18n";

type DealKind = "buy" | "sell" | "rent";

const SERVICES: { icon: string; titleKey: TKey; descKey: TKey }[] = [
  { icon: "💬", titleKey: "legal.services.consult", descKey: "legal.services.consult.desc" },
  { icon: "📄", titleKey: "legal.services.docs", descKey: "legal.services.docs.desc" },
  { icon: "📝", titleKey: "legal.services.contract", descKey: "legal.services.contract.desc" },
  { icon: "🖋️", titleKey: "legal.services.notary", descKey: "legal.services.notary.desc" },
  { icon: "🏛️", titleKey: "legal.services.register", descKey: "legal.services.register.desc" },
  { icon: "⚖️", titleKey: "legal.services.dispute", descKey: "legal.services.dispute.desc" },
];

const DOC_KEYS: Record<DealKind, TKey[]> = {
  buy: [
    "legal.docs.buy.1",
    "legal.docs.buy.2",
    "legal.docs.buy.3",
    "legal.docs.buy.4",
    "legal.docs.buy.5",
  ],
  sell: [
    "legal.docs.sell.1",
    "legal.docs.sell.2",
    "legal.docs.sell.3",
    "legal.docs.sell.4",
    "legal.docs.sell.5",
    "legal.docs.sell.6",
  ],
  rent: [
    "legal.docs.rent.1",
    "legal.docs.rent.2",
    "legal.docs.rent.3",
    "legal.docs.rent.4",
  ],
};

export default function LegalPage() {
  const { t } = useApp();
  const [deal, setDeal] = useState<DealKind>("buy");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/services" className="text-sm text-brand-700 hover:underline">
        ← {t("nav.services")}
      </Link>

      <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
            {t("legal.title")}
          </h1>
          <p className="text-slate-700 dark:text-slate-200 mt-2 max-w-3xl">
            {t("legal.subtitle")}
          </p>

          <section className="mt-8">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
              {t("legal.services.title")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <div
                  key={s.titleKey}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {t(s.titleKey)}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {t(s.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
            <h2 className="text-lg font-semibold mb-3 text-slate-900 dark:text-slate-100">
              {t("legal.docs.title")}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                {t("legal.docs.deal")}
              </label>
              <div className="flex flex-wrap gap-2">
                {(["buy", "sell", "rent"] as DealKind[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDeal(d)}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      deal === d
                        ? "bg-brand-600 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {t(`legal.docs.deal.${d}` as TKey)}
                  </button>
                ))}
              </div>
            </div>

            <ul className="space-y-2">
              {DOC_KEYS[deal].map((k) => (
                <li
                  key={k}
                  className="flex items-start gap-2 text-slate-700 dark:text-slate-200 text-sm"
                >
                  <span className="text-brand-600 mt-0.5">✓</span>
                  <span>{t(k)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="lg:sticky lg:top-20 h-fit">
          {submitted ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-center">
              <div className="text-4xl mb-3">⚖️</div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {t("legal.form.success.title")}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                {t("legal.form.success.desc")}
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4"
            >
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {t("legal.form.title")}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t("legal.form.subtitle")}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("legal.form.deal")}
                </label>
                <select
                  name="deal"
                  className="input"
                  value={deal}
                  onChange={(e) => setDeal(e.target.value as DealKind)}
                >
                  <option value="buy">{t("legal.docs.deal.buy")}</option>
                  <option value="sell">{t("legal.docs.deal.sell")}</option>
                  <option value="rent">{t("legal.docs.deal.rent")}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("auth.name")} <span className="text-red-600">*</span>
                </label>
                <input name="name" className="input" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("auth.phone")} <span className="text-red-600">*</span>
                </label>
                <input name="phone" type="tel" className="input" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("legal.form.description")}
                </label>
                <textarea
                  name="description"
                  rows={4}
                  className="input"
                  placeholder={t("legal.form.description.ph")}
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                {t("legal.form.submit")}
              </button>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}
