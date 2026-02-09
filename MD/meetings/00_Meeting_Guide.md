# 📝 MEETING NOTES OPERATION MANUAL

> **"Record to Remember, Decide to Act"**
> 회의록은 단순한 '받아적기'가 아니라, **'결정 사항을 확정하고 행동을 유발하는 트리거'**입니다.
> 모든 회의록은 **미래의 나(Future Self)**와 **팀원**이 문맥 없이 읽어도 이해할 수 있어야 합니다.

---

## 1. Core Principles (3대 작성 원칙)

### 🛑 Rule 1. Decision First (결정 우선)
* **논의 과정보다 결과가 중요합니다.** 누가 무슨 말을 했는지 나열하지 말고, **무엇이 결정되었는지**를 최상단에 명시하십시오.
* *Bad:* "A님이 버튼 색상에 대해 이야기함."
* *Good:* "**[결정]** 버튼 색상은 `#002B7A`로 변경하기로 확정함."

### 🔗 Rule 2. Action Oriented (행동 중심)
* **모든 회의는 '할 일'을 남겨야 합니다.** 회의가 끝났는데 Action Item이 없다면, 그 회의는 실패한 것입니다.
* 반드시 **[담당자]**와 **[기한]**을 명시하십시오.
* *Example:* `- [ ] 로그인 API 연동 (담당: @Backend, 기한: 11/30)`

### 📂 Rule 3. SSOT Alignment (진실의 원천 일치)
* 회의에서 기획이나 디자인이 변경되었다면, 회의록에만 남기지 말고 **반드시 원본 가이드(`about_pulse.md`, `design_guide.md`)를 업데이트**해야 합니다.
* 회의록은 '변경의 근거'일 뿐, '현재의 스펙'은 가이드 파일입니다.

---

## 2. File Naming Convention (파일 명명 규칙)

**"One Day, One File"** 원칙에 따라 하루의 모든 회의를 하나의 파일에 기록합니다.

* **Format:** `YYYYMMDD_Daily_Log.md`
* **Example:** `20231125_Daily_Log.md`

---

## 3. Workflow (작업 프로세스)

### Step 1. Preparation (준비)
* `01_Template.md`를 복사하여 `YYYYMMDD_Daily_Log.md` 파일을 생성합니다.
* 하루에 여러 회의가 있다면 `## 1. [회의명]`, `## 2. [회의명]` 형식으로 섹션을 구분하여 작성합니다.

### Step 2. Recording (기록)
* 회의 중에는 **키워드 위주**로 빠르게 기록합니다.
* 결정된 사항은 즉시 **Bold** 처리하거나 별도 섹션에 메모합니다.
* 녹음 파일을 함께 저장한다면 파일 경로를 링크합니다.

### Step 3. Refinement (정제)
* 회의 종료 후 30분 이내에 문장을 다듬고 정리합니다.
* **Action Item**을 `task.md` 또는 이슈 트래커로 이관합니다.
* 기획/디자인 변경 사항을 관련 가이드 문서(`design_guide.md` 등)에 반영합니다.

---

## 4. Structure (문서 구조)

모든 회의록은 아래 구조를 따릅니다. (템플릿 참조)

1.  **Meta Info**: 일시, 참석자, 태그
2.  **Summary**: 3줄 요약 (바쁜 사람을 위해)
3.  **Decisions**: 결정된 사항 (가장 중요)
4.  **Action Items**: 해야 할 일
5.  **Discussion**: 상세 논의 내용

---

> **⚠️ Critical Warning:**
> **"적자생존 (적는 자만이 살아남는다)"**
> 기록되지 않은 합의는 합의가 아닙니다. 나중에 딴소리가 나오지 않도록 명확하게 기록하십시오.
