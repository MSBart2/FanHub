---
name: prompt-to-skill
description: "Convert an existing .prompt.md file into a reusable, auto-discoverable Agent Skill. Use when asked to promote, upgrade, or convert a prompt to a skill, or to make a prompt reusable as a skill."
agent: agent
---

Follow the **make-template-skill** skill for all structure, frontmatter rules, validation checklist, and directory conventions.

Convert `.github/prompts/${input:promptName}.prompt.md` into a well-structured, auto-discoverable skill at `.github/skills/${input:promptName}/SKILL.md`.

## Step 1 — Read the source prompt

Read `.github/prompts/${input:promptName}.prompt.md` in full before proceeding.

Then classify the source prompt as one of:

- **Workflow prompt** — a repeatable task or review process (e.g. a data checker, linter, reviewer). Logic should be preserved verbatim.
- **Plan prompt** — a concrete implementation plan for a specific entity or feature (e.g. adding a Lore page). Logic must be **generalized** into a reusable pattern before writing the skill.

## Step 2 — Craft the SKILL.md frontmatter

Using the **make-template-skill** description guidelines:

- `name`: use `${input:promptName}` (must match folder name exactly)
- `description`: 2–4 sentences that are keyword-rich and include:
  - Synonyms and verb forms of the core action
  - Domain entity types the skill operates on (use generic terms like "entity", "model", "page" for plan prompts)
  - ≥5 trigger phrases a team member might naturally type
  - Clear WHAT + WHEN structure

## Step 3 — Write the SKILL.md body

Include these sections (per make-template-skill conventions):

1. **`## When to use this skill`** — ≥5 concrete trigger phrases
2. **`## Prerequisites`** — any required files, MCP servers, or context the agent needs before starting; for plan prompts, note that the invoker must supply entity name and field definitions
3. **`## Procedure`** — the core logic section, written as follows depending on prompt type:
   - **Workflow prompt**: copy every instruction, step, rule, and condition verbatim
   - **Plan prompt**: replace all entity-specific names (e.g. `Lore`, `lores`, `LoreDto`, `/lore`) with `${entityName}` placeholders; replace hardcoded field lists with a note to infer fields from context; preserve the phase/step structure and all architectural decisions as general rules
4. **`## Output template`** — if the source produces structured output (status fields, tables, file lists), reproduce the format with placeholders
5. **`## MCP tools`** — if the skill queries live data, list relevant tools with a one-line description of when each is used

## Step 4 — Create the skill file

Write the complete, validated skill to `.github/skills/${input:promptName}/SKILL.md`.

Run through the make-template-skill **Validation Checklist** before finishing.

## Step 5 — Confirm

Report:

- **Preserved**: what instructions/logic were carried over unchanged
- **Added**: what structure, triggers, or templates were introduced and why
- **Validation**: checklist pass/fail summary
