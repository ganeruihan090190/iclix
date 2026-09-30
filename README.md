# ICLIX — Streaming Website (Netflix-style)

Monorepo untuk streaming website gelap ala Netflix dengan logo ICLIX merah.

## Tech Stack

| Layer | Stack |
| --- | --- |
| Backend | Node.js + TypeScript strict + NestJS |
| ORM | Prisma (PostgreSQL) |
| Auth | JWT access token + bcrypt |
| Frontend | Next.js 14 App Router + React + TS + Tailwind |
| Player | hls.js (video source static mp4) |
| Container | Docker Compose (postgres, api, web) |

## Struktur

```
iclix/
├── docker-compose.yml        # postgres + api + web
├── .env / .env.example
├── package.json              # workspace root
└── packages/
    ├── backend/              # NestJS + Prisma
    │   ├── prisma/           # schema.prisma + seed.ts
    │   └── src/
    │       ├── main.ts
    │       ├── app.module.ts
    │       ├── config/
    │       ├── common/       # guards, decorators, filters
    │       └── modules/      # auth, profiles, catalog, player,
    │                         # watchlist, history, ratings, admin, recommend
    └── frontend/             # Next.js 14 (placeholder di Fase 1)
```

## Menjalankan

### Opsi A — Docker Compose (full)

```bash
docker compose up --build
```

- Postgres: `http://localhost:5432` (db `iclix`, user `iclix`, pass `iclix_dev`)
- API: `http://localhost:4000/api/v1`
- Web: `http://localhost:3000`

### Opsi B — Development (Postgres via Docker saja)

```bash
# 1. Install dependencies dari root
npm install

# 2. Jalankan Postgres
docker compose up -d postgres

# 3. Migrate + seed
cd packages/backend
npx prisma migrate dev --name init
npx prisma db seed

# 4. Jalankan API (port 4000)
npm run dev --workspace=packages/backend

# 5. (Opsional) Jalankan frontend
npm run dev --workspace=packages/frontend
```

## Kredensial Seed

| Email | Password | Role |
| --- | --- | --- |
| `admin@iclix.com` | `admin123` | ADMIN |
| `user@iclix.com` | `user123` | USER |

Setiap user punya 1 profile. Profile ID bisa dilihat dari `GET /api/v1/auth/me`.

## API Endpoints (`/api/v1`)

```
AUTH
  POST   /auth/register         { email, password, name }
  POST   /auth/login            { email, password }
  GET    /auth/me               → current user + profiles

PROFILES
  GET    /profiles
  POST   /profiles              { name, avatarUrl? }
  PATCH  /profiles/:id          { name?, avatarUrl? }
  DELETE /profiles/:id

CATALOG
  GET    /catalog/films          ?genre=&year=&type=&search=&page=1&limit=20
  GET    /catalog/films/:id
  GET    /catalog/genres
  GET    /catalog/featured       → film untuk hero banner
  GET    /catalog/trending       → top viewed
  GET    /catalog/top-rated      → highest avg rating
  GET    /catalog/new            → newest added

PLAYER
  GET    /player/:filmId/stream           → { url, startAt }
  POST   /player/:filmId/progress         { profileId, seconds, completed? }

WATCHLIST  (header: X-Profile-Id)
  GET    /watchlist
  POST   /watchlist/:filmId
  DELETE /watchlist/:filmId

HISTORY  (header: X-Profile-Id)
  GET    /history
  GET    /history/continue                → films with progress < duration

RATINGS  (header: X-Profile-Id)
  POST   /ratings/:filmId                 { score, review? }
  GET    /ratings/:filmId
  PATCH  /ratings/:filmId                 { score?, review? }

ADMIN  (role: ADMIN only)
  GET    /admin/films
  POST   /admin/films
  PATCH  /admin/films/:id
  DELETE /admin/films/:id
  GET    /admin/stats

RECOMMEND  (header: X-Profile-Id)
  GET    /recommend                       → genre affinity
```

Semua endpoint (kecuali register/login/catalog) memerlukan `Authorization: Bearer <token>`.

### Contoh testing

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:4000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@iclix.com","password":"user123"}' | jq -r .token)

# Ambil profile id
PROFILE_ID=$(curl -s http://localhost:4000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq -r '.profiles[0].id')

# Browse film
curl -s "http://localhost:4000/api/v1/catalog/films?genre=Action&page=1"

# Watchlist
curl -s -X POST http://localhost:4000/api/v1/watchlist/<FILM_ID> \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Profile-Id: $PROFILE_ID"

# Rating
curl -s -X POST http://localhost:4000/api/v1/ratings/<FILM_ID> \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Profile-Id: $PROFILE_ID" \
  -H 'Content-Type: application/json' \
  -d '{"score":5,"review":"Sangat seru!"}'
```

## Fase

- **Fase 1** ✅ — Setup monorepo, backend NestJS lengkap, Prisma schema + seed, semua API modules, docker compose
- **Fase 2** — Frontend core pages (auth, browse, detail, player, search)
- **Fase 3** — My List, History, Admin panel, polish
