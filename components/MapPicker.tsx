"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "./I18nProvider";

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

// Minimal Leaflet types — we don't add leaflet as a dep; the lib is loaded via CDN.
type LMap = {
  setView: (c: [number, number], z: number) => LMap;
  on: (evt: string, cb: (e: LMouseEvent) => void) => void;
  remove: () => void;
  flyTo: (c: [number, number], z?: number) => void;
  invalidateSize: () => void;
};
type LMarker = {
  setLatLng: (c: [number, number]) => LMarker;
  getLatLng: () => { lat: number; lng: number };
  on: (evt: string, cb: () => void) => void;
  addTo: (m: LMap) => LMarker;
};
type LMouseEvent = { latlng: { lat: number; lng: number } };
interface LeafletNS {
  map: (el: HTMLElement) => LMap;
  tileLayer: (
    url: string,
    opts: { attribution: string; maxZoom: number },
  ) => { addTo: (m: LMap) => unknown };
  marker: (c: [number, number], opts?: { draggable?: boolean }) => LMarker;
}
declare global {
  interface Window {
    L?: LeafletNS;
  }
}

function loadLeaflet(): Promise<LeafletNS> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined")
      return reject(new Error("SSR"));
    if (window.L) return resolve(window.L);

    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${LEAFLET_JS}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () =>
        window.L ? resolve(window.L) : reject(new Error("leaflet load failed")),
      );
      return;
    }
    const s = document.createElement("script");
    s.src = LEAFLET_JS;
    s.async = true;
    s.onload = () =>
      window.L ? resolve(window.L) : reject(new Error("leaflet load failed"));
    s.onerror = () => reject(new Error("leaflet load failed"));
    document.head.appendChild(s);
  });
}

export type LatLng = { lat: number; lng: number };

export function MapPicker({
  center,
  value,
  onChange,
}: {
  center: LatLng;
  value: LatLng | null;
  onChange: (ll: LatLng) => void;
}) {
  const { t } = useApp();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LMap | null>(null);
  const markerRef = useRef<LMarker | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadLeaflet()
      .then((L) => {
        if (cancelled || !containerRef.current) return;
        const initial: [number, number] = value
          ? [value.lat, value.lng]
          : [center.lat, center.lng];

        const map = L.map(containerRef.current).setView(initial, 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap",
          maxZoom: 19,
        }).addTo(map);

        const marker = L.marker(initial, { draggable: true }).addTo(map);
        marker.on("dragend", () => {
          const p = marker.getLatLng();
          onChange({ lat: p.lat, lng: p.lng });
        });
        map.on("click", (e: LMouseEvent) => {
          marker.setLatLng([e.latlng.lat, e.latlng.lng]);
          onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
        });

        mapRef.current = map;
        markerRef.current = marker;
        setReady(true);
        // force tiles to lay out correctly after mount
        setTimeout(() => map.invalidateSize(), 0);
      })
      .catch(() => setError(t("new.map.error")));

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // intentionally run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // move map when parent changes city center
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    if (!value) {
      mapRef.current.flyTo([center.lat, center.lng], 13);
      markerRef.current?.setLatLng([center.lat, center.lng]);
    }
  }, [center.lat, center.lng, ready, value]);

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const ll = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        onChange(ll);
        if (markerRef.current) markerRef.current.setLatLng([ll.lat, ll.lng]);
        mapRef.current?.flyTo([ll.lat, ll.lng], 15);
      },
      () => setError(t("new.map.geo_error")),
      { enableHighAccuracy: true, timeout: 7000 },
    );
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {t("new.map.hint")}
        </div>
        <button
          type="button"
          onClick={useMyLocation}
          className="text-xs text-brand-700 dark:text-brand-400 hover:underline"
        >
          {t("new.map.use_gps")}
        </button>
      </div>

      <div
        ref={containerRef}
        className="w-full h-72 sm:h-80 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
      />

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        {value ? (
          <span>
            {t("new.map.selected")}: {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
          </span>
        ) : (
          <span>{t("new.map.none")}</span>
        )}
        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange({ lat: center.lat, lng: center.lng });
              markerRef.current?.setLatLng([center.lat, center.lng]);
              mapRef.current?.flyTo([center.lat, center.lng], 13);
            }}
            className="text-brand-700 dark:text-brand-400 hover:underline"
          >
            {t("new.map.reset")}
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</div>
      ) : null}
    </div>
  );
}
