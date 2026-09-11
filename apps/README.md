# Applications

## Purpose

`apps/` contains the independently publishable personal sites and their owned
content, source, tests, and build configuration.

## Boundaries

Apps own routes, bootstrap, environment selection, and product composition.
Reusable capabilities and the THOM brand system belong in libraries; editorial
sources belong to `blogs`. Apps consume those public interfaces.

## Ontology

An app is a deployable product boundary. `portfolio` owns the public profile
experience and brand presentation; `tokenizer` is the thin runnable surface for the
reusable tokenizer visualization. The directory itself is a routing boundary,
not an Nx project.

## Key Terms

- **App:** an independently publishable personal product.
- **Publish artifact:** deterministic files produced in the app's `dist/`.
- **Authoring source:** material used to create a publish artifact but excluded
  from it unless explicitly designated public.
