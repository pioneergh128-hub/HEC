import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NAVER 1Q26 실적 대시보드',
  description: 'NAVER Corporation 2026년 1분기 실적 인터랙티브 대시보드',
  robots: 'noindex, nofollow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
