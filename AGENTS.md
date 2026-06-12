<!-- BEGIN:nextjs-agent-rules -->
# Agent Instructions — Project overview

This repository uses a custom Next.js variant with breaking changes and project conventions that differ from public examples. Agent-specific instruction files live in the `docs/` folder and provide authoritative guidance for LLMs acting on this repository.

Primary documents:

- docs/clerk-auth.md — Clerk authentication rules and implementation notes
- docs/shadcn-ui.md — shadcn UI usage guidelines and rules
- docs/shadcn-ui.md — shadcn UI usage guidelines and rules

When acting in this repository, agents MUST follow the guidelines in those documents. Quick summary rules (enforced by the docs):


Read the in-repo Next.js docs referenced in `node_modules/next/dist/docs/` when implementing framework-level changes.

If you need to add or change agent guidance, update the relevant `docs/*.md` file and add one-line changelog entries at the top of this file.

Generated: This file points to the canonical agent instruction pages in `docs/` and should be the first file an LLM reads when contributing to this repo.
<!-- END:nextjs-agent-rules -->

```markdown
<!-- BEGIN:nextjs-agent-rules -->
# Agent Instructions — Project overview

- Changelog: 2026-06-12 — Added docs/clerk-auth.md (Clerk auth rules)
- Changelog: 2026-06-12 — Added docs/shadcn-ui.md (shadcn UI rules)

This repository uses a custom Next.js variant with breaking changes and project conventions that differ from public examples. Agent-specific instruction files live in the `docs/` folder and provide authoritative guidance for LLMs acting on this repository.

Primary documents:

- docs/clerk-auth.md — Clerk authentication rules and implementation notes

For detailed guidlines on specific topic refer to the modular documentation in the '/docs' directory. ALWAYS refer to the relevent .md file .md file BEFORE generating any code : 

When acting in this repository, agents MUST follow the guidelines in those documents. Quick summary rules (enforced by the docs):

- Always run the todo-list workflow at task start. Use the project's `manage_todo_list` tool to create and update progress items.
- Use concise preambles before running any automated edits or tools explaining what will be done next (1–2 sentences).
- Make minimal, surgical changes: fix root causes, avoid reformatting unrelated files, and preserve public APIs.
- Add or update tests for non-trivial code changes and run existing tests when possible.
- Do not add secrets or credentials to the repo. Use environment variables and document any env requirements in `.env.example` or `README.md`.
- Follow the `docs/` guidelines for commit messages and PR descriptions.

Read the in-repo Next.js docs referenced in `node_modules/next/dist/docs/` when implementing framework-level changes.

If you need to add or change agent guidance, update the relevant `docs/*.md` file and add one-line changelog entries at the top of this file.

---
Generated: This file points to the canonical agent instruction pages in `docs/` and should be the first file an LLM reads when contributing to this repo.
<!-- END:nextjs-agent-rules -->

```
