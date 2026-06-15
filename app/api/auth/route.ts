import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (!password) {
    return NextResponse.json({ error: '비밀번호를 입력하세요.' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('site_access')
    .select('password_hash')
    .eq('id', 1)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: '접근 설정을 불러올 수 없습니다.' }, { status: 500 })
  }

  const isValid = await bcrypt.compare(password, data.password_hash)

  if (!isValid) {
    return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('dashboard_auth', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('dashboard_auth')
  return response
}
