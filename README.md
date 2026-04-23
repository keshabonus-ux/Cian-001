# Jay.tm — прототип сайта недвижимости для Туркменистана

Прототип сервиса объявлений о недвижимости для Туркменистана, вдохновлённый [cian.ru](https://www.cian.ru/), но адаптированный под туркменский рынок: города, районы, цены в манатах (TMT), трёхъязычный интерфейс.

## Возможности

- **Каталог объявлений** с фильтрами (тип сделки, тип недвижимости, город, район, цена TMT, комнаты, площадь) и сортировкой
- **Карточка объявления** — галерея, характеристики, описание, удобства, карта OpenStreetMap, контакты продавца
- **Подача объявления** (демо-форма)
- **Три языка**: русский, türkmen, English — с переключателем в шапке
- **Тёмная тема** — System / Light / Dark в шапке; состояние сохраняется в `localStorage`
- **Роли при регистрации**: покупатель/арендатор и продавец/арендодатель (демо)
- **Адаптивный интерфейс**: гамбургер-меню, выдвижные фильтры, перестановка блоков на мобильных
- **PWA**: манифест + иконки, сайт можно установить как приложение на iOS/Android
- **Capacitor**: конфиг готов для упаковки в нативные iOS/Android приложения

## Стек

- [Next.js 14](https://nextjs.org/) (App Router) + React 18 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) (`darkMode: 'class'`)
- Статический экспорт (`output: 'export'`) — деплоится как обычная статика
- Данные — seed-объявления в `lib/data.ts`, фото — Unsplash, карта — OpenStreetMap iframe
- i18n — собственный лёгкий контекст (`components/I18nProvider.tsx`, `lib/i18n.ts`)

## Страницы

- `/` — главная: hero-слайдшоу из реальных фото объявлений, популярные города, свежие объявления
- `/search` — каталог с фильтрами (на мобильном — в выдвижной панели)
- `/offer/[id]` — карточка объявления
- `/new` — форма подачи объявления (демо — данные не сохраняются)
- `/about` — информация о проекте

## Быстрый старт

```bash
npm install
npm run dev        # http://localhost:3000
```

## Сборка и проверки

```bash
npm run lint       # ESLint
npm run build      # Статический экспорт в ./out
```

Результат сборки — папка `out/`, её можно выложить на любой статический хостинг
(Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, nginx).

## PWA (установка как приложение)

Манифест — `public/manifest.webmanifest`, иконки — `public/icons/`.
После деплоя сайт можно «Добавить на главный экран» в Chrome / Safari — он будет
запускаться в полноэкранном режиме, иметь свою иконку и сплэш.

Шорткаты в манифесте: «Подать объявление» → `/new`, «Поиск» → `/search`.

## Нативные приложения (Capacitor)

`capacitor.config.ts` уже настроен (`appId: tm.jay.app`, `webDir: out`).
Для сборки нативных приложений:

### Android

```bash
# однократно
npm install --save-dev @capacitor/cli
npm install @capacitor/core @capacitor/android
npx cap add android

# при каждом обновлении
npm run build
npx cap sync android
npx cap open android     # откроет Android Studio; оттуда Build → APK / AAB
```

Требуется установленный [Android Studio](https://developer.android.com/studio) + Android SDK.

### iOS

```bash
# однократно (только на macOS)
npm install --save-dev @capacitor/cli
npm install @capacitor/core @capacitor/ios
npx cap add ios

# при каждом обновлении
npm run build
npx cap sync ios
npx cap open ios          # откроет Xcode; дальше Archive → App Store
```

Требуется macOS + [Xcode](https://developer.apple.com/xcode/) + аккаунт Apple
Developer ($99/год) для публикации в App Store.

### Замечания
- Статический экспорт (`out/`) идеально подходит для Capacitor — вся логика уже
  клиентская, серверный рендер не нужен.
- Для публикации понадобятся иконки и сплэш-скрины под требования магазинов —
  их можно сгенерировать утилитой
  [`@capacitor/assets`](https://github.com/ionic-team/capacitor-assets):
  ```bash
  npm install --save-dev @capacitor/assets
  npx capacitor-assets generate --iconBackgroundColor '#10b981' \
    --splashBackgroundColor '#eef2f6'
  ```

## Чат-бот (AI-помощник)

В правом нижнем углу всех страниц есть кнопка чата — ИИ-помощник по
недвижимости Туркменистана. Сейчас он ходит в [OpenRouter](https://openrouter.ai/)
прямо из браузера.

**⚠️ Безопасность.** Статический экспорт означает, что ключ
`NEXT_PUBLIC_OPENROUTER_API_KEY` попадает в клиентский JS-бандл — его увидит
любой, кто откроет DevTools. Для прода нужно вынести вызов на свой бэкенд и
хранить ключ только на сервере.

Настройка (локально и при сборке):

```bash
cp .env.example .env.local
# в .env.local указать:
# NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-...
# NEXT_PUBLIC_OPENROUTER_MODEL=google/gemma-4-31b-it:free
npm run build
```

Если основная модель временно `429 rate-limited`, клиент автоматически
пробует запасные бесплатные (`google/gemma-3-27b-it:free`,
`meta-llama/llama-3.3-70b-instruct:free`, `google/gemma-3-12b-it:free`).

## Структура проекта

```
app/                     # Next.js App Router
├── layout.tsx           # i18n + theme + manifest / meta
├── page.tsx             # Главная
├── search/              # Каталог
├── offer/[id]/          # Карточка объявления
├── new/                 # Подача объявления
└── about/               # О проекте
components/              # Header, Footer, Filters, ListingCard, Gallery,
                         # I18nProvider (lang + theme + auth), LangSwitcher,
                         # ThemeSwitcher, AuthButton, HeroSlideshow, …
lib/                     # Бизнес-логика
├── types.ts             # Типы (Listing, DealType, PropertyType, …)
├── cities.ts            # Города и районы Туркменистана
├── data.ts              # Seed-объявления
├── search.ts            # Поиск и фильтрация
├── format.ts            # Форматирование цен / единиц
├── i18n.ts              # Словари RU/TK/EN
├── dateI18n.ts          # Относительные даты (i18n)
└── images.ts            # Пулы Unsplash-фото по типу недвижимости
public/
├── manifest.webmanifest # PWA-манифест
└── icons/               # Иконки приложения
capacitor.config.ts      # Конфиг Capacitor (iOS/Android)
```

## Дальнейшие шаги (вне скоупа прототипа)

- Реальная БД (Postgres/Prisma) + аутентификация продавцов, загрузка фото, модерация
- Карты с реальным покрытием Туркменистана (2ГИС / Yandex)
- Избранное, сохранённые поиски, email/SMS-уведомления
- Сервис-воркер с офлайн-кэшем для PWA
- Публикация в Google Play / App Store через Capacitor
