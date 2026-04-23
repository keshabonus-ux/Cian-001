"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useApp } from "./I18nProvider";
import { CITIES } from "@/lib/cities";

type Message = { role: "user" | "assistant" | "system"; content: string };

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "z-ai/glm-4.5-air:free";
// Запасные модели на случай, если основная временно rate-limited (429).
// Порядок = приоритет. Тоже бесплатные с openrouter.ai.
const FALLBACK_MODELS = [
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "openai/gpt-oss-20b:free",
  "google/gemma-3-27b-it:free",
  "google/gemma-4-31b-it:free",
];

function buildSystemPrompt(lang: "ru" | "tk" | "en"): string {
  const cityTable = CITIES.map((c) => `${c.id} = ${c.name}`).join("; ");
  const districtHints = CITIES.map(
    (c) => `${c.id}: ${c.districts.join(", ")}`,
  ).join(" | ");
  const commonRules = [
    "ВАЖНО: рекомендуй ТОЛЬКО внутренние ссылки этого сайта. Никаких внешних доменов, только относительные пути.",
    "Разделы сайта: / (главная), /search (каталог), /offer/{id} (карточка), /new (подать объявление), /about.",
    "Формат ссылки на поиск: /search?deal=<sale|rent>&type=<apartment|house|room|commercial|land>&city=<ID>",
    `ID городов (используй ИМЕННО их, не русские названия!): ${cityTable}.`,
    `Районы можно передать параметром &district=<название> дословно: ${districtHints}.`,
    "Диапазон цен: &minPrice=... &maxPrice=... (в ТМТ).",
    "Комнаты: &minRooms=1|2|3|4 (и/или &maxRooms=...). Площадь: &minArea=... &maxArea=....",
    "Поисковая строка: &q=<текст>. Сортировка: &sort=newest|price_asc|price_desc|area_desc.",
    "Ссылки оформляй markdown-синтаксисом: [текст](/search?...). Не придумывай несуществующие параметры и значения.",
    "Если точный объект неизвестен — предлагай /search со связными фильтрами, а не /offer/<id>.",
  ];
  if (lang === "tk") {
    return [
      "Sen 'Jay.tm' — Türkmenistan üçin gozgalmaýan emläk saýtynyň AI kömekçisi.",
      "Gysga we peýdaly jogap ber. Türkmen dilinde jogap ber.",
      ...commonRules,
    ].join(" ");
  }
  if (lang === "en") {
    return [
      "You are the AI assistant for 'Jay.tm', a Turkmenistan real estate site.",
      "Give short, practical answers. Reply in English.",
      ...commonRules,
    ].join(" ");
  }
  return [
    "Ты ИИ-помощник сайта «Jay.tm» — сервис объявлений о недвижимости в Туркменистане.",
    "Отвечай кратко и по делу, на русском.",
    ...commonRules,
  ].join(" ");
}

// Рендерит текст ответа: кликабельные markdown-ссылки [текст](/path) и голые
// внутренние пути (/search?.., /offer/.., /new, /about).
function renderAssistant(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  // 1) [label](path) — только внутренние path, начинающиеся с '/'.
  const mdRe = /\[([^\]]+)\]\((\/[^\s)]*)\)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  const pushAutolinked = (chunk: string, keyPrefix: string) => {
    // автолинк для голых путей
    const urlRe = /(\/(?:search|offer\/[^\s<>"'`]+|new|about)(?:\?[^\s<>"'`]*)?)/g;
    let li = 0;
    let m: RegExpExecArray | null;
    let idx = 0;
    while ((m = urlRe.exec(chunk)) !== null) {
      if (m.index > li) parts.push(chunk.slice(li, m.index));
      const href = m[1].replace(/[.,;:!?)]+$/, "");
      const trail = m[1].slice(href.length);
      parts.push(
        <Link
          key={`${keyPrefix}-a-${idx++}`}
          href={href}
          className="underline text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 break-all"
        >
          {href}
        </Link>,
      );
      if (trail) parts.push(trail);
      li = m.index + m[1].length;
    }
    if (li < chunk.length) parts.push(chunk.slice(li));
  };
  let mdIdx = 0;
  while ((match = mdRe.exec(text)) !== null) {
    if (match.index > lastIdx)
      pushAutolinked(text.slice(lastIdx, match.index), `pre-${mdIdx}`);
    const label = match[1];
    const href = match[2];
    parts.push(
      <Link
        key={`md-${mdIdx++}`}
        href={href}
        className="underline text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 break-all"
      >
        {label}
      </Link>,
    );
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < text.length) pushAutolinked(text.slice(lastIdx), `post-${mdIdx}`);
  return parts.map((p, i) => <Fragment key={i}>{p}</Fragment>);
}

export function ChatBot() {
  const { t, lang } = useApp();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const genRef = useRef(0);

  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ?? "";
  const model = process.env.NEXT_PUBLIC_OPENROUTER_MODEL ?? DEFAULT_MODEL;
  const enabled = apiKey.length > 0;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    if (window.matchMedia("(max-width: 639px)").matches) {
      document.body.style.overflow = "hidden";
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading, open]);

  useEffect(() => {
    if (open && inputRef.current && !("ontouchstart" in window)) {
      inputRef.current.focus();
    }
  }, [open]);

  const reset = () => {
    genRef.current += 1;
    setMessages([]);
    setError(null);
    setLoading(false);
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    const gen = ++genRef.current;
    const tryModels = [model, ...FALLBACK_MODELS.filter((m) => m !== model)];
    let reply = "";
    let lastErrMsg = "";
    for (const m of tryModels) {
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer":
              typeof window !== "undefined"
                ? window.location.origin
                : "https://jay.tm",
            "X-Title": "Jay.tm",
          },
          body: JSON.stringify({
            model: m,
            messages: [
              { role: "system", content: buildSystemPrompt(lang) },
              ...next.map((msg) => ({ role: msg.role, content: msg.content })),
            ],
          }),
        });
        const data = await res.json().catch(() => null);
        const apiCode = data?.error?.code;
        const apiMsg: string | undefined = data?.error?.message;
        if (!res.ok || data?.error) {
          lastErrMsg = `${m.split("/").pop()}: ${apiCode ?? res.status}${apiMsg ? ` — ${apiMsg}` : ""}`;
          console.warn("[chat]", lastErrMsg);
          // 401/403 = неверный ключ, нет смысла пробовать другие модели
          if (res.status === 401 || res.status === 403) break;
          // 429/402/5xx/404 модели — пробуем следующую
          continue;
        }
        const content: string =
          data?.choices?.[0]?.message?.content?.toString().trim() ?? "";
        if (content) {
          reply = content;
          break;
        }
        lastErrMsg = `${m.split("/").pop()}: пустой ответ`;
      } catch (e) {
        lastErrMsg = `${m.split("/").pop()}: ${(e as Error).message ?? "network"}`;
        console.warn("[chat]", lastErrMsg);
      }
    }
    if (gen !== genRef.current) return;
    if (reply) {
      setMessages([...next, { role: "assistant", content: reply }]);
    } else {
      setError(lastErrMsg ? `${t("chat.error")} (${lastErrMsg})` : t("chat.error"));
    }
    setLoading(false);
  };

  const suggestions = [
    t("chat.suggest.1"),
    t("chat.suggest.2"),
    t("chat.suggest.3"),
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("chat.open")}
        title={t("chat.open")}
        className="fixed bottom-4 right-4 z-40 inline-flex items-center justify-center h-14 w-14 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-xl transition-colors"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 sm:bg-slate-900/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute inset-0 sm:inset-auto sm:right-4 sm:bottom-4 sm:w-[380px] sm:h-[560px] sm:max-h-[calc(100vh-2rem)] bg-white dark:bg-slate-900 sm:rounded-2xl shadow-2xl border-0 sm:border border-slate-200 dark:border-slate-800 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-brand-600 text-white font-bold">
                J
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {t("chat.title")}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {t("chat.subtitle")}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1">
                {messages.length > 0 ? (
                  <button
                    type="button"
                    onClick={reset}
                    className="text-xs text-slate-600 dark:text-slate-300 hover:text-brand-700 dark:hover:text-brand-400 px-2 py-1"
                  >
                    {t("chat.reset")}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t("chat.close")}
                  className="h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xl text-slate-600 dark:text-slate-300"
                >
                  ×
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50 dark:bg-slate-950"
            >
              <div className="flex">
                <div className="max-w-[85%] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm rounded-2xl rounded-tl-sm px-3 py-2">
                  {t("chat.greeting")}
                </div>
              </div>

              {messages.length === 0 && enabled ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : null}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] text-sm rounded-2xl px-3 py-2 whitespace-pre-wrap break-words ${
                      m.role === "user"
                        ? "bg-brand-600 text-white rounded-tr-sm"
                        : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-sm"
                    }`}
                  >
                    {m.role === "assistant" ? renderAssistant(m.content) : m.content}
                  </div>
                </div>
              ))}

              {loading ? (
                <div className="flex">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm rounded-2xl rounded-tl-sm px-3 py-2">
                    {t("chat.thinking")}
                  </div>
                </div>
              ) : null}

              {error ? (
                <div className="text-xs text-red-600 dark:text-red-400 text-center">
                  {error}
                </div>
              ) : null}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              {!enabled ? (
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  {t("chat.disabled")}
                </div>
              ) : null}
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send(input);
                    }
                  }}
                  placeholder={t("chat.placeholder")}
                  disabled={!enabled || loading}
                  className="flex-1 resize-none max-h-28 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-700 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!enabled || loading || !input.trim()}
                  className="btn-primary h-10 px-4 text-sm disabled:opacity-50"
                >
                  {t("chat.send")}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
