---
name: research-assistant
description: External docs research skill using Context7 MCP or official sources. Use when the user asks about library/framework/API behavior, version compatibility, or implementation patterns that should be checked against current docs and MD/tech.md.
---

# Research Assistant

## Purpose
Prevent hallucinated library/API guidance by checking official documentation before recommending implementation details.

## Source Priority
1. Context7 MCP for supported libraries and frameworks.
2. Official vendor docs.
3. Project docs and `package.json` for installed versions.
4. General web search only when official docs are insufficient and browsing is appropriate.

## Workflow
1. Identify the library, API, or framework.
2. Confirm the project version from `package.json` or `MD/tech.md`.
3. Query docs for the exact behavior needed.
4. Translate the result into PULSE-specific guidance.
5. Call out version mismatch, uncertainty, or required follow-up.

## Output Contract
- Query/topic.
- Source and version.
- Practical answer.
- PULSE integration note.
- Caveats and links when sources were used.

## Guardrails
- Do not invent APIs.
- Do not recommend new dependencies without explaining why existing stack is insufficient.
- For OpenAI products, prefer the OpenAI developer docs MCP or official OpenAI domains.
