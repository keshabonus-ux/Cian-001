"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { DICT, type Lang, type TKey } from "@/lib/i18n";

type AuthUser = {
  role: "buyer" | "seller";
  name: string;
  email: string;
} | null;

export type ThemeMode = "light" | "dark" | "system";

interface AppCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
  user: AuthUser;
  login: (u: NonNullable<AuthUser>) => void;
  logout: () => void;
  theme: ThemeMode;
  setTheme: (m: ThemeMode) => void;
  resolvedTheme: "light" | "dark";
}

const Ctx = createContext<AppCtx | null>(null);

function systemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

function applyTheme(mode: ThemeMode): "light" | "dark" {
  const resolved: "light" | "dark" =
    mode === "system" ? (systemPrefersDark() ? "dark" : "light") : mode;
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    if (resolved === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }
  return resolved;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");
  const [user, setUser] = useState<AuthUser>(null);
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    try {
      const storedLang =
        (localStorage.getItem("jay.lang") as Lang | null) ?? null;
      if (storedLang && ["ru", "tk", "en"].includes(storedLang)) {
        setLangState(storedLang);
        document.documentElement.lang = storedLang;
      }
      const u = localStorage.getItem("jay.user");
      if (u) setUser(JSON.parse(u));
      const storedTheme = localStorage.getItem("jay.theme") as ThemeMode | null;
      const initial: ThemeMode =
        storedTheme && ["light", "dark", "system"].includes(storedTheme)
          ? storedTheme
          : "system";
      setThemeState(initial);
      setResolvedTheme(applyTheme(initial));
    } catch {}

    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const onChange = () => {
      const stored =
        (localStorage.getItem("jay.theme") as ThemeMode | null) ?? "system";
      if (stored === "system") setResolvedTheme(applyTheme("system"));
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("jay.lang", l);
      document.documentElement.lang = l;
    } catch {}
  }, []);

  const setTheme = useCallback((m: ThemeMode) => {
    setThemeState(m);
    try {
      localStorage.setItem("jay.theme", m);
    } catch {}
    setResolvedTheme(applyTheme(m));
  }, []);

  const login = useCallback((u: NonNullable<AuthUser>) => {
    setUser(u);
    try {
      localStorage.setItem("jay.user", JSON.stringify(u));
    } catch {}
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem("jay.user");
    } catch {}
  }, []);

  const t = useCallback(
    (key: TKey) =>
      (DICT[lang] as Record<string, string>)[key] ??
      (DICT.ru as Record<string, string>)[key] ??
      key,
    [lang],
  );

  return (
    <Ctx.Provider
      value={{
        lang,
        setLang,
        t,
        user,
        login,
        logout,
        theme,
        setTheme,
        resolvedTheme,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp(): AppCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within I18nProvider");
  return v;
}

export function useT() {
  return useApp().t;
}
