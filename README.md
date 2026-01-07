
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