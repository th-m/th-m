# THOM Brand Agent Contract

## Operational Flow

Keep reusable identity components, geometry, motion, optical profiles, and
generated runtime data in this library. Application-specific routes, copy,
public artifacts, and publication workflows remain with their owning app.

## Required Verification Parameters Within Nested Context

Run `thom-brand:typecheck` and `thom-brand:test` for library changes. Run the
consumer app's `typecheck`, `test`, and `publish` targets when changing runtime
components, geometry, generated data, asset paths, or styling.

## Required Invariants Within Folder Context

The library never imports application source. Public React APIs are exported
from the package root, deterministic implementation APIs use explicit package
subpaths, and component styling remains available through `styles.css`.
