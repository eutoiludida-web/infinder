import { getSession } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getPreApproval } from '@/lib/mercadopago'

export async function POST() {
  const user = await getSession()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabaseAdmin = getSupabaseAdmin()

  try {
    // Get user's subscription
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('subscription_id')
      .eq('id', user.id)
      .single()

    if (!userData?.subscription_id) {
      return Response.json({ error: 'Nenhuma assinatura encontrada' }, { status: 404 })
    }

    // Cancel on Mercado Pago
    await getPreApproval().update({
      id: userData.subscription_id,
      body: { status: 'cancelled' },
    })

    // Update user
    await supabaseAdmin
      .from('users')
      .update({
        plan: 'free',
        subscription_status: 'cancelled',
      })
      .eq('id', user.id)

    // Update subscription record
    await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('mp_subscription_id', userData.subscription_id)

    return Response.json({ cancelled: true })
  } catch (error) {
    console.error('Cancel error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Erro ao cancelar' },
      { status: 500 }
    )
  }
}
