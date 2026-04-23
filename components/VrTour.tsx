"use client";

import { useState } from "react";
import { useApp } from "./I18nProvider";

export function VrTour({ url }: { url: string }) {
  const { t } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {t("vr.title")}
          </h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200 text-xs font-medium px-2.5 py-0.5">
            <span>🕶</span>
            <span>{t("vr.badge")}</span>
          </span>
        </div>
        {open ? (
          <div className="flex gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-sm"
            >
              {t("vr.fullscreen")}
            </a>
            <button
              type="button"
              className="btn-outline text-sm"
              onClick={() => setOpen(false)}
            >
              {t("vr.close")}
            </button>
          </div>
        ) : null}
      </div>

      {!open ? (
        <div>
          <p className="text-slate-700 dark:text-slate-200 text-sm mb-4">
            {t("vr.desc")}
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="btn-primary"
          >
            {t("vr.start")}
          </button>
        </div>
      ) : (
        <div>
          <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative">
            <iframe
              title="3D tour"
              className="absolute inset-0 w-full h-full"
              src={url}
              loading="lazy"
              allow="fullscreen; accelerometer; gyroscope; xr-spatial-tracking; vr"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {t("vr.note")}
          </p>
        </div>
      )}
    </section>
  );
}
