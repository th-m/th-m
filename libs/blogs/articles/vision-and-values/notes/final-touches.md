# Final Touches

Private working note for *Vision and Values*, preserving the article review and
proposed technical continuation from September 3, 2026. These are suggestions,
not changes applied to the canonical article. Article line references below
reflect the version reviewed and may shift as the article changes.

## Article Review Through the Conclusion

I read the updated article and its figures through the Sources section. No
changes made.

**The middle is substantially clearer now. The ending contains strong ideas,
but it hasn't fully caught up with the new Jon/value-proposition thread.** You
establish a concrete customer problem, then gradually return to abstract
organizational governance.

The clearest version of your argument is:

> Knowing what someone says matters is not enough. We must clarify the outcomes
> they want, propose a way to help, and remain accountable for whether that
> intervention actually improves their situation.

Here's where I would focus.

### 1. "Vision and Goals" Now Connects the Terms Well

The distinction at [line 158](../article.mdx) works: value statements express
significance, goals identify desired conditions, and propositions connect an
offer to those goals.

Three things still need attention:

- **Vision remains mostly undefined**, despite being in the title. Is it your
  picture of a desirable future, your judgment about an opportunity, or your
  intended contribution? One sentence distinguishing vision from a particular
  goal would help.
- **"Goals Reflect Opportunities" points in the opposite direction from your
  explanation.** The diagram and following prose say that goals determine which
  conditions count as opportunities.
- The paragraph beginning **"There is a more fundamental reason that AI cannot
  find valuable goals"** interrupts the progression. It returns to the economic
  and averaging arguments after the Jon example has already established
  something more precise.

Your argument doesn't require proving that AI cannot suggest a valuable goal.
It requires distinguishing **suggesting a goal from establishing that it
deserves to govern action**.

### 2. Correct the Hall Attribution Before Publication

At [line 165](../article.mdx), the quotation now includes:

> Our vision gives direction to that judgment; our value proposition makes the
> intended benefit explicit.

That was connective prose from our suggested rewrite, not Hall's verified
wording. The preceding "the differentiator is…" is also a paraphrase. Her
transcript supports the portion about deciding what merits creation,
communication, and trust. Keep your summary unquoted, or quote only her actual
words. [Hall's transcript](https://ai.engineer/talks/1KOdiGgMtpY-signal-layer-what-build-when-anything-be)

The economic "value goes to zero" assertion and purported "full quote" about
customers also retain the earlier credibility risks we discussed.

### 3. Carry Jon Into the Governance Section

["Authority, Accountability, and Corrigibility"](../article.mdx) has a strong
central claim:

> Governed by the wrong values, the system becomes coherently wrong.

The feedback-loop figure and examples explain it well. But the move from Jon
to institutional hierarchies is abrupt.

One continuation of his example could make the entire section feel necessary:

> Our publishing service could celebrate books released and revenue generated
> while Jon earns little after fees and spends more evenings working. The
> dashboard would show success while the value proposition fails.

That demonstrates "false evaluative closure" before naming it. It also makes
corrigibility concrete: do we revise the service and its measures when Jon's
experience contradicts our scorecard?

### 4. Resolve the Two Meanings of "Values"

Earlier, value statements are grounded in subjective experience. Later, AI has
"its own values" and an "implicit value hierarchy."

A reader may reasonably ask: **are these the same kind of values?**

You need a brief distinction between:

- What people experience as desirable, harmful, meaningful, or worth protecting.
- The priorities a system's behavior reflects through its training,
  instructions, constraints, and evaluation.

Without that distinction, the article appears to grant AI the thing it
previously denied it. Also, asking a model to describe its values illustrates
its stated position; it does not independently demonstrate the priorities
governing its behavior.

### 5. "From Human Judgment to Language" Is the Right Bridge

This section gives the argument a practical destination and introduces *Truth
and Inference* naturally.

Its list is useful, but follows another long list about corrigibility. I'd
ground it in the value proposition before broadening out:

What income would count as worthwhile? What time commitment is acceptable?
What evidence would show that Jon benefits? Who can stop or revise the work?

That also resolves an apparent tension: **language can be incomplete without
being useless.** We do not need to transmit Jon's entire inner experience; we
need sufficient shared understanding to act responsibly and correct mistakes.

### 6. The Conclusion Should Land on Accountability, Not Another Hypothesis

The return to the failed planning prompt is effective. However:

- "It failed because…" states a definitive cause that the opening anecdote
  does not establish.
- The proposed follow-up to the strategic-advice study introduces a new
  investigation just as the article should resolve.
- The final emphasis on "the hierarchy you intended" is narrower than the
  article's strongest lesson. Correctly following the author's intent is not
  enough if the consequences harm the people being served.

I would close by reconnecting **intent, the value proposition, and observed
consequences**. For example, the final thought could be:

> Making our priorities explicit is the beginning, not the end. We remain
> responsible for whether the goals we authorize—and the solutions we
> build—actually serve the people whose lives they change.

My highest priorities would be: fix the attribution, maintain the distinction
between proposing and authorizing goals, and carry Jon through the governance
section into the conclusion. The article needs continuity more than additional
concepts.

## Proposed Technical Continuation

I'd place this immediately after **"Optimize this code" can become
substantially instrumental…** It adds an important qualification: technical
work becomes instrumental only after we have chosen the right objective and
boundaries.

Here's a suggested continuation—not applied:

### Technical Work Still Requires Judgment

This distinction does not separate strategic people from technical people.
Architecture carries assumptions about what matters. Engineers need enough
understanding of the intended outcome to recognize when those assumptions no
longer serve it.

Remember the opening request: "Optimize this plan, find all the gaps and ensure
validation checks are in place." The problem was not a shortage of possible
improvements. It was the absence of a clear distinction between improvements
that mattered and work that merely looked thorough.

Consider a hypothetical ETL pipeline that keeps a DynamoDB cache populated with
current product information. Incoming events trigger Lambda workers, which
retrieve full records from a partner API, transform them, and update the cache.
The application reads from that cache to serve its customers.

An unexpected increase in incoming records overwhelms the pipeline. The
partner API limits both records per request and requests per second. Workers
encounter throttling, the backlog grows, and the information customers see
becomes stale.

What is the best fix?

- Cache repeated lookups in each Lambda worker's memory?
- Check the shared DynamoDB cache before fetching records again?
- Introduce Redis as a shared caching layer?
- Ask the API provider for larger batches or a higher request allowance?

Each option invites legitimate engineering questions about freshness,
consistency, cost, and operational complexity. We could produce an excellent
comparison and implement the winning design.

But all four options can leave the same assumption unexamined: **every incoming
record needs to be processed.**

In this scenario, the incoming feed had expanded to include product categories
our application did not support. Those records were valid, but hydrating them
contributed nothing to the customer experience. Their category was already
present in the incoming event; we did not need the expensive API request to
identify them.

Once we checked the downstream requirements, the immediate fix was a filter
before hydration. We excluded the unsupported categories, verified that
records and state changes the application depended on still passed through,
and brought the useful workload back within the existing limits.

We did not need a faster way to process all the data. We needed to stop treating
all the data as equally important.

The governing goal was not "maximize records processed." It was "keep the
information our customers depend on sufficiently current." Processing
irrelevant records was actively undermining that goal by delaying the relevant
ones.

This is the same reasoning we applied to Jon. Publishing more books does not
necessarily improve his situation. Processing more records does not
necessarily improve the product. In both cases, we have to distinguish the
activity from the outcome it is supposed to serve.

An AI could help identify and implement the filter. But a request to "fix the
rate limits" directs attention toward the constraint we have named. Someone
still needs to question the scope of the work, connect the architecture to its
purpose, and establish which changes would preserve that purpose.

The filter is simple. Knowing what it is safe to filter is not merely a coding
decision.

That judgment requires technical understanding, knowledge of the product, and
accountability to the people who depend on it. It also raises the next
question: **who can decide that something does not matter, and what evidence
would require them to reconsider?**

### Technical Wording Note

Lambda's in-memory cache is local to a reused execution environment, not shared
across all workers. That makes "local Lambda cache" versus "shared DynamoDB or
Redis cache" the clearer comparison.
[AWS execution-environment guidance](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html)

## Vision Quotations to Incorporate

Candidate language for strengthening the article's definition of vision:

> “What you aim at determines what you see.”

> “A vision of the future, the desirable future, is necessary. Such a vision
> links action taken now with important, long-term, foundational values.”

The first quotation can reinforce the argument that governing goals determine
which conditions become visible as opportunities, problems, or evidence. The
second can help define **vision** as a desirable future that connects present
action with durable values, distinguishing it from a single goal or value
proposition.

Source attribution and exact wording still need verification before either
quotation is incorporated into the canonical article.
