/**
 * Supabase에 초기 재무 데이터를 시딩하는 스크립트
 * 사용법: node scripts/seed-data.js
 *
 * 환경변수 필요:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const consolidatedIS = [
  { period: '1Q25', revenue: 2786.8, naver_platform: 1604.7, ad: 1276.2, service: 328.5, financial_platform: 386.7, global_challenge: 795.4, c2c: 222.7, content: 446.2, enterprise: 126.6, op_expense: 2281.5, dev_ops: 671.1, headcount: 573.9, other_ops: 97.2, partner: 990.9, infra: 189.3, marketing: 430.2, op_income: 505.3, op_margin: 18.1, net_income: 423.7, net_margin: 15.2, fcf: 471.9 },
  { period: '2Q25', revenue: 2915.1, naver_platform: 1693.1, ad: 1346.6, service: 346.6, financial_platform: 405.6, global_challenge: 816.4, c2c: 227.5, content: 462.1, enterprise: 126.7, op_expense: 2393.5, dev_ops: 683.1, headcount: 583.3, other_ops: 99.8, partner: 1030.2, infra: 197.7, marketing: 482.4, op_income: 521.6, op_margin: 17.9, net_income: 497.4, net_margin: 17.1, fcf: 196.8 },
  { period: '3Q25', revenue: 3138.1, naver_platform: 1816.6, ad: 1398.1, service: 418.6, financial_platform: 427.3, global_challenge: 894.1, c2c: 250.6, content: 498.2, enterprise: 145.3, op_expense: 2567.4, dev_ops: 732.7, headcount: 632.2, other_ops: 100.5, partner: 1114.1, infra: 218.6, marketing: 502.0, op_income: 570.6, op_margin: 18.2, net_income: 734.7, net_margin: 23.4, fcf: 201.9 },
  { period: '4Q25', revenue: 3195.1, naver_platform: 1850.3, ad: 1415.3, service: 434.9, financial_platform: 448.6, global_challenge: 896.2, c2c: 285.7, content: 444.9, enterprise: 165.6, op_expense: 2584.4, dev_ops: 743.7, headcount: 635.7, other_ops: 108.0, partner: 1129.8, infra: 205.2, marketing: 505.7, op_income: 610.6, op_margin: 19.1, net_income: 163.0, net_margin: 5.1, fcf: 130.8 },
  { period: '1Q26', revenue: 3241.1, naver_platform: 1839.8, ad: 1394.5, service: 445.3, financial_platform: 459.7, global_challenge: 941.6, c2c: 351.1, content: 440.1, enterprise: 150.5, op_expense: 2699.3, dev_ops: 748.9, headcount: 649.8, other_ops: 99.1, partner: 1188.0, infra: 250.8, marketing: 511.7, op_income: 541.8, op_margin: 16.7, net_income: 291.0, net_margin: 9.0, fcf: 319.8 },
]

async function seed() {
  console.log('📊 재무 데이터 시딩 시작...')

  const { error: isError } = await supabase
    .from('consolidated_is')
    .upsert(consolidatedIS, { onConflict: 'period' })

  if (isError) {
    console.error('연결IS 오류:', isError.message)
  } else {
    console.log('✅ 연결 손익계산서 데이터 저장 완료')
  }

  console.log('\n✨ 시딩 완료!')
}

seed().catch(console.error)
