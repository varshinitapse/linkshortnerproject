# Clerk Authentication — Agent Instructions

Purpose
- Define required behavior for authentication using Clerk in this project.

Rules (must follow)
- Use Clerk for all authentication. NO other auth providers or custom auth flows.
- Protect `/dashboard`: only accessible to authenticated users.
- If a logged-in user navigates to `/` (home), redirect them to `/dashboard`.
- Sign in and sign up must always open as a Clerk modal (never full-page redirects).

Implementation notes
- Integrate Clerk at the app root (wrap `app/layout.tsx` with ClerkProvider / Clerk components).
- Enforce protection both server- and client-side:
  - Server: use middleware or server helpers to block unauthenticated requests to `/dashboard` and return a redirect to trigger the Clerk modal client-side.
  - Client: use Clerk's `useAuth` / `SignedIn` / `SignedOut` or `isSignedIn` helpers to guard client navigation and UI.
- To open Clerk modals use Clerk's client methods (e.g. `openSignIn()` / `openSignUp()` or the modal components provided by the SDK).

Recommended files to update
- `app/layout.tsx`: add `ClerkProvider` and global Clerk configuration.
- `app/page.tsx`: detect session client-side and redirect authenticated users to `/dashboard`.
- `app/dashboard/page.tsx`: require auth; show fallback that triggers Clerk modal for unauthenticated requests.
- `middleware.ts` (or Next.js middleware equivalent): protect `/dashboard` at the edge and redirect unauthenticated visitors to `/` so the client can open the Clerk modal.

Environment
- Document required env vars in `.env.example` (e.g. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_FRONTEND_API`).
- Do NOT commit secrets to the repo.

Testing
- Add tests that verify:
  - Unauthenticated requests to `/dashboard` are redirected or blocked.
  - Authenticated users visiting `/` are redirected to `/dashboard`.
  - Sign-in / sign-up flows open the Clerk modal (can be tested by mocking Clerk's modal functions).

Notes for implementers
- Prefer Clerk's official Next.js integration packages and follow Clerk docs for the App Router if using the `app/` directory.
- Keep modal-based flows consistent: use the same modal trigger helpers across the app.
- If in doubt, consult Clerk docs and ensure all auth UX uses Clerk exclusively.

Change log
- 2026-06-12 — Added Clerk auth rules (required by project owner).
