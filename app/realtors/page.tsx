"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/components/I18nProvider";
import { CITIES, cityName } from "@/lib/cities";
import { REALTORS, type Specialization } from "@/lib/realtors";
import type { TKey } from "@/lib/i18n";
import type { CityId } from "@/lib/types";

const SPECS: Specialization[] = [
  "sale_apartments",
  "rent_apartments",
  "houses",
  "commercial",
  "land",
];

export default function RealtorsPage() {
  const { t } = useApp();
  const [q, setQ] = useState("");
  const [city, setCity] = useState<string>("");
  const [spec, setSpec] = useState<string>("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return REALTORS.filter((r) => {
      if (city && r.cityId !== city) return false;
      if (spec && !r.specializations.includes(spec as Specialization))
        return false;
      if (!query) return true;
      return (
        r.name.toLowerCase().includes(query) ||
        (r.agency ?? "").toLowerCase().includes(query) ||
        cityName(r.cityId as CityId).toLowerCase().includes(query)
      );
    });
  }, [q, city, spec]);

  const resetFilters = () => {
    setQ("");
    setCity("");
    setSpec("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
        {t("realtors.title")}
      </h1>
      <p className="text-slate-700 dark:text-slate-200 mt-1 mb-6 max-w-3xl">
        {t("realtors.subtitle")}
      </p>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 grid gap-3 md:grid-cols-[1fr_200px_220px_auto]">
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            {t("realtors.search.placeholder")}
          </label>
          <input
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("realtors.search.placeholder")}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            {t("realtors.city")}
          </label>
          <select
            className="input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">{t("realtors.city.any")}</option>
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            {t("realtors.spec")}
          </label>
          <select
            className="input"
            value={spec}
            onChange={(e) => setSpec(e.target.value)}
          >
            <option value="">{t("realtors.spec.any")}</option>
            {SPECS.map((s) => (
              <option key={s} value={s}>
                {t(`realtors.spec.${s}` as TKey)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button type="button" className="btn-outline w-full" onClick={resetFilters}>
            {t("realtors.reset")}
          </button>
        </div>
      </div>

      <div className="text-sm text-slate-600 dark:text-slate-300 mt-5 mb-3">
        {t("realtors.found")} {filtered.length}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-600 dark:text-slate-300">
          {t("realtors.no_results")}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <Link
              key={r.id}
              href={`/realtors/${r.id}`}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:shadow-md transition-shadow flex gap-4"
            >
              <div className="relative h-20 w-20 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                <Image
                  src={r.photo}
                  alt={r.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {r.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {r.agency ?? t("realtors.agency.none")} · {cityName(r.cityId as CityId)}
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    <span className="text-amber-500">★</span>
                    <span className="font-medium">{r.rating.toFixed(1)}</span>
                    <span className="text-slate-400">({r.reviews})</span>
                  </span>
                  <span>{r.deals} {t("realtors.deals")}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {r.specializations.slice(0, 2).map((s) => (
                    <span key={s} className="chip">
                      {t(`realtors.spec.${s}` as TKey)}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <section className="mt-10 bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">
            {t("realtors.become.title")}
          </h2>
          <p className="text-white/90 mt-1 max-w-2xl text-sm sm:text-base">
            {t("realtors.become.desc")}
          </p>
        </div>
        <Link
          href="/realtors/apply"
          className="inline-flex items-center justify-center rounded-lg bg-white text-brand-700 font-medium px-5 py-2.5 hover:bg-slate-100 transition-colors"
        >
          {t("realtors.become.cta")}
        </Link>
      </section>
    </div>
  );
}
