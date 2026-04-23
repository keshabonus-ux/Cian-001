# Jay.tm — полное описание кодовой базы

Документ для программиста, который впервые открыл репозиторий и хочет понять **что за что отвечает, где править существующее и куда добавлять новое** (в том числе — где в будущем подключать реальный бэкенд и БД).

> **Важный контекст:** сейчас в репозитории **нет серверной части** в классическом смысле. Это статический Next.js-сайт (`output: 'export'`) — весь код выполняется в браузере, данные захардкожены в `lib/`. Всё, что в этом документе названо "бэкендом", — это **заглушки на клиенте**, подготовленные места, куда потом должен прийти реальный API. См. раздел [«Где появится реальный бэкенд»](#где-появится-реальный-бэкенд).

---

## Оглавление

1. [Стек и философия](#стек-и-философия)
2. [Структура репозитория](#структура-репозитория)
3. [Потоки данных](#потоки-данных)
4. [Глобальное состояние: I18nProvider](#глобальное-состояние-i18nprovider)
5. [Справочник модулей `lib/`](#справочник-модулей-lib)
6. [Справочник компонентов `components/`](#справочник-компонентов-components)
7. [Справочник страниц `app/`](#справочник-страниц-app)
8. [Стили и темизация](#стили-и-темизация)
9. [Статический экспорт и деплой](#статический-экспорт-и-деплой)
10. [Мобильное приложение (Capacitor)](#мобильное-приложение-capacitor)
11. [Как добавить X — рецепты](#как-добавить-x--рецепты)
12. [Где появится реальный бэкенд](#где-появится-реальный-бэкенд)
13. [Конвенции кода](#конвенции-кода)

---

## Стек и философия

| Слой | Технология | Где настраивается |
|------|-----------|-------------------|
| UI-фреймворк | React 18 + Next.js 14 App Router | `next.config.mjs`, `app/` |
| Язык | TypeScript 5 (strict) | `tsconfig.json` |
| Стили | Tailwind CSS 3 + глобальный `globals.css` + CSS-переменные | `tailwind.config.ts`, `app/globals.css` |
| Сборка | `next build` → статический экспорт в `out/` | `next.config.mjs` (`output: "export"`) |
| i18n | Собственный DICT + React Context | `lib/i18n.ts`, `components/I18nProvider.tsx` |
| Карты | Leaflet через CDN (для `/new`) + OSM `embed.html` в iframe (для `/offer/[id]`) | `components/MapPicker.tsx`, `app/offer/[id]/OfferView.tsx` |
| Чат-бот | OpenRouter HTTP API, вызывается прямо из браузера | `components/ChatBot.tsx` |
| Мобильное приложение | Capacitor (обёртка над `out/`) | `capacitor.config.ts` |
| Хранилище в браузере | `localStorage` (язык, тема, псевдо-пользователь) | `components/I18nProvider.tsx` |

**Философия:**
- **Всё данные — клиентские сиды в `lib/`.** Никакой сети при рендере, кроме изображений и карт.
- **Все страницы предгенерируются как HTML.** Динамические маршруты (`/offer/[id]`, `/realtors/[id]`) имеют `generateStaticParams()`, которые перечисляют все возможные id.
- **Пользовательский ввод = локально.** Формы (вход, подача объявления, заявка риелтора, юристу, на ипотеку) никуда не отправляются — на submit показывается экран подтверждения.
- **Трёхъязычность — через централизованный словарь `DICT`.** Ключи в `kebab.case`, функция `t()` в каждом клиентском компоненте.

---

## Структура репозитория

```
Cian-001/
├── app/                       # маршруты Next.js App Router (каждая папка = URL)
│   ├── layout.tsx             # корневой layout: <html>, шрифты, Header, Footer, I18nProvider, ChatBot
│   ├── globals.css            # Tailwind @layer + служебные классы .btn-primary, .input, .chip
│   ├── page.tsx               # главная /
│   ├── about/page.tsx         # /about
│   ├── search/                # /search — каталог
│   │   ├── page.tsx           #   серверная обёртка, парсит query
│   │   ├── SearchClient.tsx   #   клиент: фильтры + сортировка + список
│   │   └── SortSelect.tsx
│   ├── offer/[id]/            # /offer/<id> — карточка объявления
│   │   ├── page.tsx           #   serverComponent + generateStaticParams
│   │   ├── OfferView.tsx      #   клиентский вид (галерея, карта, контакты)
│   │   └── not-found.tsx
│   ├── new/                   # /new — форма подачи объявления
│   │   ├── page.tsx
│   │   └── NewListingForm.tsx #   клиентская форма + MapPicker
│   ├── services/page.tsx      # /services — хаб всех услуг
│   ├── realtors/              # /realtors — риелторы
│   │   ├── page.tsx           #   каталог с фильтрами (клиент)
│   │   ├── [id]/page.tsx      #   серверная обёртка + generateStaticParams
│   │   ├── [id]/RealtorView.tsx
│   │   └── apply/page.tsx     #   /realtors/apply — заявка «я риелтор»
│   ├── legal/page.tsx         # /legal — помощь юриста (услуги, чек-лист документов, форма)
│   ├── check/page.tsx         # /check — проверка недвижимости (арест/залог, детерминированная демо-логика)
│   └── mortgage/page.tsx      # /mortgage — калькулятор + банки + форма
│
├── components/                # переиспользуемые UI-компоненты
│   ├── I18nProvider.tsx       # ГЛОБАЛЬНЫЙ контекст: язык, тема, псевдо-пользователь. Экспортирует useApp()
│   ├── Header.tsx             # шапка: лого, навигация, LangSwitcher, ThemeSwitcher, AuthButton
│   ├── Footer.tsx             # футер: разделы (каталог, услуги, о проекте)
│   ├── SearchBar.tsx          # строка поиска на главной (редиректит в /search?q=...)
│   ├── Filters.tsx            # боковая панель фильтров на /search
│   ├── ListingCard.tsx        # карточка объявления (в списках)
│   ├── Gallery.tsx            # галерея фото объявления
│   ├── HeroSlideshow.tsx      # слайдшоу на главной
│   ├── ContactReveal.tsx      # «показать телефон» с защитой от ботов
│   ├── AuthButton.tsx         # кнопка и модалка входа/регистрации (2 вкладки: Покупатель / Продавец)
│   ├── LangSwitcher.tsx       # переключатель языка ru/tk/en
│   ├── ThemeSwitcher.tsx      # System / Light / Dark
│   ├── ChatBot.tsx            # плавающий AI-ассистент (OpenRouter)
│   ├── MapPicker.tsx          # интерактивная карта Leaflet (для формы /new)
│   └── VrTour.tsx             # раскрывающийся iframe с 3D-прогулкой
│
├── lib/                       # чистая доменная логика (без React)
│   ├── types.ts               # базовые типы: Listing, CityId, DealType, PropertyType
│   ├── cities.ts              # CITIES — справочник городов, районов и координат
│   ├── data.ts                # LISTINGS — сид объявлений (~50 штук)
│   ├── realtors.ts            # REALTORS — сид риелторов
│   ├── vr.ts                  # VR_TOURS — карта id → URL 3D-тура
│   ├── search.ts              # searchListings() — фильтрация/сортировка по params
│   ├── i18n.ts                # DICT[lang][key] — единственный источник переводов
│   ├── format.ts              # formatPrice, pricePerSqm, dealLabel, ...
│   ├── dateI18n.ts            # relativeDateI18n — «5 часов назад» / «düýn» / «yesterday»
│   └── images.ts              # пулы заглушечных картинок (Unsplash) и CITY_IMAGES
│
├── public/                    # статика: иконки PWA, manifest.webmanifest, локальные фото
├── out/                       # результат `next build` (коммитить не надо)
├── node_modules/
│
├── next.config.mjs            # output:"export", trailingSlash, разрешённые хосты картинок
├── tailwind.config.ts         # darkMode: "class", brand-палитра (emerald), шрифт Geist
├── postcss.config.mjs
├── tsconfig.json
├── capacitor.config.ts        # обёртка для iOS / Android: appId=tm.jay.app, webDir=out
├── package.json               # scripts: dev / build / start / lint
├── README.md                  # краткое описание
├── DEPLOY.md                  # как развернуть на свой сервер
└── ARCHITECTURE.md            # этот файл
```

---

## Потоки данных

### 1. Список объявлений `/search`

```
URL-параметры (?deal=sale&city=ashgabat&...)
        │
        ▼
  app/search/page.tsx  (server component)
        │  parseSearchParams(sp)      ─── lib/search.ts
        │  searchListings(params)     ─── lib/search.ts  (читает LISTINGS из lib/data.ts)
        ▼
  app/search/SearchClient.tsx  (client) ── отрисовывает ListingCard[]
        │
        └── Filters (боковая панель) меняет URL через router.push(?...)
```

### 2. Карточка объявления `/offer/[id]`

```
Сборка: generateStaticParams() пробегает LISTINGS.map(l => {id}) → генерится по HTML на каждое id
        │
Runtime:
  app/offer/[id]/page.tsx  (server) → listingById(id) → OfferView (client)
        │
        ├── Gallery(listing.images)
        ├── OSM-iframe(listing.lat, lng)
        ├── VrTour(url=vrTourUrl(id))        ── опционально, если id в VR_TOURS
        ├── ContactReveal(author.phone)
        └── блок контактов / кнопки «написать»
```

### 3. Фильтр риелторов `/realtors`

Весь фильтр — клиентский (`"use client"`), данные — `REALTORS` из `lib/realtors.ts`. Навигация в профиль — `<Link href={/realtors/${id}}>`; HTML-файлы на каждого риелтора пререндерятся через `generateStaticParams()`.

### 4. Форма подачи объявления `/new`

```
NewListingForm (client)
    ├── обычные поля (контроллируются локальным state)
    ├── MapPicker ── загружает Leaflet с unpkg.com (динамически) → lat/lng в hidden input
    └── onSubmit → НИЧЕГО не отправляет, просто setSubmitted(true)
```

### 5. Глобальные провайдеры (корневой layout)

```
<RootLayout>
  <I18nProvider>        ← язык + тема + «пользователь» из localStorage
    <Header />           ← навигация
    <main>{children}</main>
    <Footer />
    <ChatBot />          ← плавающая кнопка AI-ассистента
  </I18nProvider>
</RootLayout>
```

---

## Глобальное состояние: I18nProvider

Файл: <ref_file file="components/I18nProvider.tsx" />.

Единственный React-Context в проекте. Хранит:

| Поле | Тип | Куда сохраняется | Назначение |
|------|-----|------------------|------------|
| `lang` | `"ru" \| "tk" \| "en"` | `localStorage["jay.lang"]` | Текущий язык для `t()` |
| `theme` | `"light" \| "dark" \| "system"` | `localStorage["jay.theme"]` | Режим темы |
| `resolvedTheme` | `"light" \| "dark"` | — (computed) | Какая тема фактически применена |
| `user` | `{role,name,email} \| null` | `localStorage["jay.user"]` | Псевдо-авторизация (только в браузере) |

Хук:

```ts
const { t, lang, setLang, theme, setTheme, user, login, logout } = useApp();
```

Все клиентские компоненты подтягивают переводы через `const { t } = useApp(); t("key")`.

В `app/layout.tsx` есть **inline-скрипт темы**, который до гидратации выставляет `<html class="dark">`, чтобы не было мигания светлой темы при загрузке тёмной.

---

## Справочник модулей `lib/`

### `lib/types.ts`
Базовые типы предметной области. **Здесь единственное место, где определены `DealType`, `PropertyType`, `CityId`, `Listing`.** Меняя тут — надо прогнать по остальным `lib/*` и `components/*`.

### `lib/cities.ts`
Экспорт `CITIES: City[]`. Поля: `id`, `name` (ru), `nameTk`, `districts`, `lat`, `lng`.
Используется в: фильтрах, форме `/new`, MapPicker, ChatBot-системном промпте.
**Добавить новый город → добавить тип в `CityId` в `types.ts` и объект в этот массив. Всё остальное подхватится автоматически.**

### `lib/data.ts`
Экспорт `LISTINGS: Listing[]` — ~50 захардкоженных объявлений. Каждое: id, название, тип сделки, тип недвижимости, цена (ТМТ), площадь, город, район, адрес, описание, картинки (через `imagesFor`), автор, удобства, дата, координаты.
**Когда появится реальный бэкенд — этот файл заменится одной функцией-loader’ом.** См. [раздел про бэкенд](#где-появится-реальный-бэкенд).

### `lib/realtors.ts`
Экспорт `REALTORS: Realtor[]` + helper `realtorById(id)`. 6 демо-риелторов. То же самое: один файл сейчас → один fetch-эндпоинт потом.

### `lib/vr.ts`
Маппинг `listingId → URL 3D-тура` (Kuula-ссылки). Функция `vrTourUrl(id)`.
В реальном продукте это поле должно лежать прямо в `Listing` (напр. `listing.vrTourUrl`).

### `lib/search.ts`
Чистая функция `searchListings(params: SearchParams): Listing[]` — фильтрация + сортировка в памяти.
`parseSearchParams(sp)` — мост из `URLSearchParams` в `SearchParams`.
**Когда появится бэкенд — тело `searchListings` меняется на `fetch("/api/listings?"+qs)`, сигнатура остаётся та же.**

### `lib/i18n.ts`
Огромный объект `DICT: Record<Lang, Record<TKey, string>>`. Тут **все** строки интерфейса. Структура ключей:

```
nav.search, nav.login, nav.services, ...
offer.title, offer.price, offer.map_note, ...
realtors.*, legal.*, check.*, mortgage.*, vr.*, new.*, auth.*
```

`Lang = "ru" | "tk" | "en"`. Помимо словаря экспортируется тип `TKey` — объединение всех ключей, которое делает `t("some.key")` типобезопасным.

### `lib/format.ts`
`formatPrice`, `pricePerSqm`, `formatPriceCompact(price, dealType, lang)`, `dealLabel`, `propertyLabel`, `roomsLabel`, `formatDate`, `relativeDate`.
Все ценовые строки проходят через эти функции — единая точка правды по форматированию.

### `lib/dateI18n.ts`
То же, что `format.ts`, но для дат с языком (`relativeDateI18n(iso, lang)`).

### `lib/images.ts`
Детерминированный подбор картинок Unsplash по типу недвижимости и seed’у (id объявления). Не используется, когда у объявления есть собственное поле `images`.

---

## Справочник компонентов `components/`

> Все компоненты — клиентские (`"use client"`), за исключением тех, что импортируются напрямую в серверные `page.tsx` (тогда они сами серверные, например `Header`/`Footer` — они НЕ client, но внутри используют клиентские дочерние).

### `I18nProvider.tsx`
Описан выше. Экспортирует `<I18nProvider>`, `useApp()`, `useT()`.

### `Header.tsx`
Шапка. Массив `navLinks` определяет пункты меню. `Добавить пункт меню` → дописать сюда. Навигация подсвечивается по `usePathname()`.

### `Footer.tsx`
Футер. Статические ссылки сгруппированы по разделам: «Каталог», «Услуги», «О нас».

### `SearchBar.tsx`
Поле поиска на главной. На submit делает `router.push("/search?q=...")`.

### `Filters.tsx`
Фильтры в сайдбаре `/search`. Рендерит чипы/селекты, меняет URL через `router.push`, не хранит локального состояния кроме открытия/закрытия секций.

### `ListingCard.tsx`
Карточка объявления. Показывает бейдж «3D-тур», если `vrTourUrl(listing.id)` вернула строку. Можно добавлять новые бейджи — тем же паттерном.

### `Gallery.tsx`
Галерея фото с клавиатурной навигацией и fullscreen overlay.

### `HeroSlideshow.tsx`
Смена hero-картинок на главной.

### `ContactReveal.tsx`
Телефон изначально скрыт (первые цифры); по клику раскрывается полностью + кнопка `tel:`. Анти-скрейпинг-паттерн.

### `AuthButton.tsx`
Кнопка «Войти/Регистрация» в шапке + модальное окно.
- Две вкладки: покупатель / продавец.
- Два режима: login / register.
- На submit — `login({role, name, email})` в контексте (в `localStorage["jay.user"]`). Никаких внешних запросов.
- **Дизайн-класс модалки:** `bg-black/70 backdrop-blur-sm` поверх сайта + карточка с `border`, `shadow-2xl`, `ring-1`. Активные вкладки — `dark:bg-brand-900/30`.

### `LangSwitcher.tsx`, `ThemeSwitcher.tsx`
Выпадающие переключатели языка и темы. Пишут в `setLang` / `setTheme` из `useApp()`.

### `ChatBot.tsx`
Плавающий AI-ассистент в правом нижнем углу. Зовёт OpenRouter напрямую из браузера. Системный промпт заставляет его предлагать **только внутренние маршруты** (`/search?...`, `/offer/...`). Есть цепочка fallback-моделей на случай 429.
**Конфигурация:** `process.env.NEXT_PUBLIC_OPENROUTER_API_KEY` (запекается в бандл на билде). Пустой ключ → бот пишет «ключ не настроен», сайт работает.

### `MapPicker.tsx`
Интерактивная карта на странице подачи объявления. Не тянет Leaflet как npm-зависимость — загружает его с `unpkg.com` через динамический `<script>`/`<link>` внутри `useEffect`. Плюсы: не раздуваем бандл, SSR не ломается. Минусы: требует доступа к `unpkg.com` у пользователя.

API:
```ts
<MapPicker
  center={{lat, lng}}                // центр по умолчанию (обычно — центр города)
  value={coords | null}              // текущая выбранная точка
  onChange={(ll) => setCoords(ll)}   // вызывается при клике и при перетаскивании
/>
```

Плюс кнопка «Использовать моё местоположение» (`navigator.geolocation`) и «Сбросить к центру города».

### `VrTour.tsx`
Заглушка 3D-тура. Сначала показывает пустой бокс + кнопку; по клику — вставляет `<iframe src={url}>` и кнопки «развернуть / закрыть». Отдельно компонент нужен, чтобы **не грузить iframe до клика** (экономия трафика).

---

## Справочник страниц `app/`

### `/` — главная (`app/page.tsx`)
Слайдшоу + поиск + популярные города + 6 свежих объявлений. Серверный компонент, читает `LISTINGS` напрямую.

### `/search` — каталог
`page.tsx` (server) парсит query → зовёт `searchListings` → передаёт массив в `SearchClient.tsx`. Фильтры меняют URL.

### `/offer/[id]` — карточка
`page.tsx` (server) с `generateStaticParams()` → `OfferView.tsx` (client). В `OfferView` — галерея, характеристики, удобства, описание, карта (iframe OSM), `VrTour` (опционально), сайдбар с контактами.

### `/new` — подача объявления
`page.tsx` (server wrapper) → `NewListingForm.tsx` (client). Форма + `MapPicker`. На submit показывается успех.

### `/about` — о проекте
Статическая страница с текстом.

### `/services` — хаб услуг
Сетка карточек: риелторы / юрист / проверка / ипотека. Каждая — ссылка на соответствующую страницу.

### `/realtors` — каталог риелторов
Фильтры (город, специализация, поиск), список карточек.
**`/realtors/[id]`** — профиль. Данные из `REALTORS`, объявления риелтора фильтруются из `LISTINGS` по `author.name`.
**`/realtors/apply`** — форма «я риелтор».

### `/legal` — помощь юриста
Секция «что мы делаем», интерактивный чек-лист документов (табы: купить / продать / арендовать), форма заявки в сайдбаре.

### `/check` — проверка недвижимости
Форма (адрес + ФИО, опционально). При submit — **детерминированный** демо-результат: тот же ввод всегда даёт тот же вывод. Логика: hash(ввода) → 0/1/2/… → 5 признаков (арест, залог, обременения, коммуналка, собственник). В реальном продукте это место подменяется вызовом Госрегистра / банковских API.

### `/mortgage` — ипотека
1. **Калькулятор** с формулой аннуитета `M = L * r / (1 - (1 + r)^{-n})`, где `r = (annual_rate/100)/12`, `n = years*12`. Выводит ежемесячный платёж, переплату, сумму платежей.
2. **4 банка-партнёра** с разными ставками/сроками — карточками. Клик «Оставить заявку» → подстановка банка и его ставки/срока в калькулятор + скролл к форме.
3. **Форма** — имя, телефон, доход, работодатель, банк. Демо.

---

## Стили и темизация

- Tailwind с `darkMode: "class"`. Тема переключается классом `dark` на `<html>` (вставляется `ThemeSwitcher` и инит-скриптом в `layout.tsx`).
- Палитра `brand-*` — emerald (см. `tailwind.config.ts`).
- Общие классы описаны через `@apply` в `app/globals.css`:
  - `.btn-primary` — основная кнопка (зелёная).
  - `.btn-outline` — вторичная.
  - `.input` — стилизованный `input/select/textarea`.
  - `.chip` — тег-пилюля.
- Для поддержки dark всегда пишем пары: `bg-white dark:bg-slate-900`, `border-slate-200 dark:border-slate-800`, `text-slate-900 dark:text-slate-100`.
- Шрифты — `Geist Sans` и `Geist Mono` локальные (`app/fonts/`).

---

## Статический экспорт и деплой

- `next.config.mjs` → `output: "export"` + `trailingSlash: true`. На `next build` кладёт весь сайт в `out/`.
- Никаких API-роутов (`app/api/...`) **не будет собираться** при статическом экспорте — если их добавить, надо снять `output: "export"`.
- Детальная инструкция по деплою: <ref_file file="DEPLOY.md" /> (VPS+Nginx, Docker, Netlify/Vercel/CF Pages/S3).

---

## Мобильное приложение (Capacitor)

Файл <ref_file file="capacitor.config.ts" />. Обёртывает `out/` в WebView. Команда инициализации платформ (однократно):

```bash
npm i -D @capacitor/cli @capacitor/core @capacitor/ios @capacitor/android
npm run build
npx cap add ios
npx cap add android
npx cap sync
npx cap open ios       # или android
```

Потом любой редеплой:
```bash
npm run build && npx cap sync
```

> **Осторожно с iframe-кодом на мобильных:** Leaflet с `unpkg.com` и `kuula.co` будут работать только если есть интернет и хосты не заблокированы. Для офлайн-сценария стоит либо хостить Leaflet у себя, либо заменить MapPicker на нативный плагин карт.

---

## Как добавить X — рецепты

### 1. Новый город
1. В <ref_file file="lib/types.ts" /> — добавить id в union `CityId`.
2. В <ref_file file="lib/cities.ts" /> — добавить объект: id, name, nameTk, districts[], lat, lng.
3. В <ref_file file="lib/images.ts" /> — добавить обложку в `CITY_IMAGES`.
4. (Опционально) в <ref_file file="lib/i18n.ts" /> — человекочитаемое имя под ключом `city.<id>` для всех трёх языков.

Всё остальное (фильтры, форма `/new`, карта, ChatBot-подсказки) подхватит автоматически.

### 2. Новое поле у объявления (например, `hasParking`)
1. В `Listing` (`lib/types.ts`) — добавить поле (опциональное, чтобы не ломать существующие записи).
2. Обновить записи в `lib/data.ts` там, где это применимо.
3. В `components/ListingCard.tsx` и `app/offer/[id]/OfferView.tsx` — отрисовать бейдж/иконку.
4. Если нужен фильтр — добавить параметр в `SearchParams` (`lib/search.ts`), фильтрующую ветку, пункт в `components/Filters.tsx`.
5. В `lib/i18n.ts` — все подписи.

### 3. Новая страница-услуга (в духе `/legal`, `/check`)
1. Создать `app/<slug>/page.tsx` как клиентский компонент по образцу `app/legal/page.tsx`.
2. В `lib/i18n.ts` — ключи `<slug>.title`, `<slug>.subtitle`, формы и т.д. во всех трёх языках.
3. В `app/services/page.tsx` — добавить карточку в массив `CARDS` (сейчас там 4 услуги).
4. В `components/Footer.tsx` — ссылку в разделе «Услуги».
5. При необходимости — пункт в `Header.tsx` (обычно хватает `/services`).

### 4. Новый язык (например, турецкий `tr`)
1. В <ref_file file="lib/i18n.ts" />: расширить union `Lang = "ru" | "tk" | "en" | "tr"`, добавить ветку `tr: { ...все ключи }`. TypeScript не соберёт билд, пока не заполнены все ключи — это и страхует от пропусков.
2. В <ref_file file="lib/format.ts" />, <ref_file file="lib/dateI18n.ts" /> — добавить соответствующую локаль.
3. В `components/LangSwitcher.tsx` — пункт в меню.
4. В `components/ChatBot.tsx` — ветка системного промпта под новый язык.

### 5. Новый 3D-тур
1. В `lib/vr.ts` — вписать пару `"<listingId>": "<url>"` в `VR_TOURS`. Всё остальное подхватится: бейдж на карточке + блок на странице объявления появятся сами.

### 6. Новый риелтор
Добавить объект в массив `REALTORS` в `lib/realtors.ts`. Следить за уникальным `id` (он же будет в URL: `/realtors/<id>`). После `next build` появится статическая страница профиля.

### 7. Новая валюта / регион
Сейчас жёстко `TMT`. Для расширения:
- в `Listing.currency` сделать union,
- в `lib/format.ts` — добавить ветки форматирования и локалей,
- в `lib/i18n.ts` — подписи.

---

## Где появится реальный бэкенд

Прототип спроектирован так, чтобы **миграция на API** была точечной и предсказуемой. Каждый домен имеет один «источник правды» в `lib/`, который заменяется на fetch-вызов, **не трогая UI**.

### Шаг 0. Снять статический экспорт

В `next.config.mjs` убрать строку `output: "export"`. Теперь Next.js сможет крутить API-роуты и SSR.

### Шаг 1. Создать API-роуты

```
app/
└── api/
    ├── listings/
    │   ├── route.ts          # GET  /api/listings?deal=...&city=...
    │   └── [id]/route.ts     # GET  /api/listings/<id>
    ├── realtors/
    │   ├── route.ts
    │   └── [id]/route.ts
    ├── leads/
    │   ├── legal/route.ts    # POST — заявка юристу
    │   ├── mortgage/route.ts # POST — заявка на ипотеку
    │   └── realtor/route.ts  # POST — заявка «я риелтор»
    ├── check/route.ts        # POST /api/check — проверка ареста/залога
    ├── new-listing/route.ts  # POST — подача объявления (+ модерация)
    ├── auth/
    │   ├── register/route.ts
    │   ├── login/route.ts
    │   └── logout/route.ts
    └── chat/route.ts         # проксирует OpenRouter (чтобы ключ не уходил в браузер)
```

### Шаг 2. Подменить источники данных

| Сейчас (прототип) | Станет (прод) |
|-------------------|---------------|
| `import { LISTINGS } from "@/lib/data"` | `const data = await fetch("/api/listings").then(r => r.json())` |
| `searchListings(params)` (в памяти) | `fetch("/api/listings?" + toQS(params))` — серверный фильтр по БД |
| `REALTORS` в `lib/realtors.ts` | `fetch("/api/realtors")` |
| `VR_TOURS` в `lib/vr.ts` | поле `listing.vrTourUrl` из БД |
| `AuthButton.login()` → `localStorage` | `POST /api/auth/login` → httpOnly cookie + JWT |
| Демо-`/check` с хешем ввода | Запрос к Госрегистру / банковской системе |
| Submit форм → `setSubmitted(true)` | `POST /api/leads/<kind>` → запись в CRM / в БД |
| ChatBot → OpenRouter из браузера | `POST /api/chat` → серверный прокси с тем же ключом, но уже на бэкенде |

### Шаг 3. Подключить БД

Рекомендация: **PostgreSQL + Prisma** или **Supabase** (даёт postgres + auth + storage + сразу готовый SDK).

Минимальный набор таблиц:

```
users            (id, email, name, role, password_hash, created_at)
cities           (id, name_ru, name_tk, name_en, lat, lng)
districts        (id, city_id, name)
listings         (id, user_id, deal_type, property_type, title, description,
                  price, area, rooms, floor, total_floors, city_id, district_id,
                  address, lat, lng, published_at, status, vr_tour_url)
listing_images   (id, listing_id, url, ord)
listing_amenities(listing_id, amenity)
realtors         (id, user_id, agency, photo, rating, reviews, deals, bio, ...)
realtor_spec     (realtor_id, specialization)
leads            (id, type [legal|mortgage|realtor|listing], payload_json, created_at)
check_reports    (id, address, owner_name, result_json, created_at)
favorites        (user_id, listing_id, created_at)
```

### Шаг 4. Авторизация

Заменить `I18nProvider.user` (читающего `localStorage`) на:
- httpOnly cookie-based session (Next.js middleware + `iron-session` / `next-auth`), или
- Supabase Auth (клиент сам ведёт сессию), или
- JWT + refresh-token + `httpOnly` cookie.

В серверных компонентах — читать пользователя через `cookies()` API. В клиентских — через `useApp().user`, но набирать его из `/api/auth/me`.

### Шаг 5. Загрузка картинок

Сейчас картинки — внешние URL. Для прод-версии — своё хранилище (S3 / Supabase Storage). Форма `/new` должна уметь загружать `FormData` в `POST /api/uploads`, получать URL и уже его класть в `listing.images`.

### Шаг 6. Чат-бот

Сейчас `NEXT_PUBLIC_OPENROUTER_API_KEY` виден в браузере. В проде:
- сделать `POST /api/chat` — серверный роут,
- ключ хранить в приватной env-переменной (`OPENROUTER_API_KEY`, **без** `NEXT_PUBLIC_`),
- клиент шлёт только сообщения, сервер их проксирует, режет по rate-limit, пишет в БД.

### Шаг 7. Проверка ареста/залога `/check`

Сейчас — `hash(input) % N`. В проде — интеграция с Госрегистром недвижимости Туркменистана (или с банками-партнёрами) по API. Ответ складывать в `check_reports` и показывать пользователю, плюс письмо/SMS автору.

### Шаг 8. Ипотека `/mortgage`

Калькулятор уже работает локально. Заявка — `POST /api/leads/mortgage`. Для авто-одобрения — интеграции с банками (обычно по отдельному SLA).

---

## Конвенции кода

- **`"use client"`** — только у компонентов, которые используют хуки (`useState`/`useEffect`/контекст). Все серверные `page.tsx` оставляем без `use client`.
- **`useApp()`** — единственный способ получить `t`, `lang`, `user`, `theme`. Никаких собственных контекстов не плодим.
- **Ключи i18n** — `kebab.case`, сгруппированы префиксами (`nav.*`, `offer.*`, `mortgage.*`). Новые строки добавляем сразу во все три языка (TypeScript не даст собрать с недостающим ключом).
- **Цвета** — только через Tailwind-утилиты (`brand-*`, `slate-*`, `red-*`). Никаких инлайн-стилей, кроме исключений (background картинок).
- **Тёмная тема** — у каждого `bg-*`, `text-*`, `border-*` есть пара `dark:*`.
- **Импорты** — алиасы `@/` (`@/components/Foo`, `@/lib/bar`) вместо относительных путей.
- **Валидация форм** — пока простая на клиенте (required, проверка длин). Для прод-версии — `zod` на клиенте и на сервере (одна и та же схема).
- **Никаких `any`** — типы во всех lib-файлах вручную объявлены.
- **Не держать бизнес-логику в компонентах.** Всё, что можно унести в `lib/`, — уносим (облегчает перевод на серверный API).

---

## FAQ для нового разработчика

**«Почему нет `/api/...`?»** — потому что сейчас `output: "export"`. Когда будет бэкенд — снять эту настройку, добавить `app/api/**`.

**«Почему Leaflet без npm-пакета?»** — чтобы не раздувать бандл ради одной страницы `/new` и чтобы не возиться с `next/dynamic` + SSR. Как только появится бэкенд и остановится статический экспорт — имеет смысл переехать на `react-leaflet` штатно.

**«Где вся текстовка?»** — в <ref_file file="lib/i18n.ts" />. Трогать только там; в JSX всегда `t("some.key")`.

**«Где добавить шапке новый пункт?»** — <ref_file file="components/Header.tsx" />, массив `navLinks`.

**«Как поменять иконку/favicon?»** — `public/icons/*`. Манифест — `public/manifest.webmanifest`.

**«Как работает псевдо-логин?»** — `components/AuthButton.tsx` → `useApp().login({...})` → пишется в `localStorage["jay.user"]`. Никаких запросов. В PR-е, где добавится реальный бэкенд, эту ветку заменит вызов `/api/auth/login`.

**«Что сломается при переезде на прод-бэкенд?»** — UI не должен сломаться нигде, если соблюсти сигнатуры: `searchListings`, `realtorById`, `listingById`, `vrTourUrl` — вернуть те же типы, но из `fetch`. Максимум изменения — обернуть страницы в `async` и поменять импорт.
