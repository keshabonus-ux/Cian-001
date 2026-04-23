"use client";

import { useEffect, useRef, useState } from "react";
import { useApp, type ThemeMode } from "./I18nProvider";

const ICONS: Record<ThemeMode, string> = {
  light: "☀",
  dark: "☾",
  system: "◐",
};

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme, t } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const currentIcon = theme === "system" ? ICONS[resolvedTheme] : ICONS[theme];

  const options: ThemeMode[] = ["light", "dark", "system"];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        aria-label={t("theme.label")}
        title={t("theme.label")}
      >
        <span className="text-base leading-none">{currentIcon}</span>
      </button>
      {open ? (
        <div className="absolute right-0 mt-1 z-40 min-w-[160px] rounded-lg border border-slate-200 dark:border-slate-800 bg-white shadow-lg py-1 dark:border-slate-700 dark:bg-slate-900">
          {options.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setTheme(m);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 ${
                theme === m
                  ? "text-brand-700 dark:text-brand-300 font-medium"
                  : "text-slate-700 dark:text-slate-200"
              }`}
            >
              <span className="w-4 text-center">{ICONS[m]}</span>
              <span>{t(`theme.${m}` as const)}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
