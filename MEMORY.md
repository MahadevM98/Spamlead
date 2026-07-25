# SpamLeadFixer - Project Memory & Architectural Roadmap

This file is a permanent memory log and technical reference for **SpamLeadFixer**. It summarizes all architectural decisions, features built, database schemas, environmental configurations, and deployment history so that any future AI assistant or developer can instantly understand the full project context.

---

## 1. Project Overview
**SpamLeadFixer** is a modern B2B SaaS web application designed to scan incoming CRM lead inquiries, detect semantic anomalies and bot patterns using Google Gemini AI, and purify sales pipelines.

### Technology Stack:
- **Framework**: Next.js 16 (App Router) with TypeScript & React 19 (`useTransition` support).
- **Styling**: Vanilla Tailwind CSS with custom glassmorphic utility tokens (`glass-panel`, `glass-card`), deep space dark mode themes, and micro-animations (`animate-float`, glowing gradient borders).
- **Authentication & Database**: Supabase (`@supabase/supabase-js`, `@supabase/ssr`) with PostgreSQL Row Level Security (RLS).
- **AI Engine**: Google Gemini API (`@google/genai` SDK) targeting the `gemini-2.5-flash` model.
- **Hosting & CI/CD**: Vercel (connected to GitHub for automatic production deployments).

---

## 2. Environment Variables & Resilience Setup
The application relies on three core environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: `https://ajemtlcalaxtcsrayjzd.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon JWT key.
- `GEMINI_API_KEY`: Google GenAI SDK key.

### 🛡️ Critical Auto-Trimming & Resilience Features Implemented:
To prevent Vercel 500 errors caused by accidental whitespace or quotation marks when pasting secrets into dashboards, the codebase implements automatic sanitization:
- **Auto-Cleaning**: In `utils/supabase/client.ts`, `utils/supabase/server.ts`, `utils/supabase/middleware.ts`, and `app/dashboard/actions.ts`, all environment variables are processed through `.trim().replace(/^["']|["']$/g, '')` before initialization.
- **SSR & Edge Immunity**: All Supabase session checks (`updateSession`), auth actions (`login`, `signup`), and Server Component database queries (`app/dashboard/page.tsx`) are wrapped in defensive `try/catch` blocks with fallback UI rendering. If a network timeout or env error occurs, the dashboard displays a clean yellow notice banner instead of throwing a Vercel 500 Server Error.

---

## 3. Database Schema & Security (Supabase)
The PostgreSQL schema is archived in `supabase/schema.sql`.

### Table: `public.ai_interactions`
Stores historical user prompts and Gemini AI classifications:
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `user_id` (uuid, references `auth.users(id)` on delete cascade, default `auth.uid()`)
- `prompt_text` (text, not null)
- `gemini_response` (text, not null)
- `created_at` (timestamptz, not null, default `now()`)

### Row Level Security (RLS) Policies:
- **SELECT**: `create policy "Users can view their own AI interactions" on public.ai_interactions for select to authenticated using ((select auth.uid()) = user_id);`
- **INSERT**: `create policy "Users can insert their own AI interactions" on public.ai_interactions for insert to authenticated with check ((select auth.uid()) = user_id);`
- **Index**: Indexed on `user_id` for fast dashboard queries.

---

## 4. File Structure & Component Architecture

### Core Authentication & Middleware
- `middleware.ts`: Root Next.js middleware that delegates matching routes to `updateSession`.
- `utils/supabase/middleware.ts`: Enforces route protection:
  1. Redirects unauthenticated users trying to access `/dashboard` or sub-paths to `/login`.
  2. Redirects authenticated users trying to access `/login` or `/signup` to `/dashboard`.
- `utils/supabase/client.ts`: Browser client utility using `createBrowserClient`.
- `utils/supabase/server.ts`: Server Component/Action utility using `createServerClient` and Next.js 16 async `cookies()`.
- `app/auth/actions.ts`: Next.js Server Actions (`login`, `signup`, `signout`) with server-side error handling and session revalidation.

### Application Pages & UI Suite
- `app/page.tsx`: Public landing page highlighting Gemini AI spam detection, real-time auth, and one-click purging, with direct navigation to Sign In and Dashboard.
- `app/login/page.tsx`: Standalone Sign In page with glassmorphic styling, live error banners, and link to sign up.
- `app/signup/page.tsx`: Standalone Create Account page with password length validation and live feedback.
- `app/dashboard/page.tsx`: Protected Server Component dashboard featuring:
  - Header with logged-in user email display and Sign Out action.
  - 4 Hero Analytics Cards (Total Scanned, Spam Detected, Clean Leads, Logged Prompts).
  - Try/catch wrapped Supabase query fetching past `ai_interactions` ordered by `created_at` descending.
  - Responsive history grid displaying past user prompts and Gemini AI analysis responses.
- `app/dashboard/actions.ts`: Contains `generateAIResponse(prompt: string)` Server Action. Verifies Supabase auth, calls `gemini-2.5-flash` via `@google/genai`, inserts record into `ai_interactions`, and executes `revalidatePath('/dashboard')` for instant UI updates without page reloads.
- `app/dashboard/ai-inspector.tsx`: Interactive command console with two tabs:
  - **Preset Lead Tests**: 3 pre-configured B2B/spam inquiry cards (Crypto Bot, Genuine Enterprise B2B, SEO Outreach) for instant AI testing.
  - **Custom Prompt Console**: Free-form terminal input for live Gemini evaluation and Supabase syncing.
- `app/dashboard/prompt-form.tsx`: Client-side submission form for custom spam evaluation prompts with loading spinners.
- `app/dashboard/lead-table.tsx`: Interactive lead management workspace featuring real-time search filtering, status tabs (`All`, `Clean`, `Suspicious`, `Spam`), and a simulated **"Run Gemini AI Cleanse"** workflow with animated progress bars and automatic spam lead purging.

---

## 5. Deployment & Git Repository History
- **GitHub Repository**: `https://github.com/MahadevM98/Spamlead` (Default branch: `main`).
- **Vercel CI/CD**: Automatically builds and deploys on every push to `main`.
- **Security Verification**: `.gitignore` explicitly blocks `.env`, `.env.local`, `.env.*.local`, `/node_modules`, and IDE/agent scratch folders (`.gemini`, `.vscode`, `*.log`).

### Key Git Commits:
- `28f0d3b`: Initial commit of SpamLeadFixer with Next.js, Supabase, and Gemini AI.
- `ec2ba33`: Added defensive environment variable checks to middleware and Supabase clients.
- `c07e05d`: Wrapped Edge Middleware in try/catch to guarantee immunity against Vercel 500 errors.
- `db0ee74`: Made dashboard Server Component SSR rendering and auth actions 100% resilient to crashes.
- `b08e2d7`: Implemented automatic stripping of whitespace and quotation marks from environment variables.

---

## 6. How to Resume Work in Future Sessions
When starting a new chat, instruct the AI to:
1. Read this `MEMORY.md` file to re-establish context.
2. Run `npm run dev` to start the local development server on `http://localhost:3000`.
3. Check `git status` or `git log -n 5` to see recent changes before developing new features.
