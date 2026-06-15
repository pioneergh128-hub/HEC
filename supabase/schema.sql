-- ============================================================
-- Naver KPI Dashboard - Supabase Schema
-- ============================================================

-- 사이트 접근 비밀번호 (단일 행 테이블)
CREATE TABLE IF NOT EXISTS site_access (
  id INTEGER PRIMARY KEY DEFAULT 1,
  password_hash TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- RLS 활성화 (service role만 접근 가능)
ALTER TABLE site_access ENABLE ROW LEVEL SECURITY;

-- 서비스 롤만 접근 허용
CREATE POLICY "service_role_only" ON site_access
  USING (auth.role() = 'service_role');

-- ============================================================
-- 연결 손익계산서
-- ============================================================
CREATE TABLE IF NOT EXISTS consolidated_is (
  id SERIAL PRIMARY KEY,
  period TEXT UNIQUE NOT NULL,          -- e.g. '1Q26', '4Q25'
  revenue NUMERIC(10,1),
  naver_platform NUMERIC(10,1),
  ad NUMERIC(10,1),
  service NUMERIC(10,1),
  financial_platform NUMERIC(10,1),
  global_challenge NUMERIC(10,1),
  c2c NUMERIC(10,1),
  content NUMERIC(10,1),
  enterprise NUMERIC(10,1),
  op_expense NUMERIC(10,1),
  dev_ops NUMERIC(10,1),
  headcount NUMERIC(10,1),
  other_ops NUMERIC(10,1),
  partner NUMERIC(10,1),
  infra NUMERIC(10,1),
  marketing NUMERIC(10,1),
  op_income NUMERIC(10,1),
  op_margin NUMERIC(5,2),
  net_income NUMERIC(10,1),
  net_margin NUMERIC(5,2),
  fcf NUMERIC(10,1),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

ALTER TABLE consolidated_is ENABLE ROW LEVEL SECURITY;

-- 인증된 사용자(로그인한 사용자)는 읽기 가능
CREATE POLICY "authenticated_read" ON consolidated_is
  FOR SELECT USING (true);

-- 서비스 롤만 쓰기 가능
CREATE POLICY "service_role_write" ON consolidated_is
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- 연결 재무상태표
-- ============================================================
CREATE TABLE IF NOT EXISTS consolidated_bs (
  id SERIAL PRIMARY KEY,
  period TEXT UNIQUE NOT NULL,
  current_assets NUMERIC(10,0),
  cash NUMERIC(10,0),
  receivables NUMERIC(10,0),
  other_current NUMERIC(10,0),
  non_current_assets NUMERIC(10,0),
  investments NUMERIC(10,0),
  ppe NUMERIC(10,0),
  right_of_use NUMERIC(10,0),
  intangibles NUMERIC(10,0),
  other_non_current NUMERIC(10,0),
  total_assets NUMERIC(10,0),
  current_liabilities NUMERIC(10,0),
  non_current_liabilities NUMERIC(10,0),
  total_liabilities NUMERIC(10,0),
  controlling_interest NUMERIC(10,0),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

ALTER TABLE consolidated_bs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_read_bs" ON consolidated_bs FOR SELECT USING (true);
CREATE POLICY "service_role_write_bs" ON consolidated_bs FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- 별도 손익계산서
-- ============================================================
CREATE TABLE IF NOT EXISTS standalone_is (
  id SERIAL PRIMARY KEY,
  period TEXT UNIQUE NOT NULL,
  revenue NUMERIC(10,1),
  op_expense NUMERIC(10,1),
  op_income NUMERIC(10,1),
  op_margin NUMERIC(5,2),
  net_income NUMERIC(10,1),
  net_margin NUMERIC(5,2),
  other_income NUMERIC(10,1),
  other_expense NUMERIC(10,1),
  ebt NUMERIC(10,1),
  tax_expense NUMERIC(10,1),
  comprehensive_income NUMERIC(10,1),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

ALTER TABLE standalone_is ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_read_sis" ON standalone_is FOR SELECT USING (true);
CREATE POLICY "service_role_write_sis" ON standalone_is FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- 별도 재무상태표
-- ============================================================
CREATE TABLE IF NOT EXISTS standalone_bs (
  id SERIAL PRIMARY KEY,
  period TEXT UNIQUE NOT NULL,
  current_assets NUMERIC(10,0),
  cash NUMERIC(10,0),
  receivables NUMERIC(10,0),
  other NUMERIC(10,0),
  non_current_assets NUMERIC(10,0),
  investments NUMERIC(10,0),
  ppe NUMERIC(10,0),
  right_of_use NUMERIC(10,0),
  intangibles NUMERIC(10,0),
  total_assets NUMERIC(10,0),
  current_liabilities NUMERIC(10,0),
  non_current_liabilities NUMERIC(10,0),
  total_liabilities NUMERIC(10,0),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

ALTER TABLE standalone_bs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_read_sbs" ON standalone_bs FOR SELECT USING (true);
CREATE POLICY "service_role_write_sbs" ON standalone_bs FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- 초기 비밀번호 설정 (bcrypt hash of 'naver2026')
-- 실제 배포 시 서비스 롤로 교체하세요
-- ============================================================
-- INSERT INTO site_access (id, password_hash)
-- VALUES (1, '$2a$12$YOUR_BCRYPT_HASH_HERE')
-- ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- ============================================================
-- 데이터 변경 이력 (감사 로그)
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  period TEXT,
  field_name TEXT,
  old_value TEXT,
  new_value TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT
);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_read_audit" ON audit_log FOR SELECT USING (true);
CREATE POLICY "authenticated_insert_audit" ON audit_log FOR INSERT WITH CHECK (true);
