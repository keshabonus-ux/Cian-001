"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/I18nProvider";
import type { TKey } from "@/lib/i18n";

type CheckBlock = {
  key: string;
  labelKey: TKey;
  status: "ok" | "fail" | "pending";
};

type CheckReport = {
  address: string;
  owner: string;
  checkedAt: string;
  hasIssues: boolean;
  blocks: CheckBlock[];
};

// Simple deterministic demo: hash the input and pick an outcome so the same
// query always returns the same demo result.
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function buildReport(address: string, owner: string): CheckReport {
  const h = hash((address + "|" + owner).toLowerCase().trim());
  const variant = h % 4;

  const allOk: CheckBlock[] = [
    { key: "arrest", labelKey: "check.result.arrest", status: "ok" },
    { key: "pledge", labelKey: "check.result.pledge", status: "ok" },
    { key: "encumbrance", labelKey: "check.result.encumbrance", status: "ok" },
    { key: "utility", labelKey: "check.result.utility", status: "ok" },
    { key: "owner", labelKey: "check.result.owner", status: "ok" },
  ];

  let blocks = allOk;
  let hasIssues = false;

  if (variant === 1) {
    hasIssues = true;
    blocks = allOk.map((b) =>
      b.key === "pledge" ? { ...b, status: "fail" } : b,
    );
  } else if (variant === 2) {
    hasIssues = true;
    blocks = allOk.map((b) =>
      b.key === "arrest" ? { ...b, status: "fail" } : b,
    );
  } else if (variant === 3) {
    hasIssues = true;
    blocks = allOk.map((b) =>
      b.key === "utility" ? { ...b, status: "fail" } : b,
    );
  }

  return {
    address,
    owner,
    checkedAt: new Date().toISOString(),
    hasIssues,
    blocks,
  };
}

export default function CheckPage() {
  const { t, lang } = useApp();
  const [address, setAddress] = useState("");
  const [owner, setOwner] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<CheckReport | null>(null);

  const run = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setReport(buildReport(address.trim(), owner.trim()));
      setLoading(false);
    }, 700);
  };

  const reset = () => {
    setReport(null);
    setAddress("");
    setOwner("");
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(
        lang === "ru" ? "ru-RU" : lang === "tk" ? "tk-TM" : "en-GB",
      );
    } catch {
      return iso;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/services" className="text-sm text-brand-700 hover:underline">
        ← {t("nav.services")}
      </Link>
      <h1 className="text-2xl md:text-3xl font-bold mt-3 text-slate-900 dark:text-slate-100">
        {t("check.title")}
      </h1>
      <p className="text-slate-700 dark:text-slate-200 mt-1 mb-6">
        {t("check.subtitle")}
      </p>

      {!report ? (
        <form
          onSubmit={run}
          className="space-y-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("check.form.address")} <span className="text-red-600">*</span>
            </label>
            <input
              className="input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t("check.form.address.ph")}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("check.form.owner")}
            </label>
            <input
              className="input"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary w-full sm:w-auto" disabled={loading}>
            {loading ? t("check.form.checking") : t("check.form.submit")}
          </button>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("check.form.note")}
          </p>
        </form>
      ) : (
        <div className="space-y-5">
          <div
            className={`rounded-xl border p-5 ${
              report.hasIssues
                ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                : "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800"
            }`}
          >
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {t("check.result.title")}
            </div>
            <div
              className={`text-xl font-semibold mt-1 ${
                report.hasIssues
                  ? "text-amber-800 dark:text-amber-200"
                  : "text-emerald-800 dark:text-emerald-200"
              }`}
            >
              {report.hasIssues
                ? t("check.result.status.warn")
                : t("check.result.status.clean")}
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 mt-2">
              {report.hasIssues ? t("check.result.warn") : t("check.result.clean")}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">
                  {t("check.result.object")}
                </dt>
                <dd className="text-slate-900 dark:text-slate-100 font-medium">
                  {report.address}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">
                  {t("auth.name")}
                </dt>
                <dd className="text-slate-900 dark:text-slate-100 font-medium">
                  {report.owner || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">
                  {t("check.result.checked")}
                </dt>
                <dd className="text-slate-900 dark:text-slate-100 font-medium">
                  {formatDate(report.checkedAt)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
              {t("check.result.blocks.title")}
            </h2>
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {report.blocks.map((b) => (
                <li
                  key={b.key}
                  className="flex items-center justify-between py-3"
                >
                  <span className="text-slate-700 dark:text-slate-200 text-sm">
                    {t(b.labelKey)}
                  </span>
                  <StatusBadge
                    status={b.status}
                    tOk={t("check.result.ok")}
                    tFail={t("check.result.fail")}
                    tPending={t("check.result.pending")}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            {report.hasIssues ? (
              <Link href="/legal" className="btn-primary">
                {t("check.result.cta")}
              </Link>
            ) : null}
            <button type="button" className="btn-outline" onClick={reset}>
              {t("check.result.new")}
            </button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("check.form.note")}
          </p>
        </div>
      )}
    </div>
  );
}

function StatusBadge({
  status,
  tOk,
  tFail,
  tPending,
}: {
  status: "ok" | "fail" | "pending";
  tOk: string;
  tFail: string;
  tPending: string;
}) {
  if (status === "ok") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 px-2.5 py-1">
        <span>✓</span>
        <span>{tOk}</span>
      </span>
    );
  }
  if (status === "fail") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 px-2.5 py-1">
        <span>!</span>
        <span>{tFail}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 px-2.5 py-1">
      {tPending}
    </span>
  );
}
