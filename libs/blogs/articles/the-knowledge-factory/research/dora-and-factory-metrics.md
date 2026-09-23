# Research: DORA and Factory Metrics

Reviewed 2026-09-23 for the private outline and drafts.

## Sources

- [DORA's software delivery performance metrics](https://dora.dev/guides/dora-metrics/),
  updated January 5, 2026. “Throughput and instability” defines the current
  five metrics. “Common pitfalls” cautions against quotas, single-metric
  optimization, and comparisons across dissimilar services.
- [Value-stream mapping](https://dora.dev/guides/value-stream-management/),
  updated November 13, 2024. The opening distinguishes the wider idea-to-delivery
  path from DORA's delivery/operations focus. “Defining your outcomes” places
  strategic outcomes before local optimization.
- [Continuous delivery](https://dora.dev/capabilities/continuous-delivery/),
  “Implementing continuous delivery.” Automated tests and deployments, fast
  feedback, and loosely coupled teams are established practices. This page's
  older four-metric reference should not override the newer metric guide.

## Mapping and Limits

| Factory concept | Connection | Boundary to preserve |
| --- | --- | --- |
| Number of input tokens | Context volume and resource use | Not a time measurement. |
| Time to usable model input | Lead time through preparation and its queues | DORA change lead time begins at commit and ends at production; preparation often precedes it. |
| Token value output / useful yield | Work retained after evaluation; waste and correction | Not a standardized DORA measure or a monetary value per token. |
| Failure after deployment | DORA change fail rate | Count deployments needing immediate intervention, not rejected pre-release candidates. |
| Corrective deployments after incidents | DORA deployment rework rate | Distinct from all review edits or all discarded generated work. |
| Customer benefit | Outcome that delivery should serve | A low failure rate does not establish usefulness or strategic value. |

The remaining DORA measures are deployment frequency and failed deployment
recovery time. Keep these at service/application scope and inspect change over
time. Do not average unlike work into a universal factory productivity score.

## Editorial Conclusion

The token framing leads back to familiar questions about flow, failure,
recovery, and rework. The article should let the reader recognize that
continuity instead of presenting another novel metric framework. Automation
can compress the work between checks; it does not establish a universal
reduction in delivery time or eliminate the observation window for a customer
outcome. Fast inner loops and slower outcome loops both need ownership.
