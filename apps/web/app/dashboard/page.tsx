import { requireAuth, getUserProfile } from '@/lib/auth-helpers'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  // Require authentication - will redirect if not authenticated
  const user = await requireAuth('/dashboard')

  // Get user profile
  const profile = await getUserProfile(user.id)

  return <DashboardClient user={user} profile={profile} />
}