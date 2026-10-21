---
description: Daily backlog digest for FanHub maintainers
on:
  schedule: daily around 9:00 utc-5
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  pull-requests: read
  copilot-requests: write
engine:
  id: copilot
  model: gpt-5.6-luna
timeout-minutes: 10
tools:
  github:
    toolsets: [issues, pull_requests]
safe-outputs:
  create-issue:
    title-prefix: "[digest] "
    labels: [agentic-workflows]
    close-older-issues: true
    max: 1
---

# Daily backlog digest

Write one issue that tells a FanHub maintainer where triage attention is
needed today. Report only what you can verify from issues and pull requests in
this repository; label every count with what it counts.

Include these sections:

1. **Backlog shape.** Open issues by `lang:*` label and by `severity:*`
   label, as two small tables. Count issues with neither label as untriaged.
2. **Needs triage.** Up to ten open issues that lack a `lang:*` or a
   `severity:*` label, newest first, each with a one-line summary. Suggest
   commenting `/triage` on them.
3. **Agent work waiting on people.** Open pull requests whose head branch
   starts with `copilot/` or that carry the `agent-generated` label, with
   their age in days and whether a review has been requested.
4. **Automation health.** Open issues whose titles start with `[aw]`; these
   are failure reports from agentic workflows. Link each one.
5. **One recommendation.** The single highest-value triage action for today,
   with the reason.

Keep the digest under 400 words. Do not speculate about code you have not
read. If a section is empty, say so in one line.
