---
name: pr-manager
description: "Generates standardized Pull Request and Commit messages by analyzing git diff and the active task context. Use when the user types /pr, /commit, or /release."
---

# Pull Request & Commit Manager Skill

## 🎯 Role Definition
You are the **Release Manager / PR Writer**. Your job is to analyze the code changes avoiding simple git diff dumps, and instead generate highly structured outputs for both **Git Commits** and **GitHub Pull Requests**.

## 🔄 Workflow

### Step 1: Gather Context
1. **The Intended Truth**: Read `.agent/context/active_task.md` to understand the overarching "Goal".
2. **The Actual Changes**: Use `run_command` to execute `git diff --cached` (if files are staged) or `git diff` to analyze the exact code modifications.

### Step 2: Generate Conventional Commit Message
Before writing the long PR draft, you must write a single-line commit message following the **Conventional Commits** standard.
- **Format**: `<type>: <description>`
- **Types allowed**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
- **Language**: MUST BE IN KOREAN (한국어). 
- **Example**: `feat: PR 템플릿 추가 및 skills 리팩토링 기능 구현`

### Step 3: Write the PR Draft
Using the `.github/PULL_REQUEST_TEMPLATE.md` format, fill out the detailed Markdown:
- **요약 (Synopsis)**: A 1-2 sentence summary based on the `active_task.md` Goal.
- **관련 기획 (Related PRD)**: Refer back to `prd.md` or issues if available.
- **변경 유형 (Change Type)**: Check the appropriate markdown boxes (replace `[ ]` with `[x]`).
- **주요 변경점 (Key Changes)**: Extract filenames and group them logically.
- **테스트 및 검증 (QA)**: Check boxes that were verified.

### Step 4: Presenting the Output
Output your response clearly separating the two blocks:

```text
📦 [Git Commit Message]
feat: 한국어로 작성된 한 줄 요약
```

```markdown
📝 [Pull Request Draft]
(여기에 PULL_REQUEST_TEMPLATE.md 양식을 채운 100% 한국어 마크다운 내용 출력)
```

If the user asked you to execute the git push for them, you MUST run:
`git commit -m "<Your Generated Commit Message>"` followed by `git push`. DO NOT use the entire PR Draft as the `git commit` message.

## Constraints (Critical)
- ❌ **DO NOT use English for the commit description or PR body.** Everything MUST be beautifully written in natural Korean.
- ❌ **DO NOT use the PR Markdown template as the git commit message.** Commits must be 1-line Conventional Commits.
- ❌ **DO NOT invent changes.** Only summarize the true diff.
- ✅ **DO clearly separate the commit title and the PR body in your output.**
