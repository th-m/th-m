# TODO: Complete Netlify Hosting

The repository-side contract and initial static production deployment are
complete.

- [x] Create and locally link the `th-m` project in the active `th-m.codes`
  Netlify team.
- [x] Publish and verify the static production artifact at
  `https://th-m.netlify.app` with no Functions or Edge Functions.
- [x] Document preview promotion and atomic rollback behavior.
- [x] Connect `th-m/th-m` with a scoped read-only deploy key and GitHub webhook,
  keep the base directory at the repository root, set package directory
  `apps/portfolio`, use `main` as the production branch, and enable deploy
  previews.
- [x] Push the checked-in monorepo and Netlify configuration, then verify one
  deploy preview before relying on continuous deployment.

Custom-domain setup is intentionally deferred. Continue using
`https://th-m.netlify.app`. If `th-m.codes` is requested later, transfer its DNS
zone intact from the cancelled legacy team before attaching the apex and `www`
domains so the existing Google Workspace and Shopify records are preserved.

Keep credentials and generated Netlify project identifiers out of the
repository.
