# Netlify Agent Contract

## Operational Flow

Treat this directory as delivery documentation. The portfolio owns its
site-specific `netlify.toml`; this folder records cross-site intent and remote
work that must not move application behavior into the delivery layer.

## Required Verification Parameters Within Nested Context

For documentation changes, run `testing:test`. Configuration changes must also
run `portfolio:publish`, inspect `dist/client`, and verify the fallback rewrite
does not shadow prerendered pages.

## Required Invariants Within Folder Context

Do not add credentials, site identifiers, or remote deployment behavior without
an explicit hosting task. Netlify configuration never owns app source, and the
production artifact must not require Functions or runtime SSR.
