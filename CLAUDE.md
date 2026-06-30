# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About the project

`word-cards-admin` is the admin panel for the Word Cards flashcard app — it talks to the same backend as the mobile client (sibling repos `dictionary-back` and `language-dictionary`). It manages arbitrary users, their flashcards, supported languages/translations, global app config, and other admin-only data, calling the backend's `/admin/...` and management endpoints.

Full project rules live in `RULES.md` (Russian) — read it before non-trivial changes. This file summarizes what an agent needs most; it does not repeat it in full.

## Commands

```bash
npm run dev       # start Vite dev server
npm run build     # tsc -b (typecheck/project build) then vite build
npm run lint      # eslint .
npm run preview   # preview the production build locally
npm run icons     # node scripts/generate-icons.mjs - regenerate icon assets
```

No test runner is configured in this repo (no test script/framework in `package.json`) — there is nothing to run as "a single test" today. Per `RULES.md`: run `npm run lint` after any change; also run `npm run build` if the change touches types, imports, page wiring, or API contracts.

## Architecture

Feature-Sliced Design, same layering convention as the other frontend in this monorepo group (`language-dictionary`): `app → pages → widgets → features → entities → shared`, imported via Vite/TS path aliases `@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared`, `@assets` (defined in both `vite.config.ts` and `tsconfig`). Don't reach into a higher layer from a lower one.

- `app` — bootstrap (`main.tsx`, `App.tsx`), `app/navigation` (react-router v7 setup, route table), `app/store` (Redux store), `app/api/BaseRTK.ts` (the single RTK Query instance every feature injects into).
- `pages` — route-level screens (`MainPage`, `UsersPage`, `UserProfilePage`, `AplicationPage` (app config), `TranslationPage`, `SocialsPage`, `ChatsPage`, `LoginPage`, `AdminLayout` shell, `NotFoundPage`).
- `widgets` — composed blocks spanning multiple entities/features (`Sidebar`, `UsersListFilter`).
- `features` — self-contained user scenarios (currently `Users/*`).
- `entities` — domain types + API for core entities (`entities/api/users`).
- `shared` — design-system components (`Button`, `Input`, `Modal`, `Dropdown`, `Card`, `Badge`, etc., each with sibling `*.module.scss`), `hooks`, `lib`, `config` (Firebase setup), and the entire `shared/api` layer described below.

### Routing & auth gating

`app/navigation/routes.ts` defines `AppRoutes` (a path map) and `RouteParams`. `AppRouter.tsx` decides admin-vs-not at the top level: it reads a locally stored Firebase ID token (`shared/lib/authToken`), calls `useMeQuery` (skipped if no token) against the backend's `/auth/me`-style endpoint, and renders the full admin route tree under `AdminLayout` only if that call succeeds — otherwise everything redirects to `LoginPage`. There is no separate route-guard component in active use; this top-level check is the gate.

### Auth flow

Firebase Google Sign-In (popup) on the client, same identity provider as the mobile app and same backend:
1. `shared/config/firebaseAuth.ts` calls `signInWithGoogle()` (popup) and separately runs `initFirebaseAuthTokenSync()`, which subscribes to `onIdTokenChanged` for the whole app lifetime.
2. On every token change it stores the ID token via `shared/lib/authToken` and syncs it to the backend through `authService.googleSync` (hits the same `/users/sync`-style endpoint the mobile app uses).
3. `shared/api/request.ts` attaches `Authorization: Bearer <token>` (from `authToken`) to every request automatically; `BaseRTK.ts`'s `fetchBaseQuery` does the same for any endpoint that doesn't go through a `Service`.
4. Backend authorization (admin-only vs per-user) is enforced server-side (see `dictionary-back`); this app does not re-implement permission checks beyond gating which routes render.

### Data fetching: Service + Query pairing

Every domain API in `shared/api/services/<name>/` follows the same two-file split — this is the thing most worth understanding before adding a new endpoint:

- `<Name>Service.ts` — a plain class using `shared/api/request.ts` (axios instance from `shared/api/http.ts`) to call the backend and return a `ServiceResult<T>` (`shared/api/result.ts`: a `{ok:true,data}` / `{ok:false,error}` union, never throws on HTTP failure).
- `<Name>Query.ts` — wraps that service in `baseRTK.injectEndpoints`, converting each `ServiceResult` to an RTK Query result via `toRtkQueryResult` (`shared/api/RTK/rtk.ts`), and exports the generated `useXQuery`/`useXMutation` hooks. Tags for caching/invalidation are declared here, scoped per-user where relevant (e.g. `{ type: "userCards", id: userId }`).
- `types.ts` holds the shared payload/response types for both files.

Everything funnels into the one `baseRTK` API (`app/api/BaseRTK.ts`) — don't create a second `createApi` instance; inject new endpoints into `baseRTK` instead. New admin endpoints generally target `/admin/users/{userId}/...` paths matching the backend's admin routes.

## Conventions (full detail in `RULES.md`)

- Decision priority on conflicts: 1) nearest existing pattern next to the code you're touching, 2) reusable layers (`shared`/`entities`/`features`/`widgets`), 3) `RULES.md`, 4) a new abstraction — only once skipping one would cause real duplication.
- TypeScript: no `any`, default to `const` over `let`.
- React: reuse an existing component before writing a new one; no inline functions or inline style objects in JSX; `.map()` directly in JSX is fine for list rendering as long as it has no new business logic; don't assign JSX to a variable without real cause; split a component into sibling files once it grows large.
- JSX event handlers: never wrap a zero-argument function in an arrow just to call it — write `onClick={fn}` not `onClick={() => fn()}`. Use an arrow wrapper only when you need to pass or transform arguments (e.g. `onClick={(e) => fn(e.currentTarget.value)}`) or when the native event must not reach the handler.
- Memoization: stabilize state/prop-derived values and handlers with `useMemo`/`useCallback` per existing style; plain JSX/list elements don't need extra memoization.
- Styling: reuse colors from `src/assets/styles/colors.scss` (add new ones centrally, not locally); static styles live in a sibling `*.module.scss`, not inline.
- UI text defaults to Russian; if a file already uses Russian strings in a given encoding, don't change that without reason.
- Hook order inside a component when applicable: `useNavigation`, `useRoutes`, `useActions`, `useAppDispatch`, `useAppSelector`, `useState`, query/API hooks, other custom hooks, `useMemo`, `useCallback`, `useEffect`.
- Component responsibility: keep an action's logic inside the component that owns it (e.g. a delete modal owns its own delete logic); only lift logic up when it's genuinely reused or is real cross-cutting orchestration.
- Prefer small, local, incremental diffs over refactors; don't introduce a new entity/layer/abstraction the task doesn't actually need a second use for.
- Conditional rendering: never use `{condition && <X />}` (`&&` renders `0` or other falsy values as text) or `{condition ? <X /> : null}`. Always use `{condition ? <X /> : <></>}` when the false branch renders nothing.
- No inline object/array literals in JSX props: `classes={{ btn: styles.btn }}` or `style={[styles.a, { transform: [...] }]}` allocates a new reference on every render. Extract static values to a `const` outside the component; dynamic values go in `useMemo`.
- Extract every self-contained UI block to its own component file: modals, bottom sheets, sidebars, or any block with its own purpose should not be inlined in the parent's JSX — create a dedicated component and import it.
