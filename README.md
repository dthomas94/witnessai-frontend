# WitnessAI Frontend

Check it out: https://benevolent-sherbet-77ea3d.netlify.app

A React application for viewing and analyzing AI conversation transcripts, with a focus on identifying risky prompts and responses. Built for WitnessAI assessment.

## Features

- **Conversations list** — Paginated, sortable table of conversations with client-side navigation
- **Conversation detail** — Chat-style view of prompts and LLM responses with timestamps
- **Alerts** — Dashboard of risky prompts and responses based on risk scores
- **Server-side rendering** — Fast initial loads and SEO-friendly pages

## Tech Stack

| Layer         | Choice                                |
| ------------- | ------------------------------------- |
| Framework     | React Router v7                       |
| Build         | Vite 7                                |
| Styling       | Tailwind CSS v4 + Radix UI Themes     |
| Data fetching | React Router loaders + Axios          |
| Tables        | TanStack Table                        |
| Types         | TypeScript + OpenAPI-generated schema |

## Getting Started

### Prerequisites

- Node.js 20+
- Backend API running at `http://localhost:3000`

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

App runs at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run start
```

### Docker

```bash
docker build -t witnessai-frontend .
docker run -p 3000:3000 witnessai-frontend
```

## Project Structure

```
app/
├── root.tsx           # Layout, nav, error boundary
├── app.css            # Tailwind entry
├── routes/
│   ├── _index.tsx           # Home
│   ├── conversations._index/  # Conversations list (client loader)
│   ├── conversations.$id/    # Conversation detail (server loader)
│   └── alerts._index/        # Alerts dashboard (server loader)
└── ui/
    ├── Nav.tsx              # Navigation (Radix TabNav + React Router)
    └── primitives/
        ├── Alert/
        ├── ChatBubble/
        └── Table/
api/
├── index.ts           # API client (Axios + OpenAPI types)
└── schema.d.ts        # Auto-generated from OpenAPI spec
```

## Technical Decisions

### React Router v7

- **File-based routing** — Routes map to `app/routes/` structure (`conversations.$id` = dynamic segment)
- **Loaders** — Data fetched before render; server loaders run on the server, client loaders in the browser
- **Conversations list** uses `clientLoader` for pagination (URL-driven `?page=&limit=`), so the table can update without full reloads
- **Conversation detail & Alerts** use server loaders for initial data

### Radix UI Themes

- Chosen for accessible primitives and consistent design tokens
- `TabNav` for navigation with `asChild` + React Router `Link` for active states
- `Card`, `Button`, `Badge`, `Box`, `Table` for layout and components
- `ChatBubble` uses Radix `Card` with custom Tailwind overrides for blue/gray variants

### TanStack Table

- Manual pagination with server-side data; pagination state in URL for shareable links
- Sorting and filtering wired but driven by URL params
- Pagination controls navigate via `useNavigate` to update query params

### OpenAPI TypeScript

- `api/schema.d.ts` generated from the backend OpenAPI spec
- API functions use typed responses from `paths["/api/..."]["get"]["responses"]["200"]`
- Keeps API client and types in sync with the backend

### Styling

- **Tailwind v4** via `@tailwindcss/vite` — no PostCSS, single `@import "tailwindcss"` in app.css
- **Imported after Radix** — so Tailwind utilities override Radix when needed
- **Dark mode** — ChatBubble and Alert support `dark:` variants

### API Client

- Single Axios instance
- Thin wrapper functions (`getConversations`, `getConversation`, `getPromptsAndResponses`) for each endpoint
- No env-based URL yet — hardcoded for local development

## Areas for Improvement

### Configuration & Environment

- **API base URL** — Move to `VITE_API_URL` or similar env var for staging/production
- **Error boundary** — Make error UI more informative and user-friendly

### Data Layer

- **Loader error handling** — Add try/catch in loaders and surface errors via React Router error boundaries
- **React Query** — Consider using TanStack Query for caching, refetching, and optimistic updates on client-loaded routes
- **Optimistic updates** — For any future mutations (e.g. updating conversations)

### Type Safety

- **Route params** — Replace `params as { id: string }` with proper typed params from React Router
- **API schema** — Regenerate `schema.d.ts` when backend changes; add a script or CI check

### Code Quality

- **`extractResponseText`** — Move from route file into `api/` or a shared util
- **Alerts data shape** — Clarify `riskyResponses` vs prompts; fix mapping if it’s showing wrong data
- **Table `debugTable`** — Set to `false` (or remove) for production

### Testing

- **Unit tests** — For `extractResponseText`, date formatting, API helpers
- **Component tests** — ChatBubble, Alert, Table with Testing Library
- **E2E** — Playwright or Cypress for main flows (conversations list → detail, alerts)

### UX & Accessibility

- **Loading states** — Add skeletons or clearer loading UX beyond `HydrateFallback`
- **Empty states** — Handle no conversations, no alerts, no prompts
- **Keyboard navigation** — Ensure table and nav are fully keyboard-accessible
- **Responsive layout** — Add breakpoints for mobile/tablet

### Performance

- **Code splitting** — Check route-level splitting for heavier routes (e.g. conversations detail)
- **Image optimization** — If avatars or images are added later

### Feature Gaps

- **Authentication** — No auth; assume backend handles it if needed
- **Search/filter** — Conversations table has filter UI but no backend integration
- **Real-time updates** — No WebSocket or polling for new messages

## API Contract

The frontend expects a backend with:

- `GET /api/conversations` — Paginated list (`page`, `limit` query params)
- `GET /api/conversations/:id` — Single conversation
- `GET /api/prompts` — With `filter.conversation_id` and `include=llm_responses`

Prompts and responses include `created`, `text`/`output`, and `risk_score` fields.

## License

Private.
