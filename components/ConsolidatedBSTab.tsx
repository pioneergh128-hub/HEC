'use client'

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import type { ConsolidatedBSPeriod } from '@/types/financial'

interface Props {
  data: ConsolidatedBSPeriod[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 rounded-lg text-xs min-w-[180px]"
      style={{ background: '#0f1f3d', border: '1px solid rgba(59,130,246,0.3)', color: '#e2e8f0' }}>
      <p className="font-semibold mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="number-font">{(p.value / 1000).toFixed(1)}조</span>
        </div>
      ))}
    </div>
  )
}

export default function ConsolidatedBSTab({ data }: Props) {
  const latest = data[data.length - 1]
  const prev = data[data.length - 2]

  const pct = (v: number, t: number) => ((v / t) * 100).toFixed(1)
  const chg = (c: number, p: number) => ((c - p) / Math.abs(p) * 100).toFixed(1)

  const assetComposition = [
    { name: '현금성자산', value: latest.cash, color: '#3b82f6' },
    { name: '매출채권', value: latest.receivables, color: '#60a5fa' },
    { name: '투자자산', value: latest.investments, color: '#10b981' },
    { name: '유형자산', value: latest.ppe, color: '#8b5cf6' },
    { name: '무형자산', value: latest.intangibles, color: '#06b6d4' },
    { name: '기타', value: latest.totalAssets - latest.cash - latest.receivables - latest.investments - latest.ppe - latest.intangibles, color: '#475569' },
  ]

  const trendData = data.map(d => ({
    period: d.period,
    '자산총계': d.totalAssets,
    '부채총계': d.totalLiabilities,
    '자본(지배)': d.controllingInterest,
  }))

  const kpis = [
    {
      label: '자산총계',
      value: latest.totalAssets,
      prev: prev.totalAssets,
      color: '#3b82f6',
    },
    {
      label: '부채총계',
      value: latest.totalLiabilities,
      prev: prev.totalLiabilities,
      color: '#ef4444',
    },
    {
      label: '지배주주 자본',
      value: latest.controllingInterest,
      prev: prev.controllingInterest,
      color: '#10b981',
    },
    {
      label: '현금및현금성자산',
      value: latest.cash,
      prev: prev.cash,
      color: '#06b6d4',
    },
  ]

  return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(kpi => {
          const diff = Number(chg(kpi.value, kpi.prev))
          return (
            <div key={kpi.label} className="dashboard-card p-5">
              <p className="text-xs mb-2" style={{ color: '#64748b' }}>{kpi.label}</p>
              <p className="text-2xl font-bold number-font" style={{ color: kpi.color }}>
                {(kpi.value / 1000).toFixed(1)}
                <span className="text-sm font-normal ml-1" style={{ color: '#475569' }}>조원</span>
              </p>
              <p className="text-xs mt-2">
                <span style={{ color: '#475569' }}>QoQ </span>
                <span style={{ color: diff >= 0 ? '#10b981' : '#ef4444' }}>
                  {diff >= 0 ? '▲' : '▼'} {Math.abs(diff)}%
                </span>
              </p>
            </div>
          )
        })}
      </div>

      {/* 재무 레버리지 인디케이터 */}
      <div className="dashboard-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">재무 구조 (1Q26)</h3>
        <div className="flex flex-col gap-3">
          {/* 자산 = 부채 + 자본 */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span style={{ color: '#94a3b8' }}>자산총계 {(latest.totalAssets / 1000).toFixed(1)}조</span>
              <div className="flex gap-4">
                <span style={{ color: '#ef4444' }}>부채 {pct(latest.totalLiabilities, latest.totalAssets)}%</span>
                <span style={{ color: '#10b981' }}>자본 {pct(latest.totalAssets - latest.totalLiabilities, latest.totalAssets)}%</span>
              </div>
            </div>
            <div className="flex h-4 rounded-full overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${pct(latest.totalLiabilities, latest.totalAssets)}%`,
                  background: 'rgba(239,68,68,0.7)',
                }}
              />
              <div
                className="h-full flex-1"
                style={{ background: 'rgba(16,185,129,0.7)' }}
              />
            </div>
          </div>

          {/* 유동/비유동 자산 */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span style={{ color: '#94a3b8' }}>유동 vs 비유동 자산</span>
              <div className="flex gap-4">
                <span style={{ color: '#3b82f6' }}>유동 {pct(latest.currentAssets, latest.totalAssets)}%</span>
                <span style={{ color: '#8b5cf6' }}>비유동 {pct(latest.nonCurrentAssets, latest.totalAssets)}%</span>
              </div>
            </div>
            <div className="flex h-4 rounded-full overflow-hidden">
              <div
                style={{
                  width: `${pct(latest.currentAssets, latest.totalAssets)}%`,
                  background: 'rgba(59,130,246,0.7)',
                }}
              />
              <div className="flex-1" style={{ background: 'rgba(139,92,246,0.7)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 차트 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* 추이 차트 */}
        <div className="dashboard-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">재무상태 추이</h3>
            <span className="text-xs" style={{ color: '#475569' }}>단위: 십억원</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="assetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.08)" vertical={false} />
              <XAxis dataKey="period" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1000).toFixed(0)}조`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="자산총계" stroke="#3b82f6" fill="url(#assetGrad)" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
              <Area type="monotone" dataKey="자본(지배)" stroke="#10b981" fill="url(#equityGrad)" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
              <Area type="monotone" dataKey="부채총계" stroke="#ef4444" fill="none" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {[
              { color: '#3b82f6', label: '자산총계' },
              { color: '#10b981', label: '지배주주 자본' },
              { color: '#ef4444', label: '부채총계' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-3 h-1 rounded" style={{ background: l.color }} />
                <span className="text-xs" style={{ color: '#64748b' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 자산 구성 */}
        <div className="dashboard-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">1Q26 자산 구성</h3>
            <span className="text-xs" style={{ color: '#475569' }}>
              총 {(latest.totalAssets / 1000).toFixed(1)}조원
            </span>
          </div>
          <div className="space-y-3">
            {assetComposition.map(item => {
              const p = (item.value / latest.totalAssets) * 100
              return (
                <div key={item.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs" style={{ color: '#94a3b8' }}>{item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs number-font" style={{ color: '#64748b' }}>{p.toFixed(1)}%</span>
                      <span className="text-xs font-semibold number-font" style={{ color: item.color }}>
                        {(item.value / 1000).toFixed(2)}조
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${p}%`, background: item.color, opacity: 0.85 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* BS 상세 테이블 */}
      <div className="dashboard-card overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
          <h3 className="text-sm font-semibold text-white">재무상태표 상세 (연결)</h3>
          <span className="text-xs" style={{ color: '#475569' }}>단위: 십억원</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">항목</th>
                {data.map(d => (
                  <th key={d.period} className={`text-right ${d.period === '1Q26' ? 'text-blue-400' : ''}`}>
                    {d.period}
                  </th>
                ))}
                <th className="text-right">QoQ</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: '유동자산', key: 'currentAssets' as keyof ConsolidatedBSPeriod, depth: 0 },
                { label: '├ 현금및현금성자산', key: 'cash' as keyof ConsolidatedBSPeriod, depth: 1 },
                { label: '├ 매출채권', key: 'receivables' as keyof ConsolidatedBSPeriod, depth: 1 },
                { label: '└ 기타유동자산', key: 'otherCurrent' as keyof ConsolidatedBSPeriod, depth: 1 },
                { label: '비유동자산', key: 'nonCurrentAssets' as keyof ConsolidatedBSPeriod, depth: 0 },
                { label: '├ 투자자산', key: 'investments' as keyof ConsolidatedBSPeriod, depth: 1 },
                { label: '├ 유형자산', key: 'ppe' as keyof ConsolidatedBSPeriod, depth: 1 },
                { label: '├ 사용권자산', key: 'rightOfUse' as keyof ConsolidatedBSPeriod, depth: 1 },
                { label: '└ 무형자산', key: 'intangibles' as keyof ConsolidatedBSPeriod, depth: 1 },
                { label: '자산총계', key: 'totalAssets' as keyof ConsolidatedBSPeriod, depth: 0, bold: true },
                { label: '유동부채', key: 'currentLiabilities' as keyof ConsolidatedBSPeriod, depth: 0 },
                { label: '비유동부채', key: 'nonCurrentLiabilities' as keyof ConsolidatedBSPeriod, depth: 0 },
                { label: '부채총계', key: 'totalLiabilities' as keyof ConsolidatedBSPeriod, depth: 0, bold: true },
                { label: '지배주주지분', key: 'controllingInterest' as keyof ConsolidatedBSPeriod, depth: 0, bold: true },
              ].map(row => {
                const latestVal = latest[row.key] as number
                const prevVal = prev[row.key] as number
                const qoqChg = ((latestVal - prevVal) / Math.abs(prevVal)) * 100

                return (
                  <tr key={row.key} style={{ fontWeight: row.bold ? 700 : row.depth === 0 ? 600 : 400 }}>
                    <td
                      className="text-xs"
                      style={{
                        color: row.bold ? '#e2e8f0' : row.depth === 0 ? '#94a3b8' : '#64748b',
                        paddingLeft: `${16 + row.depth * 12}px`,
                        fontFamily: row.depth > 0 ? 'monospace' : 'inherit',
                      }}
                    >
                      {row.label}
                    </td>
                    {data.map(d => (
                      <td
                        key={d.period}
                        className="text-right number-font text-sm"
                        style={{ color: d.period === '1Q26' ? (row.bold ? '#fff' : '#e2e8f0') : '#64748b' }}
                      >
                        {(d[row.key] as number).toLocaleString('ko-KR')}
                      </td>
                    ))}
                    <td className="text-right">
                      <span
                        className="text-xs font-semibold number-font"
                        style={{ color: qoqChg >= 0 ? '#10b981' : '#ef4444' }}
                      >
                        {qoqChg >= 0 ? '+' : ''}{qoqChg.toFixed(1)}%
                      </span>
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
