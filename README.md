# Mebelchi

Mebelingizni yasatishdan oldin ko'ring! — furniture design platform with two role-based areas (Customer and Furniture Maker) in a single React app.

## Stack

React 19 + TypeScript + Vite + React Router 7. Styling is a hand-rolled design system in `src/index.css` (no Tailwind — the project started without one).

## Run

```bash
npm install
npm run dev
npm run build   # production build (tsc + vite)
```

## Demo mode (no backend)

There is **no backend**. All data (users, orders, designs, portfolio, services) lives in `localStorage` via the mock store in `src/services/store.ts`, seeded from `src/data/seed.ts`.

- **Auth is a demo** (`src/services/auth.ts`): registered users' credentials are stored locally — this is explicitly NOT production security. Seeded maker accounts (`sardor@mebelchi.uz`, `jasur@mebelchi.uz`, `art@mebelchi.uz`) accept any password. Register as a **customer** from `/register`.
- **AI design is a demo**: `src/pages/customer/AiDesign.tsx` produces a template-based concept, not real AI output — a clean integration point is marked for a future design API.
- To plug in a real backend later, replace the functions in `src/services/store.ts` and `src/services/auth.ts`; the UI layer only calls these functions.

## Roles & routes

| Area | Routes | Role |
|---|---|---|
| Auth | `/login`, `/register`, `/forgot-password` | public |
| Customer | `/app`, `/app/design`, `/app/catalog`, `/app/orders`, `/app/makers`, `/app/profile` | customer only |
| Maker | `/maker`, `/maker/orders`, `/maker/portfolio`, `/maker/services`, `/maker/profile` | maker only |

`src/routes/ProtectedRoute.tsx` enforces auth + role server-of-truth-side (not just hidden nav): unauthenticated users go to `/login`, wrong-role users are redirected to their own dashboard.

## Structure

- `src/components/` — shared UI (Modal, StatusBadge, Empty, Avatar, formatters)
- `src/layouts/AppLayout.tsx` — sidebar + topbar shell, role-based nav, mobile drawer
- `src/pages/` — auth, customer, maker pages
- `src/routes/` — route protection
- `src/services/` — demo auth + data store (API integration points)
- `src/hooks/useAuth.tsx` — auth context
- `src/types/` — domain types, order status flow
- `src/data/seed.ts` — seed data

## Order status workflow

`new → accepted → in_progress → completed`, cancellable from `new`/`accepted`/`in_progress`. Transitions are validated in `transitionOrder` (`src/services/store.ts`), shared by both roles: customer-created orders appear in the maker's queue and maker status changes are visible to the customer.
