'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts'
import type { ConsolidatedISPeriod } from '@/types/financial'

interface Props {
  data: ConsolidatedISPeriod[]
}

const SEGMENT_COLORS = {
  naverPlatform: '#3b82f6',
  financialPlatform: '#10b981',
  globalChallenge: '#8b5cf6',
}

const SUB_COLORS = {
  ad: '#2563eb',
  service: '#60a5fa',
  c2c: '#7c3aed',
  content: '#a78bfa',
  enterprise: '#c4b5fd',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs min-w-[160px]"
      style={{ background: '#0f1f3d', border: '1px solid rgba(59,130,246,0.3)', color: '#e2e8f0' }}
    >
      <p className="font-semibold mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span style={{ color: p.fill || p.color }}>{p.name}</span>
          <span className="number-font">{p.value?.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}</span>
        </div>
      ))}
    </div>
  )
}

export default function RevenueSegmentTab({ data }: Props) {
  const latest = data[data.length - 1]
  const prevYear = data[0]

  const yoy = (curr: number, py: number) => ((curr - py) / Math.abs(py)) * 100

  const stackedData = data.map(d => ({
    period: d.period,
    '네이버 플랫폼': d.naverPlatform,
    '파이낸셜 플랫폼': d.financialPlatform,
    '글로벌 도전': d.globalChallenge,
  }))

  const subSegmentData = [
    { name: '광고', value: latest.ad, yoy: yoy(latest.ad, prevYear.ad), color: '#2563eb' },
    { name: '서비스', value: latest.service, yoy: yoy(latest.service, prevYear.service), color: '#60a5fa' },
    { name: 'C2C', value: latest.c2c, yoy: yoy(latest.c2c, prevYear.c2c), color: '#7c3aed' },
    { name: '콘텐츠', value: latest.content, yoy: yoy(latest.content, prevYear.content), color: '#a78bfa' },
    { name: '엔터프라이즈', value: latest.enterprise, yoy: yoy(latest.enterprise, prevYear.enterprise), color: '#06b6d4' },
    { name: '파이낸셜', value: latest.financialPlatform, yoy: yoy(latest.financialPlatform, prevYear.financialPlatform), color: '#10b981' },
  ]

  const growthData = [
    { segment: '네이버 플랫폼', yoy: yoy(latest.naverPlatform, prevYear.naverPlatform) },
    { segment: 'C2C', yoy: yoy(latest.c2c, prevYear.c2c) },
    { segment: '서비스', yoy: yoy(latest.service, prevYear.service) },
    { segment: '파이낸셜', yoy: yoy(latest.financialPlatform, prevYear.financialPlatform) },
    { segment: '엔터프라이즈', yoy: yoy(latest.enterprise, prevYear.enterprise) },
    { segment: '광고', yoy: yoy(latest.ad, prevYear.ad) },
    { segment: '글로벌 도전', yoy: yoy(latest.globalChallenge, prevYear.globalChallenge) },
    { segment: '콘텐츠', yoy: yoy(latest.content, prevYear.content) },
  ].sort((a, b) => b.yoy - a.yoy)

  // 세그먼트 기여도
  const segments = [
    { name: '네이버 플랫폼', value: latest.naverPlatform, pct: (latest.naverPlatform / latest.revenue) * 100, color: '#3b82f6' },
    { name: '파이낸셜 플랫폼', value: latest.financialPlatform, pct: (latest.financialPlatform / latest.revenue) * 100, color: '#10b981' },
    { name: '글로벌 도전', value: latest.globalChallenge, pct: (latest.globalChallenge / latest.revenue) * 100, color: '#8b5cf6' },
  ]

  return (
    <div className="space-y-6">
      {/* 세그먼트 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {segments.map(seg => (
          <div key={seg.name} className="dashboard-card p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>{seg.name}</p>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium number-font"
                style={{ background: `${seg.color}18`, color: seg.color, border: `1px solid ${seg.color}30` }}
              >
                {seg.pct.toFixed(1)}%
              </span>
            </div>
            <p className="text-3xl font-bold number-font" style={{ color: seg.color }}>
              {seg.value.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}
              <span className="text-base font-normal ml-1" style={{ color: '#475569' }}>십억</span>
            </p>
            <p className="text-xs mt-2" style={{ color: '#475569' }}>
              YoY{' '}
              <span style={{ color: yoy(seg.value, (prevYear as any)[Object.keys(data[0]).find(k => (data[0] as any)[k] === (prevYear as any)[k.replace('naverPlatform', 'naverPlatform')]) || ''] || seg.value) > 0 ? '#10b981' : '#ef4444' }}>
                +{yoy(
                  seg.value,
                  seg.name === '네이버 플랫폼' ? prevYear.naverPlatform :
                  seg.name === '파이낸셜 플랫폼' ? prevYear.financialPlatform :
                  prevYear.globalChallenge
                ).toFixed(1)}%
              </span>
            </p>
            <div className="mt-3 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="h-1 rounded-full" style={{ width: `${seg.pct}%`, background: seg.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* 차트 그리드 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* 누적 막대 차트 */}
        <div className="dashboard-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">분기별 사업부문 매출 추이</h3>
            <span className="text-xs" style={{ color: '#475569' }}>단위: 십억원</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stackedData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.08)" vertical={false} />
              <XAxis dataKey="period" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1000).toFixed(1)}조`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="네이버 플랫폼" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="파이낸셜 플랫폼" stackId="a" fill="#10b981" />
              <Bar dataKey="글로벌 도전" stackId="a" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {[
              { color: '#3b82f6', label: '네이버 플랫폼' },
              { color: '#10b981', label: '파이낸셜 플랫폼' },
              { color: '#8b5cf6', label: '글로벌 도전' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-3 h-2 rounded-sm" style={{ background: l.color }} />
                <span className="text-xs" style={{ color: '#64748b' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* YoY 성장률 */}
        <div className="dashboard-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">세부 세그먼트 YoY 성장률 (1Q26)</h3>
            <span className="text-xs" style={{ color: '#475569' }}>vs 1Q25</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={growthData} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.08)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `${v}%`}
              />
              <YAxis
                dataKey="segment"
                type="category"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const val = payload[0].value as number
                  return (
                    <div className="px-3 py-2 rounded-lg text-xs" style={{ background: '#0f1f3d', border: '1px solid rgba(59,130,246,0.3)' }}>
                      <p style={{ color: val >= 0 ? '#10b981' : '#ef4444' }}>
                        {val >= 0 ? '▲' : '▼'} {Math.abs(val).toFixed(1)}% YoY
                      </p>
                    </div>
                  )
                }}
              />
              <ReferenceLine x={0} stroke="rgba(255,255,255,0.1)" />
              <Bar dataKey="yoy" radius={[0, 3, 3, 0]}>
                {growthData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.yoy >= 0 ? '#10b981' : '#ef4444'}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 세부 세그먼트 테이블 */}
      <div className="dashboard-card overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
          <h3 className="text-sm font-semibold text-white">세부 사업부문 실적 현황</h3>
          <span className="text-xs" style={{ color: '#475569' }}>단위: 십억원</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">사업부문</th>
                {data.map(d => (
                  <th key={d.period} className={`text-right ${d.period === '1Q26' ? 'text-blue-400' : ''}`}>
                    {d.period}{d.period === '1Q26' && ' ●'}
                  </th>
                ))}
                <th className="text-right">YoY</th>
                <th className="text-right">QoQ</th>
                <th className="text-right">비중</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: '영업수익', key: 'revenue' as keyof ConsolidatedISPeriod, depth: 0 },
                { label: '├ 네이버 플랫폼', key: 'naverPlatform' as keyof ConsolidatedISPeriod, depth: 1, color: '#3b82f6' },
                { label: '│ ├ 광고', key: 'ad' as keyof ConsolidatedISPeriod, depth: 2 },
                { label: '│ └ 서비스', key: 'service' as keyof ConsolidatedISPeriod, depth: 2 },
                { label: '├ 파이낸셜 플랫폼', key: 'financialPlatform' as keyof ConsolidatedISPeriod, depth: 1, color: '#10b981' },
                { label: '└ 글로벌 도전', key: 'globalChallenge' as keyof ConsolidatedISPeriod, depth: 1, color: '#8b5cf6' },
                { label: '  ├ C2C', key: 'c2c' as keyof ConsolidatedISPeriod, depth: 2 },
                { label: '  ├ 콘텐츠', key: 'content' as keyof ConsolidatedISPeriod, depth: 2 },
                { label: '  └ 엔터프라이즈', key: 'enterprise' as keyof ConsolidatedISPeriod, depth: 2 },
              ].map(row => {
                const latestVal = latest[row.key] as number
                const prevVal = data[data.length - 2][row.key] as number
                const prevYearVal = data[0][row.key] as number
                const yoyVal = ((latestVal - prevYearVal) / Math.abs(prevYearVal)) * 100
                const qoqVal = ((latestVal - prevVal) / Math.abs(prevVal)) * 100
                const share = (latestVal / latest.revenue) * 100

                return (
                  <tr key={row.key} style={{ fontWeight: row.depth === 0 ? 700 : row.depth === 1 ? 600 : 400 }}>
                    <td
                      className="font-mono text-xs"
                      style={{
                        color: row.color || (row.depth === 0 ? '#e2e8f0' : row.depth === 1 ? '#94a3b8' : '#64748b'),
                        paddingLeft: `${16 + row.depth * 12}px`,
                      }}
                    >
                      {row.label}
                    </td>
                    {data.map(d => (
                      <td
                        key={d.period}
                        className="text-right number-font text-sm"
                        style={{ color: d.period === '1Q26' ? (row.depth === 0 ? '#fff' : '#e2e8f0') : '#64748b' }}
                      >
                        {(d[row.key] as number).toLocaleString('ko-KR', { maximumFractionDigits: 1 })}
                      </td>
                    ))}
                    <td className="text-right">
                      <span
                        className="text-xs font-semibold number-font"
                        style={{ color: yoyVal >= 0 ? '#10b981' : '#ef4444' }}
                      >
                        {yoyVal >= 0 ? '+' : ''}{yoyVal.toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-right">
                      <span
                        className="text-xs font-semibold number-font"
                        style={{ color: qoqVal >= 0 ? '#10b981' : '#ef4444' }}
                      >
                        {qoqVal >= 0 ? '+' : ''}{qoqVal.toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-right number-font text-xs" style={{ color: '#64748b' }}>
                      {share.toFixed(1)}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
