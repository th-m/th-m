# Applications

## Purpose

`apps/` contains the independently publishable personal sites and their owned
content, source, tests, and build configuration.

## Ontology

An app is a deployable product boundary. `blogs` owns editorial content and its
publication artifact; `portfolio` owns the public profile experience and brand
system. The directory itself is a routing boundary, not an Nx project.

## Key Terms

- **App:** an independently publishable personal product.
- **Publish artifact:** deterministic files produced in the app's `dist/`.
- **Authoring source:** material used to create a publish artifact but excluded
  from it unless explicitly designated public.
