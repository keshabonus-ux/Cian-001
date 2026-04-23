"use client";

import Link from "next/link";
import { useApp } from "./I18nProvider";

export function Footer() {
  const { t } = useApp();
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-brand-600 text-white font-bold">
              J
            </span>
            <span className="text-lg font-bold text-white">
              Jay<span className="text-brand-400">.tm</span>
            </span>
          </div>
          <p className="text-sm">{t("footer.desc")}</p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">{t("footer.buy")}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/search?deal=sale&type=apartment">
                {t("footer.apartments")}
              </Link>
            </li>
            <li>
              <Link href="/search?deal=sale&type=house">
                {t("footer.houses")}
              </Link>
            </li>
            <li>
              <Link href="/search?deal=sale&type=land">{t("footer.land")}</Link>
            </li>
            <li>
              <Link href="/search?deal=sale&type=commercial">
                {t("footer.commercial")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">{t("footer.rent")}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/search?deal=rent&type=apartment">
                {t("footer.apartments")}
              </Link>
            </li>
            <li>
              <Link href="/search?deal=rent&type=house">
                {t("footer.houses")}
              </Link>
            </li>
            <li>
              <Link href="/search?deal=rent&type=room">
                {t("footer.rooms")}
              </Link>
            </li>
            <li>
              <Link href="/search?deal=rent&type=commercial">
                {t("footer.offices")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">
            {t("nav.services")}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/services">{t("nav.services")}</Link>
            </li>
            <li>
              <Link href="/realtors">{t("services.realtors")}</Link>
            </li>
            <li>
              <Link href="/legal">{t("services.legal")}</Link>
            </li>
            <li>
              <Link href="/check">{t("services.check")}</Link>
            </li>
            <li>
              <Link href="/mortgage">{t("services.mortgage")}</Link>
            </li>
            <li>
              <Link href="/new">{t("footer.post")}</Link>
            </li>
            <li>
              <Link href="/about">{t("footer.about")}</Link>
            </li>
            <li>
              <a href="mailto:info@jay.tm">info@jay.tm</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
        © {new Date().getFullYear()} Jay.tm — {t("footer.rights")}
      </div>
    </footer>
  );
}
