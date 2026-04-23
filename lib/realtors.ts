import type { Lang } from "./i18n";

export type Specialization =
  | "sale_apartments"
  | "rent_apartments"
  | "houses"
  | "commercial"
  | "land";

export type Realtor = {
  id: string;
  name: string;
  agency: string | null;
  cityId: string;
  phone: string;
  email: string;
  photo: string;
  rating: number;
  reviews: number;
  deals: number;
  listingsCount: number;
  yearsExperience: number;
  languages: Lang[];
  specializations: Specialization[];
  bio: string;
};

export const REALTORS: Realtor[] = [
  {
    id: "merdan-ataev",
    name: "Мердан Атаев",
    agency: "Jay.tm Premium",
    cityId: "ashgabat",
    phone: "+993 12 34-56-78",
    email: "merdan@jay.tm",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 147,
    deals: 212,
    listingsCount: 18,
    yearsExperience: 9,
    languages: ["ru", "tk", "en"],
    specializations: ["sale_apartments", "houses"],
    bio: "Эксперт по премиальной недвижимости Ашхабада. Помогаю с подбором квартир в Беркарарлыке и частных домов в Копетдаге.",
  },
  {
    id: "gulshirin-nuryeva",
    name: "Гульширин Нурыева",
    agency: "Altyn Öý",
    cityId: "ashgabat",
    phone: "+993 12 11-22-33",
    email: "gulshirin@altynoy.tm",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 92,
    deals: 156,
    listingsCount: 24,
    yearsExperience: 7,
    languages: ["ru", "tk"],
    specializations: ["rent_apartments", "sale_apartments"],
    bio: "Сопровождаю сделки с долгосрочной арендой и покупкой первого жилья. Работаю с молодыми семьями.",
  },
  {
    id: "bayram-hojayev",
    name: "Байрам Ходжаев",
    agency: null,
    cityId: "turkmenabat",
    phone: "+993 422 22-33-44",
    email: "bayram.h@mail.tm",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 54,
    deals: 78,
    listingsCount: 11,
    yearsExperience: 5,
    languages: ["ru", "tk"],
    specializations: ["houses", "land"],
    bio: "Частный риелтор в Лебапском велаяте. Специализируюсь на частных домах и земельных участках.",
  },
  {
    id: "jennet-myradova",
    name: "Дженнет Мырадова",
    agency: "Dessan Estate",
    cityId: "mary",
    phone: "+993 522 33-44-55",
    email: "jennet@dessan.tm",
    photo:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 63,
    deals: 89,
    listingsCount: 14,
    yearsExperience: 6,
    languages: ["ru", "tk", "en"],
    specializations: ["sale_apartments", "commercial"],
    bio: "Работаю с коммерческой недвижимостью и квартирами в Мары. Веду сделки под ключ с юридическим сопровождением.",
  },
  {
    id: "serdar-orazov",
    name: "Сердар Оразов",
    agency: "Balkan Realty",
    cityId: "turkmenbashi",
    phone: "+993 243 44-55-66",
    email: "serdar@balkanrealty.tm",
    photo:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 118,
    deals: 164,
    listingsCount: 27,
    yearsExperience: 11,
    languages: ["ru", "tk", "en"],
    specializations: ["sale_apartments", "rent_apartments", "commercial"],
    bio: "Недвижимость в Туркменбаши и Аваза: курортные апартаменты, офисы и коммерция на побережье.",
  },
  {
    id: "aynur-mammedova",
    name: "Айнур Маммедова",
    agency: "Dashoguz Home",
    cityId: "dashoguz",
    phone: "+993 322 55-66-77",
    email: "aynur@dashoguzhome.tm",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 41,
    deals: 62,
    listingsCount: 9,
    yearsExperience: 4,
    languages: ["ru", "tk"],
    specializations: ["sale_apartments", "houses", "land"],
    bio: "Дашогузский рынок недвижимости — от квартир в центре до участков под застройку.",
  },
];

export function realtorById(id: string): Realtor | undefined {
  return REALTORS.find((r) => r.id === id);
}
