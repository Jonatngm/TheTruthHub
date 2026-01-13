# TheTruthHub Setup Checklist

## ✅ Completed Setup Tasks

### Vercel Configuration
- [x] Project linked to new Vercel account
- [x] Custom domain configured: thetruthhub.blog
- [ ] Environment variables set in Vercel:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`

### Supabase Configuration
- [ ] New Supabase project created
- [ ] Database schema deployed (run migrations)
- [ ] Auth configured

## 🔧 Required Actions

### 1. Update Admin Email Whitelist
Currently only `victor@truthhub.blog` can register as admin. Update this in `src/lib/authService.ts`:

```typescript
const AUTHORIZED_EMAILS = ['your-admin-email@example.com'];
```

### 2. Run Database Migrations in Supabase
Execute these SQL files in your Supabase SQL Editor (in order):

1. **First**: `db/migrations/0001_increment_post_views.sql`
   - Creates function to increment post views
   
2. **Second**: `db/migrations/0002_create_post_views.sql`
   - Creates post_views table for tracking unique views

### 3. Update Local Environment Variables
If you want to develop locally, update `.env` with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key
```

## 📋 Deployment Verification

After completing the above:

1. **Trigger Vercel deployment**: Push to main branch or redeploy in Vercel dashboard
2. **Test authentication**: Try logging in with whitelisted email
3. **Test post creation**: Create a test blog post in admin panel
4. **Verify domain**: Ensure thetruthhub.blog resolves correctly

## ⚠️ Important Notes

- The app restricts admin registration to whitelisted emails only (security feature)
- All environment variables must be set in Vercel for production deployment
- Database migrations must be run manually in Supabase SQL Editor
