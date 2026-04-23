export type DealType = "sale" | "rent";

export type PropertyType =
  | "apartment"
  | "house"
  | "room"
  | "commercial"
  | "land";

export type CityId =
  | "ashgabat"
  | "turkmenabat"
  | "mary"
  | "dashoguz"
  | "balkanabat"
  | "turkmenbashi"
  | "tejen"
  | "bayramaly";

export interface Listing {
  id: string;
  title: string;
  dealType: DealType;
  propertyType: PropertyType;
  price: number; // in TMT
  currency: "TMT";
  rooms?: number;
  area: number; // m²
  floor?: number;
  totalFloors?: number;
  cityId: CityId;
  district: string;
  address: string;
  description: string;
  images: string[];
  author: {
    name: string;
    role: "owner" | "agent" | "agency";
    phone: string;
  };
  amenities: string[];
  publishedAt: string; // ISO
  lat?: number;
  lng?: number;
}
