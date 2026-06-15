# NAVER 1Q26 실적 대시보드

NAVER Corporation 2026년 1분기 Financial Factsheet 기반 인터랙티브 대시보드

## 기술 스택

- **프론트엔드**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **차트**: Recharts
- **백엔드/DB**: Supabase (PostgreSQL + RLS)
- **인증**: 비밀번호 기반 (bcrypt 해시 → Supabase 저장)

## 기능

- 비밀번호 보호 (DB 관리, bcrypt 해시)
- 4개 탭: 핵심 지표 / 사업부문 실적 / 연결 재무상태표 / 별도 손익
- 인터랙티브 차트 (추이, 누적 막대, YoY 성장률, 자산 구성)
- 데이터 CRUD (값 클릭 → 편집 모달 → Supabase 업데이트)
- 변경 이력 감사 로그

## 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. Supabase 프로젝트 설정

1. [supabase.com](https://supabase.com)에서 새 프로젝트 생성
2. **SQL Editor**에서 `supabase/schema.sql` 전체 실행
3. **Settings > API**에서 URL과 anon key 복사

### 3. 환경변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local`을 열고 Supabase 값 입력:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...
AUTH_SECRET=임의의-64자-문자열
```

### 4. 초기 비밀번호 설정

```bash
node scripts/setup-password.js 원하는비밀번호
```

출력된 SQL을 Supabase SQL Editor에서 실행합니다.

### 5. (선택) 초기 데이터 시딩

Supabase에 재무 데이터를 저장하려면:

```bash
node scripts/seed-data.js
```

> 시딩하지 않아도 코드의 하드코딩 데이터로 대시보드가 동작합니다.

### 6. 개발 서버 실행

```bash
npm run dev
```

→ http://localhost:3000 접속 → 비밀번호 입력 → 대시보드

## 배포 (Vercel 추천)

```bash
# Vercel CLI
npm i -g vercel
vercel

# 환경변수를 Vercel 대시보드에서도 설정 필요
```

## 대시보드 구성

| 탭 | 내용 |
|---|---|
| 핵심 지표 | KPI 카드 6개 + 분기별 추이 차트 + 비용 구조 |
| 사업부문 실적 | 세그먼트별 매출 + YoY 성장률 + 누적 막대 차트 |
| 연결 재무상태표 | 자산/부채/자본 추이 + 재무 구조 바 + 자산 구성 |
| 별도 손익 | 연결 vs 별도 비교 + 별도 IS/BS 상세 |

## 보안 참고

- RLS(Row Level Security)가 모든 테이블에 적용됩니다
- `SUPABASE_SERVICE_ROLE_KEY`는 절대 클라이언트에 노출하지 마세요
- 프로덕션에서는 HTTPS 필수
- `AUTH_SECRET`은 충분히 긴 랜덤 문자열 사용
