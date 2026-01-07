
This Project was done by Robert

Note: the login page is intentionally hidden behind a secret route. To access the login UI use `/secret-login` (for example: `https://your-site.example/secret-login`).
The public `/login` route is disabled; authentication is still enforced server-side via the authorized emails list.

Vercel deployment
-----------------
If you prefer Vercel instead of GitHub Pages (Vercel will return 200 for SPA routes like `/secret-login`), connect this repository to Vercel:

1. Go to https://vercel.com/new and import the `Jonatngm/TheTruthHub` repo.
2. Framework Preset: Vite — Build Command: `npm run build` — Output Directory: `dist`.
3. Ensure the project has `vercel.json` (this repo includes it) so Vercel will rewrite all routes to `index.html`.
4. Add your custom domain `thetruthhub.blog` in the Vercel project settings, then remove the domain from Vercel later if you switch to GitHub Pages.

Note: Adding the domain to Vercel will require updating DNS at your registrar to point A to `76.76.21.21` (Vercel). If you want GitHub Pages instead, point DNS to the GitHub Pages A records (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) and remove the domain from Vercel to avoid conflicts.

Enabling GitHub Pages (if you choose Pages)
-----------------------------------------

1. Build the site locally or let CI build it: `npm run build` (output goes to `dist`).
2. The repo already includes a `gh-pages` GitHub Action that publishes `dist/` to the `gh-pages` branch. If that ran successfully you'll have a `gh-pages` branch and `public/CNAME` set.
3. In your GitHub repo: go to Settings → Pages, set Source to the `gh-pages` branch and the root folder, then save. GitHub will provision HTTPS (may take a few minutes).
4. Ensure your registrar DNS points the apex to the GitHub Pages A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and `www` CNAME to your apex. Remove the domain from any Vercel project to avoid conflicts.

Notes about the secret login
----------------------------

- The admin/login UI is intentionally behind `/secret-login`. The public `/login` route is disabled and redirects to `/`.
- Server-side access is still enforced by the authorized admin emails list in `src/lib/authService.ts` (only those emails can register or request OTP codes).
- For GitHub Pages to correctly serve SPA routes (direct visits to `/secret-login`), ensure a SPA fallback is present. The CI workflow copies `index.html` to `404.html` on publish; locally you can replicate this after `npm run build` with:

```bash
cp dist/index.html dist/404.html
```

If you'd like, I can attempt to enable Pages via the GitHub API (I previously hit a permissions error). To do that I need a token with `repo` + `pages:write` scopes or you can enable Pages in the UI.
