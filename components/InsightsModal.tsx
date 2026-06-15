'use client'

import { useState } from 'react'

interface InsightsModalProps {
  onClose: () => void
}

export default function InsightsModal({ onClose }: InsightsModalProps) {
  const [loading, setLoading] = useState(false)
  const [insights, setInsights] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function fetchInsights() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/insights', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'API 오류')
      setInsights(data.insights)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  // 자동 실행
  if (!loading && !insights && !error) {
    fetchInsights()
  }

  function formatInsights(text: string) {
    return text.split('\n').map((line, i) => {
      if (/^#{1,3}\s/.test(line)) {
        const content = line.replace(/^#+\s/, '')
        return (
          <h3 key={i} style={{ color: '#60a5fa', fontWeight: 600, fontSize: 15, margin: '20px 0 8px' }}>
            {content}
          </h3>
        )
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <p key={i} style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 14, margin: '16px 0 6px' }}>
            {line}
          </p>
        )
      }
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={i} style={{ display: 'flex', gap: 8, margin: '4px 0' }}>
            <span style={{ color: '#3b82f6', flexShrink: 0 }}>•</span>
            <span style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7 }}>
              {line.replace(/^[-•]\s/, '')}
            </span>
          </div>
        )
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={i} style={{ color: '#cbd5e1', fontWeight: 600, fontSize: 13, margin: '4px 0' }}>
            {line.replace(/\*\*/g, '')}
          </p>
        )
      }
      if (!line.trim()) return <div key={i} style={{ height: 4 }} />
      return (
        <p key={i} style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, margin: '3px 0' }}>
          {line.replace(/\*\*(.*?)\*\*/g, '$1')}
        </p>
      )
    })
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 720, maxHeight: '85vh',
          background: '#0f1f3d', border: '1px solid rgba(59,130,246,0.25)',
          borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        {/* 모달 헤더 */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid rgba(59,130,246,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(59,130,246,0.3))',
              border: '1px solid rgba(99,102,241,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div>
              <h2 style={{ color: '#e2e8f0', fontSize: 15, fontWeight: 600, margin: 0 }}>
                AI 인사이트 분석
              </h2>
              <p style={{ color: '#475569', fontSize: 12, margin: 0 }}>
                Powered by Gemini 2.5 Flash · 1Q26 실적 기반
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: '#475569', padding: 4, borderRadius: 6,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* 모달 바디 */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{
                width: 40, height: 40, margin: '0 auto 16px',
                border: '3px solid rgba(59,130,246,0.2)',
                borderTopColor: '#3b82f6', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ color: '#475569', fontSize: 14 }}>Gemini 2.5 Flash 분석 중...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          )}

          {error && (
            <div style={{
              padding: '16px 20px', borderRadius: 10,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            }}>
              <p style={{ color: '#f87171', fontSize: 13, margin: 0 }}>오류: {error}</p>
              <button
                onClick={fetchInsights}
                style={{
                  marginTop: 12, padding: '6px 16px', borderRadius: 6, cursor: 'pointer',
                  background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
                  color: '#60a5fa', fontSize: 13,
                }}
              >
                다시 시도
              </button>
            </div>
          )}

          {insights && (
            <div>
              <div style={{
                padding: '10px 14px', borderRadius: 8, marginBottom: 20,
                background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)',
                display: 'flex', gap: 8, alignItems: 'flex-start',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                </svg>
                <p style={{ color: '#818cf8', fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                  본 분석은 AI가 재무 데이터를 기반으로 생성한 참고 자료이며, 투자 조언이 아닙니다.
                </p>
              </div>
              {formatInsights(insights)}
            </div>
          )}
        </div>

        {insights && (
          <div style={{
            padding: '14px 24px', borderTop: '1px solid rgba(59,130,246,0.1)',
            display: 'flex', justifyContent: 'flex-end', gap: 8, flexShrink: 0,
          }}>
            <button
              onClick={fetchInsights}
              style={{
                padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
                background: 'transparent', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa',
              }}
            >
              재분석
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
                background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#93c5fd',
              }}
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
