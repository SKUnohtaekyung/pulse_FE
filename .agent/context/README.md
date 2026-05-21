# PULSE Agent Context

`.agent/context`는 현재 작업 handoff만 담는 공간입니다. 프로젝트 skill 정본은 `.agents/skills/`입니다.

## Current Files

- `active_task.md`: 현재 목표, 상태, 다음 실행 agent.
- `current_plan.md`: 현재 작업의 우선순위와 검증 기준.
- `current_pr_draft.md`: 현재 diff 기준 PR 초안 상태.
- `archive/`: 지난 작업 계획, PR 초안, walkthrough.

## Rules

- 새 작업을 시작할 때는 `active_task.md`를 먼저 갱신합니다.
- 긴 실행 계획은 `current_plan.md` 하나로 통합합니다.
- 완료된 작업 문서는 최상위에 남기지 말고 `archive/`로 이동합니다.
- `.env` 내용, 토큰, API 키는 이 폴더에 기록하지 않습니다.
