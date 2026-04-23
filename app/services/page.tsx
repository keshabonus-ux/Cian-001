"use client";

import Link from "next/link";
import { useApp } from "@/components/I18nProvider";
import type { TKey } from "@/lib/i18n";

type ServiceCard = {
  href: string;
  icon: string;
  titleKey: TKey;
  descKey: TKey;
  available: boolean;
};

const SERVICES: ServiceCard[] = [
  {
    href: "/realtors",
    icon: "🤝",
    titleKey: "services.realtors",
    descKey: "services.realtors.desc",
    available: true,
  },
  {
    href: "/legal",
    icon: "⚖️",
    titleKey: "services.legal",
    descKey: "services.legal.desc",
    available: true,
  },
  {
    href: "/check",
    icon: "🛡️",
    titleKey: "services.check",
    descKey: "services.check.desc",
    available: true,
  },
  {
    href: "/mortgage",
    icon: "🏦",
    titleKey: "services.mortgage",
    descKey: "services.mortgage.desc",
    available: true,
  },
];

export default function ServicesHubPage() {
  const { t } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
        {t("services.title")}
      </h1>
      <p className="text-slate-700 dark:text-slate-200 mt-1 mb-8 max-w-3xl">
        {t("services.subtitle")}
      </p>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s) => {
          const inner = (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{s.icon}</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {t(s.titleKey)}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 flex-1">
                {t(s.descKey)}
              </p>
              <div className="mt-4 text-sm font-medium">
                {s.available ? (
                  <span className="text-brand-700 dark:text-brand-400">
                    {t("services.open")}
                  </span>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500">
                    {t("services.coming_soon")}
                  </span>
                )}
              </div>
            </div>
          );
          return s.available ? (
            <Link key={s.href} href={s.href} className="block">
              {inner}
            </Link>
          ) : (
            <div key={s.href} aria-disabled className="opacity-70">
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
