'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import KPICards from './KPICards'
import RevenueSegmentTab from './RevenueSegmentTab'
import ConsolidatedBSTab from './ConsolidatedBSTab'
import StandaloneTab from './StandaloneTab'
import { consolidatedIS, consolidatedBS, standaloneIS, standaloneBS } from '@/lib/financial-data'

const TABS = [
  { id: 'overview', label: '핵심 지표', icon: '📊' },
  { id: 'segment', label: '사업부문 실적', icon: '📈' },
  { id: 'balance', label: '연결 재무상태표', icon: '🏦' },
  { id: 'standalone', label: '별도 손익', icon: '📋' },
]

export default function DashboardClient() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen" style={{ background: '#060d1f' }}>
      {/* 헤더 */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(6,13,31,0.95)',
          borderBottom: '1px solid rgba(59,130,246,0.15)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-4">
          {/* NAVER 로고 */}
          <div
            className="flex items-center justify-center w-9 h-9 rounded-lg"
            style={{ background: 'linear-gradient(135deg, #1e3a6e, #2a4f8f)', border: '1px solid rgba(59,130,246,0.3)' }}
          >
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path d="M6 6h7l9 14V6h4v20h-7L10 12v14H6V6z" fill="#3b82f6" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-none">
              NAVER 실적 대시보드
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
              Financial Factsheet 1Q26 (IFRS)
            </p>
          </div>

          {/* 진행 중 배지 */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium in-progress-badge"
            style={{
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.3)',
              color: '#f59e0b',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            2026년 1분기 확정 실적
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: '#475569' }}>
            단위: 십억원 (연결 기준)
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{
              color: '#64748b',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#ef4444'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.3)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = '#64748b'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            로그아웃
          </button>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <div
        className="px-6 flex gap-1 overflow-x-auto"
        style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-all border-b-2"
            style={{
              borderBottomColor: activeTab === tab.id ? '#3b82f6' : 'transparent',
              color: activeTab === tab.id ? '#3b82f6' : '#64748b',
              background: activeTab === tab.id ? 'rgba(59,130,246,0.08)' : 'transparent',
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <main className="px-6 py-6 max-w-[1600px] mx-auto">
        <div className="animate-fadeInUp">
          {activeTab === 'overview' && (
            <KPICards data={consolidatedIS} />
          )}
          {activeTab === 'segment' && (
            <RevenueSegmentTab data={consolidatedIS} />
          )}
          {activeTab === 'balance' && (
            <ConsolidatedBSTab data={consolidatedBS} />
          )}
          {activeTab === 'standalone' && (
            <StandaloneTab isData={standaloneIS} bsData={standaloneBS} />
          )}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="px-6 py-4 text-center border-t" style={{ borderColor: 'rgba(59,130,246,0.08)' }}>
        <p className="text-xs" style={{ color: '#1e3a6e' }}>
          NAVER Corporation · 본 자료는 내부 검토용으로만 사용 가능합니다 · © 2026
        </p>
      </footer>
    </div>
  )
}
