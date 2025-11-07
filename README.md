# TrueContract – Assured Agreements Platform

TrueContract is a Vite + React application that showcases a modern contract lifecycle experience. The product vision focuses on
streamlining the creation, review, and risk management of commercial agreements backed by financial guarantees and blockchain
notarisation.

## Key capabilities

- **Portfolio intelligence dashboard** – contextual filters, revenue trends, risk heatmaps, upcoming renewals, and actionable
  tasks provide a holistic view of contract health.
- **Guided contract wizard** – a five-step workflow that validates critical fields, captures guarantor preferences, and
  produces a submission checklist before publishing a new agreement.
- **Collaborative review workspace** – AI insights, immutable signature metadata, next-best actions, and activity history help
  teams finalise deals with confidence.
- **Financial guarantees marketplace** – explore curated guarantors with filtering, search, and rich service descriptions to
  improve payment assurance.

## Project structure

```
├── src
│   ├── components
│   │   ├── Dashboard.tsx           # Main dashboard UI with analytics, filters, tasks, and charts
│   │   ├── ContractWizard.tsx      # Guided creation flow with validation and submission checklist
│   │   ├── ContractReview.tsx      # Detailed contract viewer with AI insights and blockchain audit trail
│   │   ├── GuaranteesMarketplace.tsx
│   │   └── ...                     # Navigation, landing, and shared UI primitives
│   ├── lib
│   │   ├── data
│   │   │   └── contracts.ts        # Centralised mock data, metrics helpers, and type definitions
│   │   └── utils.ts                # Tailwind utility merger
│   ├── pages                       # Route-level wrappers
│   └── main.tsx / App.tsx          # Application bootstrap
```

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the development server**

   ```bash
   npm run dev
   ```

   The app is served at `http://localhost:5173` by default.

3. **Lint the project**

   ```bash
   npm run lint
   ```

## Code style and best practices

- The project uses **TypeScript** for strong typing and centralises domain models inside `src/lib/data/` to keep components
  presentation-focused.
- UI state is co-located with the components that render it. Derived data is memoised with `useMemo` to prevent unnecessary
  re-renders.
- Mock content lives alongside helper functions (e.g. `formatCurrency`, `countByStatus`). When integrating an API, replace these
  helpers with data fetching hooks or TanStack Query resources.
- Tailwind CSS powers the design system. Use semantic class names (`text-muted-foreground`, `bg-card`) to stay consistent with
  the theme tokens.
- Prefer small, composable components and dedicated hooks for reusable logic. Each major view (dashboard, wizard, review) now
  exposes well-commented sections to aid future enhancements.

## Testing strategy

Automated tests are not yet configured for this mock application. For production readiness, consider adding the following:

- Component-level tests with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).
- Integration tests for the wizard and review flows using [Playwright](https://playwright.dev/).
- Type-driven validations with [Zod](https://github.com/colinhacks/zod) or react-hook-form before persisting data.

## Deployment

The build output is optimised for static hosting. To generate a production build, run:

```bash
npm run build
```

You can serve the build output from any modern CDN or integrate it with containerised hosting solutions.
