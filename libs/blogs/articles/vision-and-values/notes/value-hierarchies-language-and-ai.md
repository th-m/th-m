# Value Hierarchies, Language, and AI

## Central Distinction

> **AI can infer, construct, and operationally enforce a hierarchy of values.
> It cannot make that hierarchy normatively legitimate merely by predicting or
> implementing it.**

There are several different senses of “determine”:

| Capability | AI can do it? |
| --- | --- |
| Infer what someone appears to value | Yes, provisionally |
| Detect inconsistencies between stated and revealed preferences | Yes |
| Construct a hierarchy from supplied principles | Yes |
| Rank actions using that hierarchy | Yes |
| Enforce the hierarchy through tools and permissions | Yes, if authorized |
| Experience why the values matter to the stakeholder | Not established |
| Decide which stakeholders deserve authority | Not from prediction alone |
| Make the hierarchy ethically or politically legitimate | Not by itself |

An AI could therefore *institute* values operationally. A system could reject
every transaction that violates a privacy rule. But enforcement would make
privacy an effective constraint, not prove that the rule is just, correctly
interpreted, or legitimately authorized.

## Language That Implies Value Operations

Several kinds of language carry implicit value judgments.

### Evaluative Language

```text
better
worse
safe
fair
harmful
responsible
efficient
meaningful
acceptable
```

“Make the product better” implies evaluation, but does not specify what
`better` means.

### Goal-Oriented Language

```text
optimize
improve
maximize
minimize
protect
reduce
promote
prevent
```

“Optimize engagement” silently elevates engagement into an objective. The word
`optimize` implies an operation, but the metric and acceptable costs remain
unstated.

### Deontic Language

Deontic language concerns obligation and permission:

```text
must
should
may
must not
required
permitted
prohibited
```

“Customer data must not leave the region” translates a value into a hard
constraint.

### Priority Language

```text
before
above
more important than
prefer
unless
even if
at the expense of
```

“Protect privacy even if conversion falls” establishes a hierarchy:

```text
privacy > conversion
```

### Threshold Language

```text
at least
no more than
only if
until
within
never
always
```

“Do not release unless every critical vulnerability is resolved” turns
security into an operational gate.

### Affective and Experiential Language

```text
painful
frustrating
reassuring
alienating
trustworthy
empowering
humiliating
```

These words point toward subjective consequences. They suggest that experience
should affect the decision, but do not fully specify whose experience, how it
will be measured, or how it trades off against other values.

### Rights and Authority Language

```text
consent
deserve
owe
entitled
responsible
accountable
authorized
```

“Users must consent before collection” connects a value to a person with
recognized authority.

## Values Hidden in Apparently Neutral Words

Words such as these already contain an evaluation:

```text
problem
solution
risk
opportunity
success
failure
technical debt
waste
improvement
```

Calling something a `problem` presupposes that its current state is
undesirable. Calling something `technical debt` implies a future cost. Calling
something an `opportunity` implies a valued outcome that might be gained.

Even a technical instruction can smuggle in a hierarchy:

> “Reduce false positives.”

That instruction implicitly treats false positives as costly, but says nothing
about the false negatives that might increase as a result.

## From Values to Operations

Value language becomes progressively more operational:

```text
Value:
“Privacy matters.”

Preference:
“Prefer privacy to personalization.”

Priority:
“Privacy outranks engagement.”

Constraint:
“Never share personal data without consent.”

Metric:
“Zero unconsented disclosures.”

Procedure:
“If consent is uncertain, stop and escalate to the privacy officer.”
```

An AI can execute the later statements much more reliably because they convert
an abstract value into priorities, observable conditions, and actions.

The danger is treating the model's inference as authorization:

> “The user said ‘safe,’ so I inferred that preventing every possible risk
> outranks autonomy.”

That may be a plausible interpretation, but it is still an inferred
hierarchy—not one the stakeholder necessarily endorsed.

## Conclusion

> **Value-laden language can imply goals, constraints, priorities, and actions.
> AI can translate those implications into an operational hierarchy, but the
> translation remains provisional until an authorized person or institution
> accepts it.**
