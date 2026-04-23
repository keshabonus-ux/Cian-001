import { LISTINGS } from "./data";
import type { CityId, DealType, Listing, PropertyType } from "./types";

export interface SearchParams {
  deal?: DealType;
  type?: PropertyType;
  cityId?: CityId;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  minRooms?: number;
  maxRooms?: number;
  minArea?: number;
  maxArea?: number;
  q?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "area_desc";
}

export function searchListings(params: SearchParams): Listing[] {
  let result = LISTINGS.slice();

  if (params.deal) {
    result = result.filter((l) => l.dealType === params.deal);
  }
  if (params.type) {
    result = result.filter((l) => l.propertyType === params.type);
  }
  if (params.cityId) {
    result = result.filter((l) => l.cityId === params.cityId);
  }
  if (params.district) {
    const d = params.district.toLowerCase();
    result = result.filter((l) => l.district.toLowerCase().includes(d));
  }
  if (params.minPrice !== undefined) {
    result = result.filter((l) => l.price >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    result = result.filter((l) => l.price <= params.maxPrice!);
  }
  if (params.minRooms !== undefined) {
    result = result.filter(
      (l) => (l.rooms ?? 0) >= params.minRooms!,
    );
  }
  if (params.maxRooms !== undefined) {
    result = result.filter(
      (l) => (l.rooms ?? 0) <= params.maxRooms!,
    );
  }
  if (params.minArea !== undefined) {
    result = result.filter((l) => l.area >= params.minArea!);
  }
  if (params.maxArea !== undefined) {
    result = result.filter((l) => l.area <= params.maxArea!);
  }
  if (params.q && params.q.trim().length > 0) {
    const q = params.q.toLowerCase();
    result = result.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.district.toLowerCase().includes(q),
    );
  }

  const sort = params.sort ?? "newest";
  switch (sort) {
    case "price_asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "area_desc":
      result.sort((a, b) => b.area - a.area);
      break;
    default:
      result.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime(),
      );
  }

  return result;
}

export function parseSearchParams(
  sp: Record<string, string | string[] | undefined>,
): SearchParams {
  const pick = (k: string): string | undefined => {
    const v = sp[k];
    if (Array.isArray(v)) return v[0];
    return v;
  };
  const num = (k: string): number | undefined => {
    const v = pick(k);
    if (v === undefined || v === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  return {
    deal: pick("deal") as SearchParams["deal"] | undefined,
    type: pick("type") as SearchParams["type"] | undefined,
    cityId: pick("city") as SearchParams["cityId"] | undefined,
    district: pick("district"),
    minPrice: num("minPrice"),
    maxPrice: num("maxPrice"),
    minRooms: num("minRooms"),
    maxRooms: num("maxRooms"),
    minArea: num("minArea"),
    maxArea: num("maxArea"),
    q: pick("q"),
    sort: pick("sort") as SearchParams["sort"] | undefined,
  };
}
