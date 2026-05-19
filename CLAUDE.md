# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # Production build
npm run lint       # Run ESLint
npm run preview    # Preview production build locally
```

No test runner is configured.

## Stack

- **React 19** + **Vite 7** + **React Router 7**
- **TanStack Query 5** for server state
- **Tailwind CSS v4** via Vite plugin (no `tailwind.config.js` — configured in `src/index.css`)
- **motion** for animations, **lucide-react** + **@heroicons/react** for icons
- **react-hot-toast** for notifications

## Environment

| File | Purpose |
|------|---------|
| `.env` | Production API base: `https://hello-dreams-ai.onrender.com` |
| `.env.local` | Local dev API base: `http://localhost:3000` |

API base URL is read in `src/config/apiConfig.js`.

## Architecture

### Auth & HTTP Layer (`src/auth/`)

All API calls go through `auth/apiClient.js` → `apiFetch()`. This custom fetch wrapper:
- Injects Bearer token automatically
- Intercepts 401s to refresh the token via `auth/authApi.js`, then retries the original request
- Classifies errors into kinds: `AUTH_EXPIRED`, `RATE_LIMITED`, `SERVER_ERROR`, `CLIENT_ERROR`, `NETWORK_ERROR`
- Handles 429 with `Retry-After` header

`authProvider.jsx` manages auth state in React context + localStorage. On mount it checks for a cached token and user, fetches the profile with an 8s timeout if needed, and prefetches the latest resume. Tokens are stored via `authStorage.js`.

### API Services (`src/api/`)

Each product feature has a dedicated service file (`resumeBuilderService.js`, `headshotService.js`, etc.) that calls `apiFetch()`. A parallel set of wrappers lives in `src/components/AI-portions/module-services/` for hooks used directly inside components.

### Dashboard Module System (`src/components/AI-portions/`)

`ai-dashboard.component.jsx` is the shell. It maintains an `activeModule` string (persisted in localStorage) and maps it to components via a `MODULE_COMPONENTS` object. Each module is a self-contained section folder (e.g., `cv-builder-section/`, `job-application-section/`).

Modules communicate back to the shell through `DashboardActionsContext` (defined in `src/context/DashboardActionsContext.jsx`).

### State Management

| Layer | Tool | Location |
|-------|------|---------|
| Auth state | React Context + localStorage | `src/auth/authProvider.jsx` |
| Server/query state | TanStack Query 5 | `main.jsx` queryClient; staleTime 30s, retry 1 |
| Resume data | `ResumeContext` | `src/context/ResumeContext.jsx` |
| Credits/paywall | `PaywallContext` | `src/context/paywallContext.jsx` |
| Dashboard triggers | `DashboardActionsContext` | `src/context/DashboardActionsContext.jsx` |

The `useProgressTracker` hook (`src/hooks/useProgressTracker.js`) aggregates 7 TanStack queries to compute a single progress indicator shown in the sidebar.

### Routing (`src/App.jsx`)

| Route | Access |
|-------|--------|
| `/` | Public — landing page |
| `/signin` | Public |
| `/signup` | Public (4-step flow) |
| `/ai-dashboard` | Protected via `auth/protectedRoute.jsx` |

`vercel.json` rewrites all paths to `index.html` for SPA routing.

### Styling

Tailwind v4 is configured entirely inside `src/index.css` (no separate config file). Dark mode uses the `:dark` CSS pseudo-class variant. Custom fonts (Poppins, DM Sans, Darker Grotesque, Inter) are loaded from Google Fonts.
