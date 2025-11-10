# 협상 시뮬레이터 (Negotiation Simulator)

AI와 대화하면서 협상 스킬을 연습하고 향상시키는 웹 애플리케이션입니다.

## 주요 기능

- **AI NPC 시스템**: Claude AI 기반의 현실적인 협상 상대
- **다양한 협상 시나리오**: 연봉협상, 계약협상, 프로젝트 관리 등 5가지 시나리오
- **실시간 피드백**: 협상 과정에 대한 즉각적인 분석과 개선 제안
- **자유 대화 방식**: 제약 없는 자연스러운 대화로 협상 진행
- **사용자 인증**: Firebase Authentication을 통한 로그인/회원가입
- **대화 기록 저장**: Firestore를 통한 협상 내역 자동 저장
- **개인 대시보드**: 과거 협상 기록 및 통계 확인

## 기술 스택

### Frontend
- React 18
- Vite
- React Router
- Axios
- Firebase SDK (Authentication, Firestore)

### Backend
- Node.js
- Express
- Claude AI API (@anthropic-ai/sdk)
- Firebase Admin SDK
- Firestore (데이터베이스)

## 프로젝트 구조

```
negotiation-simulator/
├── client/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/    # 재사용 가능한 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   │   ├── HomePage.jsx
│   │   │   ├── ScenarioListPage.jsx
│   │   │   └── NegotiationPage.jsx
│   │   ├── services/      # API 서비스
│   │   │   └── api.js
│   │   └── App.jsx
│   └── package.json
│
└── server/                # Node.js 백엔드
    ├── src/
    │   ├── controllers/   # 비즈니스 로직
    │   │   ├── conversationController.js
    │   │   └── scenarioController.js
    │   ├── routes/        # API 라우트
    │   │   ├── conversation.js
    │   │   └── scenario.js
    │   ├── services/      # 외부 서비스 연동
    │   │   └── claudeService.js
    │   ├── models/        # 데이터 모델
    │   │   └── scenarios.js
    │   └── index.js
    └── package.json
```

## 시작하기

> 📘 **상세한 설정 가이드는 [SETUP_GUIDE.md](./SETUP_GUIDE.md)를 참고하세요.**

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn
- Claude API 키 (Anthropic)
- Firebase 프로젝트 (Authentication + Firestore)

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

## API 엔드포인트

### 시나리오 API
- `GET /api/scenarios` - 모든 시나리오 조회
- `GET /api/scenarios/:id` - 특정 시나리오 조회
- `GET /api/scenarios/category/:category` - 카테고리별 시나리오 조회
- `GET /api/scenarios/difficulty/:difficulty` - 난이도별 시나리오 조회

### 대화 API
- `POST /api/conversation/start` - 새 대화 시작 (인증 선택)
- `POST /api/conversation/message` - 메시지 전송 (인증 선택)
- `POST /api/conversation/analyze` - 대화 분석 (인증 선택)
- `POST /api/conversation/save` - 대화 저장 (인증 필수)
- `GET /api/conversation/history` - 대화 기록 조회 (인증 필수)

## 사용 가능한 시나리오

1. **연봉 협상** (중급)
   - 채용 담당자와 연봉 협상
   - 목표: 높은 연봉 확보, 복지 혜택 협상

2. **공급업체 계약** (고급)
   - B2B 소프트웨어 구매 협상
   - 목표: 가격 할인, 유연한 계약 조건

3. **프로젝트 마감일 협상** (초급)
   - 비현실적인 마감일 조정
   - 목표: 현실적인 타임라인 확보

4. **부동산 가격 협상** (중급)
   - 아파트 매매가격 협상
   - 목표: 가격 인하, 하자 수리 요구

5. **팀 리소스 배분** (고급)
   - 부서 간 인력 배분 협상
   - 목표: 충분한 인력 확보, 협력 관계 유지

## 필수 서비스 설정

### Claude API 키 발급

1. [Anthropic Console](https://console.anthropic.com/) 접속
2. 계정 생성 또는 로그인
3. API Keys 섹션에서 새 키 생성
4. 생성된 키를 서버 `.env` 파일의 `ANTHROPIC_API_KEY`에 입력

### Firebase 프로젝트 설정

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 새 프로젝트 생성
3. **Authentication 활성화**:
   - 이메일/비밀번호 로그인 활성화
   - Google 로그인 활성화 (선택사항)
4. **Firestore Database 생성**:
   - 테스트 모드로 시작 (개발 중)
   - 위치: asia-northeast3 (Seoul) 권장
5. 웹 앱 등록 후 Firebase 구성 정보를 클라이언트 `.env`에 입력

> 📘 자세한 Firebase 설정 방법은 [SETUP_GUIDE.md](./SETUP_GUIDE.md)를 참고하세요.

## 개발 가이드

### 새로운 시나리오 추가

`server/src/models/scenarios.js` 파일에 새 시나리오 객체 추가:

```javascript
{
  id: 'unique-id',
  title: '시나리오 제목',
  description: '시나리오 설명',
  difficulty: 'easy|medium|hard',
  category: '카테고리',
  npcProfile: {
    role: 'NPC 역할',
    personality: 'NPC 성격',
    goals: 'NPC 목표',
    constraints: 'NPC 제약사항',
    startingPosition: '초기 입장'
  },
  userGoals: ['목표1', '목표2'],
  tips: ['팁1', '팁2']
}
```

### AI 프롬프트 커스터마이징

`server/src/services/claudeService.js`의 `buildSystemPrompt` 메서드에서 시스템 프롬프트 수정 가능

## 문제 해결

### 서버가 시작되지 않는 경우
- `.env` 파일이 올바르게 설정되었는지 확인
- `ANTHROPIC_API_KEY`가 유효한지 확인
- 포트 3000이 사용 중이 아닌지 확인

### API 연결 오류
- 서버가 실행 중인지 확인
- CORS 설정 확인 (`server/src/index.js`)
- 클라이언트의 `.env` 파일에서 `VITE_API_URL` 확인

### AI 응답이 느린 경우
- Claude API의 응답 시간은 보통 2-5초
- 네트워크 연결 상태 확인
- API 사용량 제한 확인

## 향후 개발 계획

- [x] Firebase/Firestore 데이터베이스 연동
- [x] 사용자 인증 시스템 (Firebase Authentication)
- [x] 대화 내역 저장 및 불러오기
- [ ] 협상 성과 통계 및 상세 대시보드
- [ ] 커스텀 시나리오 생성 기능
- [ ] 협상 점수 및 랭킹 시스템
- [ ] 다중 언어 지원
- [ ] 음성 대화 기능
- [ ] 협상 기술 학습 튜토리얼

## 라이선스

ISC

## 기여

이슈와 PR은 언제나 환영합니다!

## 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.
