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
- [x] Attach `th-m.dev` as the primary production domain, redirect
  `www.th-m.dev` to the apex, point the Porkbun-managed DNS records at Netlify,
  and provision the Let's Encrypt certificate.

The production site uses `https://th-m.dev`. Keep the Porkbun authoritative
nameservers in place unless DNS ownership is deliberately migrated; the Netlify
project uses external DNS rather than a Netlify DNS zone.

Keep credentials and generated Netlify project identifiers out of the
repository.
