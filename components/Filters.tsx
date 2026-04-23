"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { CITIES } from "@/lib/cities";
import { useApp } from "./I18nProvider";

export function Filters() {
  const router = useRouter();
  const sp = useSearchParams();
  const { t } = useApp();

  const current = useMemo(() => {
    const get = (k: string) => sp.get(k) ?? "";
    return {
      deal: get("deal"),
      type: get("type"),
      city: get("city"),
      district: get("district"),
      minPrice: get("minPrice"),
      maxPrice: get("maxPrice"),
      minRooms: get("minRooms"),
      maxRooms: get("maxRooms"),
      minArea: get("minArea"),
      maxArea: get("maxArea"),
      q: get("q"),
      sort: get("sort") || "newest",
    };
  }, [sp]);

  const city = CITIES.find((c) => c.id === current.city);

  const update = (patch: Record<string, string>) => {
    const params = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === "" || v === undefined || v === null) params.delete(k);
      else params.set(k, v);
    }
    router.push(`/search?${params.toString()}`);
  };

  const reset = () => router.push("/search");

  return (
    <aside className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
      <div>
        <h3 className="text-sm font-semibold mb-2">{t("filters.deal")}</h3>
        <div className="grid grid-cols-3 gap-1">
          {[
            { v: "", label: t("filters.deal.all") },
            { v: "sale", label: t("nav.buy") },
            { v: "rent", label: t("nav.rent") },
          ].map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => update({ deal: o.v })}
              className={`px-2 py-1.5 text-xs rounded ${
                current.deal === o.v
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">{t("filters.prop")}</h3>
        <select
          className="input"
          value={current.type}
          onChange={(e) => update({ type: e.target.value })}
        >
          <option value="">{t("filters.prop.any")}</option>
          <option value="apartment">{t("prop.apartment")}</option>
          <option value="house">{t("prop.house")}</option>
          <option value="room">{t("prop.room")}</option>
          <option value="commercial">{t("prop.commercial")}</option>
          <option value="land">{t("prop.land")}</option>
        </select>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">{t("filters.city")}</h3>
        <select
          className="input"
          value={current.city}
          onChange={(e) => update({ city: e.target.value, district: "" })}
        >
          <option value="">{t("search.all_cities")}</option>
          {CITIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {city ? (
          <select
            className="input mt-2"
            value={current.district}
            onChange={(e) => update({ district: e.target.value })}
          >
            <option value="">{t("filters.district.any")}</option>
            {city.districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">{t("filters.price")}</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            key={`minPrice-${current.minPrice}`}
            className="input"
            placeholder={t("filters.price.from")}
            inputMode="numeric"
            defaultValue={current.minPrice}
            onBlur={(e) => update({ minPrice: e.target.value })}
          />
          <input
            key={`maxPrice-${current.maxPrice}`}
            className="input"
            placeholder={t("filters.price.to")}
            inputMode="numeric"
            defaultValue={current.maxPrice}
            onBlur={(e) => update({ maxPrice: e.target.value })}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">{t("filters.rooms")}</h3>
        <div className="flex flex-wrap gap-1">
          {["", "1", "2", "3", "4", "5"].map((v) => (
            <button
              key={v || "any"}
              type="button"
              onClick={() =>
                update({ minRooms: v, maxRooms: v === "5" ? "" : v })
              }
              className={`px-3 py-1.5 text-xs rounded border ${
                current.minRooms === v
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white border-slate-300 hover:bg-slate-50 text-slate-800"
              }`}
            >
              {v === "" ? t("filters.rooms.any") : v === "5" ? "5+" : v}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">{t("filters.area")}</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            key={`minArea-${current.minArea}`}
            className="input"
            placeholder={t("filters.price.from")}
            inputMode="numeric"
            defaultValue={current.minArea}
            onBlur={(e) => update({ minArea: e.target.value })}
          />
          <input
            key={`maxArea-${current.maxArea}`}
            className="input"
            placeholder={t("filters.price.to")}
            inputMode="numeric"
            defaultValue={current.maxArea}
            onBlur={(e) => update({ maxArea: e.target.value })}
          />
        </div>
      </div>

      <button type="button" onClick={reset} className="btn-outline w-full">
        {t("filters.reset")}
      </button>
    </aside>
  );
}
