# Netlify Agent Contract

## Operational Flow

Treat this directory as delivery documentation. The portfolio owns its
site-specific `netlify.toml`; this folder records cross-site intent and remote
work that must not move application behavior into the delivery layer.

### Preview promotion and rollback

After the checked-in monorepo migration reaches GitHub, pull requests receive
deploy previews and merges to `main` create production deploys. Before
promotion, verify `/`, `/writing`, a non-prerendered fallback URL, and the
content manifest on the immutable deploy URL.

Netlify deploys are atomic. To roll back, open the project's **Deploys** page,
select the last known-good production deploy, and choose **Publish deploy**.
Re-run the same live route checks after the alias changes. A rollback changes
the published artifact; it does not revert the Git repository.

See [TODO.md](TODO.md) for the remaining account-level setup.

## Required Verification Parameters Within Nested Context

For documentation changes, run `testing:test`. Configuration changes must also
run `portfolio:publish`, inspect `dist/client`, and verify the fallback rewrite
does not shadow prerendered pages.

## Required Invariants Within Folder Context

Do not add credentials, site identifiers, or remote deployment behavior without
an explicit hosting task. Netlify configuration never owns app source, and the
production artifact must not require Functions or runtime SSR.
