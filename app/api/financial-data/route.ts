import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get('dashboard_auth')?.value === 'authenticated'
}

const VALID_TABLES = ['consolidated_is', 'consolidated_bs', 'standalone_is', 'standalone_bs']

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  const table = new URL(request.url).searchParams.get('table')
  if (!table || !VALID_TABLES.includes(table)) {
    return NextResponse.json({ error: '유효하지 않은 테이블입니다.' }, { status: 400 })
  }

  const { data, error } = await getSupabase()
    .from(table)
    .select('*')
    .order('period', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  const { table, period, field, value, oldValue } = await request.json()
  if (!table || !VALID_TABLES.includes(table)) {
    return NextResponse.json({ error: '유효하지 않은 테이블입니다.' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { error } = await supabase
    .from(table)
    .update({ [field]: value, updated_at: new Date().toISOString() })
    .eq('period', period)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('audit_log').insert({
    table_name: table, period, field_name: field,
    old_value: String(oldValue), new_value: String(value),
  })

  return NextResponse.json({ success: true })
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  const { table, data } = await request.json()
  if (!table || !VALID_TABLES.includes(table)) {
    return NextResponse.json({ error: '유효하지 않은 테이블입니다.' }, { status: 400 })
  }

  const { error } = await getSupabase().from(table).upsert(data, { onConflict: 'period' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
