import { z } from 'zod/v4'
import { getSession } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getPreApproval, getPlanId } from '@/lib/mercadopago'

const RequestSchema = z.object({
  plan: z.enum(['starter', 'pro', 'agency']),
})

export async function POST(req: Request) {
  const user = await getSession()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = RequestSchema.safeParse(await req.json())
  if (!body.success) return Response.json({ error: body.error }, { status: 400 })

  const supabaseAdmin = getSupabaseAdmin()

  try {
    const planId = getPlanId(body.data.plan)

    const subscription = await getPreApproval().create({
      body: {
        preapproval_plan_id: planId,
        payer_email: user.email!,
        back_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        reason: `Viral Content Analyzer - ${body.data.plan}`,
      },
    })

    // Save subscription record
    await supabaseAdmin.from('subscriptions').insert({
      user_id: user.id,
      mp_subscription_id: subscription.id,
      plan: body.data.plan,
      status: 'pending',
    })

    // Update user subscription_id
    await supabaseAdmin
      .from('users')
      .update({ subscription_id: subscription.id })
      .eq('id', user.id)

    return Response.json({ checkout_url: subscription.init_point })
  } catch (error) {
    console.error('Subscribe error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Erro ao criar assinatura' },
      { status: 500 }
    )
  }
}
