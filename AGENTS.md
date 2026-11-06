# FanHub agent team rules

- The team works on the Node frontend. The check is `npm --prefix node/frontend test -- --watchAll=false --ci`; install `node/frontend` dependencies once before a run.
- Source lives in `node/frontend/src/`. Tests are `*.test.js` files next to the code they test.
- `.team/` is the shared record. Any agent can read any file there; each file has one writer:

| File | Writer |
|---|---|
| `task.md` | orchestrator drafts; the person approves |
| `plan.md` | planner |
| `changes.md` | implementer |
| `tests.md` | test-writer |
| `review.md` | test-reviewer |
| `status.md`, `evidence/` | orchestrator |

- Append a new `## Round N` section; never rewrite an earlier round or another agent's file.
- Name each test after the acceptance criterion it proves (`A#: ...`).
- Never commit, push, merge, or install packages. A person makes those decisions.
