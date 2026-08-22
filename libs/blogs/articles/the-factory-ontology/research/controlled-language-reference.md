# Controlled Language, AI Slop, and Domain Ontology

## Source Status

This note records the supplied secondary source and its author-published
companion material. Verify claims about ASD-STE100 against the official
standard and any claims about human comprehension against the underlying study
before publication.

## Supplied Reference

- Video: [Ege Chelebi, “The cure for AI slop is a 1986 aircraft
  manual”](https://www.youtube.com/watch?v=uJblcC4lKYw), published July 2026.
- Companion page: [experiment summary, kit, caveats, and source
  list](https://www.chele.bi/videos/the-cure-for-ai-slop).
- Standard lead: [ASD-STE100 Simplified Technical English](https://asd-ste100.org).

## What the Reference Claims

The reference contrasts a banned-word list with an actual writing system. It
describes ASD-STE100 as controlled English developed for aerospace technical
documentation, with constrained vocabulary, usage rules, and machine-checkable
guidance intended to reduce avoidable ambiguity.

The author distilled part of that system into an agent skill and heuristic
linter, then tested six engineering-writing tasks across four prompting
conditions and two models. The companion page reports that the STE-derived
condition reduced measured rule violations substantially relative to baseline.

## Strengths to Acknowledge

- “Do not sound like AI” is not an operational instruction; a writing system
  provides affirmative rules and a correctness surface.
- Constrained vocabulary and consistent usage can reduce optional linguistic
  branching in procedural technical writing.
- Machine-checkable rules allow generated output to be evaluated rather than
  accepted because it feels cleaner.
- The author publishes the scoring summary, examples, linter, and explicit
  caveats rather than presenting the result as universal.

## Limits to Preserve

- The test is an author-run experiment with six tasks, not a broad or peer-
  reviewed evaluation.
- Effects differ between the two tested models.
- The linter measures a mechanical subset of writing-rule violations, not
  factual correctness, domain completeness, safety, usefulness, or meaning.
- ASD-STE100 is designed for a bounded technical-documentation purpose. Its
  strict form is not a universal style for strategy, narrative, creative work,
  or every product interface.
- Controlled language can express a wrong domain model very clearly.

## Editorial Amendment

The ontology article should accept the reference's strongest result and extend
its solution:

> A controlled writing system clarifies how a model should express an answer.
> A domain-specific ontology clarifies which entities and relationships the
> answer may refer to, what evidence warrants its claims, which constraints
> govern action, and how correctness will be evaluated.

The article should therefore avoid claiming that ontology replaces controlled
language. The factory needs both at different layers:

1. **Ontology:** domain commitments, evidence, invariants, and actions.
2. **Context assembly:** the relevant subset of those commitments for the task.
3. **Controlled expression:** language rules appropriate to the audience and
   operational purpose.
4. **Evaluation:** checks for form, semantic consistency, factual support, and
   observed outcome.

## Primary Follow-Ups

- Obtain and review the current ASD-STE100 specification for exact history,
  vocabulary, and rule claims.
- Review the underlying aviation-maintenance comprehension study listed on the
  companion page before using its percentages.
- Add primary sources on in-context learning, retrieval, and context selection.
- Find evidence distinguishing gains in linguistic compliance from gains in
  task correctness for generated technical documentation.
