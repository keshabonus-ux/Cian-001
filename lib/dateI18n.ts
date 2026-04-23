import type { Lang } from "./i18n";

const STRINGS: Record<
  Lang,
  {
    justNow: string;
    hoursAgo: (n: number) => string;
    yesterday: string;
    daysAgo: (n: number) => string;
    locale: string;
  }
> = {
  ru: {
    justNow: "только что",
    hoursAgo: (n) => `${n} ч. назад`,
    yesterday: "вчера",
    daysAgo: (n) => `${n} дн. назад`,
    locale: "ru-RU",
  },
  tk: {
    justNow: "häzir",
    hoursAgo: (n) => `${n} sag. öň`,
    yesterday: "düýn",
    daysAgo: (n) => `${n} gün öň`,
    locale: "en-GB",
  },
  en: {
    justNow: "just now",
    hoursAgo: (n) => `${n}h ago`,
    yesterday: "yesterday",
    daysAgo: (n) => `${n}d ago`,
    locale: "en-GB",
  },
};

export function relativeDateI18n(
  iso: string,
  lang: Lang,
  now: Date = new Date(),
): string {
  const s = STRINGS[lang];
  const d = new Date(iso);
  const diffMs = now.getTime() - d.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return s.justNow;
  if (hours < 24) return s.hoursAgo(hours);
  const days = Math.floor(hours / 24);
  if (days === 1) return s.yesterday;
  if (days < 7) return s.daysAgo(days);
  return d.toLocaleDateString(s.locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateI18n(iso: string, lang: Lang): string {
  return new Date(iso).toLocaleDateString(STRINGS[lang].locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
