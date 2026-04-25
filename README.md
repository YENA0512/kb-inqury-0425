# KB금융그룹 고객 문의 자동 분류 시스템 (AI CS)

이 프로젝트는 KB금융그룹의 고객 문의를 **Gemini 3 Flash** AI를 통해 자동으로 분류하고, 분석 결과를 **Supabase**에 저장 및 관리하는 웹 애플리케이션입니다.

## 주요 기능
- **문의 자동 분류**: 고객 문의 내용을 분석하여 카테고리, 긴급도, 담당 부서 자동 배정
- **응대 스크립트 생성**: AI가 최적의 고객 응대 문구 제안
- **문의 내역 관리**: 저장된 전체 문의 내역 조회 및 실시간 업데이트
- **데이터 내보내기**: 전체 내역을 CSV 파일로 다운로드 (엑셀 한글 깨짐 방지 처리)

## 기술 스택
- **Frontend**: React, TypeScript, Vite, Tailwind CSS v4
- **AI**: @google/genai (Gemini 3 Flash)
- **Database**: @supabase/supabase-js (Supabase)
- **Icons**: Lucide React

## 로컬 실행 방법

1.  **패키지 설치**:
    ```bash
    npm install
    ```

2.  **환경변수 설정**: 프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 입력합니다.
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
    ```

3.  **애플리케이션 실행**:
    ```bash
    npm run dev
    ```

## 데이터베이스 설정 (Supabase)

Supabase SQL Editor에서 `supabase_setup.sql` 파일의 내용을 복사하여 실행하세요.
- `inquiries` 테이블 생성 및 RLS 정책 설정이 포함되어 있습니다.

## Vercel 배포 방법

1.  GitHub 저장소에 프로젝트 푸시
2.  Vercel에서 프로젝트 Import
3.  **Environment Variables** 설정: 위 `.env`에 정의된 3개의 키와 값을 입력
4.  **Deploy** 버튼 클릭

---
&copy; 2026 KB Financial Group Customer Support System.
