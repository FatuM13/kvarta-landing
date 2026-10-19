# Project Memory & Durable Decisions

## Project: Coffee Roastery "Kvarta" (Кварта) Landing Page

### Core Architectural Decisions
- **Framework**: Next.js 15+ (App Router), React 19, TypeScript, Tailwind CSS.
- **Design Philosophy**: Warm craft roastery aesthetic (editorial typography, warm cream/kraft paper background `#FBF9F5`, dark espresso `#1F1A17`, roasted caramel/terracotta accent `#C85A32`), mobile-first, zero generic AI/futuristic fluff.
- **Database Architecture**: 
  - Dual-mode resilient database repository:
    - Primary: PostgreSQL (compatible with Neon serverless via `@neondatabase/serverless` or `pg`) when `DATABASE_URL` is set.
    - Fallback/Dev/Test: Built-in local SQLite (`better-sqlite3` or SQLite file via `sqlite3` or memory/file-backed SQLite) with automatic schema initialization if `DATABASE_URL` is not provided.
    - Ensures tests pass out of the box without requiring external credentials.
- **API Endpoint**: `POST /api/lead`
  - Input validation with strict Belarusian phone normalization (`+375XXXXXXXXX`, exactly 9 digits after country code).
  - 10-minute duplicate check per normalized phone number with race-condition safety.
  - Marketing attribution: capturing and sanitizing `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `yclid`, `fbclid`, `landing_page_url`, `referrer_url`.
  - Telegram bot notification with safe failure isolation (failures logged, never fail the lead creation).

- **Multi-Coffee Selection & Quantity Controls**: 
  - Added interactive mini-blocks for all 5 coffee products with tactile `+` and `−` quantity steppers directly on the order form between the interest selection and "Ваше имя".
  - Real-time order summary calculation: total pack count, total BYN cost, and dynamic free delivery badge indicator (when total >= 50 BYN or subscription > 0).
  - Synchronized bidirectional interaction with product catalogue cards (clicking "Заказать" on any product increments its counter in the form).

### Execution & Verification Status
- **Automated Tests**: 27/27 tests passing across 5 test suites (`tests/phone.test.ts`, `tests/lead.test.ts`, `tests/api-lead.test.ts`, `tests/content.test.ts`, `tests/products.test.ts`).
- **Static Analysis & Build**: Clean `npm run lint` (0 errors, 0 warnings) and production `npm run build` with Turbopack.
- **Server Verification**: Tested live on HTTP server:
  - `GET /` returns 200 OK.
  - `GET /privacy` returns 200 OK.
  - `POST /api/lead` successfully records multi-product lead with 201 Created and rejects duplicate submission within 10 minutes with 409 Conflict.
- **Deployment Ready**: Fully configured for Vercel deployment with Neon Postgres support. Detailed Russian documentation in `README.md` and environment variables in `.env.example`.
