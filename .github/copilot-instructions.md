# TheTruthHub - AI Coding Guidelines

## Project Overview
TheTruthHub is a Christocentric blog platform built with React/TypeScript/Vite, using Supabase for backend services. It features user authentication, content management (posts with categories/tags/series), and a public blog interface.

## Architecture
- **Frontend**: React SPA with TypeScript, Vite build tool
- **UI**: shadcn/ui component library + Tailwind CSS
- **State Management**: Zustand for client state (auth), React Query for server state
- **Backend**: Supabase (auth, database, storage)
- **Routing**: React Router with protected routes for admin features

## Key Patterns & Conventions

### Authentication
- Use `useAuth()` hook for auth state (from `@/hooks/useAuth`)
- Admin routes protected with `<ProtectedRoute>` wrapper
- Auth service restricts registration to whitelisted emails (see `AUTHORIZED_EMAILS` in `authService.ts`)
- OTP-based login flow via Supabase

### Data Fetching
- Use React Query for all server data (posts, categories, etc.)
- Query keys include relevant filters: `['posts', categorySlug, tagSlug, seriesSlug, searchQuery]`
- Services in `src/lib/` handle Supabase interactions (`postService`, `authService`)

### Component Structure
- UI components: `src/components/ui/` (shadcn/ui, don't modify)
- Custom components: `src/components/` (Hero, PostCard, etc.)
- Pages: `src/pages/` (Home, Admin, etc.)
- Layout components: `src/components/layout/`

### State Management
- Auth state: `useAuthStore` (Zustand)
- Server state: React Query hooks
- Avoid local component state for shared data

### File Organization
- `@/` alias resolves to `src/`
- Types: `src/types/index.ts`
- Hooks: `src/hooks/`
- Stores: `src/stores/`

## Development Workflow
- `npm run dev`: Start dev server (port 8080)
- `npm run build`: Production build
- `npm run lint`: ESLint check
- Use `http://localhost:8080` for debugging (matches launch.json)

## Common Tasks
- **Add new post feature**: Create service method in `postService.ts`, add React Query hook, update types
- **New admin page**: Add route in `App.tsx` with `<ProtectedRoute>`, create page in `src/pages/`
- **UI component**: Use shadcn/ui from `src/components/ui/`, or create custom in `src/components/`
- **Database changes**: Update Supabase schema, reflect in types and services

## Examples
- Post queries: `postService.getPublishedPosts({ featured: true })`
- Auth check: `const { user, loading } = useAuth();`
- Protected route: Wrap admin components with `<ProtectedRoute>`

## Notes
- All posts have categories, tags, optional series
- Featured posts displayed prominently on home
- Search filters by title/content/excerpt
- Admin can schedule posts for future publication</content>
<parameter name="filePath">/workspaces/TheTruthHub/.github/copilot-instructions.md