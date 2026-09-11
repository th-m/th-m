# Contract Review Checklist

Use this checklist when revising an owner contract. Record only material
decisions and unresolved evidence in the handoff.

- Identify the owning Nx project from its manifest. For routing directories,
  identify child owners instead of inventing a project.
- Confirm each named API in exports and each relationship in imports, source,
  or tests. Label historical observations and proposals as such.
- Give the README Purpose, Boundaries, Ontology, and Key Terms exactly once,
  in that order. Connect concepts to real paths or APIs. Keep conceptual
  examples when they explain use or relationships.
- Put command recipes and workflows in AGENTS Operational Flow, executable
  checks in Required Verification, and local constraints in Required
  Invariants. Preserve all obligations when moving text.
- Link shared definitions and child contracts. Put a repeated procedure in a
  focused skill; maintain its catalog and root Skills route together.
- Check that role, task, artifact, project, and domain describe distinct
  concepts where used. Add terminology only when it resolves a real ambiguity.
- Separate structural enforcement from semantic review. Verify source claims
  manually; heading, link, and metadata tests cannot establish their truth.
- Run the owning projects' required checks plus `testing:test`. Report exact
  failures or unrun checks; do not turn an unavailable target into a recipe.
