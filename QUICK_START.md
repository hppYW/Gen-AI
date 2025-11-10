# 빠른 시작 가이드

## 1. 환경 변수 파일이 생성되었는지 확인

이미 생성되었습니다!
- `client/.env` ✅
- `server/.env` ✅

## 2. Claude API 키 설정 (중요!)

### Claude API 키 발급
1. https://console.anthropic.com/ 접속
2. 로그인 또는 회원가입
3. API Keys 섹션에서 새 키 생성
4. 결제 정보 등록 (API 사용 필수)

### 키 설정
`server/.env` 파일을 열고 다음 줄을 수정:
```env
ANTHROPIC_API_KEY=여기에_실제_API_키_입력
```

**주의**: 실제 API 키를 입력하지 않으면 AI 대화가 작동하지 않습니다!

## 3. 서버 실행

터미널 1:
```bash
cd server
npm run dev
```

성공하면 다음과 같이 표시됩니다:
```
🚀 Server running on port 3000
📍 API available at http://localhost:3000
```

## 4. 클라이언트 실행

터미널 2:
```bash
cd client
npm run dev
```

성공하면 다음과 같이 표시됩니다:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

## 5. 브라우저 접속

브라우저에서 http://localhost:5173 를 엽니다.

## 현재 상태

### ✅ 작동하는 기능
- 홈페이지
- 시나리오 목록 (로그인 없이 볼 수 없음)
- AI와 협상 대화 (Claude API 키 필요)

### ⚠️ Firebase 미설정 상태
현재 Firebase가 설정되지 않아서:
- 로그인/회원가입 불가
- 대화 기록 저장 불가

### 임시 해결책

**옵션 1: Firebase 없이 테스트** (권장)
1. 로그인 없이 사용하려면 코드 수정 필요
2. 또는 API 직접 테스트

**옵션 2: Firebase 설정** (완전한 기능)
1. [SETUP_GUIDE.md](./SETUP_GUIDE.md) 참고
2. Firebase 프로젝트 생성
3. Authentication + Firestore 활성화
4. `client/.env`와 `server/.env` 업데이트

## 문제 해결

### 까만 화면만 나올 때
1. 브라우저 콘솔(F12) 확인
2. 서버가 실행 중인지 확인
3. 클라이언트를 Ctrl+C로 중단하고 다시 `npm run dev`

### API 오류
- `server/.env`의 `ANTHROPIC_API_KEY`가 설정되었는지 확인
- API 키가 유효한지 확인
- 결제 정보가 등록되었는지 확인

### Firebase 오류
- 콘솔에 "Firebase is not configured" 경고가 나오는 것은 정상입니다
- 로그인 기능을 사용하려면 Firebase 설정 필요

## 다음 단계

1. Claude API 키 설정 (필수)
2. Firebase 설정 (로그인 기능 사용 시)
3. 시나리오 선택하고 AI와 협상 연습!
