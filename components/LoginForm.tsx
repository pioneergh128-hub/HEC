'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '로그인 실패')
        setLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('서버 연결 오류가 발생했습니다.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="rounded-2xl p-8"
        style={{
          background: '#0f1f3d',
          border: '1px solid rgba(59,130,246,0.2)',
          boxShadow: '0 0 0 1px rgba(59,130,246,0.1), 0 24px 48px rgba(0,0,0,0.4)',
        }}
      >
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-2"
            style={{ color: '#94a3b8' }}
          >
            접근 비밀번호
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: '#060d1f',
                border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(59,130,246,0.2)'}`,
                color: '#e2e8f0',
                boxShadow: password ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
              }}
              onFocus={e => {
                e.target.style.border = '1px solid rgba(59,130,246,0.6)'
                e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'
              }}
              onBlur={e => {
                e.target.style.border = '1px solid rgba(59,130,246,0.2)'
                e.target.style.boxShadow = 'none'
              }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
          </div>
          {error && (
            <p className="mt-2 text-xs" style={{ color: '#ef4444' }}>
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: loading || !password
              ? 'rgba(59,130,246,0.3)'
              : 'linear-gradient(135deg, #2563eb, #3b82f6)',
            color: loading || !password ? '#64748b' : '#fff',
            cursor: loading || !password ? 'not-allowed' : 'pointer',
            boxShadow: loading || !password ? 'none' : '0 0 20px rgba(59,130,246,0.3)',
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75"/>
              </svg>
              인증 중...
            </span>
          ) : (
            '대시보드 접속'
          )}
        </button>
      </div>
    </form>
  )
}
