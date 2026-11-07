# GitHub Universe 2026 — Demo Guide

A run book that maps each announcement in the **GitHub Universe 2026 Customer-Facing Deck** to a live demo. Demos that need code use this repository (FanHub). Demos that don't need a repository are walkthroughs in the right tool: the GitHub Copilot app, Copilot CLI, VS Code, or github.com.

> **Seller rule from the deck:** choose 3–5 demos that fit the customer's priorities. Keep the focus on value and outcomes, and keep the developer in control. Don't run all 11.

---

## Contents

- [At a glance](#at-a-glance)
- [One-time prerequisites](#one-time-prerequisites)
- [Core announcements](#core-announcements)
  1. [GitHub Enterprise includes Copilot](#1-github-enterprise-includes-access-to-copilot)
  2. [GitHub Copilot app: Projects](#2-github-copilot-app-projects)
  3. [Copilot Automations](#3-copilot-automations)
  4. [Copilot Fusion + local models in `/model`](#4-copilot-fusion--bring-your-own-local-models)
  5. [AI Scan for repositories](#5-ai-scan-for-repositories)
- [Appendix announcements](#appendix-announcements)
  6. [Git infrastructure performance](#6-git-infrastructure-performance)
  7. [Agentic autofix for code scanning alerts](#7-agentic-autofix-for-code-scanning-alerts)
  8. [Reachability analysis for Dependabot](#8-reachability-analysis-for-dependabot)
  9. [Package firewall](#9-package-firewall)
  10. [GitHub security extension for the Copilot app](#10-github-security-extension-for-the-copilot-app)
  11. [AI-detected secrets in push protection](#11-ai-detected-secrets-in-push-protection)
- [Suggested demo flows](#suggested-demo-flows)
- [Reset after a demo](#reset-after-a-demo)

---

## At a glance

| # | Announcement | Deck slide | Status (per changelog) | Where to demo | Uses FanHub? | Time |
|---|---|---|---|---|---|---|
| 1 | GitHub Enterprise includes Copilot | 6 | GA (through account teams) | Enterprise settings on github.com | No | 3 min |
| 2 | Copilot app: Projects | 7 | Public preview ⚠️ | GitHub Copilot app | **Yes** | 8 min |
| 3 | Copilot Automations | 8 | GA; shared automations rolling out | github.com **Agents** tab / Copilot app / VS Code | **Yes (private copy)** | 7 min |
| 4 | Copilot Fusion + local models | 9 | Fusion GA; local routing experimental | Copilot CLI, VS Code, Copilot app | **Yes** | 6 min |
| 5 | AI Scan for repositories | 10 | Public preview | github.com **Security** tab | **Yes** | 5 min |
| 6 | Git infrastructure performance | 15 | Private preview | Talk track only | No | 1 min |
| 7 | Agentic autofix | 17 | GA | github.com **Security** tab | **Yes** | 6 min |
| 8 | Dependabot reachability | 18 | Public preview (JS/TS) | github.com **Security** tab | **Yes** | 4 min |
| 9 | Package firewall | 19 | Public preview | Terminal (Codespace) + enterprise settings | Yes (Codespace) | 5 min |
| 10 | Security extension for the Copilot app | 20 | Public preview | GitHub Copilot app / Copilot CLI | **Yes** | 6 min |
| 11 | AI-detected secrets in push protection | 21 | Public preview | Terminal + repo settings | **Yes** | 4 min |

> ⚠️ **Deck vs. changelog:** The deck shows **Copilot Projects** as GA. The [Oct 28 changelog](https://github.blog/changelog/2026-10-28-github-copilot-app-universe-releases) and [docs](https://docs.github.com/copilot/how-tos/github-copilot-app/working-with-projects) say **public preview**. Confirm availability before you promise anything to a customer.

### What FanHub already has (as of Nov 4, 2026)

FanHub is a **public, organization-owned** repository (`MSBart2/FanHub`) with security alerts already in place. You don't need to plant fake vulnerabilities for most demos.

| Asset | Details | Used by demos |
|---|---|---|
| CodeQL default setup | Configured for JS/TS, C#, Go, Java/Kotlin, Actions | 5, 7, 10 |
| Code scanning alert **#3** | `js/missing-rate-limiting` — `node/backend/src/routes/auth.js:131` | 7, 10 |
| Code scanning alert **#4** | `java/spring-disabled-csrf-protection` — `java/backend/src/main/java/com/fanhub/config/SecurityConfig.java:18` | 7, 10 |
| Code scanning alert **#5** | `go/sql-injection` — `go/backend/handlers/character_handler.go:23` | 7, 10 |
| Dependabot alerts | 30+ open JS alerts (e.g., `axios`, `launch-editor`, `proxy-addr`, `compression`) in `node/frontend` and `java/frontend` | 8 |
| Secret scanning + push protection | Enabled. **AI-detected secrets is disabled.** | 11 |
| Intentional bugs (answer key) | [BUGS.md](./BUGS.md), especially **Menu C — "The Security Sweep"** | 2, 4, 5 |
| Agentic workflows (gh-aw) | [`.github/workflows/triage.md`](./.github/workflows/triage.md), [`triage-wizard.md`](./.github/workflows/triage-wizard.md) | 3 (comparison) |

Refresh the alert numbers before each demo:

```powershell
gh api "repos/MSBart2/FanHub/code-scanning/alerts?state=open" --jq '.[] | "\(.number)  \(.rule.id)  \(.most_recent_instance.location.path):\(.most_recent_instance.location.start_line)"'
gh api "repos/MSBart2/FanHub/dependabot/alerts?state=open&per_page=100" --jq '.[] | "\(.number)  \(.security_advisory.severity)  \(.dependency.package.name)  \(.dependency.manifest_path)"'
```

---

## One-time prerequisites

Set these up **at least 24 hours before** a customer session. Reachability analysis scans once a day and can't be started on demand.

### Tools

| Tool | Needed for | Install / check |
|---|---|---|
| GitHub Copilot app (latest) | 2, 3, 4, 10 | [Download](https://github.com/features/ai/github-app); update to the Universe release |
| GitHub Copilot CLI (latest) | 4, 10 | `copilot --version` |
| VS Code ≥ 1.144 + GitHub Copilot Chat | 3, 4 | Help → About |
| GitHub CLI (`gh`) | 3, 7, 8, 11 | `gh auth status` |
| Git | 11 | `git --version` |
| Optional: Ollama or an OpenAI-compatible local server | 4 (non-Windows local model path) | `ollama list` |

> **Package feeds on Microsoft corporate machines:** npm and NuGet restores must go through `https://packagefeedproxy.microsoft.io/`. Demo 9 (package firewall) changes the npm registry, so run it in a **Codespace or dev container**, not on a corporate laptop. See [Demo 9](#9-package-firewall).

### Licenses and policies

| Requirement | Demos |
|---|---|
| Copilot Business/Enterprise (or Pro+/Max) with **Copilot cloud agent** enabled | 2, 3, 7 |
| Org policy **"Allow use of Copilot cloud agent billed to the organization"** (for shared automations) | 3 |
| Org admin enabled the **GitHub Copilot app** policy (Business/Enterprise) | 2, 10 |
| GitHub Enterprise Cloud enterprise with the **AI Scan** policy enabled | 5 |
| GitHub Code Security / Advanced Security (needed for private repos; FanHub is public) | 5, 7, 10 |
| GitHub Enterprise Cloud (reachability analysis) | 8 |
| GitHub Enterprise Cloud with enterprise admin access | 1, 9 |
| GitHub Secret Protection or GHAS, with **AI-detected secrets** enabled | 11 |

### Create a private copy of FanHub (for Automations)

**Copilot Automations aren't available in public repositories**, and FanHub is public. Make a private mirror once and reuse it:

```powershell
$org = "<your-demo-org>"
gh repo create "$org/FanHub-demo" --private
git clone --bare https://github.com/MSBart2/FanHub.git "$env:TEMP\FanHub.git"
git -C "$env:TEMP\FanHub.git" push --mirror "https://github.com/$org/FanHub-demo.git"
Remove-Item -Recurse -Force "$env:TEMP\FanHub.git"
```

---

## Core announcements

### 1. GitHub Enterprise includes access to Copilot

**Deck slide 6 · GA (available through GitHub/Microsoft account teams) · No repository needed**

**Value:** One license instead of two things to manage (seats plus usage). Every licensed GitHub Enterprise user gets Copilot access. Admins manage usage against one enterprise budget.

**Where:** github.com → your enterprise → **Settings** / **Billing and licensing**. Use an enterprise admin account on a demo enterprise.

**Walkthrough**

1. Open `https://github.com/enterprises/<enterprise>` → **Billing and licensing** → **Licensing**. Point out that GitHub Enterprise licenses now carry Copilot access. There's no separate Copilot seat count to reconcile.
2. Go to **Billing and licensing** → **Budgets and alerts**. Show the enterprise AI-usage budget and alert thresholds. *"This is the main thing you manage now."*
3. Go to **Policies** → **Copilot**. Show that the existing feature and model policies still apply. *"Included access doesn't mean everything is switched on automatically. You still choose how to roll it out."*
4. Explain how budget affects access (from the changelog):
   - Code completion and next edit suggestions **keep working with no budget**.
   - Copilot Chat, Copilot code review, and Copilot cloud agent **need available budget**.
   - An exhausted budget **never removes the seat**.
5. Mention that users without a GitHub Enterprise license can get the same access through **Copilot Standalone**.

**Watch for:** Confirm eligibility, pricing, and rollout with the account team before discussing commercial details. Self-serve availability is rolling out in stages.

**Links:** [Changelog](https://github.blog/changelog/2026-10-28-github-enterprise-now-includes-access-to-github-copilot) · [What's changing with GitHub Enterprise and Copilot](https://docs.github.com/copilot/get-started/whats-changing-with-github-enterprise-and-copilot) · [Copilot billing for enterprises](https://docs.github.com/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing)

---

### 2. GitHub Copilot app: Projects

**Deck slide 7 · Public preview per changelog (deck says GA) · FanHub**

**Value:** Give Copilot a *goal*, not a single task. Copilot runs as many agents as the work needs. You review and steer from one place.

**Where:** GitHub Copilot app → sidebar → **Projects**.

**Setup**

- Sign in to the Copilot app with an account that can write to `MSBart2/FanHub` (or your fork).
- Have [BUGS.md](./BUGS.md) available to upload.

**Walkthrough**

1. In the sidebar, next to **Projects**, click **+**. Name the project **FanHub Security Sweep**.
2. Under **Which repositories should this Project use?**, add `MSBart2/FanHub`.
3. Open **Library** → **Add** → **Add file…** and add `BUGS.md`. *"This is the context I'd normally paste into five different chats."*
4. Send this goal:

   ```text
   Goal: harden FanHub's Node.js backend using the "Menu C — The Security Sweep"
   table in BUGS.md from this project's library.

   - Fix bugs #7 (weak password rules), #20 (CORS wide open), and #18 (error
     details exposed to clients) in node/backend.
   - Open one pull request per bug so each can be reviewed independently.
   - Don't modify tests and don't touch the dotnet/, java/, or go/ folders.
   - Ask me before changing any public API response shape.
   ```

5. Click **Overview** and walk through the status groups:
   - **Working**: several sessions running in parallel.
   - **Needs input**: Copilot is asking a question (for example, about the CORS allow-list). Answer it live. *"The developer stays in control."*
   - **Open**: pull requests ready to review, with line counts.
6. Click into one session → **Steer this session**. Send: `Read allowed origins from a CORS_ORIGINS env var and document it in node/.env.example.`
7. Show recurring work. In the project prompt, enter:

   ```text
   Every Monday at 9 AM, list new FanHub issues labeled severity:critical or
   severity:high, and summarize which BUGS.md entries they map to.
   ```

**Optional extras from the same release**

- **Image generation:** in chat, ask *"Create a FanHub logo: a TV with a lightning bolt, flat style."*
- **Computer use** (public preview on Windows/macOS): **Settings** → **Computer Use** → **Enable Computer Use**. Copilot asks for approval before it controls any app.

**Talking point:** For a focused task in one repository, a regular session is still the right tool. Projects are for coordinating a broader goal.

**Links:** [Changelog](https://github.blog/changelog/2026-10-28-github-copilot-app-universe-releases) · [Working with projects](https://docs.github.com/copilot/how-tos/github-copilot-app/working-with-projects)

---

### 3. Copilot Automations

**Deck slide 8 · GA; shared automations rolling out · FanHub (private copy)**

**Value:** Automate recurring work like issue triage, bug reproduction, and review prep. Copilot runs in the cloud with **only the tools you allow**. Shared automations belong to the repository, not to one person.

**Where:** github.com → repository → **Agents** tab → **Automations** pane. You can also use the **Automations** tab in the Copilot app or the **Agents** window in VS Code (requires `chat.automations.cloud.enabled`).

**Setup**

- Use the **private** `FanHub-demo` mirror ([see prerequisites](#create-a-private-copy-of-fanhub-for-automations)). Automations don't run in public repos.
- Enable the org policy **"Allow use of Copilot cloud agent billed to the organization"** so shared automations can run.

**Walkthrough: "Reproduce bugs as soon as they're filed"**

1. Open `https://github.com/<org>/FanHub-demo` → **Agents** → **Automations** → **New automation**.
2. Fill in:
   - **Name:** `Reproduce workshop bugs`
   - **Type:** **Shared**. *"Everyone with read access can see it. Copilot's identity performs the actions. The org is billed. It keeps running if I leave."* The type can't be changed later.
   - **Trigger:** *When an issue is created*, filter: `label:bug`
   - **Tools:** read code, comment on issues, add labels. Don't allow opening pull requests.
   - **AI credits limit:** set a low per-run cap. *"Cost controls are built in."*
   - **Prompt:**

     ```text
     A bug was reported in FanHub. Locate the code path in node/, dotnet/, java/,
     or go/ that the issue describes. Check BUGS.md for a matching known bug.
     Try to reproduce it by reading the code and, if needed, running the relevant
     backend locally. Comment once with: the file and line responsible, the
     matching BUGS.md entry (if any), reproduction steps, and a suggested
     severity. Do not change code.
     ```

3. Save, then trigger it live:

   ```powershell
   gh issue create -R <org>/FanHub-demo --label bug `
     --title "[Node] [BUG] Season filter on Episodes page shows wrong season" `
     --body "Clicking Season 2 sometimes still shows Season 1 episodes."
   ```

4. Open the automation's **runs**. Then open the issue and show Copilot's comment. It should point to `node/frontend/src/pages/Episodes.js` and BUGS.md **#2 — Episode Cache Ignores Season Filter**.
5. Show **change history** on the automation to demonstrate team ownership and auditability.

**Second example (PR review prep):** trigger *When a pull request is opened*, files filter `node/frontend/**`, prompt *"Capture screenshots of the changed pages and attach them to the PR."*

**Talking point (vs. GitHub Agentic Workflows):** FanHub already uses **gh-aw** agentic workflows for slash-command triage ([`.github/workflows/triage.md`](./.github/workflows/triage.md)). Automations are the UI-first way to build the same kind of loop. gh-aw is the YAML/Actions-native way, for teams that want everything in source control.

**Links:** [Changelog](https://github.blog/changelog/2026-10-28-build-shared-workflows-for-your-team-with-copilot-automations) · [About automations](https://docs.github.com/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/about-automations)

---

### 4. Copilot Fusion + bring your own local models

**Deck slide 9 · Fusion GA · Local-model routing in experimental preview · FanHub**

**Value:** Stop picking models. Pick an **effort level**. Fusion routes each task and, when it helps, orchestrates several models (**Single**, **Cascade**, **Critique**). Admins control which models it can use.

**Where:** Copilot CLI (best for showing routing), VS Code, or the Copilot app.

**Walkthrough A: Copilot CLI on FanHub**

1. In a terminal at the FanHub root:

   ```powershell
   cd C:\path\to\FanHub
   copilot
   ```

2. Run `/model` → select **Copilot Fusion** → choose **Fusion Standard**.
3. Easy task (expect **Single** routing):

   ```text
   Explain what node/backend/src/routes/auth.js does in 5 bullets.
   ```

4. Run `/model` → switch to **Fusion High** (or **Max**). Then give a harder, cross-cutting task (expect **Cascade** or **Critique**):

   ```text
   Fix BUGS.md #2 (episode cache ignores season filter) in
   node/frontend/src/pages/Episodes.js. Key the cache by seasonId, keep the
   30-second TTL, and explain any edge cases you considered.
   ```

5. Point out the routing information in the output: which model drafted the change and whether a second model reviewed it. *"I didn't have to know which model is best for React state bugs."*
6. Discard the change if you don't want to keep it: `git restore node/frontend/src/pages/Episodes.js`.

**Walkthrough B: local models in `/model`**

| Client | Setup |
|---|---|
| Copilot CLI (Windows, managed) | Enable experimental mode, open `/model`, and follow the prompts to download **MAI Code 1.1 Flash** through the Windows ML provider |
| Copilot CLI (Windows/macOS/Linux, BYO) | Run **MAI Code 1.1 Flash** or **Qwen3.8 Flash Next** behind a local OpenAI-compatible server (or Ollama, which the CLI discovers automatically). Add it from `/model`, then enable experimental local routing |
| Copilot app | **Settings** → **Model providers** → configure Windows ML. Then **Settings** → **Experiments** → enable **Local model auto routing**. Start a new session |
| VS Code | Set `"chat.copilot.localModel.enabled": true` |

Then select **Copilot Fusion** → **Standard**, and Copilot chooses between local and cloud models. Ask a small question (for example, *"rename `query` to `dbQuery` in node/backend/src/routes/shows.js"*) and show it routed to the local model.

**Watch for**

- Local inference doesn't make the session offline. Routing decisions still happen in the cloud.
- Adding a model through BYOK doesn't automatically make it eligible for Fusion.

**Admin angle:** Enterprise → **Policies** → **Copilot** → **Models**. Show which models Fusion can use, and that Fusion can be set as the **default** at any effort level through enterprise managed settings.

**Links:** [Fusion changelog](https://github.blog/changelog/2026-10-28-route-and-orchestrate-models-with-github-copilot-fusion) · [Local models changelog](https://github.blog/changelog/2026-10-28-github-copilot-fusion-now-supports-selection-of-local-models) · [Add LLM models to Copilot CLI](https://docs.github.com/copilot/how-tos/copilot-cli/customize-copilot/add-llm-models)

---

### 5. AI Scan for repositories

**Deck slide 10 · Public preview · FanHub**

**Value:** An on-demand, agentic scan of the whole repository. It finds vulnerabilities that rule-based scanning misses, and in languages CodeQL doesn't cover. Findings appear in the existing code scanning list.

**Where:** github.com → `MSBart2/FanHub` → **Security** → **Code scanning**.

**Setup**

- An enterprise admin enables the **AI Scan** policy. Then an org owner or security manager turns on **AI Scan for repositories** for the org. This is separate from AI Scan for pull requests.
- Run the scan **before** the meeting. It runs within a fixed time budget, but don't wait on it live.

**Walkthrough**

1. **Security** → **Code scanning**. Show the 3 existing CodeQL alerts (#3, #4, #5). *"This is what rules-based scanning found."*
2. Start an AI scan from the Code scanning page. It analyzes the latest commit on `main`.
3. Filter the alert list by tool to show **AI Scan** findings next to CodeQL's.
4. Compare them with the answer key in [BUGS.md](./BUGS.md) Menu C. These are issues that pattern-based rules typically don't flag:

   | Expected kind of finding | Location |
   |---|---|
   | Hard-coded fallback JWT secret | `node/backend/src/routes/auth.js:11` |
   | Weak password policy (6 characters, no complexity) | `node/backend/src/routes/auth.js:27` |
   | CORS allows any origin | `node/backend/src/index.js:13` |
   | Internal error details returned to clients | `node/backend/src/routes/characters.js` |
   | Auth middleware defined but never applied | `node/backend/src/routes/auth.js` |

5. Point out that AI Scan **skips issues CodeQL already reports**. That's why you don't see a duplicate of the Go SQL injection.
6. Hand off: select an AI Scan alert → **Assign to Copilot** (leads into [Demo 7](#7-agentic-autofix-for-code-scanning-alerts)).

**Watch for**

- Results vary from run to run. Present the BUGS.md items as *what to look for*, not as guaranteed findings. Position AI Scan as *additional* coverage, not a replacement for CodeQL.
- AI Scan alerts don't close automatically when a fix merges. Run a new scan to close them.

**Links:** [Changelog](https://github.blog/changelog/2026-10-28-ai-scan-for-repositories-in-public-preview) · [About AI Scan for repositories](https://docs.github.com/code-security/concepts/code-scanning/ai-scan-for-repositories)

---

## Appendix announcements

### 6. Git infrastructure performance

**Deck slide 15 · Private preview · No demo**

**Value:** GitHub is rebuilding how it stores and replicates repositories. The goal is better performance and scale as agents multiply clone, fetch, and push traffic.

**How to present:** Talk track only. There's nothing customer-visible to click. If the customer has very large monorepos or heavy CI clone traffic, record a baseline now so you can compare once they're in the preview:

```powershell
Measure-Command { git clone --no-checkout https://github.com/<org>/<large-repo>.git "$env:TEMP\perf-baseline" } | Select-Object TotalSeconds
Remove-Item -Recurse -Force "$env:TEMP\perf-baseline"
```

**Next step:** Nominate the customer for the private preview through the account team.

---

### 7. Agentic autofix for code scanning alerts

**Deck slide 17 · GA · FanHub**

**Value:** Hand the security backlog to Copilot. It explores the codebase, writes a fix, **re-runs CodeQL to confirm the alert closes**, and opens a draft pull request for review.

**Where:** github.com → `MSBart2/FanHub` → **Security** → **Code scanning**.

**Prereqs:** Code Security/GHAS on GitHub Enterprise Cloud, with Copilot cloud agent enabled for the repository. When it's on, **Generate fix** is replaced by **Assign to Copilot**.

**Walkthrough: one alert**

1. Open alert **#5 `go/sql-injection`** in `go/backend/handlers/character_handler.go`. Show the string-concatenated `LIKE` query.
2. Click **Assign to Copilot**.
3. Open the **Agents** tab and show the session: files explored, the proposed fix, and the CodeQL re-run.
4. Open the draft PR. Show the summary, *why it closes the alert*, and the validation steps.
5. Comment on the PR: `@copilot also add a unit test for the search handler with a payload containing a single quote.` Copilot iterates.

**Walkthrough: batch fix (the "backlog" story)**

1. In the **Code scanning** alert list, select **#3, #4, #5**. These span Node, Java, and Go.
2. Choose **Assign to Copilot**. Up to 25 alerts go into **one** PR.

**API option (for automation-minded customers):**

```powershell
gh api -X PATCH repos/MSBart2/FanHub/code-scanning/alerts/5 -f "assignees[]=copilot-swe-agent[bot]"
```

**Watch for:** Validation re-runs the default CodeQL query suite. It can't confirm fixes for custom-query or third-party alerts. Close the PRs afterward ([Reset](#reset-after-a-demo)) so the alerts stay available for the next demo.

**Links:** [Changelog](https://github.blog/changelog/2026-10-15-agentic-autofix-for-code-scanning-alerts-general-availability/) · [About autofix for code scanning](https://docs.github.com/code-security/concepts/code-scanning/copilot-autofix-for-code-scanning)

---

### 8. Reachability analysis for Dependabot

**Deck slide 18 · Public preview (JavaScript/TypeScript) · FanHub**

**Value:** Cut through dependency noise. Each alert gets a verdict, **Reachable**, **Potentially reachable**, **Unreachable**, or **Unavailable**, with the call-path evidence.

**Where:** github.com → `MSBart2/FanHub` → **Security** → **Dependabot**.

**Setup (≥ 24 h ahead):** Reachability runs in a managed Actions workflow **once every 24 hours** while open alerts exist. You can't trigger it on demand during the preview, and it doesn't use billed Actions minutes. Requires GitHub Enterprise Cloud.

**Walkthrough**

1. Open **Dependabot** alerts. *"30+ alerts across `node/frontend` and `java/frontend`. Where do you start?"*
2. Filter or sort by **reachability**.
3. Open an `axios` alert in `node/frontend/package-lock.json`. FanHub calls axios directly from `node/frontend/src/services/api.js`, so look for a **Reachable** or **Potentially reachable** verdict and walk through the call-path evidence.
4. Open a `launch-editor` or `compression` alert. These come in through the `react-scripts` dev server, so expect **Unreachable**. *"Real, but lower priority. Severity alone would have put it first."*
5. Emphasize that verdicts **never auto-close or dismiss alerts**. They're one more prioritization signal next to severity and EPSS.

**Watch for:** Verdicts reflect the most recent daily scan, not the latest push. Present the expected verdicts as likely, not guaranteed.

**Links:** [Changelog](https://github.blog/changelog/2026-10-28-prioritize-dependabot-alerts-with-reachability-analysis/) · [About reachability analysis](https://docs.github.com/code-security/concepts/supply-chain-security/about-reachability-analysis-for-dependabot-alerts)

---

### 9. Package firewall

**Deck slide 19 · Public preview (GitHub Enterprise Cloud) · FanHub in a Codespace**

**Value:** An install-time policy gate between developers, CI, **and coding agents** and the public registries. It blocks malware, known-vulnerable versions, and too-new releases (cooldown) **before they run**.

**Where:** Enterprise settings (policy) plus a terminal (the block).

> ⚠️ **Run this in a Codespace or dev container**, not on a Microsoft corporate laptop. Corporate machines must use the Microsoft package feed proxy, and this demo points npm at the firewall instead. FanHub ships a [`.devcontainer`](./.devcontainer).

**Setup**

1. Enterprise admin: **Enterprise** → **Settings** → **Advanced Security** → **Package firewall**. Turn on the policies to show:
   - **Cooldown period** (for example, 7 days)
   - Block packages with GitHub Advisory Database **malware** or **vulnerability** advisories
   - Supply-chain checks (for example, attestation downgrades)
2. Open a Codespace on `MSBart2/FanHub` and add a token with access to the enterprise as the Codespace secret `GITHUB_TOKEN`.

**Walkthrough**

1. In the Codespace terminal, point npm at the firewall (replace `ENTERPRISE`):

   ```bash
   npm config set registry https://package-firewall.githubapp.com/npm/enterprises/ENTERPRISE
   npm config set //package-firewall.githubapp.com/npm/enterprises/ENTERPRISE/:_authToken '${GITHUB_TOKEN}'
   ```

2. Show that a normal install still works:

   ```bash
   cd node/backend && npm install
   ```

3. Find a version published inside the cooldown window, then try to install it:

   ```bash
   npm view <package> time --json | tail -5   # choose a version published in the last few days
   npm install <package>@<fresh-version>
   ```

   The install fails with a message like `blocked by package-firewall due to security policies (version cooldown)` and a **Request an override** URL.
4. Open the override URL. Show that the bypass request goes through the same approval flow as other GitHub Advanced Security exceptions.
5. **Agent angle:** in the same Codespace, run `copilot` and ask: *"add the latest `<package>` to node/backend."* The agent hits the same block. *"Agents install packages with no human in the loop. This is where the firewall matters most."*

**Never** demo with a real malicious package. Use the cooldown policy, or a known-vulnerable version if the advisory policy is enabled.

**Links:** [Changelog](https://github.blog/changelog/2026-10-20-github-package-firewall-in-public-preview/) · [Protecting endpoints with package firewall](https://docs.github.com/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/protecting-endpoints-with-package-firewall)

---

### 10. GitHub security extension for the Copilot app

**Deck slide 20 · Public preview · FanHub**

**Value:** Code scanning alerts inside the agent workspace. Find an alert, **Explain** or **Fix** it, and run `/security-review` on uncommitted changes, all without leaving the Copilot app.

**Where:** GitHub Copilot app (Security canvas) or Copilot CLI.

**Setup**

- In the Copilot app: **Customize** → search `github-security` → **+ Install**.
- Or in a terminal: `copilot plugin install github-security@awesome-copilot`.
- Clone FanHub locally and open a Copilot app session on that folder.

**Walkthrough**

1. In the FanHub session, open the **Security** canvas. Alerts **#3, #4, #5** appear, ordered by severity.
2. Select **#3 `js/missing-rate-limiting`** (`node/backend/src/routes/auth.js:131`) → **Explain**. Copilot describes the brute-force risk on the auth route.
3. Click **Fix**. Copilot edits **only the local working copy**. It doesn't commit or push. Review the diff in the app.
4. Show **linked pull requests** on an alert (useful right after Demo 7). *"Someone is already fixing this one."*
5. Catch a new issue **before a PR**. Introduce a risky change locally, for example in `node/backend/src/routes/characters.js`, build a SQL string with template-literal interpolation of `req.query.search`. Then run:

   ```text
   /security-review
   ```

   The finding appears next to the existing alerts. Undo it with `git restore node/backend/src/routes/characters.js`.
6. **Dismiss** an alert you don't plan to fix. If delegated dismissal is enabled, the request goes for approval.

**Watch for:** Explain, Fix, and `/security-review` use the selected model and consume AI credits. Browsing and dismissing don't.

**Links:** [Changelog](https://github.blog/changelog/2026-10-28-security-extension-for-the-github-copilot-app) · [View and fix security alerts](https://docs.github.com/copilot/how-tos/github-copilot-app/view-and-fix-security-alerts)

---

### 11. AI-detected secrets in push protection

**Deck slide 21 · Public preview · FanHub**

**Value:** Push protection now blocks secrets **that don't match any known pattern**, such as passwords and internal tokens. A context-aware classifier runs in the push path.

**Where:** Repository settings plus a terminal.

**Setup (FanHub currently has AI-detected secrets disabled)**

1. `MSBart2/FanHub` → **Settings** → **Advanced Security** → **Secret Protection**. Make sure **Push protection** is on (it already is), then turn on **AI-detected secrets** and **Block AI-detected secrets**.
2. Or across an org: **Security configurations** → custom config → set `secret_scanning_generic_secrets`, `secret_scanning_push_protection`, and `secret_scanning_generic_secrets_push_protection` to **enabled**.

**Walkthrough**

1. **Generate the fake credential at demo time.** Don't keep secret-shaped strings in this repository.

   ```powershell
   git switch -c demo/ai-secret
   $chars = [char[]]'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!#%'
   $pw = -join (1..22 | ForEach-Object { $chars | Get-Random })
   @"
   // Partner reporting service (internal, no vendor token format)
   module.exports = {
     reportingHost: 'reports.fanhub.internal',
     reportingUser: 'svc_fanhub_reports',
     reportingPassword: '$pw',
   };
   "@ | Set-Content node/backend/src/database/reporting.js
   git add node/backend/src/database/reporting.js
   git commit -m "demo: add reporting config"
   git push -u origin demo/ai-secret
   ```

2. The push is **rejected**. The output names the file and line of the AI-detected secret. *"No regex would recognize that string. The classifier caught it from context."*
3. Show the bypass options (if allowed) and explain that **agents must get authorization** before bypassing.
4. Clean up locally. Nothing reached GitHub:

   ```powershell
   git switch main
   git branch -D demo/ai-secret
   ```

**Watch for:** It's **off by default**, and enabling it in push protection consumes AI credits. AI-detected *alerts* from post-push scanning remain included with GHSP/GHAS.

**Links:** [Changelog](https://github.blog/changelog/2026-10-28-push-protection-beyond-predefined-secret-patterns) · [About push protection](https://docs.github.com/enterprise-cloud@latest/code-security/concepts/secret-security/push-protection)

---

## Suggested demo flows

Pick the flow that fits the customer's stated pressure point (deck slide 11).

| Customer priority | Flow | Time |
|---|---|---|
| **"Help developers do more"** | 4 Fusion (CLI) → 2 Projects → 3 Automations | ~20 min |
| **"Security backlog is out of control"** | 5 AI Scan → 7 Agentic autofix (batch) → 8 Reachability | ~15 min |
| **"Secure AI agents and the supply chain"** | 9 Package firewall → 11 AI-detected secrets → 10 Security extension | ~15 min |
| **"Commercial / adoption conversation"** | 1 GHE includes Copilot → 4 Fusion (admin model policy) → 3 Automations (cost limits) | ~12 min |
| **Executive overview** | 2 Projects → 7 Agentic autofix → 1 GHE includes Copilot | ~12 min |

**Story connector for the security flows:** *AI Scan finds it → Reachability tells you what matters → Agentic autofix fixes it → the security extension keeps new issues out → the package firewall and push protection stop risk at the door.*

---

## Reset after a demo

Run these so the next demo starts from the same alerts and a clean `main`:

```powershell
# Close Copilot-authored PRs from Demos 2 and 7 (review the list first)
gh pr list -R MSBart2/FanHub --author "app/copilot-swe-agent" --state open
gh pr list -R MSBart2/FanHub --author "app/copilot-swe-agent" --state open --json number --jq '.[].number' |
  ForEach-Object { gh pr close $_ -R MSBart2/FanHub --delete-branch }

# Unassign Copilot from code scanning alerts (Demo 7)
3,4,5 | ForEach-Object { '{"assignees":[]}' | gh api -X PATCH "repos/MSBart2/FanHub/code-scanning/alerts/$_" --input - }

# Discard local edits from Demos 4 and 10
git restore .
git switch main

# Close demo issues in the private mirror (Demo 3)
gh issue list -R <org>/FanHub-demo --label bug --state open
```

> If a demo PR is merged by accident, the alert closes. Revert the merge commit on `main` to bring the vulnerable code (and the alert) back. FanHub's bugs are intentional workshop material. See [BUGS.md](./BUGS.md).
