# Geometrica — Интернет-магазин премиальной керамической плитки

## 1. Общая информация

**Geometrica** — это полнофункциональный интернет-магазин по продаже керамической плитки, керамогранита и отделочных материалов. Проект представляет собой SPA (Single Page Application) с отдельным бэкендом и фронтендом, связанными через REST API.

**Адрес магазина (офлайн):** г. Иркутск, ул. Старо-Кузьмихинская, 41/3

---

## 2. Технологический стек

### Бэкенд (backend/)
| Технология | Версия | Назначение |
|---|---|---|
| Node.js | 24+ | Среда выполнения |
| NestJS | 11 | Фреймворк для построения серверного API |
| TypeORM | 0.3 | ORM для работы с базой данных |
| SQLite | 5.1 | База данных (файловая, не требует отдельного сервера) |
| passport-jwt | 4.0 | Аутентификация через JWT-токены |
| bcryptjs | 2.4 | Хеширование паролей |
| class-validator / class-transformer | 0.15 / 0.5 | Валидация входящих данных |

### Фронтенд (frontend/)
| Технология | Версия | Назначение |
|---|---|---|
| Next.js | 16.2.3 | React-фреймворк (серверный рендеринг, роутинг) |
| React | 19.2.4 | UI-библиотека |
| Zustand | 5.0.13 | Управление состоянием (корзина, избранное, auth) |
| Tailwind CSS | 4.2.2 | CSS-фреймворк (стилизация) |
| clsx + tailwind-merge | 2.1.1 + 3.5 | Утилиты для объединения CSS-классов |
| Playfair Display + Inter | Google Fonts | Шрифты (Inter — для текста, Playfair Display — для заголовков) |

---

## 3. Архитектура проекта

```
graduation_project/
├── backend/                     # NestJS API-сервер (порт 3001)
│   ├── src/
│   │   ├── main.ts              # Точка входа, CORS, ValidationPipe
│   │   ├── app.module.ts        # Корневой модуль, подключение TypeORM + SQLite
│   │   ├── auth/                # Модуль аутентификации
│   │   ├── users/               # Модуль пользователей
│   │   ├── products/            # Модуль товаров
│   │   ├── orders/              # Модуль заказов
│   │   └── cart/                # Модуль корзины (сессионной)
│   └── geometrica.db            # Файл SQLite-базы данных
│
└── frontend/                    # Next.js-клиент (порт 3000)
    └── src/
        ├── app/                 # Страницы (Next.js App Router)
        ├── stores/              # Zustand-сторы (auth, cart, favorites)
        ├── shared/              # Переиспользуемые компоненты и утилиты
        │   ├── ui/              # UI-компоненты (Button, ProductCard, SectionTitle)
        │   ├── utils/           # Утилиты (cn)
        │   └── lib/             # Работа с API + статические данные
        └── widgets/             # Блоки главной страницы (баннер, категории, футер)
```

### Взаимодействие фронтенда и бэкенда

1. Фронтенд (Next.js) запускается на **порту 3000**, бэкенд (NestJS) — на **порту 3001**.
2. Все запросы к API идут через `fetch()` напрямую к `http://localhost:3001/api/...`.
3. CORS настроен в `main.ts` бэкенда: `app.enableCors({ origin: 'http://localhost:3000' })`.
4. Frontend не использует API-клиенты вроде axios — только нативный `fetch`.
5. Товары загружаются с бэкенда динамически, остальные данные (категории, отзывы, проекты) — статические, хранятся в `shared/lib/data.ts`.

---

## 4. Бэкенд (NestJS) — детальное описание

### 4.1 Точка входа — `main.ts`

```typescript
// Файл: backend/src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:3000' });  // Разрешаем запросы с фронта
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));  // Авто-валидация DTO
  await app.listen(3001);  // Сервер на порту 3001
}
```

- **ValidationPipe** с `whitelist: true` автоматически удаляет поля, не описанные в DTO, и проверяет типы.
- **CORS** разрешён только для `localhost:3000` (фронтенд).

### 4.2 Корневой модуль — `app.module.ts`

Подключает:
- `TypeOrmModule.forRoot()` — настройка SQLite:
  - `type: 'sqlite'`
  - `database: 'geometrica.db'`
  - `entities: [__dirname + '/**/*.entity{.ts,.js}']` — авто-поиск entity-файлов
  - `synchronize: true` — авто-синхронизация схемы БД с entity (удобно для разработки)
- Все 5 модулей: UsersModule, AuthModule, ProductsModule, OrdersModule, CartModule

### 4.3 Модуль auth/

**Назначение:** Регистрация и вход пользователей, выдача JWT-токенов.

**Файлы:**
- `auth.module.ts` — регистрирует JwtModule с секретом `geometrica-secret-key-2025` и сроком жизни токена 7 дней
- `auth.controller.ts` — эндпоинты:
  - `POST /api/auth/register` — регистрация нового пользователя
  - `POST /api/auth/login` — вход по email + password
- `auth.service.ts` — бизнес-логика:
  - `register()`: проверяет, не занят ли email → хеширует пароль bcrypt (10 раундов) → создаёт пользователя → подписывает JWT → возвращает `{ token, user }`
  - `login()`: ищет пользователя по email → сравнивает пароль bcrypt → подписывает JWT → возвращает `{ token, user }`
- `jwt.strategy.ts` — стратегия passport-jwt:
  - Извлекает токен из заголовка `Authorization: Bearer <token>`
  - Валидирует подпись секретом
  - В `validate()` проверяет, что пользователь существует в БД
  - Возвращает `{ id, email, role }` в `req.user`
- `jwt-auth.guard.ts` — гард для защиты эндпоинтов (расширяет `AuthGuard('jwt')`)

### 4.4 Модуль users/

**Назначение:** CRUD пользователей.

**Файлы:**
- `user.entity.ts` — сущность TypeORM (таблица `users`):
  - `id: INTEGER PRIMARY KEY AUTOINCREMENT`
  - `email: VARCHAR UNIQUE NOT NULL`
  - `name: VARCHAR NOT NULL`
  - `password: VARCHAR NOT NULL` (bcrypt-хеш)
  - `phone: VARCHAR nullable`
  - `role: VARCHAR DEFAULT 'user'`
  - `orders: OneToMany` — связь с заказами
- `dto/create-user.dto.ts` — DTO с валидацией:
  - `CreateUserDto`: email (@IsEmail), name (MinLength 2), password (MinLength 6)
  - `LoginUserDto`: email, password
- `users.controller.ts`:
  - `GET /api/users/profile` (защищён JwtAuthGuard) — возвращает профиль текущего пользователя (без пароля)
  - `PUT /api/users/profile` (защищён JwtAuthGuard) — обновляет профиль; если передан `currentPassword` — проверяет его bcrypt.compare перед сменой пароля
- `users.service.ts`:
  - `create()` — создаёт пользователя с bcrypt-хешем пароля
  - `findByEmail()` — поиск по email для входа
  - `findById()` — поиск по ID для JWT-стратегии
  - `update()` — обновляет данные; если есть `password` — хеширует его
  - `onModuleInit()` — при старте создаёт:
    - Администратора `admin@gmail.com / 123123`
    - Обычного пользователя `user@gmail.com / 123123`

### 4.5 Модуль products/

**Назначение:** Каталог товаров с фильтрацией.

**Файлы:**
- `product.entity.ts` — таблица `products`:
  - `id`, `name`, `collection`, `category`, `size`, `price`, `oldPrice`, `image`, `description`, `brand`
- `dto/create-product.dto.ts` — валидация: name (string), price (number, min 0), остальные опциональны
- `products.controller.ts`:
  - `GET /api/products` (публичный) — список с фильтрацией (category, brand, sale, minPrice, maxPrice, sort)
  - `GET /api/products/:id` (публичный) — один товар
  - `POST /api/products` (защищён) — создание товара
  - `PUT /api/products/:id` (защищён) — обновление товара
  - `DELETE /api/products/:id` (защищён) — удаление товара
- `products.service.ts`:
  - `findAll(query)` — построение динамического запроса через QueryBuilder:
    - Если параметр не указан — фильтр не применяется
    - Фильтры: category, brand, sale (oldPrice IS NOT NULL), minPrice, maxPrice
    - Сортировка: price-asc, price-desc, name; по умолчанию — по id
  - `onModuleInit()` — если БД пуста, заполняет 10 тестовыми товарами (сидирование)

### 4.6 Модуль cart/

**Назначение:** Сессионная корзина (без авторизации, по sessionId).

**Файлы:**
- `cart-item.entity.ts` — таблица `cart_items`:
  - `id`, `productId`, `quantity` (DEFAULT 1), `sessionId`
- `cart.controller.ts`:
  - `GET /api/cart?sessionId=...` — получить корзину с обогащёнными данными товаров
  - `POST /api/cart` — добавить товар (upsert: если есть — увеличить quantity)
  - `PUT /api/cart/:id` — изменить quantity (если 0 — удалить)
  - `DELETE /api/cart/:id` — удалить один item
  - `DELETE /api/cart?sessionId=...` — очистить всю корзину
- `cart.service.ts`:
  - `findBySession()` — находит все items по sessionId, обогащает каждый данными из products
  - `add()` — если товар уже есть в корзине — увеличивает quantity, иначе создаёт новый item
  - `update()` — при quantity ≤ 0 удаляет запись

**Важно:** Фронтенд использует свою клиентскую корзину (Zustand + localStorage), а не бэкендовую. Бэкендовый cart API не задействован в текущей версии фронтенда.

### 4.7 Модуль orders/

**Назначение:** Оформление и просмотр заказов.

**Файлы:**
- `order.entity.ts` — таблица `orders`:
  - `id`, `userId` (nullable, FK → users.id), `customerName`, `customerPhone`, `customerEmail`
  - `total` (FLOAT, DEFAULT 0), `status` (DEFAULT 'pending')
  - `createdAt` (DEFAULT datetime('now'))
  - `items: OneToMany` → OrderItem
- `order-item.entity.ts` — таблица `order_items`:
  - `id`, `orderId` (FK → orders.id), `productId` (FK → products.id), `quantity`, `price` (цена на момент покупки)
  - `product: ManyToOne → Product` — связь для получения названия и изображения товара
- `orders.controller.ts`:
  - `GET /api/orders` (защищён JwtAuthGuard) — заказы текущего пользователя
  - `POST /api/orders` (публичный) — создание заказа (для гостьевой оплаты)
- `orders.service.ts`:
  - `create(data)` — для каждого товара получает цену из ProductsService, суммирует total, создаёт Order + OrderItem'ы
  - `findAll(userId?)` — все заказы пользователя с вложенными items (сортировка по createdAt DESC)

**Важно:** При оформлении заказа на фронтенде отправляется `POST /api/orders` с контактными данными и списком товаров. Если пользователь авторизован, также передаётся `userId` и `Authorization: Bearer <token>`. После успешного создания заказа корзина очищается.

---

## 5. Фронтенд (Next.js) — детальное описание

### 5.1 Структура страниц (App Router)

| URL | Файл | Тип | Описание |
|---|---|---|---|
| `/` | `app/page.tsx` | Server | Главная: Banner, CategoryGrid, PopularProducts, Advantages, Brands, Promo |
| `/catalog` | `app/catalog/page.tsx` | Server | Серверная обёртка, внутри Suspense → CatalogContent |
| `/catalog?category=...` | `app/catalog/catalog-content.tsx` | Client | Сетка товаров с фильтрами и сортировкой |
| `/catalog/[slug]` | `app/catalog/[slug]/page.tsx` | Server | Детальная карточка товара (динамический роут) |
| `/auth/login` | `app/auth/login/page.tsx` | Client | Форма входа |
| `/auth/register` | `app/auth/register/page.tsx` | Client | Форма регистрации |
| `/cart` | `app/cart/page.tsx` | Client | Корзина + форма контактных данных + оплата |
| `/favorites` | `app/favorites/page.tsx` | Client | Список избранных товаров |
| `/profile` | `app/profile/page.tsx` | Client | Личный кабинет (заказы + настройки профиля) |
| `/admin` | `app/admin/page.tsx` | Client | Админ-панель (CRUD товаров) |
| `/contacts` | `app/contacts/page.tsx` | Client | Контакты + форма обратной связи |
| `/projects` | `app/projects/page.tsx` | Server | Портфолио реализованных проектов |
| `/reviews` | `app/reviews/page.tsx` | Server | Отзывы клиентов |

**Server vs Client компоненты:**
- Server — данные отображаются статически (рендерятся на сервере)
- Client (`"use client"`) — имеют интерактивность (фильтры, формы, Zustand-сторы)

### 5.2 Root Layout — `app/layout.tsx`

Оборачивает все страницы в `<Header>` + `<main>{children}</main>` + `<Footer>`.
Подключает Google Fonts (Inter + Playfair Display).
Заголовок: "Geometrica — Премиальный магазин керамической плитки".

### 5.3 Управление состоянием (Zustand)

В проекте 3 стора, все с persist (сохраняются в localStorage):

**1. `stores/auth.ts` — `useAuthStore`**
- Состояние: `token: string | null`, `user: { id, name, email, role, phone } | null`
- Действия: `setAuth(token, user)` — после логина/регистрации; `updateUser(data)` — после обновления профиля; `logout()`
- Ключ localStorage: `geometrica-auth`

**2. `stores/cart.ts` — `useCartStore`**
- Состояние: `items: CartItem[]` (id, productId, name, price, image, size, collection, quantity)
- Действия: `addItem(product, quantity?)` — добавляет или увеличивает quantity; `removeItem(productId)`; `updateQuantity(productId, delta)`; `clearCart()`
- Вычисляемые: `total()` — сумма всех товаров; `count()` — общее количество
- Ключ localStorage: `geometrica-cart`

**3. `stores/favorites.ts` — `useFavoritesStore`**
- Состояние: `ids: number[]`
- Действия: `toggle(id)` — добавить/убрать из избранного; `has(id)` — проверить
- Ключ localStorage: `geometrica-favorites`

### 5.4 Общие UI-компоненты (`shared/ui/`)

**Button (`button.tsx`):**
- Варианты: `primary` (красный фон), `outline` (красная обводка), `ghost` (только текст)
- Размеры: `sm` (px-4 py-2), `md` (px-6 py-3), `lg` (px-8 py-4)
- Все варианты имеют `border-2` для одинаковой высоты

**ProductCard (`product-card.tsx`):**
- Показывает: изображение, коллекцию, название, размер, цену, старую цену (если есть)
- Кнопка избранного (сердечко)
- Кнопка «В корзину» / «В корзине»
- При наведении — тень и масштабирование изображения

**SectionTitle (`section-title.tsx`):**
- Заголовок h2 + подзаголовок
- Шрифт Playfair Display (font-heading)
- Параметр `light` для тёмного фона

**Typography (`typography.tsx`):**
- Варианты: h1-h5 с соответствующими стилями
- Все используют font-heading

### 5.5 Виджеты главной страницы (`widgets/`)

Каждый виджет — папка с `index.ts` (переэкспорт) и `ui/Component.tsx`.

- **Banner** — полноэкранный баннер с изображением Casabella, двумя кнопками (Каталог, Проекты)
- **CategoryGrid** — сетка категорий с реальным количеством товаров (загружается с бэкенда)
- **PopularProducts** — первые 4 товара из API
- **Advantages** — 4 преимущества (качество, подбор, доставка, 3D-дизайн)
- **Brands** — логотипы брендов (Cezares, Italon, Keramin, Grasaro)
- **PromoBlocks** — два промо-блока (дизайн-проект, коллекция премиум)
- **Header** — шапка: логотип, каталог-дропдаун, навигация, иконки (профиль, избранное, корзина)
- **Footer** — подвал: описание, каталог (ссылки), контакты (адрес, телефон)

### 5.6 API-функции (`shared/lib/data.ts`)

- `fetchProducts(query?)` — `GET /api/products` с опциональными query-параметрами
- `fetchProduct(id)` — `GET /api/products/:id`
- `fetchCategoryCounts()` — получает все товары и считает количество по категориям

### 5.7 Статические данные (`shared/lib/data.ts`)

- `categories` — 7 категорий с id, названием и изображением
- `brands` — 4 бренда с логотипами
- `advantages` — 4 преимущества
- `projects` — 4 реализованных проекта
- `reviews` — 4 отзыва клиентов

### 5.8 Детали страниц

**Каталог (`/catalog`):**
- Фильтры (сайдбар): категория (кнопки), бренд (чипсы), цена (от-до), скидка (toggle)
- Сортировка: по умолчанию, по цене (возр/убыв), по названию — кастомный дропдаун
- Сетка товаров 3 колонки
- Фильтрация без перезагрузки страницы (useState + useEffect)

**Карточка товара (`/catalog/[slug]`):**
- Хлебные крошки
- Изображение, бренд, название, коллекция
- Цена со скидкой (если есть), процент скидки
- Описание
- Кнопки: «В корзину», «В избранное», «Удалить товар» (для админа)
- Характеристики: производитель, коллекция, размер, категория
- Блок «С этим покупают» (related products той же категории)

**Корзина (`/cart`):**
- Список товаров (изображение, название, размер, цена, количество, удалить)
- Контактные данные (ФИО, телефон, email) — предзаполнены из профиля
- Комментарий к заказу
- Способ оплаты (в офисе / онлайн → Visa/Mastercard или МИР)
- Итого + кнопка «Оформить заказ»
- При оформлении отправляет `POST /api/orders` на бэкенд с контактными данными и товарами; для авторизованных пользователей передаётся userId и JWT-токен
- После успешного создания заказа корзина очищается, показывается экран успеха

**Профиль (`/profile`):**
- Вкладка «Мои заказы»: загружает список заказов с `GET /api/orders` (защищённый эндпоинт, требует JWT). Каждый заказ отображает номер, дату, статус, список товаров (название, изображение, количество, цена), сумму и контактные данные
- Вкладка «Настройки»: форма редактирования имени, телефона, смена пароля
- Выход из аккаунта

**Админ-панель (`/admin`):**
- Доступ только для `role === 'admin'`
- Таблица всех товаров (с возможностью редактирования названия и цены inline)
- Добавление нового товара (форма)
- Удаление товара
- Прямые fetch-запросы к бэкенду с `Authorization: Bearer <token>`

---

## 6. База данных (SQLite)

Файл `backend/geometrica.db` — создаётся автоматически при первом запуске.

### Схема (создаётся TypeORM через synchronize: true):

**Таблица `users`:**
| Поле | Тип | Ограничения |
|---|---|---|
| id | INTEGER | PK AUTOINCREMENT |
| email | VARCHAR | UNIQUE NOT NULL |
| name | VARCHAR | NOT NULL |
| password | VARCHAR | NOT NULL (bcrypt hash) |
| phone | VARCHAR | nullable |
| role | VARCHAR | DEFAULT 'user' |

**Таблица `products`:**
| Поле | Тип |
|---|---|
| id | INTEGER PK |
| name | VARCHAR |
| collection | VARCHAR nullable |
| category | VARCHAR nullable |
| size | VARCHAR nullable |
| price | FLOAT |
| oldPrice | FLOAT nullable |
| image | VARCHAR nullable |
| description | VARCHAR nullable |
| brand | VARCHAR nullable |

**Таблица `cart_items`:**
| Поле | Тип |
|---|---|
| id | INTEGER PK |
| productId | INTEGER |
| quantity | INTEGER DEFAULT 1 |
| sessionId | VARCHAR |

**Таблица `orders`:**
| Поле | Тип |
|---|---|
| id | INTEGER PK |
| userId | INTEGER nullable (FK → users.id) |
| customerName | VARCHAR nullable |
| customerPhone | VARCHAR nullable |
| customerEmail | VARCHAR nullable |
| total | FLOAT DEFAULT 0 |
| status | VARCHAR DEFAULT 'pending' |
| createdAt | VARCHAR DEFAULT datetime('now') |

**Таблица `order_items`:**
| Поле | Тип |
|---|---|
| id | INTEGER PK |
| orderId | INTEGER (FK → orders.id) |
| productId | INTEGER |
| quantity | INTEGER |
| price | FLOAT |

### Начальные данные (сидирование)

При первом запуске автоматически создаются:
- **Администратор:** admin@gmail.com / 123123 (role: 'admin')
- **Тестовый пользователь:** user@gmail.com / 123123 (role: 'user')
- **10 товаров:** 5 разных брендов (Porcelanosa, Italon, Cezares, Keramin, Grasaro), 3 категорий (keramogranit — 5 шт, ceramic-tile — 2 шт, large-formats — 3 шт)

---

## 7. Аутентификация и авторизация

**Поток:**
1. Пользователь вводит email + пароль на `/auth/login` или `/auth/register`
2. Фронтенд отправляет `POST /api/auth/login` (или `/register`)
3. Бэкенд проверяет данные, подписывает JWT (секрет: `geometrica-secret-key-2025`, срок: 7 дней)
4. Ответ: `{ token, user: { id, name, email, role } }`
5. Фронтенд сохраняет в `useAuthStore` → persist в localStorage
6. При запросах к защищённым эндпоинтам токен передаётся в `Authorization: Bearer <token>`
7. JwtStrategy проверяет токен, JwtAuthGuard защищает эндпоинты
8. На фронте проверка `user.role === 'admin'` для админ-панели

---

## 8. Запуск проекта

### Бэкенд:
```bash
cd backend
npm install
npm run start    # или npm run dev (с авто-перезагрузкой)
```
Запускается на `http://localhost:3001`.

### Фронтенд:
```bash
cd frontend
npm install
npm run dev      # режим разработки (Turbopack)
# или
npm run build && npm run start  # продакшн-сборка
```
Запускается на `http://localhost:3000`.

### Очередность запуска:
1. Сначала бэкенд (создаст БД и заполнит тестовыми данными)
2. Затем фронтенд

---

## 9. Принятые архитектурные решения и их обоснование

| Решение | Причина |
|---|---|
| **SQLite вместо PostgreSQL/MySQL** | Простота — не требует установки и настройки отдельного сервера БД; вся БД в одном файле. Идеально для дипломного проекта. |
| **NestJS вместо Express** | Структурированность — модули, контроллеры, сервисы, DI. Код организован и масштабируем. |
| **Next.js вместо CRA/Vite** | SSR для главной страницы (лучше SEO), встроенный роутинг, оптимизация изображений. |
| **Zustand вместо Redux** | Минимальный бойлерплейт, встроенный persist (localStorage), простота использования. |
| **Tailwind CSS вместо CSS-in-JS** | Быстрая разработка, утилитарные классы, отличная интеграция с Next.js. |
| **Корзина на фронтенде (localStorage), а не на бэкенде** | Простота реализации. Бэкендовый cart API существует как задел на будущее (для cross-device синхронизации). |
| **JWT вместо сессий** | Stateless — не нужно хранить сессии на сервере, токен живёт на клиенте. |
| **OrderItem → Product (ManyToOne)** | Позволяет при загрузке заказов сразу получать название и изображение товара без дополнительных запросов. |
| **synchronize: true в TypeORM** | Автоматическая синхронизация схемы БД с entity-классами — удобно для разработки (не нужно писать миграции). |
| **Хардкод JWT-секрета и URL API** | Упрощение для дипломного проекта. В production использовались бы переменные окружения (.env). |
| **Server-Client разделение страниц** | Страницы без интерактива (проекты, отзывы) — серверные (быстрее). Страницы с формами/фильтрами — клиентские. |
| **Playfair Display для заголовков** | Придаёт премиальный, элегантный вид, соответствующий позиционированию магазина. |

---

## 10. Возможные улучшения

- Добавить env-переменные для JWT-секрета и URL API
- Реализовать пагинацию в каталоге
- Добавить поиск по названию товара
- Загружать изображения товаров через файловый upload (сейчас URL)
- Добавить unit-тесты (Jest для NestJS, Vitest для React)
- Подключить платёжную систему
- Миграции вместо synchronize: true
- Страница 404 (Not Found)
