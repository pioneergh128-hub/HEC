'use client'

import { useState } from 'react'

interface Props {
  table: string
  period: string
  field: string
  currentValue: number
  onClose: () => void
  onSaved: () => void
}

const FIELD_LABELS: Record<string, string> = {
  revenue: '영업수익',
  naverPlatform: '네이버 플랫폼',
  ad: '광고',
  service: '서비스',
  financialPlatform: '파이낸셜 플랫폼',
  globalChallenge: '글로벌 도전',
  c2c: 'C2C',
  content: '콘텐츠',
  enterprise: '엔터프라이즈',
  opIncome: '영업이익',
  opMargin: '영업이익률(%)',
  netIncome: '당기순이익',
  netMargin: '당기순이익률(%)',
  fcf: '연결 FCF',
}

export default function EditModal({ table, period, field, currentValue, onClose, onSaved }: Props) {
  const [value, setValue] = useState(String(currentValue))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    const numVal = parseFloat(value)
    if (isNaN(numVal)) {
      setError('유효한 숫자를 입력하세요.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/financial-data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table,
          period,
          field,
          value: numVal,
          oldValue: currentValue,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || '저장 실패')
        setLoading(false)
        return
      }

      onSaved()
    } catch {
      setError('서버 연결 오류')
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-sm mx-4 rounded-2xl p-6"
        style={{ background: '#0f1f3d', border: '1px solid rgba(59,130,246,0.3)', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">데이터 수정</h2>
          <button onClick={onClose} className="p-1" style={{ color: '#475569' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>
              {period}
            </span>
            <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
              {FIELD_LABELS[field] || field}
            </span>
          </div>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#64748b' }}>
              현재값: <span className="text-white number-font">{currentValue.toLocaleString('ko-KR')}</span>
            </label>
            <input
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
              step="0.1"
              className="w-full px-3 py-2.5 rounded-lg text-sm number-font outline-none"
              style={{
                background: '#060d1f',
                border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(59,130,246,0.3)'}`,
                color: '#e2e8f0',
              }}
              onFocus={e => { e.target.style.border = '1px solid rgba(59,130,246,0.7)' }}
              onBlur={e => { e.target.style.border = '1px solid rgba(59,130,246,0.3)' }}
              autoFocus
            />
            {error && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{error}</p>}
          </div>

          <div
            className="text-xs p-3 rounded-lg"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', color: '#92400e' }}
          >
            변경 이력이 감사 로그에 기록됩니다.
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: loading ? 'rgba(59,130,246,0.3)' : 'linear-gradient(135deg, #2563eb, #3b82f6)',
              color: loading ? '#64748b' : '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}
