# Mesa

QR-based ordering for cafes, fast food, and small restaurants. The customer scans the QR at their table, browses the menu and confirms an order, and the kitchen receives it live on a display board — no waiter, no waiting, no app to install.

> **Live demo:** [qr-table.vercel.app](https://qr-table.vercel.app)

## Overview

Mesa is a Next.js 16 demo of a self-serve restaurant ordering flow. It ships with a fake restaurant ("Café Mesa") so you can walk the entire customer-to-kitchen journey end to end without a backend. Order state is held in-memory and synced across browser tabs via `BroadcastChannel`, so opening the customer view in one tab and the kitchen view in another behaves like a real-time system.

The data layer is intentionally swap-friendly: the in-memory `MockStore` exposes the same observable surface (`subscribe` + `getSnapshot`) that React's `useSyncExternalStore` consumes, so replacing it later with Supabase Realtime, SSE, or WebSockets does not require touching any view or hook.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Components | shadcn/ui (`base-nova` style on `@base-ui/react`) |
| Icons | lucide-react |
| State (demo) | `useSyncExternalStore` over a `MockStore` singleton |
| Cross-tab sync | `BroadcastChannel` |
| Deployment | Vercel (Fluid Compute) |

## Demo Flow

Open two tabs side by side in the same browser:

| Role | URL |
|------|-----|
| Customer at table 3 | `/r/cafe-mesa/t/3` |
| Kitchen display | `/kitchen/cafe-mesa` |

Then:

1. In the customer tab, add items to the cart and confirm the order.
2. The kitchen tab receives the order instantly via `BroadcastChannel`.
3. From kitchen, advance the order: `pending` → `preparing` → `ready` → `delivered`.
4. The customer's tracking screen reflects each step in real time.

The `/demo` page is the entry point and explains the flow.

## Project Structure

```
src/
├── app/                              # App Router routes
│   ├── demo/                         # Demo hub
│   ├── r/[slug]/t/[tableNumber]/     # Customer menu + cart
│   │   └── o/[orderId]/              # Order tracking (live)
│   ├── kitchen/[slug]/               # Kitchen Display System (KDS)
│   ├── globals.css                   # Theme tokens + custom keyframes
│   ├── layout.tsx                    # Root layout + decorative background
│   └── page.tsx                      # Marketing landing page
├── components/ui/                    # shadcn primitives (button, card, ...)
├── lib/
│   ├── hooks/use-orders.ts           # Subscription hooks
│   ├── menu.ts                       # Pure menu queries + price formatter
│   ├── mock-data.ts                  # Café Mesa seed (categories, products)
│   ├── mock-store.ts                 # Observable order store + tab sync
│   └── utils.ts                      # cn() class merger
└── types/                            # Domain types (Order, Product, ...)
```

Server components handle data loading and `notFound()` validation. Client components (`_components/*.tsx`) handle interactivity and subscriptions.

## Getting Started

### Prerequisites

- Node.js 24 (LTS)
- npm 10+

### Run locally

```bash
git clone https://github.com/hnkatze/qr-tablev2.git
cd qr-tablev2
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and follow the landing page or jump straight to `/demo`.

No environment variables are required — the demo runs entirely from in-memory data.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server (Turbopack) |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the codebase with ESLint |

## Architecture Notes

### Observable store with `useSyncExternalStore`

Order state lives in a single `MockStore` instance (`src/lib/mock-store.ts`):

```ts
class MockStore {
  subscribe(listener: () => void): () => void;
  getSnapshot(): readonly Order[];
  getServerSnapshot(): readonly Order[];
  createOrder(input): Order;
  updateOrderStatus(id, status): Order | undefined;
}
```

Hooks in `src/lib/hooks/use-orders.ts` consume it through `useSyncExternalStore`, returning memoized derivations so reference identity stays stable across renders.

To plug in a real backend, replace `MockStore` with an implementation that opens an SSE connection (or WebSocket / Supabase Realtime channel) and notifies on incoming events. Hooks and views remain unchanged.

### Cross-tab synchronization

`MockStore` opens a `BroadcastChannel("mesa-mock-store")` and replays state across tabs of the same browser. This is what makes the demo feel live: a customer order placed in one tab appears in the kitchen tab immediately. State is **not** persisted, so a full refresh resets the demo.

### Theme and motion

Tailwind v4 CSS-first configuration in `src/app/globals.css` exposes brand tokens (`--brand-tangerine`, `--brand-mint`, `--brand-grape`, `--brand-cream`) as utility classes via `@theme inline`. A fixed-position decorative layer in the root layout renders animated gradient blobs that flow continuously across all sections. All animations honor `prefers-reduced-motion: reduce`.

## Roadmap

This repository is an MVP demo. The following are intentionally out of scope and would be the next steps for a real product:

- [ ] Authentication for restaurant owners and kitchen staff
- [ ] Persistent backend (Supabase, Postgres) replacing `MockStore`
- [ ] Real-time transport (SSE or WebSockets) with the same hook surface
- [ ] Restaurant onboarding and menu management dashboard
- [ ] QR generation and printable PDFs per table
- [ ] Order history and basic reporting
- [ ] Optional payments integration

## License

Not yet licensed. Contact the author before reusing the code in production.
