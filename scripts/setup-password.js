/**
 * 초기 비밀번호 설정 스크립트
 * 사용법: node scripts/setup-password.js <비밀번호>
 *
 * 예: node scripts/setup-password.js naver2026!
 */

const bcrypt = require('bcryptjs')
const https = require('https')

const password = process.argv[2]
if (!password) {
  console.error('사용법: node scripts/setup-password.js <비밀번호>')
  process.exit(1)
}

async function setup() {
  const hash = await bcrypt.hash(password, 12)

  console.log('\n✅ bcrypt 해시 생성 완료:')
  console.log(hash)
  console.log('\n아래 SQL을 Supabase SQL Editor에서 실행하세요:')
  console.log(`
INSERT INTO site_access (id, password_hash)
VALUES (1, '${hash}')
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();
  `)
}

setup().catch(console.error)
