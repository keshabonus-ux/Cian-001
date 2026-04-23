"use client";

import { useState } from "react";
import { useApp } from "./I18nProvider";

export function ContactReveal({ phone }: { phone: string }) {
  const { t } = useApp();
  const [shown, setShown] = useState(false);
  const masked = phone.slice(0, 4) + phone.slice(4).replace(/\d/g, "•");

  return (
    <div>
      <div className="text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-100">
        {shown ? phone : masked}
      </div>
      {shown ? (
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="btn-primary w-full mt-2"
        >
          {t("offer.call")}
        </a>
      ) : (
        <button
          type="button"
          onClick={() => setShown(true)}
          className="btn-primary w-full mt-2"
        >
          {t("offer.show_phone")}
        </button>
      )}
    </div>
  );
}
