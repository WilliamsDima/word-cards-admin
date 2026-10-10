# Word Cards Admin

Админ-панель приложения **Word Cards**: пользователи, их карточки и статистика, достижения, языки и переводы интерфейса, конфиг мобильного приложения.

**Открыть админку: https://wordcards-admin.duckdns.org**

Вход — через Google, пускает только аккаунты с правами админа (Firebase custom claim `admin=true`).

## Как устроено

- React + TypeScript + Vite, Redux Toolkit / RTK Query, Feature-Sliced Design.
- Данные — из бэкенда [dictionary-backend](https://github.com/WilliamsDima/dictionary-backend), API: https://wordcards-api.duckdns.org
- Хостинг — тот же VPS, что и бэкенд: Caddy раздаёт собранные файлы по HTTPS. Подробности про сервер — в `dictionary-backend/deploy/SERVER.md`.

## Деплой

Автоматический: любой push в `master` → GitHub Actions (`.github/workflows/deploy.yml`) собирает админку и выкладывает её на сервер (~1–2 минуты). Ход и логи — во вкладке **Actions** репозитория.

Настройки сборки берутся из GitHub Secrets (`VITE_API_BASE_URL`, `VITE_FIREBASE_*`, `DEPLOY_*`), а не из `.env`.

## Локальная разработка

Менеджер пакетов — **npm** (`package-lock.json`).

```bash
npm ci            # установить зависимости
npm run dev       # dev-сервер на http://localhost:5173
npm run build     # проверка типов + сборка в dist/
npm run lint      # ESLint
```

Нужен файл `.env` (не в git) с `VITE_API_BASE_URL` и `VITE_FIREBASE_*`. Сейчас в нём адрес прод-API, для локального бэкенда — раскомментировать локальный адрес.
