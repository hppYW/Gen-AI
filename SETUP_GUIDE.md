# 협상 시뮬레이터 설정 가이드

이 가이드는 협상 시뮬레이터를 처음부터 설정하는 방법을 단계별로 안내합니다.

## 목차
1. [Firebase 프로젝트 생성](#1-firebase-프로젝트-생성)
2. [Claude API 키 발급](#2-claude-api-키-발급)
3. [환경 변수 설정](#3-환경-변수-설정)
4. [서버 실행](#4-서버-실행)
5. [클라이언트 실행](#5-클라이언트-실행)

---

## 1. Firebase 프로젝트 생성

### 1.1 Firebase Console 접속
1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭

### 1.2 프로젝트 생성
1. 프로젝트 이름 입력 (예: "negotiation-simulator")
2. Google Analytics 사용 여부 선택 (선택사항)
3. "프로젝트 만들기" 클릭

### 1.3 Authentication 설정
1. 좌측 메뉴에서 "Build" > "Authentication" 선택
2. "시작하기" 클릭
3. 로그인 방법 탭에서 활성화:
   - **이메일/비밀번호**: 사용 설정
   - **Google** (선택사항): 사용 설정

### 1.4 Firestore Database 설정
1. 좌측 메뉴에서 "Build" > "Firestore Database" 선택
2. "데이터베이스 만들기" 클릭
3. 모드 선택:
   - **테스트 모드**: 개발 중 선택 (30일간 모든 읽기/쓰기 허용)
   - **프로덕션 모드**: 배포 시 선택
4. 위치 선택: `asia-northeast3 (Seoul)` 또는 가까운 지역
5. "사용 설정" 클릭

### 1.5 Firebase 웹 앱 등록
1. 프로젝트 개요 페이지에서 웹 아이콘 (`</>`) 클릭
2. 앱 닉네임 입력 (예: "Negotiation Simulator Web")
3. Firebase Hosting 설정은 건너뛰기
4. "앱 등록" 클릭
5. **Firebase 구성 객체 복사** (나중에 사용)

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 1.6 Firebase Admin SDK 설정 (서버용)
1. 프로젝트 설정 > 서비스 계정 탭
2. "새 비공개 키 생성" 클릭
3. JSON 파일 다운로드
4. 파일을 안전한 곳에 보관

---

## 2. Claude API 키 발급

### 2.1 Anthropic Console 접속
1. [Anthropic Console](https://console.anthropic.com/) 접속
2. 계정이 없다면 회원가입

### 2.2 API 키 생성
1. 좌측 메뉴에서 "API Keys" 선택
2. "Create Key" 클릭
3. 키 이름 입력 (예: "Negotiation Simulator")
4. **생성된 키 복사** (다시 볼 수 없으므로 안전하게 보관)

### 2.3 결제 정보 등록
1. Claude API 사용을 위해 결제 정보 등록 필요
2. Settings > Billing에서 결제 수단 등록
3. 사용량 한도 설정 (예: $10/월)

---

## 3. 환경 변수 설정

### 3.1 서버 환경 변수

`server/.env.example`을 `server/.env`로 복사:
```bash
cd server
cp .env.example .env
```

`server/.env` 파일 편집:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Claude AI API
ANTHROPIC_API_KEY=sk-ant-api03-...  # 2단계에서 발급받은 키

# Firebase Configuration (선택사항 - Admin SDK)
# 방법 1: 서비스 계정 JSON 파일 사용 (권장)
# firebase-service-account.json 파일을 server/ 폴더에 저장

# 방법 2: 환경 변수로 직접 설정
FIREBASE_PROJECT_ID=your-project-id

# CORS
CLIENT_URL=http://localhost:5173
```

### 3.2 클라이언트 환경 변수

`client/.env.example`을 `client/.env`로 복사:
```bash
cd ../client
cp .env.example .env
```

`client/.env` 파일 편집 (1.5단계의 Firebase 구성 사용):
```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

## 4. 서버 실행

### 4.1 의존성 설치 (처음 한 번만)
```bash
cd server
npm install
```

### 4.2 서버 실행
```bash
npm run dev
```

성공 시 출력:
```
🚀 Server running on port 3000
📍 API available at http://localhost:3000
```

### 4.3 서버 테스트
브라우저나 curl로 헬스체크:
```bash
curl http://localhost:3000/health
```

응답:
```json
{"status":"ok","message":"Negotiation Simulator API is running"}
```

---

## 5. 클라이언트 실행

### 5.1 의존성 설치 (처음 한 번만)
```bash
cd ../client
npm install
```

### 5.2 클라이언트 실행
```bash
npm run dev
```

성공 시 출력:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 5.3 브라우저에서 확인
브라우저에서 `http://localhost:5173` 접속

---

## 문제 해결

### Firebase 인증 오류
**증상**: "Firebase: Error (auth/...)"

**해결**:
1. `.env` 파일의 Firebase 설정 확인
2. Firebase Console에서 Authentication 활성화 확인
3. 브라우저 콘솔에서 구체적인 에러 확인

### Claude API 오류
**증상**: "Failed to generate AI response"

**해결**:
1. `ANTHROPIC_API_KEY`가 올바르게 설정되었는지 확인
2. Anthropic Console에서 API 키가 활성화되어 있는지 확인
3. 결제 정보가 등록되어 있는지 확인
4. 사용량 한도를 초과하지 않았는지 확인

### CORS 오류
**증상**: "Access to XMLHttpRequest has been blocked by CORS policy"

**해결**:
1. 서버의 `.env`에서 `CLIENT_URL`이 `http://localhost:5173`으로 설정되어 있는지 확인
2. 서버를 재시작

### Firestore 저장 실패
**증상**: 대화 기록이 저장되지 않음

**해결**:
1. Firestore Database가 생성되어 있는지 확인
2. 테스트 모드에서는 30일 후 자동 만료되므로 보안 규칙 재설정 필요
3. Firebase Admin SDK 설정 확인

---

## Firestore 보안 규칙 (프로덕션)

개발 완료 후 프로덕션 배포 시 다음 보안 규칙 적용:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Conversations collection
    match /conversations/{conversationId} {
      // 사용자는 자신의 대화만 읽기/쓰기 가능
      allow read, write: if request.auth != null
                         && request.auth.uid == resource.data.userId;

      // 새 대화 생성
      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## 다음 단계

설정이 완료되었다면:

1. 회원가입하여 계정 생성
2. 로그인
3. 시나리오 선택
4. AI와 협상 연습 시작!

추가 질문이나 문제가 있다면 GitHub Issues에 등록해주세요.
