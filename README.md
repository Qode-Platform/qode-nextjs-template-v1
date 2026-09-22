# Next.js template

Provisioned from [`Qode-Platform/fleet-template-v1`](https://github.com/Qode-Platform/fleet-template-v1) — the fleet
lifecycle contract (`bin/`, `fleet.conf`, deploy workflows) with a
Next.js starter laid on top.

## Origin

    npx create-next-app@latest --ts --tailwind --eslint --app --src-dir --skip-install

Generated 2026-09-21 on Node v22.12.0 / Python 3.12.3. **Dependencies were
never installed and this has never been built or run.** Boot it once before
trusting it.

## Fleet lifecycle

`fleet.conf` drives every script in `bin/`:

| step | command |
|---|---|
| install | `npm install` |
| build | `npm run build` |
| start | `npx next start -H 0.0.0.0 -p $PORT` |

    ./bin/run       # install, build, start in the foreground
    ./bin/start     # start from existing build artifacts
    ./bin/restart   # rebuild and restart
    ./bin/stop      # stop whatever holds the port

Listens on `$PORT` (default `3000`); health check hits `/`.

## BASE_PATH

The fleet injects `BASE_PATH` (`/direct/<agent>:<port>`) and nginx forwards
that prefix **unchanged** — so this app serves every route and asset under
it. An empty or unset value means standalone mode: serve at the host root.

- Next `basePath` + `assetPrefix` in next.config.ts, baked at BUILD time.
- `HEALTH_PATH` in `fleet.conf` stays un-prefixed; the fleet prepends `$BASE_PATH` itself.
- A value like `direct/x:3000/` is normalised to `/direct/x:3000`.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Rule: everything under BASE_PATH

This app is not served at the host root. The fleet ingress serves it under a
proxy prefix and forwards that prefix **unchanged**:

```
BASE_PATH=/direct/<agent>:<port>
```

**Every API call and every asset reference must carry that base path.** A bare
`"/..."` literal resolves against the host root, so it works on localhost and
404s in the fleet.

**What Next.js rewrites for you:** only `next/link` `href`, `next/image` `src`,
and Next's own bundle/asset URLs - `next.config.ts` sets `basePath` and
`assetPrefix` from `NEXT_PUBLIC_BASE_PATH`.

**What is NOT rewritten:** `fetch`/XHR/axios URLs, plain `<a href>` and
`<img src>`, CSS `url(...)`, and any URL built from a string literal in code.

**Use this framework's mechanism:** `NEXT_PUBLIC_BASE_PATH`. `fleet.conf` sets
it at both build and start time, so it is available to server and client code:

```tsx
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const res = await fetch(`${base}/api/items`);
```

**Verify with:**

```bash
npm run check:base-path
```

A line that is genuinely framework-handled can be exempted with a trailing
`// base-path-ok` comment (say why).
