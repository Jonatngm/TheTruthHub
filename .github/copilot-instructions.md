# TheTruthHub - AI Coding Guidelines

## Project Overview
TheTruthHub is a Christocentric blog platform built with React/TypeScript/Vite, using Supabase for backend services. It features user authentication, content management (posts with categories/tags/series), and a public blog interface.

## Architecture
- **Frontend**: React 18 SPA with TypeScript, Vite build tool
- **UI**: shadcn/ui component library + Tailwind CSS
- **State Management**: Zustand for client state (auth), React Query for server state
- **Backend**: Supabase (auth, database, storage, realtime)
- **Routing**: React Router v6 with protected routes for admin features
- **Deployment**: Vercel (primary) or GitHub Pages (alternative), both support SPA routing

## Key Patterns & Conventions

### Authentication & Authorization
- **Whitelist-only registration**: Only emails in `AUTHORIZED_EMAILS` (in `authService.ts`) can register
- Current whitelist: `['victor@truthhub.blog']` - update this before first deployment
- **Dual auth flow**: Password-based login or OTP verification for registration
- Auth hook: `useAuth()` from `@/hooks/useAuth` provides `{ user, loading, logout }`
- Protected routes: Wrap admin components with `<ProtectedRoute>` in `App.tsx`
- Session persists via Supabase PKCE flow with auto-refresh

### Data Fetching & Caching
- **Always use React Query** for server data (posts, categories, tags, series)
- Query keys with filters: `['posts', categorySlug, tagSlug, seriesSlug, searchQuery]`
- Services pattern: `postService`, `authService` in `src/lib/` handle all Supabase calls
- **Realtime sync**: `RealtimeSync` component in `App.tsx` listens to `postgres_changes` on posts table
- Example: `postService.getPublishedPosts({ featured: true, categorySlug: 'theology' })`

### Post Data Model
- Posts have many-to-many relationships with categories and tags
- Join table pattern: `post_categories`, `post_tags` in database
- Service methods flatten joins: `categories: post.categories.map(pc => pc.category)`
- Series are one-to-many: `series_id`, `series_order` fields on posts
- View counts increment via Supabase function (see `db/migrations/0001_increment_post_views.sql`)

### Rich Text Editing
- **Tiptap editor** in `RichTextEditor.tsx` - Word-style toolbar with formatting, alignment, images, links
- Images upload to Supabase storage (`post-images` bucket) via `postService.uploadImage()`
- Editor returns HTML content for storage in `posts.content` field
- Cover images stored separately in `posts.cover_image` field

### Component Structure
- **UI primitives**: `src/components/ui/` - shadcn/ui components, DO NOT MODIFY directly
- **Custom components**: `src/components/` - Hero, PostCard, SearchBar, CategoryTags, Comments
- **Layout**: `src/components/layout/` - Header, Footer
- **Pages**: `src/pages/` - route-level components (Home, Admin, PostDetail, WritePost, EditPost)
- **Composition pattern**: Pages use UI primitives + custom components, not raw HTML

### State Management
- **Auth state**: `useAuthStore` (Zustand) - `user`, `loading`, `login()`, `logout()`, `setLoading()`
- **Server state**: React Query hooks - never duplicate server data in Zustand
- **Form state**: Local component state or react-hook-form (not yet implemented)

### File Organization
- **Path alias**: `@/` resolves to `src/` (configured in `vite.config.ts`)
- **Types**: `src/types/index.ts` - all TypeScript interfaces (Post, AuthUser, Category, Tag, Series, Comment)
- **Hooks**: `src/hooks/` - custom hooks (`useAuth`, `use-toast`)
- **Stores**: `src/stores/` - Zustand stores (`authStore`)
- **Services**: `src/lib/` - API clients (`postService`, `authService`, `supabase`)

## Development Workflow

### Local Development
- `npm run dev` - Start dev server on port 8080 (configured in `vite.config.ts`)
- `npm run build` - Production build to `dist/`
- `npm run build:dev` - Dev build (includes sourcemaps)
- `npm run lint` - ESLint check
- Dev server: `http://localhost:8080` (matches `.vscode/launch.json`)

### Database Migrations
1. Write SQL in `db/migrations/` directory
2. Run in Supabase SQL Editor (dashboard)
3. Update `src/types/index.ts` if schema changes
4. Update service methods in `src/lib/postService.ts` or `authService.ts`

### Deployment
- **Vercel** (primary): Auto-deploys on push to `main`, uses `vercel.json` for SPA rewrites
- **GitHub Pages** (alternative): `.github/workflows/gh-pages.yml` builds and publishes to `gh-pages` branch
- Both configs copy `index.html` to `404.html` for SPA fallback routing
- Set environment variables in Vercel dashboard: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Common Tasks

### Add New Post Feature
1. Add method to `postService.ts` (e.g., `async markPostAsRead(postId) { ... }`)
2. Create React Query hook in page/component: `const { mutate } = useMutation({ mutationFn: postService.markPostAsRead })`
3. Update `src/types/index.ts` if data model changes
4. Add database migration in `db/migrations/` if needed

### Add New Admin Page
1. Create page component in `src/pages/` (e.g., `AnalyticsDashboard.tsx`)
2. Add route in `App.tsx`:
   ```tsx
   <Route path="/admin/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
   ```
3. Add navigation link in `Header.tsx` for logged-in users

### Add UI Component
- **Existing shadcn/ui**: Already installed, just import from `@/components/ui/`
- **New shadcn/ui**: Run `npx shadcn-ui@latest add <component-name>` (auto-installs to `src/components/ui/`)
- **Custom component**: Create in `src/components/`, use shadcn primitives for consistency

### Modify Authentication
- Update `AUTHORIZED_EMAILS` in `src/lib/authService.ts`
- Auth flow in `src/pages/Login.tsx` - supports password login and OTP-based registration
- User mapping: `mapUser()` function converts Supabase User to `AuthUser` type

## Critical Implementation Details

### Realtime Post Sync
- App-level subscription in `App.tsx` `RealtimeSync` component
- Listens to all `INSERT`, `UPDATE`, `DELETE` on `posts` table
- Invalidates React Query cache on changes: `queryClient.invalidateQueries({ queryKey: ['posts'] })`
- Per-post subscriptions in `PostDetail.tsx` for view count updates

### Post Publishing Logic
- Posts have `published` boolean and optional `scheduled_at` timestamp
- `getPublishedPosts()` filters: `.eq('published', true)`
- Scheduled posts require manual background job (not implemented - future feature)

### Image Upload Flow
1. User selects image (cover or inline)
2. `postService.uploadImage(file, path)` uploads to Supabase Storage `post-images` bucket
3. Returns public URL: `supabase.storage.from('post-images').getPublicUrl(path)`
4. URL stored in database (`cover_image` field or inline in `content` HTML)

### Category/Tag Management
- Categories: Managed by admin, predefined list (`postService.createCategory()`)
- Tags: Created on-the-fly when writing posts (typed as comma-separated, stored as array)
- Both use slug generation: `name.toLowerCase().replace(/\s+/g, '-')`

## Examples

### Query Posts with Filters
```typescript
const { data: posts } = useQuery({
  queryKey: ['posts', categorySlug, tagSlug, seriesSlug, searchQuery],
  queryFn: () => postService.getPublishedPosts({ categorySlug, tagSlug, seriesSlug, searchQuery })
});
```

### Check Auth State
```typescript
const { user, loading, logout } = useAuth();
if (loading) return <Spinner />;
if (!user) return <Navigate to="/login" />;
```

### Upload Image in Editor
```typescript
const url = await postService.uploadImage(file, `posts/${Date.now()}_${file.name}`);
editor.chain().focus().setImage({ src: url }).run();
```

## Important Notes
- **Port 8080**: Always use this port (configured in Vite) for consistency with launch configs
- **Login route**: Public `/login` route (previously hidden at `/secret-login`, now restored)
- **Admin whitelist**: Must update `AUTHORIZED_EMAILS` before deploying (security requirement)
- **Supabase config**: PKCE flow required for auth, configured in `src/lib/supabase.ts`
- **Query invalidation**: Realtime subscriptions auto-invalidate queries, no manual refetch needed
- **Series ordering**: Posts in a series use `series_order` for manual sorting (1, 2, 3...)
- **View tracking**: Views increment via database function, not client-side to prevent manipulation</content>
<parameter name="filePath">/workspaces/TheTruthHub/.github/copilot-instructions.md