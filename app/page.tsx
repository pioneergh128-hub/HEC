import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function Home() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('dashboard_auth')

  if (authCookie?.value === 'authenticated') {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}
