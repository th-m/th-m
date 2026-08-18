# Testing Support

## Purpose

This library owns reusable unit and browser-test setup plus repository-wide
documentation contract checks.

## Ontology

Testing support is reusable mechanism: DOM observer mocks, shared Playwright
project definitions, and structural policy checks. Product-specific assertions
and browser journeys remain beside their app or tool owner.

## Key Terms

- **Test setup:** shared environment behavior loaded before owner tests.
- **Project definition:** reusable Playwright device configuration.
- **Repository policy:** a deterministic structural invariant checked by unit
  tests.
