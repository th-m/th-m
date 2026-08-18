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
