'use client'

import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import type { StandaloneISPeriod, StandaloneBSPeriod } from '@/types/financial'

interface Props {
  isData: StandaloneISPeriod[]
  bsData: StandaloneBSPeriod[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 rounded-lg text-xs min-w-[160px]"
      style={{ background: '#0f1f3d', border: '1px solid rgba(59,130,246,0.3)', color: '#e2e8f0' }}>
      <p className="font-semibold mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span style={{ color: p.color || p.fill }}>{p.name}</span>
          <span className="number-font">
            {typeof p.value === 'number'
              ? (p.name?.includes('%') ? `${p.value.toFixed(1)}%` : p.value.toLocaleString('ko-KR', { maximumFractionDigits: 1 }))
              : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function StandaloneTab({ isData, bsData }: Props) {
  const latestIS = isData[isData.length - 1]
  const prevIS = isData[isData.length - 2]
  const prevYearIS = isData[0]
  const latestBS = bsData[bsData.length - 1]

  const yoy = (c: number, p: number) => ((c - p) / Math.abs(p)) * 100

  const chartData = isData.map(d => ({
    period: d.period,
    '영업수익': d.revenue,
    '영업이익': d.opIncome,
    '영업이익률(%)': d.opMargin,
    '당기순이익': d.netIncome,
    '순이익률(%)': d.netMargin,
  }))

  const comparison = [
    {
      label: '영업이익률',
      consolidated: 16.7,
      standalone: latestIS.opMargin,
      color: '#3b82f6',
    },
    {
      label: '순이익률',
      consolidated: 9.0,
      standalone: latestIS.netMargin,
      color: '#10b981',
    },
  ]

  const kpis = [
    { label: '영업수익', value: latestIS.revenue, yoy: yoy(latestIS.revenue, prevYearIS.revenue), qoq: yoy(latestIS.revenue, prevIS.revenue), color: '#3b82f6' },
    { label: '영업이익', value: latestIS.opIncome, yoy: yoy(latestIS.opIncome, prevYearIS.opIncome), qoq: yoy(latestIS.opIncome, prevIS.opIncome), color: '#10b981' },
    { label: '영업이익률', value: latestIS.opMargin, yoy: latestIS.opMargin - prevYearIS.opMargin, qoq: latestIS.opMargin - prevIS.opMargin, color: '#06b6d4', isMargin: true },
    { label: '당기순이익', value: latestIS.netIncome, yoy: yoy(latestIS.netIncome, prevYearIS.netIncome), qoq: yoy(latestIS.netIncome, prevIS.netIncome), color: '#8b5cf6' },
  ]

  return (
    <div className="space-y-6">
      {/* 비교 배너: 연결 vs 별도 */}
      <div
        className="dashboard-card p-4"
        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(16,185,129,0.05))' }}
      >
        <p className="text-xs font-medium mb-3" style={{ color: '#64748b' }}>
          연결 vs 별도 주요 지표 비교 (1Q26)
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '영업수익', cons: 3241.1, stand: latestIS.revenue },
            { label: '영업이익', cons: 541.8, stand: latestIS.opIncome },
            { label: '영업이익률', cons: 16.7, stand: latestIS.opMargin, isMargin: true },
            { label: '당기순이익', cons: 291.0, stand: latestIS.netIncome },
          ].map(item => (
            <div key={item.label}>
              <p className="text-xs mb-2" style={{ color: '#475569' }}>{item.label}</p>
              <div className="flex items-end gap-3">
                <div>
                  <p className="text-xs" style={{ color: '#64748b' }}>연결</p>
                  <p className="text-base font-bold number-font" style={{ color: '#3b82f6' }}>
                    {item.isMargin ? `${item.cons.toFixed(1)}%` : item.cons.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}
                  </p>
                </div>
                <div className="text-xs" style={{ color: '#334155' }}>vs</div>
                <div>
                  <p className="text-xs" style={{ color: '#64748b' }}>별도</p>
                  <p className="text-base font-bold number-font" style={{ color: '#10b981' }}>
                    {item.isMargin ? `${item.stand.toFixed(1)}%` : item.stand.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className="dashboard-card p-4">
            <p className="text-xs mb-2" style={{ color: '#64748b' }}>{kpi.label}</p>
            <p className="text-2xl font-bold number-font" style={{ color: kpi.color }}>
              {kpi.isMargin ? `${kpi.value.toFixed(1)}%` : kpi.value.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}
              {!kpi.isMargin && <span className="text-sm font-normal ml-1" style={{ color: '#475569' }}>십억</span>}
            </p>
            <div className="flex gap-3 mt-2">
              <span className="text-xs" style={{ color: '#475569' }}>
                YoY <span style={{ color: kpi.yoy >= 0 ? '#10b981' : '#ef4444' }}>
                  {kpi.yoy >= 0 ? '+' : ''}{kpi.yoy.toFixed(1)}{kpi.isMargin ? '%p' : '%'}
                </span>
              </span>
              <span className="text-xs" style={{ color: '#475569' }}>
                QoQ <span style={{ color: kpi.qoq >= 0 ? '#10b981' : '#ef4444' }}>
                  {kpi.qoq >= 0 ? '+' : ''}{kpi.qoq.toFixed(1)}{kpi.isMargin ? '%p' : '%'}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 차트 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* 별도 손익 추이 */}
        <div className="dashboard-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">별도 손익 추이</h3>
            <span className="text-xs" style={{ color: '#475569' }}>단위: 십억원</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.08)" vertical={false} />
              <XAxis dataKey="period" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1000).toFixed(1)}조`} domain={[0, 2500]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
                domain={[0, 50]} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="left" dataKey="영업수익" maxBarSize={36} radius={[3, 3, 0, 0]}>
                {chartData.map((e, i) => (
                  <Cell key={i} fill={e.period === '1Q26' ? '#3b82f6' : 'rgba(59,130,246,0.4)'} />
                ))}
              </Bar>
              <Bar yAxisId="left" dataKey="영업이익" maxBarSize={36} radius={[3, 3, 0, 0]}>
                {chartData.map((e, i) => (
                  <Cell key={i} fill={e.period === '1Q26' ? '#10b981' : 'rgba(16,185,129,0.4)'} />
                ))}
              </Bar>
              <Line yAxisId="right" type="monotone" dataKey="영업이익률(%)" stroke="#f59e0b" strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 4 }} activeDot={{ r: 6 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 별도 재무상태표 */}
        <div className="dashboard-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">별도 재무상태 (최근)</h3>
          <div className="space-y-4">
            {[
              { label: '자산총계', value: latestBS.totalAssets, color: '#3b82f6' },
              { label: '현금및현금성자산', value: latestBS.cash, color: '#06b6d4' },
              { label: '투자자산', value: latestBS.investments, color: '#10b981' },
              { label: '부채총계', value: latestBS.totalLiabilities, color: '#ef4444' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-sm" style={{ color: '#94a3b8' }}>{item.label}</span>
                <span className="text-sm font-bold number-font" style={{ color: item.color }}>
                  {(item.value / 1000).toFixed(1)}조
                </span>
              </div>
            ))}
            <div
              className="mt-2 p-3 rounded-xl text-xs"
              style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)', color: '#64748b' }}
            >
              * 별도 BS는 {latestBS.period} 기준 (1Q26 미발표)
            </div>
          </div>
        </div>
      </div>

      {/* 별도 IS 상세 테이블 */}
      <div className="dashboard-card overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
          <h3 className="text-sm font-semibold text-white">별도 손익계산서 상세</h3>
          <span className="text-xs" style={{ color: '#475569' }}>단위: 십억원</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">항목</th>
                {isData.map(d => (
                  <th key={d.period} className={`text-right ${d.period === '1Q26' ? 'text-blue-400' : ''}`}>
                    {d.period}{d.period === '1Q26' && ' ●'}
                  </th>
                ))}
                <th className="text-right">YoY</th>
                <th className="text-right">QoQ</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: '영업수익', key: 'revenue' as keyof StandaloneISPeriod },
                { label: '영업비용', key: 'opExpense' as keyof StandaloneISPeriod },
                { label: '영업이익', key: 'opIncome' as keyof StandaloneISPeriod, bold: true },
                { label: '영업이익률(%)', key: 'opMargin' as keyof StandaloneISPeriod, isMargin: true },
                { label: '영업외수익', key: 'otherIncome' as keyof StandaloneISPeriod },
                { label: '영업외비용', key: 'otherExpense' as keyof StandaloneISPeriod },
                { label: '법인세차감전순이익', key: 'ebt' as keyof StandaloneISPeriod },
                { label: '법인세비용', key: 'taxExpense' as keyof StandaloneISPeriod },
                { label: '당기순이익', key: 'netIncome' as keyof StandaloneISPeriod, bold: true },
                { label: '순이익률(%)', key: 'netMargin' as keyof StandaloneISPeriod, isMargin: true },
              ].map(row => {
                const lv = latestIS[row.key] as number
                const pv = prevIS[row.key] as number
                const pyv = prevYearIS[row.key] as number
                const yoyVal = row.isMargin ? lv - pyv : ((lv - pyv) / Math.abs(pyv)) * 100
                const qoqVal = row.isMargin ? lv - pv : ((lv - pv) / Math.abs(pv)) * 100

                return (
                  <tr key={row.key} style={{ fontWeight: row.bold ? 700 : 400 }}>
                    <td className="text-sm" style={{ color: row.bold ? '#e2e8f0' : '#94a3b8' }}>{row.label}</td>
                    {isData.map(d => (
                      <td key={d.period} className="text-right number-font text-sm"
                        style={{ color: d.period === '1Q26' ? (row.bold ? '#fff' : '#e2e8f0') : '#64748b' }}>
                        {row.isMargin
                          ? `${(d[row.key] as number).toFixed(1)}%`
                          : (d[row.key] as number).toLocaleString('ko-KR', { maximumFractionDigits: 1 })}
                      </td>
                    ))}
                    <td className="text-right">
                      <span className="text-xs font-semibold number-font"
                        style={{ color: yoyVal >= 0 ? '#10b981' : '#ef4444' }}>
                        {yoyVal >= 0 ? '+' : ''}{yoyVal.toFixed(1)}{row.isMargin ? '%p' : '%'}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className="text-xs font-semibold number-font"
                        style={{ color: qoqVal >= 0 ? '#10b981' : '#ef4444' }}>
                        {qoqVal >= 0 ? '+' : ''}{qoqVal.toFixed(1)}{row.isMargin ? '%p' : '%'}
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
