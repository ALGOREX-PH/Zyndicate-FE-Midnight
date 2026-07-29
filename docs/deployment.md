# Deploying the Zyndicate frontend to Vercel

The frontend is a static single-page app. Vercel builds it with `npm run build`
and serves `dist/`. There is no server-side rendering and no serverless
function — every request either returns a static asset or the SPA shell.

## Order of operations

Deploy [the coordination service](https://github.com/ALGOREX-PH/Zyndicate-BE-Midnight)
first. You need its URL here, and it needs this site's origin in its
`CORS_ORIGINS`. Deploying the API first means only one round trip:

1. Deploy the API to Render, note `https://<service>.onrender.com`.
2. Deploy this app with `VITE_API_BASE_URL` set to that URL.
3. Go back to Render and set `CORS_ORIGINS` to this app's Vercel origin.

## Deploy

1. **Import the repository** in Vercel: **Add New → Project**, select this repo.
   [`vercel.json`](../vercel.json) already declares the framework, build
   command, and output directory, so accept the detected settings.

2. **Set the environment variable** under *Settings → Environment Variables*:

   | Variable | Value | Environments |
   | --- | --- | --- |
   | `VITE_API_BASE_URL` | `https://<your-service>.onrender.com` | Production, Preview |

   No trailing slash. This is a build-time value: Vite inlines it into the
   bundle, so **changing it requires a redeploy**, not just a restart.

   Nothing here is secret. Everything prefixed `VITE_` ships to the browser in
   plain text — which is correct for an API URL and would be catastrophic for a
   key. The app's real secrets (the Zyndicate identity key and the per-mandate
   encryption keys) are generated in the browser and never leave it.

3. **Deploy**, then confirm the API origin was actually baked in:

   ```bash
   curl -s https://<your-app>.vercel.app/assets/index-*.js | grep -o 'onrender\.com'
   ```

4. **Allow this origin on the API.** In Render, set:

   ```
   CORS_ORIGINS=https://<your-app>.vercel.app,https://*.vercel.app
   ```

   The wildcard entry lets preview deployments reach the API too. Drop it if you
   want production to be the only client.

## Verify the deployment

- `/` renders the landing page.
- **Reload directly on `/exchange`.** This is the check that catches a broken
  SPA fallback — if it 404s, the rewrite in `vercel.json` is not being applied.
- The Exchange lists mandates. An error banner reading *"The Exchange is
  unreachable"* means the API call failed: check `VITE_API_BASE_URL`, then the
  browser console for a CORS rejection.
- `/settings` shows the network badge and the wallet state.

## Things that will bite you

**A blank page on a deep link** means the SPA fallback is not working. The
rewrite sends every path except `/assets/*` to `index.html`; if you change the
output directory or asset path, update that rule to match.

**CORS failures show up as a network error, not a 4xx.** The browser blocks the
response before the app sees it, so the UI reports the API as unreachable. The
real message is in the console. The API origin must be listed exactly, scheme
included, with no trailing slash.

**Preview deployments get a fresh URL each time.** Without the
`https://*.vercel.app` entry in `CORS_ORIGINS`, previews cannot talk to the API
even though production works.

**The API sleeps.** On Render's smaller plans an idle service takes a few
seconds to wake, so the first load after a quiet period sits in its loading
state longer than you would expect. Not a frontend bug.

## What is not wired up yet

Wallet *connection* is real — the app discovers a Midnight wallet through the
DApp connector v4 and reads its addresses and balances. The contract layer is
not: `src/midnight/chain.ts` is a local adapter, so **no transaction is
submitted to a Midnight node and no zk proof is generated**. Deploying this
gives you the confidential coordination layer with client-side encryption and
commitments, not on-chain settlement. Wiring that up needs the compiled Compact
artifacts plus a reachable node, indexer, and proof server.
