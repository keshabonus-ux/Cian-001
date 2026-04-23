"use client";

import Link from "next/link";
import { useApp } from "@/components/I18nProvider";

export default function OfferNotFound() {
  const { lang } = useApp();
  const msg =
    lang === "en"
      ? {
          title: "Listing not found",
          desc: "It may have been taken down or the link is broken.",
          back: "Back to listings",
        }
      : lang === "tk"
        ? {
            title: "Bildiriş tapylmady",
            desc: "Ol ýa aýrylan ýa-da salgy nädogry bolup biler.",
            back: "Bildirişlere gaýdyp git",
          }
        : {
            title: "Объявление не найдено",
            desc: "Возможно, оно уже снято с публикации или ссылка содержит ошибку.",
            back: "К списку объявлений",
          };
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">🏚️</div>
      <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">{msg.title}</h1>
      <p className="text-slate-700 dark:text-slate-200 mb-6">{msg.desc}</p>
      <Link href="/search" className="btn-primary">
        {msg.back}
      </Link>
    </div>
  );
}
