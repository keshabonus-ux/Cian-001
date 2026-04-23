"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CITIES } from "@/lib/cities";
import { useApp } from "./I18nProvider";

export function SearchBar({
  initialDeal = "sale",
  initialType = "apartment",
  initialCity = "",
  initialQ = "",
}: {
  initialDeal?: string;
  initialType?: string;
  initialCity?: string;
  initialQ?: string;
}) {
  const router = useRouter();
  const { t } = useApp();
  const [deal, setDeal] = useState(initialDeal);
  const [type, setType] = useState(initialType);
  const [city, setCity] = useState(initialCity);
  const [q, setQ] = useState(initialQ);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (deal) params.set("deal", deal);
    if (type) params.set("type", type);
    if (city) params.set("city", city);
    if (q) params.set("q", q);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 md:p-3"
    >
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setDeal("sale")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg ${
            deal === "sale"
              ? "bg-brand-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {t("search.buy")}
        </button>
        <button
          type="button"
          onClick={() => setDeal("rent")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg ${
            deal === "rent"
              ? "bg-brand-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {t("search.rent")}
        </button>
      </div>

      <div className="grid gap-2 grid-cols-2 md:grid-cols-[1fr_1fr_2fr_auto]">
        <select
          className="input"
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label={t("search.type")}
        >
          <option value="apartment">{t("prop.apartment")}</option>
          <option value="house">{t("prop.house")}</option>
          <option value="room">{t("prop.room")}</option>
          <option value="commercial">{t("prop.commercial")}</option>
          <option value="land">{t("prop.land")}</option>
        </select>
        <select
          className="input"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-label={t("search.city")}
        >
          <option value="">{t("search.all_cities")}</option>
          {CITIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          className="input col-span-2 md:col-span-1"
          placeholder={t("search.placeholder")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label={t("search.submit")}
        />
        <button type="submit" className="btn-primary px-6 col-span-2 md:col-span-1">
          {t("search.submit")}
        </button>
      </div>
    </form>
  );
}
