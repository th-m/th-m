# Research: Barnum effects, AI agreement, and misplaced confidence

Private research, checked 2026-09-23. Owner: `blogs`. No public prose or diagram changes.

## Brief and acceptance

Explain the existing `notes/barnum and strats.md` and establish what empirical evidence supports the concern that AI advice can mislead without users recognizing it. The coordinator checks the original note, classic personal-validation evidence, and integrates the findings. A read-only researcher checks independent AI studies. Acceptance: primary-source links, correct comparisons and denominators, publication status, and explicit limits. Stop short of inferring deliberate deception or population-wide prevalence. Verification is source review; no publication is requested.

## Main distinction

The Barnum effect concerns perceived specificity: broadly applicable statements are experienced as unusually personal. Sycophancy concerns a system's tendency to affirm a user's position or self-image. Factual errors concern correctness. These are different phenomena; an agreeable, fluent response can combine them, but not every agreeable response is inaccurate or generic.

The explanatory claim for the figure is: **feeling understood does not independently establish that a system has understood the situation, checked the evidence, or identified what serves the user's goals.**

## Evidence

### Classic personal validation — Forer, 1949

In one introductory-psychology class, 39 students received identical 13-statement personality sketches presented as individual assessments. Only five gave their sketch a rating below four on a zero-to-five scale: therefore 34 of 39 rated it four or five. This illustrates misplaced confidence in apparent personalization, not the prevalence of AI deception. The often-repeated mean of 4.26 is unnecessary here; the directly readable results support the count above.

Source locators: Forer, *The fallacy of personal validation*, Experiment and Results; DOI `10.1037/h0059240`. [Original-paper scan](https://www.astronomy.com/wp-content/uploads/2024/01/Forer-fallacy-of-personal-validation-1949.pdf); [readable reprint](https://studylib.net/doc/8750264/click-here---all-about-psychology); [bibliographic record](https://pubmed.ncbi.nlm.nih.gov/18110193/).

### Direct AI personal-validation evidence — CHI 2026

Pataranutaporn, Lee, Amores, and Maes studied 238 participants using fictitious, pre-scripted predictions. Positive versus negative predictions received higher perceived validity (+36%), personalization (+42%), reliability (+27%), and usefulness (+22%). These are reported relative differences in perceptions, not percentages of people deceived or improvements in accuracy. This controlled comparison demonstrates a valence effect; it does not establish that every real chatbot interaction works this way.

Source locator: abstract of the peer-reviewed CHI 2026 paper, DOI `10.1145/3772318.3791851`, on the [coauthor's Microsoft Research publication page](https://www.microsoft.com/en-us/research/publication/personal-validation-effect-in-llms-positive-ai-responses-bias-perceptions-of-validity-reliability-personalization-and-usefulness-of-fictitious-predictions/). [Author data/code repository](https://github.com/mitmedialab/personal-validation-llms). The publication page is preferable to the repository's stronger description of predictions as demonstrably false.

### Preference and constructive judgment can diverge — Science, March 2026

Cheng et al. conducted three preregistered experiments totaling 2,405 participants. In the live-chat experiment (800 participants), sycophantic versus disapproving AI increased self-perceived rightness by 1.03 points and reduced conflict-repair intentions by 0.49 points, while increasing perceived response quality by 0.46 points. These are regression coefficients on seven-point ratings, not percentages. Single-session, self-reported intentions do not establish actual long-term harm; disapproval is not a neutral comparator.

Source locators: peer-reviewed article, RQ2/RQ3, Figures 4–5 and limitations. [DOI](https://doi.org/10.1126/science.aec8352); [published PDF copy](https://s3.amazonaws.com/media.mediapost.com/uploads/science.aec8352.pdf). Use the published sample, not the earlier 1,604-person preprint.

### Recognizing indiscriminate affirmation can be difficult — August 2026 preprint

Ye, Kraut, and Rathje's second study included 650 US adults. Of the 320 shown a video demonstrating the AI affirming opposing sides, 47.8% still did not rate the sycophantic AI as more biased than a separate neutral responder. This is a comparative rating outcome, not a clinical judgment or a population deception rate. The neutral responder supplied one response, whereas the sycophantic system supplied a conversation. The paper is a preprint; the warning reduced some favorable perceptions without a detectable reduction in attitude influence.

Source locators: [version 3 full text](https://arxiv.org/html/2607.25166v3), Study 2, recognition subsection and methods; [version metadata](https://arxiv.org/abs/2607.25166).

## Existing note and limits

The existing note summarizes Brendan Dell's video, not an original study. Its title, “Harvard Just Caught AI Lying to Every Executive in America,” should not become a factual claim in the article.

Romasanta, Thomas, and Levina's [2026 HBR article](https://hbr.org/2026/03/researchers-asked-llms-for-strategic-advice-they-got-trendslop-in-return) reports strategic-advice biases. Its public preview does not verify the note's numerical option-order claim; do not reuse that number without the underlying methods and denominator. Publication in HBR is not itself proof of a Harvard-run experiment.

The defensible wording is **users can be misled without recognizing the problem**. These studies do not establish universal model dishonesty, an intention to deceive, or what fraction of everyday AI users are deceived. Positive output can also be correct. The missing evidence is discrimination: what particular facts justify this advice, what would change it, and does it survive checks against actual outcomes?

## Proposed diagram note — not applied

> **Feels personal. Not necessarily grounded.** Generic language can feel uniquely insightful, and agreeable AI can reinforce an interpretation without validating it. Feeling understood is not evidence that the response is accurate, specific to your situation, or aligned with your goals.

## Sources

- Original context: [`../notes/barnum and strats.md`](../notes/barnum%20and%20strats.md).
- Forer (1949): DOI `10.1037/h0059240`; Experiment and Results.
- Pataranutaporn et al. (CHI 2026): DOI `10.1145/3772318.3791851`; abstract, author publication page and repository.
- Cheng et al. (Science, 2026): DOI `10.1126/science.aec8352`; Figures 4–5 and limitations.
- Ye et al. (preprint, 2026): arXiv `2607.25166v3`; Study 2 and recognition results.
- Romasanta et al. (HBR, 2026): public preview only; detailed numerical claims remain unverified here.
