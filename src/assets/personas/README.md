# Persona Avatars

이 디렉토리는 페르소나 아바타 이미지를 관리합니다.

## 사용 방법

### 1. DiceBear API 사용 (현재 적용)

밝고 친근한 표정의 아바타를 제공하는 무료 API입니다.

```javascript
import { getPersonaAvatar } from './personaAvatars';

// 프리셋 사용
const avatar = getPersonaAvatar('youngProfessional');

// 커스텀 옵션
const customAvatar = getPersonaAvatar('youngProfessional', {
  backgroundColor: 'fef3c7',
  mood: 'happy'
});
```

### 2. 사용 가능한 스타일

- **adventurer**: 밝고 친근한 캐릭터 (현재 사용 중)
- **avataaars**: 다양한 표정
- **big-smile**: 큰 미소
- **open-peeps**: 친근한 일러스트
- **personas**: 다양한 페르소나

### 3. 프리셋 목록

- `youngProfessional`: 미식가 직장인 (여성, 노란색 배경)
- `middleAged`: 이자카야 애호가 (남성, 파란색 배경)
- `youngCouple`: 미식가 커플 (여성, 핑크색 배경)
- `serviceOriented`: 서비스 중시형 (여성, 보라색 배경)
- `casual`: 가성비 직장인 (남성, 초록색 배경)

### 4. API 연동 시

실제 API에서 페르소나 데이터를 받을 때:

```javascript
// API 응답 예시
{
  "persona": {
    "id": 1,
    "type": "youngProfessional",  // 프리셋 이름
    "nickname": "시원 국물파",
    // ... 기타 데이터
  }
}

// 아바타 URL 생성
const avatarUrl = getPersonaAvatar(persona.type);
```

### 5. 커스텀 이미지 저장

만약 직접 제작한 일러스트를 사용하려면:

1. 이 디렉토리에 이미지 파일 저장 (예: `persona-1.png`)
2. `personaAvatars.js`에 경로 추가:

```javascript
export const CUSTOM_AVATARS = {
  youngProfessional: '/src/assets/personas/persona-1.png',
  // ...
};
```

## 참고

- DiceBear API 문서: https://www.dicebear.com/
- 모든 아바타는 밝은 표정(`mood=happy`)으로 설정됨
- 배경색은 각 페르소나 특성에 맞게 설정됨
