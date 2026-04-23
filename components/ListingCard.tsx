"use client";

import Image from "next/image";
import Link from "next/link";
import { cityName } from "@/lib/cities";
import { formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/types";
import { useApp } from "./I18nProvider";
import { relativeDateI18n } from "@/lib/dateI18n";
import { vrTourUrl } from "@/lib/vr";

export function ListingCard({ listing }: { listing: Listing }) {
  const { t, lang } = useApp();
  const price = formatPrice(listing.price, lang);
  const priceLabel =
    listing.dealType === "rent" ? `${price} ${t("listing.per_month")}` : price;
  const has3d = Boolean(vrTourUrl(listing.id));

  return (
    <Link
      href={`/offer/${listing.id}`}
      className="group block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-brand-300 transition-all"
    >
      <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800">
        <Image
          src={listing.images[0]}
          alt={listing.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full text-white shadow ${
              listing.dealType === "sale" ? "bg-brand-600" : "bg-blue-600"
            }`}
          >
            {listing.dealType === "sale"
              ? t("listing.sale")
              : t("listing.rent")}
          </span>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow">
            {t(`prop.${listing.propertyType}` as const)}
          </span>
          {has3d ? (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-brand-600 text-white shadow inline-flex items-center gap-1">
              <span>🕶</span>
              <span>{t("vr.badge")}</span>
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-4">
        <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{priceLabel}</div>
        <div className="mt-1 text-sm text-slate-700 dark:text-slate-200 line-clamp-1">
          {listing.title}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
          {listing.rooms ? (
            <span>
              {listing.rooms}
              {t("listing.rooms_suffix")}
            </span>
          ) : null}
          <span>{listing.area} м²</span>
          {listing.floor ? (
            <span>
              {listing.floor}
              {listing.totalFloors ? `/${listing.totalFloors}` : ""}{" "}
              {t("listing.floor_suffix")}
            </span>
          ) : null}
        </div>
        <div className="mt-2 text-sm text-slate-500 dark:text-slate-400 truncate">
          {cityName(listing.cityId)}, {listing.district}
        </div>
        <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          {relativeDateI18n(listing.publishedAt, lang)}
        </div>
      </div>
    </Link>
  );
}
