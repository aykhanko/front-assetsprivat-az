<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Rules

### General
- Always understand the existing architecture before making changes.
- Make the smallest possible change to solve the problem.
- Never rewrite files unnecessarily.
- Reuse existing utilities and components.
- Keep code style consistent with the project.

---

## Token Optimization

To reduce token usage:

- Read only files that are required.
- Never scan the whole repository unless explicitly requested.
- Do not summarize large files unless asked.
- Avoid repeating code already shown.
- When editing:
  - Read only the affected file.
  - Return only changed code.
- Avoid explaining obvious code.
- Keep responses concise.
- Do not regenerate unchanged files.
- Do not restate the prompt.

---

## Coding Standards

- Follow existing folder structure.
- Follow existing naming conventions.
- Keep components small.
- Prefer composition over duplication.
- Remove dead code if encountered.
- Do not introduce new dependencies unless requested.

---

## Before Editing

Always:

1. Understand the task.
2. Find the minimum affected files.
3. Modify only what is necessary.
4. Check imports.
5. Check TypeScript types.
6. Preserve formatting.

---

## Git Commit

Whenever code changes are completed, generate a commit message.

Format:

<type>: <short description>

Examples:

feat: add property status dashboard
fix: resolve login redirect issue
refactor: simplify auth middleware
docs: update deployment guide
style: format dashboard components
test: add auth integration tests
chore: update dependencies

If multiple logical changes exist, suggest multiple commits.

---

## Response Style

- Be concise.
- No unnecessary explanations.
- Prefer bullet points.
- Show only relevant code.
- Do not include unchanged code.

---

## Priority

Priority order:

1. Correctness
2. Minimal changes
3. Readability
4. Performance
5. Token efficiency

---

## Commit Checklist

Before generating commit message ensure:

- Code compiles.
- Imports are correct.
- No unused variables.
- No debug logs.
- No commented dead code.
- Commit message generated.

## Conventional Commits

Use one of:

- feat
- fix
- refactor
- docs
- chore
- style
- perf
- test
- ci
- build

Examples:

feat(auth): add JWT refresh endpoint
fix(api): handle null property owner
refactor(ui): split dashboard cards

## Do Not

- Do not modify unrelated files.
- Do not rename files unless required.
- Do not change formatting of untouched code.
- Do not upgrade dependencies unless requested.
- Do not add comments explaining obvious code.