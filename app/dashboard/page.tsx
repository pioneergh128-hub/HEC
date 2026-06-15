import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import DashboardClient from '@/components/DashboardClient'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('dashboard_auth')

  if (authCookie?.value !== 'authenticated') {
    redirect('/login')
  }

  return <DashboardClient />
}
