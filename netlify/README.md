# Netlify

## Purpose

This directory documents Netlify delivery for the personal site. The
site-specific build configuration lives with the deployed app at
[`apps/portfolio/netlify.toml`](../apps/portfolio/netlify.toml).

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

## Live Deployment

The static production artifact is live at
[th-m.netlify.app](https://th-m.netlify.app). The `/`, `/writing`, content
manifest, and SPA fallback responses are verified on the CDN. The deploy has no
Functions or Edge Functions.

The generated Netlify URL is the intentional production URL for now. A custom
domain is deferred. If `th-m.codes` is attached later, its Netlify DNS zone must
be transferred intact from the legacy, cancelled team because it also contains
Google Workspace MX records and the `shop.th-m.codes` Shopify record.

## Continuous Deployment

The Netlify project is connected to `th-m/th-m` with a scoped, read-only deploy
key and a GitHub webhook. Netlify installs and builds from the repository root,
uses `apps/portfolio` as the package directory, runs
`bun run nx run portfolio:publish`, and publishes
`apps/portfolio/dist/client`. `master` is the production branch, and deploy
previews are enabled for pull requests against it.

## Preview Promotion and Rollback

After the checked-in monorepo migration reaches GitHub, pull requests receive
deploy previews and merges to `master` create production deploys. Before
promotion, verify `/`, `/writing`, a non-prerendered fallback URL, and the
content manifest on the immutable deploy URL.

Netlify deploys are atomic. To roll back, open the project's **Deploys** page,
select the last known-good production deploy, and choose **Publish deploy**.
Re-run the same live route checks after the alias changes. A rollback changes
the published artifact; it does not revert the Git repository.

See [TODO.md](TODO.md) for the remaining account-level setup.
