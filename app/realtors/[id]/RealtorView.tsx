"use client";

import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/components/I18nProvider";
import type { Realtor } from "@/lib/realtors";
import { cityName } from "@/lib/cities";
import { ContactReveal } from "@/components/ContactReveal";
import { ListingCard } from "@/components/ListingCard";
import { LISTINGS } from "@/lib/data";
import type { TKey } from "@/lib/i18n";
import type { CityId } from "@/lib/types";

export function RealtorView({ realtor }: { realtor: Realtor }) {
  const { t } = useApp();

  const agentListings = LISTINGS.filter(
    (l) =>
      l.author.role !== "owner" &&
      l.author.name.toLowerCase() === realtor.name.toLowerCase(),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Link
        href="/realtors"
        className="text-sm text-brand-700 hover:underline"
      >
        {t("realtors.profile.back")}
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex flex-col sm:flex-row gap-5">
            <div className="relative h-28 w-28 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 self-center sm:self-start">
              <Image
                src={realtor.photo}
                alt={realtor.name}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {realtor.name}
              </h1>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {realtor.agency ?? t("realtors.agency.none")} ·{" "}
                {cityName(realtor.cityId as CityId)}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-700 dark:text-slate-200">
                <span className="inline-flex items-center gap-1">
                  <span className="text-amber-500">★</span>
                  <span className="font-semibold">
                    {realtor.rating.toFixed(1)}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    ({realtor.reviews} {t("realtors.reviews")})
                  </span>
                </span>
                <span>
                  {realtor.yearsExperience} {t("realtors.experience.years")}{" "}
                  {t("realtors.experience")}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {realtor.specializations.map((s) => (
                  <span key={s} className="chip">
                    {t(`realtors.spec.${s}` as TKey)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <section className="mt-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
            <h2 className="text-lg font-semibold mb-3 text-slate-900 dark:text-slate-100">
              {t("realtors.profile.about")}
            </h2>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
              {realtor.bio}
            </p>
            <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {t("realtors.languages")}:
              </span>{" "}
              {realtor.languages.map((l) => l.toUpperCase()).join(" · ")}
            </div>
          </section>

          <section className="mt-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
              {t("realtors.profile.stats")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Stat value={realtor.deals} label={t("realtors.deals")} />
              <Stat
                value={realtor.listingsCount}
                label={t("realtors.listings")}
              />
              <Stat value={realtor.reviews} label={t("realtors.reviews")} />
              <Stat
                value={`${realtor.yearsExperience} ${t("realtors.experience.years")}`}
                label={t("realtors.experience")}
              />
            </div>
          </section>

          <section className="mt-6">
            <h2 className="text-lg font-semibold mb-3 text-slate-900 dark:text-slate-100">
              {t("realtors.profile.listings")}
            </h2>
            {agentListings.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-center text-slate-600 dark:text-slate-300 text-sm">
                {t("realtors.profile.listings.empty")}
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {agentListings.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="lg:sticky lg:top-20 h-fit space-y-4 lg:order-last">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t("realtors.profile.contacts")}
            </div>
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-1">
              {realtor.name}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {realtor.email}
            </div>
            <div className="mt-4">
              <ContactReveal phone={realtor.phone} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {value}
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
        {label}
      </div>
    </div>
  );
}
