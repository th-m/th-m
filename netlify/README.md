# Netlify

## Purpose

This directory documents Netlify delivery for the personal site. The
site-specific build configuration lives with the deployed app at
[`apps/portfolio/netlify.toml`](../apps/portfolio/netlify.toml).

## Boundaries

This folder owns delivery documentation, not application source or publication
selection. The portfolio owns its build configuration. Remote account state and
deployment require a separate hosting task; local publish remains artifact-only.

## Ontology

Netlify is a delivery boundary for app-owned publish artifacts. It does not own
application source or decide what content is public.

## Key Terms

- **Site:** the integrated portfolio and writing artifact hosted by Netlify.
- **Build contract:** the app command and output directory configured for a
  site.
- **Prerendered route:** route-specific HTML served directly from the CDN and
  hydrated into the React application.
- **SPA shell:** `_shell.html`, used only when a requested route has no static
  file.
- **Deployment:** a remote operation, distinct from local `publish`.

The build runs `portfolio:publish`, publishes `apps/portfolio/dist/client`, and
uses a non-forced catch-all rewrite so prerendered files win before the SPA
shell.

## Recorded Deployment

The recorded deployment uses a static production artifact at [th-m.dev](https://th-m.dev), with
`www.th-m.dev` redirecting to the apex domain. The generated
[th-m.netlify.app](https://th-m.netlify.app) URL remains available as the
Netlify project subdomain. The `/`, `/writing`, content manifest, and SPA
fallback responses were recorded as verified on the CDN during the original setup.
These are historical observations; current account and CDN state require a
separate read-only check. The deploy has no Functions or
Edge Functions.

DNS remains managed by Porkbun on its authoritative nameservers. The apex uses
an `ALIAS` record to `apex-loadbalancer.netlify.com`, and `www` uses a `CNAME`
record to `th-m.netlify.app`. Netlify provisions and renews the Let's Encrypt
certificate for both production domains.

## Continuous Deployment

The Netlify project is connected to `th-m/th-m` with a scoped, read-only deploy
key and a GitHub webhook. Netlify installs and builds from the repository root,
uses `apps/portfolio` as the package directory, runs
`bun run nx run portfolio:publish`, and publishes
`apps/portfolio/dist/client`. `main` is the production branch, and deploy
previews are enabled for pull requests against it.
