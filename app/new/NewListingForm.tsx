"use client";

import { useMemo, useState } from "react";
import { CITIES } from "@/lib/cities";
import { useApp } from "@/components/I18nProvider";
import { MapPicker, type LatLng } from "@/components/MapPicker";

export function NewListingForm() {
  const { t } = useApp();
  const [cityId, setCityId] = useState<string>("ashgabat");
  const [dealType, setDealType] = useState<string>("sale");
  const [propertyType, setPropertyType] = useState<string>("apartment");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<LatLng | null>(null);

  const city = useMemo(() => CITIES.find((c) => c.id === cityId), [cityId]);
  const mapCenter: LatLng = city
    ? { lat: city.lat, lng: city.lng }
    : { lat: 37.9601, lng: 58.3261 };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") ?? "").trim();
    const price = Number(fd.get("price"));
    const area = Number(fd.get("area"));
    const phone = String(fd.get("phone") ?? "").trim();
    if (!title || !price || !area || !phone) {
      setError(t("new.required"));
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">✨</div>
        <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
          {t("new.success.title")}
        </h2>
        <p className="text-slate-700 dark:text-slate-200">{t("new.success.desc")}</p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="btn-outline mt-4"
        >
          {t("new.success.again")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6"
    >
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg p-3">
          {error}
        </div>
      ) : null}

      <div>
        <label className="block text-sm font-medium mb-1">{t("new.deal")}</label>
        <div className="flex gap-2">
          {[
            { v: "sale", label: t("deal.sale") },
            { v: "rent", label: t("deal.rent") },
          ].map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => setDealType(o.v)}
              className={`px-4 py-2 rounded-lg text-sm ${
                dealType === o.v
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <input type="hidden" name="dealType" value={dealType} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t("new.prop")}</label>
        <select
          name="propertyType"
          className="input"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="apartment">{t("prop.apartment")}</option>
          <option value="house">{t("prop.house")}</option>
          <option value="room">{t("prop.room")}</option>
          <option value="commercial">{t("prop.commercial")}</option>
          <option value="land">{t("prop.land")}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          {t("new.heading")} <span className="text-red-600">*</span>
        </label>
        <input
          name="title"
          className="input"
          placeholder={t("new.heading.placeholder")}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("new.city")}
          </label>
          <select
            name="cityId"
            className="input"
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
          >
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("new.district")}
          </label>
          <select
            name="district"
            className="input"
            key={cityId}
            defaultValue=""
          >
            <option value="">{t("new.district.none")}</option>
            {city?.districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          {t("new.address")}
        </label>
        <input
          name="address"
          className="input"
          placeholder={t("new.address.placeholder")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          {t("new.map.label")}
        </label>
        <MapPicker
          center={mapCenter}
          value={coords}
          onChange={setCoords}
        />
        <input type="hidden" name="lat" value={coords?.lat ?? ""} />
        <input type="hidden" name="lng" value={coords?.lng ?? ""} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("new.price")} <span className="text-red-600">*</span>
          </label>
          <input
            name="price"
            type="number"
            min={0}
            className="input"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("new.area")} <span className="text-red-600">*</span>
          </label>
          <input
            name="area"
            type="number"
            min={0}
            className="input"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("new.rooms")}
          </label>
          <input name="rooms" type="number" min={0} className="input" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          {t("new.description")}
        </label>
        <textarea
          name="description"
          rows={5}
          className="input"
          placeholder={t("new.description.placeholder")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("new.name")}
          </label>
          <input name="authorName" className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("new.phone")} <span className="text-red-600">*</span>
          </label>
          <input
            name="phone"
            className="input"
            placeholder="+99365 12 34 56"
            required
          />
        </div>
      </div>

      <div className="pt-2 flex items-center justify-end gap-3">
        <button type="submit" className="btn-primary">
          {t("new.submit")}
        </button>
      </div>
    </form>
  );
}
