import { getSupabaseAdmin } from './supabase'
import { PLAN_LIMITS, type PlanName, type UsageType } from '@/types/plans'
import type { User } from '@/types'

export async function checkUsageLimits(
  userId: string,
  type: UsageType
): Promise<boolean> {
  const supabaseAdmin = getSupabaseAdmin()
  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('plan')
    .eq('id', userId)
    .single()

  const plan = ((userData as User | null)?.plan || 'free') as PlanName
  const limit = PLAN_LIMITS[plan][type]

  const currentMonth = new Date().toISOString().slice(0, 7)
  const { data: usage } = await supabaseAdmin
    .from('usage')
    .select('*')
    .eq('user_id', userId)
    .eq('month', currentMonth)
    .single()

  const current = (usage as Record<string, number> | null)?.[type] || 0
  return current < limit
}

export async function incrementUsage(
  userId: string,
  type: UsageType
): Promise<void> {
  const supabaseAdmin = getSupabaseAdmin()
  const currentMonth = new Date().toISOString().slice(0, 7)

  await supabaseAdmin.rpc('increment_usage', {
    p_user_id: userId,
    p_month: currentMonth,
    p_type: type,
  })
}

export async function getUsage(userId: string) {
  const supabaseAdmin = getSupabaseAdmin()
  const currentMonth = new Date().toISOString().slice(0, 7)

  const { data: usage } = await supabaseAdmin
    .from('usage')
    .select('*')
    .eq('user_id', userId)
    .eq('month', currentMonth)
    .single()

  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('plan')
    .eq('id', userId)
    .single()

  const plan = ((userData as User | null)?.plan || 'free') as PlanName
  const limits = PLAN_LIMITS[plan]

  return {
    ads_scraped: (usage as Record<string, number> | null)?.ads_scraped || 0,
    ai_analyses: (usage as Record<string, number> | null)?.ai_analyses || 0,
    limits,
    plan,
  }
}
