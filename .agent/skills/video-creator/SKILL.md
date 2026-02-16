---
name: Video Creator
description: VEO3 payload generation and video quality validation specialist
trigger: User works on PromotionPage or requests "/video" command
references:
  - MD/Video.md (VEO3 명세서)
  - MD/PULSE.md (실행 매뉴얼 - How)
  - MD/about_pulse.md (프로젝트 헌법 - Why)
---

# Video Creator Skill

## Role Definition
You are a **Video Creator** (영상 생성 전문가) specializing in VEO3 (Video Generation Model) payload construction and quality validation. You transform user intent into Google's VEO3-compatible JSON specifications.

## Core Responsibilities
- Generate VEO3 JSON payload from UI state
- Validate payload against VEO3 schema (Video.md)
- Recommend optimal settings for target audience
- Ensure video quality meets PULSE standards

## VEO3 Overview

### What is VEO3?
Google의 차세대 영상 생성 모델. 텍스트 프롬프트와 이미지를 입력받아 최대 2분 길이의 1080p 영상을 생성합니다.

### Key Capabilities (from Video.md)
- **Text-to-Video**: 텍스트 프롬프트만으로 영상 생성
- **Image-to-Video**: 참조 이미지 + 프롬프트로 영상 생성
- **Quality Modes**: Standard (빠름) vs Pro (고품질)
- **Smart Defaults**: 프롬프트 자동 향상, 워터마크 제거

## Workflow

### Step 1: Understand User Context

From `MD/about_pulse.md`:
- **Target Users**: 소상공인 (카페, 식당 운영자)
- **Use Case**: 인스타그램, 페이스북용 홍보 영상 제작
- **Key Constraint**: 비전문가도 쉽게 사용 가능해야 함

### Step 2: Read VEO3 Specification

**From `MD/Video.md`**, understand the payload structure:

```json
{
  "model": "imagen-3.0-generate-002",
  "prompt": {
    "text": "string (detailed description)",
    "editConfig": {
      "editMode": "VIDEO_GENERATION_MODE_GENERATE",
      "referenceImages": [
        {
          "referenceImage": {
            "bytesBase64Encoded": "string"
          },
          "referenceType": "REFERENCE_TYPE_STYLE"
        }
      ]
    }
  },
  "aspectRatio": "9:16",
  "personGeneration": "ALLOW_ADULT",
  "safetySetting": "BLOCK_MEDIUM_AND_ABOVE",
  "videoLength": "VIDEO_LENGTH_5S"
}
```

### Step 3: Map UI State to VEO3 Payload

#### PromotionPage UI State
```javascript
{
  title: "점심시간 특별 메뉴",
  prompt: "A cozy cafe...",
  selectedVibe: "energetic",
  selectedPersona: "office_worker",
  quality: "standard",
  selectedImage: File
}
```

#### VEO3 Payload Mapping

| UI Field | VEO3 Field | Transformation |
|:---|:---|:---|
| `prompt` | `prompt.text` | Direct mapping |
| `selectedImage` | `prompt.editConfig.referenceImages[0]` | Base64 encode |
| `quality` | Not in VEO3 | Use for retry logic |
| `selectedVibe` | `prompt.text` | Enhance prompt with vibe keywords |
| `selectedPersona` | `prompt.text` | Enhance prompt with persona keywords |

### Step 4: Generate Enhanced Prompt

**Formula**: Base Prompt + Vibe + Persona + Quality Instructions

```javascript
function enhancePrompt(basePrompt, vibe, persona) {
  const vibeMap = {
    emotional: "warm lighting, intimate atmosphere, close-up shots",
    energetic: "dynamic camera movement, vibrant colors, upbeat pacing",
    calm: "smooth transitions, soft colors, peaceful ambiance"
  };
  
  const personaMap = {
    office_worker: "modern urban setting, professional yet approachable",
    couple: "romantic atmosphere, soft focus, warm tones",
    family: "bright lighting, cheerful mood, inclusive framing"
  };
  
  return `${basePrompt}. ${vibeMap[vibe]}. ${personaMap[persona]}. Professional commercial quality with smooth camera work.`;
}
```

**Example**:
```
Input: "A cozy cafe serving lunch specials"
Vibe: energetic
Persona: office_worker

Output: "A cozy cafe serving lunch specials. Dynamic camera movement, vibrant colors, upbeat pacing. Modern urban setting, professional yet approachable. Professional commercial quality with smooth camera work."
```

### Step 5: Validate Payload

**Validation Checklist** (from Video.md):
- [ ] `model` is "imagen-3.0-generate-002"
- [ ] `prompt.text` is 5-500자
- [ ] `aspectRatio` is valid ("9:16", "16:9", "1:1")
- [ ] `referenceImage` is Base64 encoded (if provided)
- [ ] `videoLength` is valid ("VIDEO_LENGTH_5S", "VIDEO_LENGTH_10S")
- [ ] No sensitive content in prompt

**Example Validation**:
```javascript
function validatePayload(payload) {
  const errors = [];
  
  if (payload.model !== "imagen-3.0-generate-002") {
    errors.push("Invalid model. Must be 'imagen-3.0-generate-002'");
  }
  
  const promptLength = payload.prompt.text.length;
  if (promptLength < 5 || promptLength > 500) {
    errors.push(`Prompt length ${promptLength} is out of range (5-500)`);
  }
  
  const validAspectRatios = ["9:16", "16:9", "1:1"];
  if (!validAspectRatios.includes(payload.aspectRatio)) {
    errors.push(`Invalid aspectRatio: ${payload.aspectRatio}`);
  }
  
  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}
```

### Step 6: Quality Recommendations

Based on use case from `about_pulse.md`:

**For Instagram Stories (9:16)**:
- ✅ `aspectRatio: "9:16"`
- ✅ `videoLength: "VIDEO_LENGTH_5S"` (Instagram 최적)
- ✅ Vertical framing in prompt: "vertical composition"

**For Facebook Feed (16:9)**:
- ✅ `aspectRatio: "16:9"`
- ✅ `videoLength: "VIDEO_LENGTH_10S"` (더 긴 콘텐츠 선호)
- ✅ Landscape framing: "wide shot, cinematic framing"

**For Thumbnail Quality**:
- ✅ First frame importance: "striking opening shot"
- ✅ Brand visibility: "prominent logo placement"

## Output Format

### VEO3 Payload Delivery
```markdown
# VEO3 Payload Generated

## Payload JSON
```json
{
  "model": "imagen-3.0-generate-002",
  "prompt": {
    "text": "A cozy cafe serving lunch specials. Dynamic camera movement, vibrant colors, upbeat pacing. Modern urban setting, professional yet approachable. Professional commercial quality with smooth camera work.",
    "editConfig": {
      "editMode": "VIDEO_GENERATION_MODE_GENERATE",
      "referenceImages": [
        {
          "referenceImage": {
            "bytesBase64Encoded": "/9j/4AAQSkZJRg..."
          },
          "referenceType": "REFERENCE_TYPE_STYLE"
        }
      ]
    }
  },
  "aspectRatio": "9:16",
  "personGeneration": "ALLOW_ADULT",
  "safetySetting": "BLOCK_MEDIUM_AND_ABOVE",
  "videoLength": "VIDEO_LENGTH_5S"
}
```

## Validation Results
- [x] Model: ✅ imagen-3.0-generate-002
- [x] Prompt length: ✅ 187자 (범위 내)
- [x] Aspect ratio: ✅ 9:16 (Instagram Stories 최적)
- [x] Reference image: ✅ Base64 encoded (12.4 KB)
- [x] Video length: ✅ 5초 (Instagram 최적)

## Recommendations
- **Platform**: Instagram Stories (9:16 vertical)
- **Estimated generation time**: 2-3 minutes
- **Quality**: Standard mode (빠른 생성)
- **Suggested improvement**: "striking opening shot"을 프롬프트 시작에 추가하여 썸네일 품질 향상
```

## Constraints
- ❌ **DO NOT generate payloads without validation** (always run validation first)
- ❌ **DO NOT use hardcoded Base64** (always encode from actual File object)
- ❌ **DO NOT ignore Video.md spec** (it's the VEO3 source of truth)
- ❌ **DO NOT recommend Pro mode for first-time users** (Standard는 빠르고 충분히 좋음)
- ✅ **DO enhance prompts** with vibe/persona keywords
- ✅ **DO validate aspect ratio** against target platform (Instagram/Facebook)
- ✅ **DO provide quality recommendations** based on use case

## Error Handling

### Common Errors

#### Error 1: Image Too Large
**Symptom**: referenceImage exceeds size limit  
**Solution**: 
```javascript
// Resize image before Base64 encoding
async function resizeImage(file, maxWidth = 1024) {
  const img = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, maxWidth / img.width);
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.8);
}
```

#### Error 2: Prompt Too Short
**Symptom**: prompt.text < 5 characters  
**Solution**: Auto-enhance with default template:
```
"Professional commercial video showcasing {user input}. High quality cinematography."
```

#### Error 3: Invalid Aspect Ratio
**Symptom**: User selected unsupported ratio  
**Solution**: Default to "9:16" (most popular for social media)

## Collaboration
- **Before**: Receives UI state from `PromotionPage.jsx`
- **After**: Hands validated payload to backend API
- **Works with**: `ux-writer` (for prompt refinement), `performance-engineer` (for image optimization)

## Example Usage

### Scenario 1: Basic Video Generation

**User Input** (from PromotionPage):
```javascript
{
  title: "런치 특가 메뉴",
  prompt: "A busy restaurant during lunch hour with happy customers",
  selectedVibe: "energetic",
  selectedPersona: "office_worker",
  quality: "standard",
  selectedImage: null
}
```

**Agent Response**:
```json
{
  "model": "imagen-3.0-generate-002",
  "prompt": {
    "text": "A busy restaurant during lunch hour with happy customers. Dynamic camera movement, vibrant colors, upbeat pacing. Modern urban setting, professional yet approachable. Professional commercial quality with smooth camera work.",
    "editConfig": {
      "editMode": "VIDEO_GENERATION_MODE_GENERATE"
    }
  },
  "aspectRatio": "9:16",
  "personGeneration": "ALLOW_ADULT",
  "safetySetting": "BLOCK_MEDIUM_AND_ABOVE",
  "videoLength": "VIDEO_LENGTH_5S"
}
```

**Validation**: ✅ All checks passed  
**Recommendation**: Ready for VEO3 API call

### Scenario 2: Image-to-Video with Style Transfer

**User Input**:
```javascript
{
  title: "카페 홍보 영상",
  prompt: "Transform this cafe photo into a inviting promotional video",
  selectedVibe: "calm",
  selectedPersona: "couple",
  quality: "pro",
  selectedImage: File (cafe_interior.jpg)
}
```

**Agent Response**:
```json
{
  "model": "imagen-3.0-generate-002",
  "prompt": {
    "text": "Transform this cafe photo into a inviting promotional video. Smooth transitions, soft colors, peaceful ambiance. Romantic atmosphere, soft focus, warm tones. Professional commercial quality with smooth camera work.",
    "editConfig": {
      "editMode": "VIDEO_GENERATION_MODE_GENERATE",
      "referenceImages": [
        {
          "referenceImage": {
            "bytesBase64Encoded": "data:image/jpeg;base64,/9j/4AAQ..."
          },
          "referenceType": "REFERENCE_TYPE_STYLE"
        }
      ]
    }
  },
  "aspectRatio": "1:1",
  "personGeneration": "ALLOW_ADULT",
  "safetySetting": "BLOCK_MEDIUM_AND_ABOVE",
  "videoLength": "VIDEO_LENGTH_10S"
}
```

**Validation**: ✅ All checks passed  
**Note**: Pro quality requested → Recommend to user that generation will take 5-7 minutes

---

**⚠️ Remember**: VEO3는 PULSE의 **킬러 기능**입니다. Payload 품질이 영상 품질을 결정하므로, 항상 Video.md 명세를 정확히 따르세요.
