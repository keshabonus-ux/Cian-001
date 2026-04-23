# Деплой Jay.tm на свой сервер

Это статический сайт: `next build` с `output: 'export'` кладёт весь собранный HTML/JS/CSS в папку `out/`. Её можно раздавать любым обычным веб-сервером (Nginx, Apache, Caddy) или CDN (S3 + CloudFront, Cloudflare Pages, Netlify, Vercel). Бэкенд **не нужен**.

Ниже — три стандартных сценария.

---

## 1. Быстрый вариант: VPS + Nginx

### 1.1 Требования на сервере
- Ubuntu 22.04+ / Debian 12+ / любой Linux с Nginx
- Node.js **20 LTS** (нужен только для сборки; собирать можно и на локальной машине и заливать готовую `out/`)
- доменное имя, направленное на IP сервера (A-запись)

### 1.2 Собрать сайт

На локальной машине **или** на сервере:
```bash
git clone https://github.com/keshabonus-ux/Cian-001.git
cd Cian-001
npm ci
npm run build
# на выходе: ./out/ — это и есть готовый сайт
```

### 1.3 Если собирали локально — залить на сервер
```bash
# с локальной машины
rsync -avz --delete ./out/ user@your-server:/var/www/jay.tm/
```

На сервере обеспечьте права:
```bash
sudo mkdir -p /var/www/jay.tm
sudo chown -R www-data:www-data /var/www/jay.tm
```

### 1.4 Конфиг Nginx

`/etc/nginx/sites-available/jay.tm`:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name jay.tm www.jay.tm;

    root /var/www/jay.tm;
    index index.html;

    # Next.js static export: для всех маршрутов вида /search, /realtors, /legal и т.д.
    # отдаём соответствующий index.html без redirect.
    location / {
        try_files $uri $uri/ $uri.html $uri/index.html =404;
    }

    # Хешированные ассеты — кэшируем агрессивно
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # HTML — не кэшируем, чтобы обновления прилетали сразу
    location ~* \.html$ {
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml application/manifest+json;
}
```

Активируем и перезагружаем:
```bash
sudo ln -s /etc/nginx/sites-available/jay.tm /etc/nginx/sites-enabled/jay.tm
sudo nginx -t && sudo systemctl reload nginx
```

### 1.5 HTTPS через Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d jay.tm -d www.jay.tm
```
Сертификаты продлеваются автоматически (`certbot.timer`).

### 1.6 Обновление сайта
```bash
# локально
git pull && npm ci && npm run build
rsync -avz --delete ./out/ user@your-server:/var/www/jay.tm/
```
Или через простой `deploy.sh` + CI (GitHub Actions).

---

## 2. Простой вариант: Docker + Nginx (в один контейнер)

Создайте в корне репозитория два файла.

### 2.1 `Dockerfile`
```dockerfile
# --- stage 1: build ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- stage 2: serve ---
FROM nginx:1.27-alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2.2 `deploy/nginx.conf`
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html $uri/index.html =404;
    }

    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml application/manifest+json;
}
```

### 2.3 Сборка и запуск
```bash
docker build -t jay-tm .
docker run -d --name jay-tm --restart unless-stopped -p 80:80 jay-tm
```

HTTPS перед контейнером делается через **Caddy** / **Traefik** / внешний Nginx-reverse-proxy с Let's Encrypt.

---

## 3. Статические хостинги (без своего сервера)

Любой CDN/хостинг, принимающий статическую папку, подойдёт:

| Сервис              | Команда / настройка                                              |
|---------------------|------------------------------------------------------------------|
| Netlify             | Build cmd: `npm run build`, Publish dir: `out`                   |
| Vercel              | Импорт репо; Framework: **Next.js**, export подхватится сам      |
| Cloudflare Pages    | Build cmd: `npm run build`, Output dir: `out`                    |
| GitHub Pages        | Залить `out/` в ветку `gh-pages` (нужно добавить `basePath` если не на корневом домене) |
| AWS S3 + CloudFront | `aws s3 sync ./out s3://your-bucket --delete` + инвалидация CDN  |

---

## 4. Переменные окружения

В репозитории используется одна опциональная переменная для встроенного AI-ассистента (`ChatBot`):

- `NEXT_PUBLIC_OPENROUTER_API_KEY` — ключ [OpenRouter](https://openrouter.ai).

Положите её в `.env.local` **до сборки** (`next build` запечёт её в бандл, так как префикс `NEXT_PUBLIC_` делает значение клиентским):

```bash
echo "NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-..." > .env.local
npm run build
```

⚠️ Этот ключ будет виден в браузере пользователей (это ограничение текущего прототипа без собственного бэкенда). Для продакшена имеет смысл:
- либо убрать чат-бот,
- либо добавить минимальный прокси-эндпоинт, который будет делать запросы к OpenRouter со стороны сервера и не отдавать ключ в браузер.

Если переменная не задана — чат-бот просто скажет, что ключ не настроен, остальной сайт работает нормально.

---

## 5. Что точно стоит проверить после деплоя

1. Открыть главную `/` — должны быть видны hero-слайдшоу, популярные города, свежие объявления.
2. Зайти по прямой ссылке на вложенный маршрут, например `/realtors/merdan-ataev` или `/offer/ash-001` — страница должна открыться **без** 404. Если падает в 404 — значит Nginx отдаёт `index.html` только для `/`; проверьте `try_files` из раздела 1.4.
3. Проверить переключение языков (ru / tk / en) — сохраняется в `localStorage`.
4. Проверить тёмную тему — переключатель в шапке.
5. На `/new` должна загружаться карта (Leaflet, тайлы с `tile.openstreetmap.org`) — значит исходящие HTTPS-запросы на `tile.openstreetmap.org` и `unpkg.com` не блокируются фаерволом/провайдером.
6. На `/offer/...` с бейджем «3D-тур» кнопка «Запустить 3D-прогулку» должна показывать iframe — проверьте, что `kuula.co` тоже доступен.

---

## 6. Известные ограничения прототипа

- Бэкенда и БД нет: все данные — сид в `lib/data.ts`, `lib/realtors.ts`. Подача объявлений, регистрация, заявки юристу / на ипотеку никуда не отправляются.
- Авторизация — только на `localStorage` (UX-заглушка).
- 3D-туры — демо-URL (Kuula), в реальном продукте каждое объявление должно получать свой URL при загрузке.
- Проверка ареста/залога — детерминированная демо-логика. Для прод-версии нужна интеграция с Госрегистром и банками.

Когда будет бэкенд — надо будет:
1. Снять `output: 'export'` из `next.config.mjs`.
2. Поменять деплой с «статическая папка» на «Node-процесс» (`next start` за Nginx или Docker).
3. Перенести ключи и приватную логику на серверные Route Handlers (`app/api/...`).
