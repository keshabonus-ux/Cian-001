"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/components/I18nProvider";

export function SortSelect({ current }: { current: string }) {
  const router = useRouter();
  const sp = useSearchParams();
  const { t } = useApp();

  const options: { v: string; label: string }[] = [
    { v: "newest", label: t("search.sort.newest") },
    { v: "price_asc", label: t("search.sort.price_asc") },
    { v: "price_desc", label: t("search.sort.price_desc") },
    { v: "area_desc", label: t("search.sort.area_desc") },
  ];

  const onChange = (v: string) => {
    const params = new URLSearchParams(sp.toString());
    if (v) params.set("sort", v);
    else params.delete("sort");
    router.push(`/search?${params.toString()}`);
  };

  return (
    <label className="text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
      {t("search.sort")}
      <select
        className="input py-1.5 w-auto"
        value={current}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
