# 🤝 협상 시뮬레이터 (Negotiation Simulator)

**AI와 함께하는 실전 협상 연습 플랫폼**

Claude AI 기반의 현실적인 NPC와 대화하며 협상 스킬을 체계적으로 향상시킬 수 있는 게임형 학습 플랫폼입니다.

## 🌐 배포 링크

> https://generativeai-3bf99.web.app/

---

## ✨ 주요 개발 기능

### 🎮 게임형 인터랙티브 UI
- **Phaser 3 게임 엔진**: 2D 게임 기반의 몰입감 있는 협상 환경
- **실시간 캐릭터 애니메이션**: NPC의 감정 변화를 시각적으로 표현
- **다이나믹한 배경**: 시나리오별 맞춤 배경 및 분위기 연출
- **사운드 효과**: 메시지 전송, 성공, 실패 등 인터랙티브 오디오 피드백

### 🤖 AI 기반 학습 지원
- **AI 응답 선택지 시스템**: 막막할 때 AI가 3가지 전략적 응답 추천 (최대 3회)
- **실시간 메시지 피드백**: 각 발언에 대한 즉각적인 평가 (탁월/좋음/보통/미흡)
- **감정 상태 추적**: NPC의 호감도와 감정 변화를 실시간 모니터링
- **별점 평가 시스템**: 협상 진행도에 따른 5단계 별점 표시

### 📊 협상 분석 & 성장 추적
- **종합 협상 분석**: 100점 만점 기준 상세 성과 평가
- **강점/약점 분석**: AI가 분석한 당신의 협상 스타일
- **맞춤형 개선 제안**: 실력 향상을 위한 구체적인 팁 제공
- **대화 기록 저장**: 과거 협상 내역을 LocalStorage에 자동 저장
- **진행률 추적**: 로딩 프로그레스 바로 각 단계별 진행 상황 확인

### 🎯 다양한 협상 시나리오
- **5가지 실전 시나리오**: 연봉협상, 계약협상, 프로젝트 관리 등
- **난이도 시스템**: 초급/중급/고급으로 단계적 학습
- **맞춤형 NPC**: 각 시나리오별 특화된 성격과 협상 스타일

---

## 🛠️ 기술 스택

### Frontend
- **React 19**: 최신 React로 구현된 사용자 인터페이스
- **Phaser 3**: 2D 게임 엔진 기반 인터랙티브 UI
- **Vite**: 빠른 개발 서버 및 빌드 도구
- **React Router v7**: SPA 라우팅 관리
- **Axios**: HTTP 클라이언트

### Backend
- **Node.js + Express 5**: RESTful API 서버
- **Claude AI (Sonnet 3.5)**: Anthropic의 최신 AI 모델
- **@anthropic-ai/sdk**: Claude API 통합

### Storage
- **LocalStorage**: 클라이언트 측 대화 기록 저장
- **Session Management**: 실시간 협상 세션 관리

---

## 📂 프로젝트 구조

```
negotiation-simulator/
├── client/                          # React 프론트엔드
│   ├── src/
│   │   ├── components/             # 재사용 가능한 컴포넌트
│   │   │   ├── PhaserGame.jsx      # Phaser 게임 컴포넌트
│   │   │   ├── StarRating.jsx      # 별점 평가 UI
│   │   │   ├── AchievementToast.jsx # 업적 알림
│   │   │   └── ...
│   │   ├── pages/                  # 페이지 컴포넌트
│   │   │   ├── HomePage.jsx
│   │   │   ├── ScenarioListPage.jsx
│   │   │   ├── NegotiationPagePhaser.jsx  # 메인 협상 페이지
│   │   │   └── HistoryPage.jsx     # 대화 기록 페이지
│   │   ├── scenes/                 # Phaser 게임 씬
│   │   │   └── GameScene.js        # 메인 게임 씬
│   │   ├── services/               # 서비스 레이어
│   │   │   ├── api.js              # API 통신
│   │   │   ├── localStorage.js     # 로컬 저장소 관리
│   │   │   └── soundManager.js     # 사운드 관리
│   │   └── App.jsx
│   └── package.json
│
└── server/                          # Node.js 백엔드
    ├── src/
    │   ├── controllers/            # 비즈니스 로직
    │   │   ├── conversationController.js
    │   │   └── scenarioController.js
    │   ├── routes/                 # API 라우트
    │   │   ├── conversation.js     # 대화 API
    │   │   └── scenario.js         # 시나리오 API
    │   ├── services/               # 외부 서비스 연동
    │   │   └── claudeService.js    # Claude AI 통합
    │   ├── models/                 # 데이터 모델
    │   │   └── scenarios.js        # 시나리오 데이터
    │   └── index.js                # 서버 엔트리포인트
    └── package.json
```

---

## 🎮 주요 화면 구성

### 1️⃣ 홈 화면
- 프로젝트 소개 및 시작 버튼
- 주요 기능 설명

### 2️⃣ 시나리오 선택
- 5가지 협상 시나리오 카드
- 난이도 표시 (초급/중급/고급)
- 각 시나리오의 목표 및 팁 제공

### 3️⃣ 협상 게임 화면
- **좌측**: NPC 캐릭터 애니메이션 (감정 상태 반영)
- **중앙**: 대화 내용 표시 영역
- **우측**: 감정 상태 바, 별점 표시
- **하단**: 메시지 입력 버튼
- **피드백 패널**: 실시간 메시지 평가

### 4️⃣ 협상 결과 화면
- 100점 만점 협상 점수
- 별점 평가 (1-5점)
- 최종 호감도 게이지
- 강점/약점 분석
- 개선 제안 목록
- 대화 저장 버튼

### 5️⃣ 기록 페이지
- 과거 협상 내역 목록
- 각 기록별 점수 및 주요 피드백
- 다시 연습하기 버튼
- 기록 삭제 기능

---

## 🚀 시작하기

> 📘 **상세한 설정 가이드는 [SETUP_GUIDE.md](./SETUP_GUIDE.md)를 참고하세요.**

### 📋 필수 요구사항

- **Node.js** 18 이상
- **npm** 또는 **yarn**
- **Claude API 키** ([Anthropic Console](https://console.anthropic.com/)에서 발급)

### 설치 방법

1. **저장소 클론**
```bash
git clone <repository-url>
cd negotiation-simulator
```

2. **서버 설정**
```bash
cd server
npm install
```

3. **환경 변수 설정**
`.env.example` 파일을 `.env`로 복사하고 필요한 값을 입력:
```bash
cp .env.example .env
```

`.env` 파일 내용:
```env
PORT=3000
NODE_ENV=development

# Claude AI API Key (필수)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Firebase Configuration
FIREBASE_PROJECT_ID=your_project_id

CLIENT_URL=http://localhost:5173
```

> 💡 Firebase Admin SDK 인증은 `firebase-service-account.json` 파일을 server/ 폴더에 저장하는 것을 권장합니다.

4. **클라이언트 설정**
```bash
cd ../client
npm install
```

클라이언트 환경 변수 설정:
```bash
cp .env.example .env
```

`.env` 파일 내용:
```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> 💡 Firebase 설정 값은 [Firebase Console](https://console.firebase.google.com/)의 프로젝트 설정에서 확인할 수 있습니다.

### 실행 방법

1. **서버 실행** (터미널 1)
```bash
cd server
npm run dev
```
서버가 `http://localhost:3000`에서 실행됩니다.

2. **클라이언트 실행** (터미널 2)
```bash
cd client
npm run dev
```
클라이언트가 `http://localhost:5173`에서 실행됩니다.

3. 브라우저에서 `http://localhost:5173` 접속

---

## 📡 API 엔드포인트

### 🎯 시나리오 API
| Method | Endpoint | 설명 |
|--------|----------|------|
| `GET` | `/api/scenarios` | 모든 시나리오 조회 |
| `GET` | `/api/scenarios/:id` | 특정 시나리오 상세 조회 |
| `GET` | `/api/scenarios/category/:category` | 카테고리별 시나리오 조회 |
| `GET` | `/api/scenarios/difficulty/:difficulty` | 난이도별 시나리오 조회 |

### 💬 대화 API
| Method | Endpoint | 설명 | 주요 기능 |
|--------|----------|------|-----------|
| `POST` | `/api/conversation/start` | 새 협상 시작 | 초기 메시지, 감정 상태 생성 |
| `POST` | `/api/conversation/message` | 메시지 전송 | AI 응답, 감정 업데이트, 별점 평가 |
| `POST` | `/api/conversation/suggestions` | AI 응답 선택지 요청 | 3가지 전략적 응답 추천 |
| `POST` | `/api/conversation/analyze` | 협상 종합 분석 | 점수, 강점/약점, 개선 제안 |

---

## 🎯 사용 가능한 시나리오

| 시나리오 | 난이도 | 주요 목표 | NPC 유형 |
|---------|--------|----------|---------|
| 💼 **연봉 협상** | 🟡 중급 | 높은 연봉 확보, 복지 혜택 협상 | 인사 담당자 |
| 🏢 **공급업체 계약** | 🔴 고급 | 가격 할인, 유연한 계약 조건 | 영업 담당자 |
| ⏰ **프로젝트 마감일 협상** | 🟢 초급 | 현실적인 타임라인 확보 | 프로젝트 매니저 |
| 🏠 **부동산 가격 협상** | 🟡 중급 | 가격 인하, 하자 수리 요구 | 부동산 중개인 |
| 👥 **팀 리소스 배분** | 🔴 고급 | 충분한 인력 확보, 협력 관계 유지 | 부서장 |

> 각 시나리오는 고유한 NPC 성격, 협상 스타일, 목표를 가지고 있어 다양한 협상 전략을 연습할 수 있습니다.

---

## 🔑 Claude API 키 발급

### 1단계: Anthropic 계정 생성
1. [Anthropic Console](https://console.anthropic.com/) 접속
2. 계정 생성 또는 Google 계정으로 로그인

### 2단계: API 키 생성
1. 좌측 메뉴에서 **API Keys** 선택
2. **Create Key** 버튼 클릭
3. 키 이름 입력 (예: "negotiation-simulator")
4. 생성된 키를 안전한 곳에 복사

### 3단계: 환경 변수 설정
서버 `.env` 파일에 API 키 추가:
```env
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

> ⚠️ **주의**: API 키는 절대 공개 저장소에 업로드하지 마세요!

---

## 🛠️ 개발 가이드

### 새로운 시나리오 추가하기

`server/src/models/scenarios.js` 파일에 시나리오 객체 추가:

```javascript
{
  id: 'unique-scenario-id',
  title: '시나리오 제목',
  description: '시나리오 설명',
  difficulty: 'easy', // 'easy' | 'medium' | 'hard'
  category: '카테고리명',
  npcProfile: {
    role: 'NPC의 역할 (예: 인사 담당자)',
    personality: 'NPC 성격 특성',
    goals: 'NPC가 달성하려는 목표',
    constraints: 'NPC의 제약 조건',
    startingPosition: 'NPC의 초기 입장'
  },
  userGoals: ['사용자 목표 1', '사용자 목표 2'],
  tips: ['협상 팁 1', '협상 팁 2']
}
```

### AI 프롬프트 커스터마이징

`server/src/services/claudeService.js`의 다음 메서드들을 수정하여 AI 동작을 조정할 수 있습니다:
- `buildSystemPrompt()`: NPC의 기본 행동 패턴
- `generateSuggestions()`: AI 응답 선택지 생성 로직
- `analyzeConversation()`: 협상 분석 기준

### 게임 씬 커스터마이징

`client/src/scenes/GameScene.js`에서 게임 비주얼 요소 수정:
- 배경 이미지 변경
- 캐릭터 애니메이션 추가
- UI 레이아웃 조정

---

## 🐛 문제 해결

### 서버가 시작되지 않을 때
- ✅ `.env` 파일이 `server/` 폴더에 있는지 확인
- ✅ `ANTHROPIC_API_KEY`가 유효한 키인지 확인
- ✅ 포트 3000이 다른 프로세스에서 사용 중이 아닌지 확인
  ```bash
  # Windows
  netstat -ano | findstr :3000
  # macOS/Linux
  lsof -i :3000
  ```

### API 연결 오류
- ✅ 서버가 `http://localhost:3000`에서 실행 중인지 확인
- ✅ CORS 설정 확인 (`server/src/index.js`)
- ✅ 클라이언트 `.env`의 `VITE_API_URL` 확인

### AI 응답이 느릴 때
- ℹ️ Claude API 평균 응답 시간: 2-5초
- ✅ 네트워크 연결 상태 확인
- ✅ Anthropic Console에서 API 사용량 제한 확인

### Phaser 게임이 로드되지 않을 때
- ✅ 브라우저 콘솔에서 에러 메시지 확인
- ✅ `client/public/assets/` 폴더에 에셋 파일들이 있는지 확인
- ✅ 브라우저 캐시 삭제 후 새로고침

### 대화 기록이 저장되지 않을 때
- ✅ 브라우저의 LocalStorage가 활성화되어 있는지 확인
- ✅ 시크릿 모드에서는 LocalStorage가 제한될 수 있음
- ✅ 브라우저 개발자 도구 > Application > Local Storage 확인

---

## 🎯 향후 개발 목표

### Phase 1: 현재 구현 완료 ✅
- [x] Phaser 게임 엔진 통합
- [x] AI 응답 선택지 시스템
- [x] 실시간 감정 상태 추적
- [x] 협상 분석 및 피드백 시스템
- [x] 대화 내역 저장 및 불러오기
- [x] 별점 평가 시스템
- [x] 사운드 효과 시스템

### Phase 2: 단기 목표 (1-2개월)
- [ ] **회원 시스템 고도화**
  - 사용자 인증 (Firebase Authentication)
  - 클라우드 데이터베이스 연동 (Firestore)
  - 프로필 관리 및 개인화

- [ ] **통계 & 대시보드**
  - 협상 성과 통계 그래프
  - 성장 추이 시각화
  - 강점/약점 트렌드 분석

- [ ] **소셜 기능**
  - 리더보드 및 랭킹 시스템
  - 친구와 결과 공유
  - 협상 기록 공개/비공개 설정

### Phase 3: 중장기 목표 (3-6개월)
- [ ] **콘텐츠 확장**
  - 10개 이상 추가 시나리오
  - 사용자 커스텀 시나리오 생성 기능
  - 업계별 전문 시나리오 (IT, 의료, 법률 등)

- [ ] **고급 기능**
  - 음성 인식 기반 대화 입력
  - TTS(Text-to-Speech) NPC 음성
  - 멀티플레이 협상 연습 (사용자 vs 사용자)

- [ ] **교육 콘텐츠**
  - 협상 기술 학습 튜토리얼
  - 단계별 가이드 미션
  - 전문가 팁 및 케이스 스터디

- [ ] **글로벌화**
  - 다국어 지원 (영어, 일본어, 중국어)
  - 문화권별 협상 스타일 반영

### Phase 4: 장기 비전
- [ ] **모바일 앱**: React Native 기반 iOS/Android 앱
- [ ] **기업용 버전**: B2B 협상 교육 플랫폼
- [ ] **AI 코칭**: 개인 맞춤형 협상 코칭 시스템

---

## 🤝 기여하기

프로젝트 개선에 참여해주세요! 기여 방법:

1. **🐛 버그 리포트**: [이슈 등록](../../issues/new)
2. **💡 기능 제안**: [이슈에 제안 사항 작성](../../issues/new)
3. **🔧 Pull Request**:
   ```bash
   # 1. Fork & Clone
   git clone https://github.com/your-username/negotiation-simulator.git

   # 2. 브랜치 생성
   git checkout -b feature/your-feature-name

   # 3. 커밋 & 푸시
   git commit -m "Add: 새로운 기능 설명"
   git push origin feature/your-feature-name

   # 4. Pull Request 생성
   ```

### 기여 가이드라인
- 코드 스타일: ESLint 규칙 준수
- 커밋 메시지: `Add:`, `Fix:`, `Update:` 등 명확한 접두사 사용
- 테스트: 새 기능 추가 시 테스트 코드 포함 권장

---

## 📄 라이선스

이 프로젝트는 **ISC 라이선스**를 따릅니다.

---

## 📬 문의 및 지원

- **이슈 등록**: [GitHub Issues](../../issues)
- **질문 및 토론**: [Discussions](../../discussions)
- **버그 제보**: 상세한 재현 방법과 함께 이슈 등록

---

## 🌟 Special Thanks

이 프로젝트는 다음 기술들로 만들어졌습니다:
- [Anthropic Claude AI](https://www.anthropic.com/) - 고급 AI 대화 엔진
- [Phaser 3](https://phaser.io/) - 강력한 2D 게임 프레임워크
- [React](https://react.dev/) - 현대적인 UI 라이브러리
- [Express](https://expressjs.com/) - 빠르고 간결한 웹 프레임워크

---

<div align="center">

### 🚀 협상 스킬 향상의 여정을 시작하세요!

**[⭐ Star](../../stargazers)** 를 눌러 프로젝트를 응원해주세요!

Made with ❤️ for better negotiation skills

</div>
