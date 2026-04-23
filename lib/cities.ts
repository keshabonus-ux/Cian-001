import type { CityId } from "./types";

export interface City {
  id: CityId;
  name: string;
  nameTk: string;
  districts: string[];
  lat: number;
  lng: number;
}

export const CITIES: City[] = [
  {
    id: "ashgabat",
    name: "Ашхабад",
    nameTk: "Aşgabat",
    districts: [
      "Центр",
      "Бикрова",
      "Копетдаг",
      "Беркарарлык",
      "Багтыярлык",
      "Арчабил",
      "30 мкр",
      "Мир 1",
      "Парахат 1",
      "Парахат 2",
      "Парахат 7",
      "Хитровка",
      "Гаудан",
    ],
    lat: 37.9601,
    lng: 58.3261,
  },
  {
    id: "turkmenabat",
    name: "Туркменабат",
    nameTk: "Türkmenabat",
    districts: ["Центр", "Ходжамбас", "Газоджак", "Саят", "Фараб"],
    lat: 39.0725,
    lng: 63.5784,
  },
  {
    id: "mary",
    name: "Мары",
    nameTk: "Mary",
    districts: ["Центр", "Байрамали", "Мургаб", "Туркменкала", "Векильбазар"],
    lat: 37.5960,
    lng: 61.8330,
  },
  {
    id: "dashoguz",
    name: "Дашогуз",
    nameTk: "Daşoguz",
    districts: ["Центр", "Гурбансолтан", "Кёнеургенч", "Болдумсаз"],
    lat: 41.8361,
    lng: 59.9642,
  },
  {
    id: "balkanabat",
    name: "Балканабат",
    nameTk: "Balkanabat",
    districts: ["Центр", "Небитдаг", "Джебел", "Сердар"],
    lat: 39.5108,
    lng: 54.3672,
  },
  {
    id: "turkmenbashi",
    name: "Туркменбаши",
    nameTk: "Türkmenbaşy",
    districts: ["Центр", "Аваза", "Хазар", "Гарабогаз"],
    lat: 40.0216,
    lng: 52.9698,
  },
  {
    id: "tejen",
    name: "Теджен",
    nameTk: "Tejen",
    districts: ["Центр", "Алтын-Асыр"],
    lat: 37.3787,
    lng: 60.5083,
  },
  {
    id: "bayramaly",
    name: "Байрамали",
    nameTk: "Baýramaly",
    districts: ["Центр", "Мургаб"],
    lat: 37.6196,
    lng: 62.1628,
  },
];

export function cityById(id: CityId): City | undefined {
  return CITIES.find((c) => c.id === id);
}

export function cityName(id: CityId): string {
  return cityById(id)?.name ?? id;
}
