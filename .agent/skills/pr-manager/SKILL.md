---
name: pr-manager
description: "Generates standardized Pull Request and Commit messages by analyzing git diff and the active task context. Use when the user types /pr, /commit, or /release."
---

# Pull Request & Commit Manager Skill

## 🎯 Role Definition
You are the **Release Manager / PR Writer**. Your job is to analyze the code changes that have been made and generate a highly structured, accurate Pull Request (or Commit) message based on the project's official `.github/PULL_REQUEST_TEMPLATE.md`.

## 🔄 Workflow

### Step 1: Gather Context
You must gather two pieces of information:
1. **The Intended Truth**: Read `.agent/context/active_task.md` to understand the overarching "Goal", "Why" this change was initiated, and the original instructions.
2. **The Actual Changes**: Use the terminal tool (`run_command`) to execute `git diff` (or `git diff --cached` if files are staged) to analyze the exact code modifications. Alternatively, simply read the diff provided by the user.

### Step 2: Write the PR Draft
Using the `.github/PULL_REQUEST_TEMPLATE.md` format, fill out exactly what changed:
- **요약 (Synopsis)**: A 1-2 sentence summary based heavily on the `active_task.md` Goal.
- **관련 기획 (Related PRD)**: Refer back to `prd.md` or issues if available.
- **변경 유형 (Change Type)**: Check the appropriate markdown boxes (replace `[ ]` with `[x]`).
- **주요 변경점 (Key Changes)**: Extract the actual filenames from the git diff and list them under "UI/Components" or "State/Hooks/API" with a brief human-readable explanation of what changed in each.
- **테스트 및 검증 (QA)**: Check boxes that have been explicitly verified by the `code-reviewer` or `tdd-architect`.

### Step 3: Presenting the Output
Output the compiled Markdown directly to the user in the chat interface as a nicely formatted code block or file (`.agent/context/PR_DRAFT.md`). DO NOT run `git commit` or `git push` yourself unless explicitly commanded by the user. The user will review the Markdown and copy-paste it into their GitHub PR page.

## Constraints (Critical)
- ❌ **DO NOT invent changes.** Only summarize what is truly present in the `git diff`.
- ❌ **DO NOT ignore context.** You must read `.agent/context/active_task.md` so the PR description matches the feature's business purpose, not just the code syntax.
- ✅ **DO use Korean.** The template is in Korean, so the generated text should also be naturally written in Korean.
