# Libraries Agent Contract

## Operational Flow

Keep library APIs focused, export consumers through the package boundary, and
update all affected consumers when changing a contract.

## Required Verification Parameters Within Nested Context

Run the library's `typecheck` and `test` targets plus those targets for affected
consumer projects.

## Required Invariants Within Folder Context

Libraries do not start or publish applications. They remain independent of app
and tool source and expose reusable behavior through package exports.

## Downlinks

- [blogs](blogs/AGENTS.md)
- [design-theme](design-theme/AGENTS.md)
- [embedding-space](embedding-space/AGENTS.md)
- [graph-visualization](graph-visualization/AGENTS.md)
- [knowledge-model](knowledge-model/AGENTS.md)
- [laws](laws/AGENTS.md)
- [llm-decoding](llm-decoding/AGENTS.md)
- [llm-generation](llm-generation/AGENTS.md)
- [llm-training](llm-training/AGENTS.md)
- [llm-visualization](llm-visualization/AGENTS.md)
- [neural-net-visualization](neural-net-visualization/AGENTS.md)
- [set-theory-visualization](set-theory-visualization/AGENTS.md)
- [testing](testing/AGENTS.md)
- [thom-brand](thom-brand/AGENTS.md)
- [tokenizer-visualization](tokenizer-visualization/AGENTS.md)
- [topology-visualization](topology-visualization/AGENTS.md)
- [ui](ui/AGENTS.md)
