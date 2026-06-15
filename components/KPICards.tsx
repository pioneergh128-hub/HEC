'use client'

import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts'
import type { ConsolidatedISPeriod } from '@/types/financial'
import EditModal from './EditModal'

interface Props {
  data: ConsolidatedISPeriod[]
}

function DeltaBadge({ value, unit = '%' }: { value: number; unit?: string }) {
  const isPositive = value > 0
  const isZero = value === 0
  const color = isZero ? '#64748b' : isPositive ? '#10b981' : '#ef4444'
  const arrow = isZero ? '–' : isPositive ? '▲' : '▼'
  return (
    <span
      className="inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full number-font"
      style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}
    >
      {arrow} {Math.abs(value).toFixed(1)}{unit}
    </span>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs"
      style={{ background: '#0f1f3d', border: '1px solid rgba(59,130,246,0.3)', color: '#e2e8f0' }}
    >
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString('ko-KR', { maximumFractionDigits: 1 }) : p.value}
          {p.name?.includes('률') || p.name?.includes('margin') ? '%' : '십억'}
        </p>
      ))}
    </div>
  )
}

export default function KPICards({ data }: Props) {
  const [editModal, setEditModal] = useState<{ field: string; period: string; value: number } | null>(null)
  const latest = data[data.length - 1]
  const prev = data[data.length - 2]
  const prevYear = data[0]

  const yoy = (curr: number, py: number) => ((curr - py) / Math.abs(py)) * 100
  const qoq = (curr: number, pq: number) => ((curr - pq) / Math.abs(pq)) * 100

  const kpis = [
    {
      label: '영업수익',
      value: latest.revenue,
      yoy: yoy(latest.revenue, prevYear.revenue),
      qoq: qoq(latest.revenue, prev.revenue),
      field: 'revenue',
      color: '#3b82f6',
      icon: '💹',
    },
    {
      label: '영업이익',
      value: latest.opIncome,
      yoy: yoy(latest.opIncome, prevYear.opIncome),
      qoq: qoq(latest.opIncome, prev.opIncome),
      field: 'opIncome',
      color: '#10b981',
      icon: '📈',
    },
    {
      label: '영업이익률',
      value: latest.opMargin,
      yoy: latest.opMargin - prevYear.opMargin,
      qoq: latest.opMargin - prev.opMargin,
      field: 'opMargin',
      color: '#06b6d4',
      icon: '%',
      isMargin: true,
    },
    {
      label: '당기순이익',
      value: latest.netIncome,
      yoy: yoy(latest.netIncome, prevYear.netIncome),
      qoq: qoq(latest.netIncome, prev.netIncome),
      field: 'netIncome',
      color: '#8b5cf6',
      icon: '💰',
    },
    {
      label: '당기순이익률',
      value: latest.netMargin,
      yoy: latest.netMargin - prevYear.netMargin,
      qoq: latest.netMargin - prev.netMargin,
      field: 'netMargin',
      color: '#a78bfa',
      icon: '%',
      isMargin: true,
    },
    {
      label: '연결 FCF',
      value: latest.fcf,
      yoy: yoy(latest.fcf, prevYear.fcf),
      qoq: qoq(latest.fcf, prev.fcf),
      field: 'fcf',
      color: '#f59e0b',
      icon: '🔄',
    },
  ]

  const revenueChartData = data.map(d => ({
    period: d.period,
    '영업수익': d.revenue,
    '영업이익': d.opIncome,
    '영업이익률(%)': d.opMargin,
  }))

  const costChartData = [{
    name: '인건비',
    value: latest.headcount,
    color: '#3b82f6',
  }, {
    name: '파트너',
    value: latest.partner,
    color: '#10b981',
  }, {
    name: '인프라',
    value: latest.infra,
    color: '#06b6d4',
  }, {
    name: '마케팅',
    value: latest.marketing,
    color: '#8b5cf6',
  }, {
    name: '기타',
    value: latest.other,
    color: '#64748b',
  }]

  return (
    <div className="space-y-6">
      {/* KPI 카드 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map(kpi => (
          <div
            key={kpi.field}
            className="dashboard-card p-4 relative group"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-medium" style={{ color: '#64748b' }}>
                {kpi.label}
              </p>
              <button
                onClick={() => setEditModal({ field: kpi.field, period: latest.period, value: kpi.value })}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                title="수정"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
            <p
              className="text-2xl font-bold number-font leading-none mb-3"
              style={{ color: kpi.color }}
            >
              {kpi.isMargin
                ? `${kpi.value.toFixed(1)}%`
                : `${kpi.value.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}`}
              {!kpi.isMargin && <span className="text-sm font-normal ml-1" style={{ color: '#475569' }}>십억</span>}
            </p>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: '#475569' }}>YoY</span>
                <DeltaBadge value={kpi.yoy} unit={kpi.isMargin ? '%p' : '%'} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: '#475569' }}>QoQ</span>
                <DeltaBadge value={kpi.qoq} unit={kpi.isMargin ? '%p' : '%'} />
              </div>
            </div>
            {/* 컬러 바 */}
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl"
              style={{ background: kpi.color, opacity: 0.6 }}
            />
          </div>
        ))}
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 영업수익 & 영업이익 추이 */}
        <div className="xl:col-span-2 dashboard-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">분기별 영업수익 · 영업이익 추이</h3>
            <span className="text-xs" style={{ color: '#475569' }}>단위: 십억원</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueChartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.08)" vertical={false} />
              <XAxis
                dataKey="period"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `${(v / 1000).toFixed(1)}조`}
                domain={[0, 4000]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 25]}
                tickFormatter={v => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="left" dataKey="영업수익" fill="rgba(59,130,246,0.7)" radius={[3, 3, 0, 0]} maxBarSize={40}>
                {revenueChartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.period === '1Q26' ? '#3b82f6' : 'rgba(59,130,246,0.45)'}
                  />
                ))}
              </Bar>
              <Bar yAxisId="left" dataKey="영업이익" fill="rgba(16,185,129,0.7)" radius={[3, 3, 0, 0]} maxBarSize={40}>
                {revenueChartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.period === '1Q26' ? '#10b981' : 'rgba(16,185,129,0.45)'}
                  />
                ))}
              </Bar>
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="영업이익률(%)"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3 justify-center">
            {[
              { color: '#3b82f6', label: '영업수익' },
              { color: '#10b981', label: '영업이익' },
              { color: '#f59e0b', label: '영업이익률(%)' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
                <span className="text-xs" style={{ color: '#64748b' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 비용 구조 */}
        <div className="dashboard-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">1Q26 비용 구조</h3>
            <span className="text-xs" style={{ color: '#475569' }}>
              합계 {latest.opExpense.toLocaleString()}십억
            </span>
          </div>
          <div className="space-y-3">
            {costChartData.map(item => {
              const pct = (item.value / latest.opExpense) * 100
              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: '#94a3b8' }}>{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs number-font" style={{ color: '#64748b' }}>
                        {pct.toFixed(1)}%
                      </span>
                      <span className="text-xs font-semibold number-font" style={{ color: item.color }}>
                        {item.value.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${pct}%`, background: item.color, opacity: 0.85 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* FCF 박스 */}
          <div
            className="mt-5 p-3 rounded-xl"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ color: '#78716c' }}>연결 FCF</p>
                <p className="text-xl font-bold number-font" style={{ color: '#f59e0b' }}>
                  {latest.fcf.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}
                  <span className="text-sm font-normal ml-1" style={{ color: '#78716c' }}>십억</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs" style={{ color: '#78716c' }}>YoY</p>
                <DeltaBadge value={yoy(latest.fcf, prevYear.fcf)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 요약 테이블 */}
      <div className="dashboard-card overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
          <h3 className="text-sm font-semibold text-white">분기별 실적 요약 (연결)</h3>
          <span className="text-xs" style={{ color: '#475569' }}>단위: 십억원, %</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">항목</th>
                {data.map(d => (
                  <th key={d.period} className={`text-right ${d.period === '1Q26' ? 'text-blue-400' : ''}`}>
                    {d.period}
                    {d.period === '1Q26' && <span className="ml-1 text-amber-400">●</span>}
                  </th>
                ))}
                <th className="text-right">YoY</th>
                <th className="text-right">QoQ</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: '영업수익', key: 'revenue' as const },
                { label: '영업이익', key: 'opIncome' as const },
                { label: '영업이익률(%)', key: 'opMargin' as const, isMargin: true },
                { label: '당기순이익', key: 'netIncome' as const },
                { label: '순이익률(%)', key: 'netMargin' as const, isMargin: true },
                { label: '연결 FCF', key: 'fcf' as const },
              ].map(row => {
                const latestVal = latest[row.key]
                const prevVal = prev[row.key]
                const prevYearVal = prevYear[row.key]
                const yoyVal = row.isMargin
                  ? (latestVal as number) - (prevYearVal as number)
                  : yoy(latestVal as number, prevYearVal as number)
                const qoqVal = row.isMargin
                  ? (latestVal as number) - (prevVal as number)
                  : qoq(latestVal as number, prevVal as number)

                return (
                  <tr key={row.key}>
                    <td className="font-medium" style={{ color: '#94a3b8' }}>{row.label}</td>
                    {data.map(d => (
                      <td
                        key={d.period}
                        className={`text-right number-font text-sm ${d.period === '1Q26' ? 'font-semibold text-white' : ''}`}
                        style={{ color: d.period === '1Q26' ? '#fff' : '#64748b' }}
                      >
                        {row.isMargin
                          ? `${(d[row.key] as number).toFixed(1)}%`
                          : (d[row.key] as number).toLocaleString('ko-KR', { maximumFractionDigits: 1 })}
                      </td>
                    ))}
                    <td className="text-right">
                      <DeltaBadge value={yoyVal} unit={row.isMargin ? '%p' : '%'} />
                    </td>
                    <td className="text-right">
                      <DeltaBadge value={qoqVal} unit={row.isMargin ? '%p' : '%'} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editModal && (
        <EditModal
          table="consolidated_is"
          period={editModal.period}
          field={editModal.field}
          currentValue={editModal.value}
          onClose={() => setEditModal(null)}
          onSaved={() => {
            setEditModal(null)
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}
