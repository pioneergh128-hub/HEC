import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, #060d1f 60%)',
      }}
    >
      {/* 배경 그리드 패턴 */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* 로고 영역 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{
              background: 'linear-gradient(135deg, #1e3a6e, #2a4f8f)',
              border: '1px solid rgba(59,130,246,0.4)',
              boxShadow: '0 0 30px rgba(59,130,246,0.2)',
            }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M6 6h7l9 14V6h4v20h-7L10 12v14H6V6z" fill="#3b82f6"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            NAVER 실적 대시보드
          </h1>
          <p className="text-sm mt-2" style={{ color: '#64748b' }}>
            2026년 1분기 Financial Factsheet
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-xs mt-8" style={{ color: '#334155' }}>
          NAVER Corporation Confidential · Internal Use Only
        </p>
      </div>
    </div>
  )
}
