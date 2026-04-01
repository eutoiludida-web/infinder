import { createSupabaseServer } from './supabase-server'

export async function getSession() {
  const supabase = await createSupabaseServer()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) return null
  return user
}

export async function getUser() {
  const user = await getSession()
  if (!user) return null

  const supabase = await createSupabaseServer()
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return data
}
