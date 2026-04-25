-- KB금융 고객 문의 자동 분류 시스템 테이블 생성 스크립트
-- 이 내용을 Supabase SQL Editor에서 실행하세요.

-- 1. 기존 테이블 삭제 (초기화용)
DROP TABLE IF EXISTS inquiries CASCADE;

-- 2. inquiries 테이블 생성
CREATE TABLE inquiries (
    id bigint primary key generated always as identity,
    created_at timestamptz default now(),
    customer_name text not null,
    inquiry text not null,
    category text not null,
    urgency text not null,
    summary text not null,
    department text not null,
    script text not null
);

-- 3. Row Level Security 비활성화 (실습용)
-- 실제 서비스에서는 적절한 Policy 설정이 필요합니다.
ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;

-- 4. 확인용 주석
-- SQL Editor에서 'Run' 버튼을 눌러 실행하면 테이블이 생성됩니다.
