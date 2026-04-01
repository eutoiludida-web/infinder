import { getSupabaseAdmin } from '@/lib/supabase'
import { getPreApproval, getPlanFromAmount } from '@/lib/mercadopago'

export async function POST(req: Request) {
  const supabaseAdmin = getSupabaseAdmin()

  try {
    const body = await req.json()

    if (body.type === 'subscription_preapproval') {
      const sub = await getPreApproval().get({ id: body.data.id })

      // Update subscription status
      await supabaseAdmin
        .from('subscriptions')
        .update({
          status: sub.status,
          current_period_start: sub.date_created,
          current_period_end: sub.next_payment_date,
        })
        .eq('mp_subscription_id', body.data.id)

      // Update user plan
      if (sub.status === 'authorized') {
        const plan = getPlanFromAmount(
          sub.auto_recurring?.transaction_amount || 0
        )
        await supabaseAdmin
          .from('users')
          .update({
            plan,
            subscription_status: 'active',
          })
          .eq('subscription_id', body.data.id)
      } else if (sub.status === 'cancelled' || sub.status === 'paused') {
        await supabaseAdmin
          .from('users')
          .update({
            plan: 'free',
            subscription_status: sub.status,
          })
          .eq('subscription_id', body.data.id)
      }
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return Response.json({ received: true })
  }
}
