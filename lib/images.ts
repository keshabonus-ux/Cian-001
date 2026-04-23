import type { PropertyType } from "./types";

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=crop`;

const APARTMENTS = [
  "photo-1522708323590-d24dbb6b0267",
  "photo-1502672260266-1c1ef2d93688",
  "photo-1505691938895-1758d7feb511",
  "photo-1493809842364-78817add7ffb",
  "photo-1560448204-e02f11c3d0e2",
  "photo-1600585154340-be6161a56a0c",
  "photo-1600566753190-17f0baa2a6c3",
  "photo-1600566753376-12c8ab7fb75b",
  "photo-1600585154526-990dced4db0d",
  "photo-1600607687939-ce8a6c25118c",
  "photo-1600210492493-0946911123ea",
  "photo-1560185127-6ed189bf02f4",
].map(unsplash);

const HOUSES = [
  "photo-1512917774080-9991f1c4c750",
  "photo-1564013799919-ab600027ffc6",
  "photo-1568605114967-8130f3a36994",
  "photo-1580587771525-78b9dba3b914",
  "photo-1600585154340-be6161a56a0c",
  "photo-1570129477492-45c003edd2be",
  "photo-1613490493576-7fde63acd811",
  "photo-1600596542815-ffad4c1539a9",
].map(unsplash);

const COMMERCIAL = [
  "photo-1497366216548-37526070297c",
  "photo-1497366811353-6870744d04b2",
  "photo-1556761175-5973dc0f32e7",
  "photo-1497366754035-f200968a6e72",
  "photo-1551135049-8a33b5883817",
  "photo-1542361345-89e58247f2d5",
].map(unsplash);

const LAND = [
  "photo-1500382017468-9049fed747ef",
  "photo-1470723710355-95304d8aece4",
  "photo-1464822759023-fed622ff2c3b",
  "photo-1501854140801-50d01698950b",
].map(unsplash);

const ROOMS = [
  "photo-1540518614846-7eded433c457",
  "photo-1522771739844-6a9f6d5f14af",
  "photo-1595526114035-0d45ed16cfbf",
  "photo-1598928506311-c55ded91a20c",
].map(unsplash);

const POOLS: Record<PropertyType, string[]> = {
  apartment: APARTMENTS,
  house: HOUSES,
  commercial: COMMERCIAL,
  land: LAND,
  room: ROOMS,
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function imagesFor(
  type: PropertyType,
  seed: string,
  count = 4,
): string[] {
  const pool = POOLS[type] ?? APARTMENTS;
  const start = hash(seed) % pool.length;
  return Array.from({ length: count }, (_, i) => pool[(start + i) % pool.length]);
}

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80&auto=format&fit=crop";

export const CITY_IMAGES: Record<string, string> = {
  ashgabat:
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80&auto=format&fit=crop",
  turkmenabat:
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&q=80&auto=format&fit=crop",
  mary:
    "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=1200&q=80&auto=format&fit=crop",
  dashoguz:
    "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&q=80&auto=format&fit=crop",
  balkanabat:
    "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&q=80&auto=format&fit=crop",
  turkmenbashi:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop",
  tejen:
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80&auto=format&fit=crop",
  bayramaly:
    "https://images.unsplash.com/photo-1543489822-c49534f3271f?w=1200&q=80&auto=format&fit=crop",
};
