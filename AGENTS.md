# FanHub agent team rules

- The team works on the Node frontend, one issue per branch (`issue-N`). Install `node/frontend` dependencies once before a run.
- Source lives in `node/frontend/src/`. Tests are `*.test.js` files next to the code they test.
- The default Check for task.md, run from the repository root:
  - `npm --prefix node/frontend test -- --watchAll=false --ci`
  - `node/frontend/node_modules/.bin/eslint` on every changed file under `node/frontend/src/`
- `.team/` is the shared record for the current issue. It is gitignored, so it stays put when branches change. Any agent can read any file there; each file has one writer:

| File | Writer |
|---|---|
| `task.md` | orchestrator drafts; the person approves |
| `plan.md` | planner |
| `changes.md` | implementer |
| `tests.md` | test-writer |
| `review.md` | test-reviewer |
| `status.md`, `evidence/` | orchestrator |

- Round N is the work that leads to check-N. Append a `## Round N` section with the round number the orchestrator gives you; never rewrite an earlier round or another agent's file.
- Name each test after the acceptance criterion it proves (`A#: ...`) or the edge it guards (`E#: ...`; `E#: risk: ...` for a plan.md risk).
- task.md lists Out of scope items under their own heading. Agents never fix or test them.
- Never commit, push, merge, or install packages. A person makes those decisions.
