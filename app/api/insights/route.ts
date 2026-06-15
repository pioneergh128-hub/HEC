import { NextRequest, NextResponse } from 'next/server'
import { consolidatedIS, consolidatedBS, standaloneIS } from '@/lib/financial-data'

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get('dashboard_auth')?.value === 'authenticated'
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
  }

  const latest = consolidatedIS[consolidatedIS.length - 1]
  const prev = consolidatedIS[consolidatedIS.length - 2]
  const yoy = consolidatedIS[0]
  const latestBS = consolidatedBS[consolidatedBS.length - 1]
  const latestSA = standaloneIS[standaloneIS.length - 1]

  const prompt = `당신은 NAVER Corporation의 재무 분석 전문가입니다. 아래 최신 분기 실적 데이터를 바탕으로 경영진 보고서 수준의 핵심 인사이트를 도출해주세요.

## 연결 손익 5개 분기 추이 (단위: 십억원)
| 지표 | 1Q25 | 2Q25 | 3Q25 | 4Q25 | 1Q26 |
|------|------|------|------|------|------|
| 매출 | ${consolidatedIS[0].revenue} | ${consolidatedIS[1].revenue} | ${consolidatedIS[2].revenue} | ${consolidatedIS[3].revenue} | ${latest.revenue} |
| 영업이익 | ${consolidatedIS[0].opIncome} | ${consolidatedIS[1].opIncome} | ${consolidatedIS[2].opIncome} | ${consolidatedIS[3].opIncome} | ${latest.opIncome} |
| 영업이익률 | ${consolidatedIS[0].opMargin}% | ${consolidatedIS[1].opMargin}% | ${consolidatedIS[2].opMargin}% | ${consolidatedIS[3].opMargin}% | ${latest.opMargin}% |
| 당기순이익 | ${consolidatedIS[0].netIncome} | ${consolidatedIS[1].netIncome} | ${consolidatedIS[2].netIncome} | ${consolidatedIS[3].netIncome} | ${latest.netIncome} |
| FCF | ${consolidatedIS[0].fcf} | ${consolidatedIS[1].fcf} | ${consolidatedIS[2].fcf} | ${consolidatedIS[3].fcf} | ${latest.fcf} |

## 사업부문별 매출 1Q26 (단위: 십억원, YoY 비교)
| 부문 | 1Q25 | 1Q26 | YoY |
|------|------|------|-----|
| 네이버플랫폼(광고) | ${yoy.naverPlatform} | ${latest.naverPlatform} | ${(((latest.naverPlatform - yoy.naverPlatform) / yoy.naverPlatform) * 100).toFixed(1)}% |
| 금융플랫폼 | ${yoy.financialPlatform} | ${latest.financialPlatform} | ${(((latest.financialPlatform - yoy.financialPlatform) / yoy.financialPlatform) * 100).toFixed(1)}% |
| 글로벌챌린지 | ${yoy.globalChallenge} | ${latest.globalChallenge} | ${(((latest.globalChallenge - yoy.globalChallenge) / yoy.globalChallenge) * 100).toFixed(1)}% |
| C2C | ${yoy.c2c} | ${latest.c2c} | ${(((latest.c2c - yoy.c2c) / yoy.c2c) * 100).toFixed(1)}% |
| 콘텐츠 | ${yoy.content} | ${latest.content} | ${(((latest.content - yoy.content) / yoy.content) * 100).toFixed(1)}% |
| 엔터프라이즈 | ${yoy.enterprise} | ${latest.enterprise} | ${(((latest.enterprise - yoy.enterprise) / yoy.enterprise) * 100).toFixed(1)}% |

## 비용 구조 1Q26 (단위: 십억원)
- 파트너비용(매출원가): ${latest.partner} (매출 대비 ${((latest.partner/latest.revenue)*100).toFixed(1)}%)
- 인건비(개발운영): ${latest.devOps} (${((latest.devOps/latest.revenue)*100).toFixed(1)}%)
- 마케팅비: ${latest.marketing} (${((latest.marketing/latest.revenue)*100).toFixed(1)}%)
- 인프라: ${latest.infra} (${((latest.infra/latest.revenue)*100).toFixed(1)}%)

## 재무상태표 요약 (1Q26, 단위: 십억원)
- 총자산: ${latestBS.totalAssets}
- 총부채: ${latestBS.totalLiabilities}
- 자기자본: ${latestBS.controllingInterest}
- 부채비율: ${((latestBS.totalLiabilities / latestBS.controllingInterest) * 100).toFixed(1)}%
- 현금성자산: ${latestBS.cash}

## 별도 실적 1Q26 (단위: 십억원)
- 매출: ${latestSA.revenue} (연결 대비 ${((latestSA.revenue/latest.revenue)*100).toFixed(1)}%)
- 영업이익: ${latestSA.opIncome} (영업이익률 ${latestSA.opMargin}%)

아래 4가지 항목으로 구조화하여 분석해주세요. 각 항목은 번호와 제목으로 시작하고, 구체적인 수치를 반드시 포함하세요:

1. 수익성 진단: 1Q26 영업이익률 ${latest.opMargin}%의 의미와 전분기(${prev.opMargin}%) 대비 하락 원인
2. 성장 동력 분석: 가장 주목해야 할 부문과 그 이유
3. 리스크 요인: 비용 구조 및 수익성 측면에서의 위험 신호
4. 투자자 관점 핵심 체크포인트: 다음 분기 주목해야 할 지표 3가지

전문적이고 간결하게, 한국어로 작성해주세요.`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      }
    )

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ error: err.error?.message || 'Gemini API error' }, { status: res.status })
    }

    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      return NextResponse.json({ error: 'No response from Gemini' }, { status: 500 })
    }

    return NextResponse.json({ insights: text })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
