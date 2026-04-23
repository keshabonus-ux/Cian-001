"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/I18nProvider";
import { formatPrice } from "@/lib/format";
import type { TKey } from "@/lib/i18n";

type Bank = {
  id: string;
  nameKey: TKey;
  descKey: TKey;
  logo: string;
  color: string;
  rateFrom: number;
  downFrom: number;
  termYears: number;
};

const BANKS: Bank[] = [
  {
    id: "sbtm",
    nameKey: "mortgage.banks.sbtm.name",
    descKey: "mortgage.banks.sbtm.desc",
    logo: "🏛",
    color: "from-emerald-600 to-emerald-700",
    rateFrom: 7,
    downFrom: 20,
    termYears: 25,
  },
  {
    id: "dayhan",
    nameKey: "mortgage.banks.dayhan.name",
    descKey: "mortgage.banks.dayhan.desc",
    logo: "🌾",
    color: "from-amber-600 to-amber-700",
    rateFrom: 8,
    downFrom: 25,
    termYears: 20,
  },
  {
    id: "senagat",
    nameKey: "mortgage.banks.senagat.name",
    descKey: "mortgage.banks.senagat.desc",
    logo: "🏭",
    color: "from-blue-600 to-blue-700",
    rateFrom: 9,
    downFrom: 15,
    termYears: 15,
  },
  {
    id: "rysgal",
    nameKey: "mortgage.banks.rysgal.name",
    descKey: "mortgage.banks.rysgal.desc",
    logo: "💠",
    color: "from-violet-600 to-violet-700",
    rateFrom: 6.5,
    downFrom: 10,
    termYears: 30,
  },
];

function monthlyPayment(loan: number, annualRatePct: number, years: number) {
  if (loan <= 0 || years <= 0) return 0;
  const n = years * 12;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return loan / n;
  return (loan * r) / (1 - Math.pow(1 + r, -n));
}

export default function MortgagePage() {
  const { t, lang } = useApp();

  const [price, setPrice] = useState(500_000);
  const [down, setDown] = useState(150_000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(8);
  const [bankId, setBankId] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const loan = Math.max(0, price - down);
  const monthly = useMemo(
    () => monthlyPayment(loan, rate, years),
    [loan, rate, years],
  );
  const total = monthly * years * 12;
  const overpay = total - loan;
  const downPct = price > 0 ? Math.round((down / price) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/services" className="text-sm text-brand-700 hover:underline">
        ← {t("nav.services")}
      </Link>
      <h1 className="text-2xl md:text-3xl font-bold mt-3 text-slate-900 dark:text-slate-100">
        {t("mortgage.title")}
      </h1>
      <p className="text-slate-700 dark:text-slate-200 mt-1 mb-6 max-w-3xl">
        {t("mortgage.subtitle")}
      </p>

      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
        <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
          {t("mortgage.calc.title")}
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
              {t("mortgage.calc.price")}
            </label>
            <input
              type="number"
              min={0}
              step={10000}
              className="input"
              value={price}
              onChange={(e) => setPrice(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
              {t("mortgage.calc.down")} ({downPct}%)
            </label>
            <input
              type="number"
              min={0}
              step={10000}
              max={price}
              className="input"
              value={down}
              onChange={(e) =>
                setDown(Math.max(0, Math.min(price, Number(e.target.value) || 0)))
              }
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
              {t("mortgage.calc.term")}
            </label>
            <input
              type="number"
              min={1}
              max={30}
              step={1}
              className="input"
              value={years}
              onChange={(e) =>
                setYears(Math.max(1, Math.min(30, Number(e.target.value) || 1)))
              }
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
              {t("mortgage.calc.rate")}
            </label>
            <input
              type="number"
              min={0}
              max={30}
              step={0.1}
              className="input"
              value={rate}
              onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
          <Metric
            label={t("mortgage.calc.monthly")}
            value={`${formatPrice(Math.round(monthly), lang)} ${t("mortgage.calc.per_month")}`}
            highlight
          />
          <Metric
            label={t("mortgage.calc.loan")}
            value={formatPrice(Math.round(loan), lang)}
          />
          <Metric
            label={t("mortgage.calc.overpay")}
            value={formatPrice(Math.round(overpay), lang)}
          />
          <Metric
            label={t("mortgage.calc.total")}
            value={formatPrice(Math.round(total), lang)}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
          {t("mortgage.banks.title")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BANKS.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
            >
              <div
                className={`bg-gradient-to-br ${b.color} text-white p-4 flex items-center gap-3`}
              >
                <div className="text-3xl">{b.logo}</div>
                <div className="font-semibold">{t(b.nameKey)}</div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                  {t(b.descKey)}
                </p>
                <dl className="text-xs space-y-1 mt-auto">
                  <div className="flex justify-between">
                    <dt className="text-slate-500 dark:text-slate-400">
                      {t("mortgage.banks.rate")}
                    </dt>
                    <dd className="font-medium">{b.rateFrom}%</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500 dark:text-slate-400">
                      {t("mortgage.banks.down")}
                    </dt>
                    <dd className="font-medium">{b.downFrom}%</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500 dark:text-slate-400">
                      {t("mortgage.banks.term")}
                    </dt>
                    <dd className="font-medium">
                      {b.termYears} {t("mortgage.banks.years")}
                    </dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={() => {
                    setBankId(b.id);
                    setRate(b.rateFrom);
                    setYears(Math.min(b.termYears, years));
                    document
                      .getElementById("mortgage-form")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="btn-outline mt-4 w-full text-sm"
                >
                  {t("mortgage.banks.apply")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="mortgage-form"
        className="mt-10 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6"
      >
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {t("mortgage.form.title")}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t("mortgage.form.subtitle")}
        </p>

        {submitted ? (
          <div className="mt-5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-5">
            <div className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
              {t("mortgage.form.success.title")}
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 mt-1">
              {t("mortgage.form.success.desc")}
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="mt-5 grid gap-4 sm:grid-cols-2"
          >
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">
                {t("mortgage.form.bank")}
              </label>
              <select
                className="input"
                value={bankId}
                onChange={(e) => setBankId(e.target.value)}
              >
                <option value="">{t("mortgage.form.bank.any")}</option>
                {BANKS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {t(b.nameKey)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("auth.name")} <span className="text-red-600">*</span>
              </label>
              <input name="name" className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("auth.phone")} <span className="text-red-600">*</span>
              </label>
              <input name="phone" type="tel" className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("mortgage.form.income")}
              </label>
              <input name="income" type="number" min={0} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("mortgage.form.employer")}
              </label>
              <input name="employer" className="input" />
            </div>

            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary">
                {t("mortgage.form.submit")}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "bg-brand-50 border-brand-200 dark:bg-brand-900/20 dark:border-brand-800"
          : "bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
      }`}
    >
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div
        className={`mt-1 text-lg font-bold ${
          highlight
            ? "text-brand-800 dark:text-brand-200"
            : "text-slate-900 dark:text-slate-100"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
