"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "./I18nProvider";
import { LangSwitcher } from "./LangSwitcher";
import { AuthButton } from "./AuthButton";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Header() {
  const { t } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const navLinks: { href: string; key: Parameters<typeof t>[0] }[] = [
    { href: "/search?deal=sale&type=apartment", key: "nav.buy" },
    { href: "/search?deal=rent&type=apartment", key: "nav.rent" },
    { href: "/search?type=commercial", key: "nav.commercial" },
    { href: "/search?type=house", key: "nav.houses" },
    { href: "/search?type=land", key: "nav.land" },
  ];

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-3 md:px-4 h-14 sm:h-16 flex items-center gap-1.5 md:gap-4">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 flex-shrink-0"
          aria-label={t("nav.menu")}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <Link href="/" className="flex items-center gap-2 flex-shrink-0 min-w-0">
          <span className="inline-flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-brand-600 text-white font-bold flex-shrink-0">
            J
          </span>
          <span className="text-lg sm:text-xl font-bold tracking-tight">
            Jay<span className="text-brand-600">.tm</span>
          </span>
          <span className="hidden lg:inline text-xs text-slate-500 dark:text-slate-400 ml-1 whitespace-nowrap">
            {t("brand.tagline")}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5 text-sm text-slate-700 dark:text-slate-200">
          {navLinks.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className="px-2.5 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <ThemeSwitcher />
          <LangSwitcher />
          <AuthButton />
          <Link
            href="/new"
            className="btn-primary text-sm hidden md:inline-flex"
          >
            {t("nav.post")}
          </Link>
          <Link
            href="/new"
            className="btn-primary md:hidden inline-flex items-center justify-center h-9 w-9 p-0 text-lg leading-none flex-shrink-0"
            aria-label={t("nav.post")}
            title={t("nav.post")}
          >
            +
          </Link>
        </div>
      </div>

      {menuOpen ? (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-900/50"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute top-0 left-0 h-full w-[82%] max-w-xs bg-white dark:bg-slate-900 shadow-xl p-4 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold">
                Jay<span className="text-brand-600">.tm</span>
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                aria-label={t("nav.close")}
              >
                ×
              </button>
            </div>
            {navLinks.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-3 rounded-lg text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 text-base"
              >
                {t(l.key)}
              </Link>
            ))}
            <div className="border-t border-slate-200 dark:border-slate-800 my-2" />
            <Link
              href="/new"
              onClick={() => setMenuOpen(false)}
              className="btn-primary text-center"
            >
              {t("nav.post")}
            </Link>
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
            >
              {t("footer.about")}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
