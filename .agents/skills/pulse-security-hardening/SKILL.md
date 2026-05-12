---
name: pulse-security-hardening
description: PULSE 전용 security hardening skill. Use when touching auth, environment variables, Kakao/OpenAI/Gemini/VEO/API integrations, file/image upload, user input, review text, AI prompt payloads, route protection, or when auditing .env tracking, dependency risk, XSS, prompt/data boundary safety, adapted from openai/skills security-best-practices and addyosmani security-and-hardening.
---

# Pulse Security Hardening

## Overview
PULSE는 외부 API, 지도 키, 리뷰 텍스트, 이미지 업로드, AI 생성 요청, 인증 우회 플래그를 다루므로 프론트엔드 변경도 보안 경계가 있다.

## Always Check

- `.env` must not be committed or printed.
- `.env.example` may contain placeholders only.
- `VITE_BYPASS_AUTH` and dev quick login flags must not be assumed safe in production.
- Kakao API keys and AI provider keys must come from environment variables.
- User-entered review text, prompts, store names, and influencer profile fields are untrusted data.
- Never use `dangerouslySetInnerHTML` for user or AI-generated content unless sanitized and justified.
- External API responses must be shape-checked before rendering important decisions.

## Workflow

1. Identify boundary:
   - auth/session
   - env/config
   - third-party API
   - user input
   - generated AI content
   - upload/media
2. Inspect implementation and `.env.example`; do not read `.env` contents unless the user explicitly asks and understands the risk.
3. Search for obvious leaks:
   - `api_key`, `secret`, `token`, `password`, `KAKAO`, `OPENAI`, `GEMINI`, `VEO`
4. Review rendering and form handling for XSS and validation issues.
5. Run dependency/security checks when appropriate:
   - `npm audit`
6. Report severity with concrete file paths and line numbers.

## PULSE-Specific Findings To Flag

- `.env` tracked by git.
- Route protection that relies only on frontend state.
- AI prompt text that includes private store data without consent.
- Public assets or build output containing secrets.
- Proposal accept tokens rendered or logged unnecessarily.
- Map/search API error messages exposing raw provider responses to users.

## Output Contract

Lead with high-risk findings. Include impact, evidence, fix, and verification command. Do not bury security issues in a summary.
