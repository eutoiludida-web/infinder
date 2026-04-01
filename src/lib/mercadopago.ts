import { MercadoPagoConfig, PreApproval } from 'mercadopago'

let _mpClient: MercadoPagoConfig | null = null
let _preApproval: PreApproval | null = null

function getMpClient() {
  if (!_mpClient) {
    _mpClient = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    })
  }
  return _mpClient
}

export function getPreApproval() {
  if (!_preApproval) {
    _preApproval = new PreApproval(getMpClient())
  }
  return _preApproval
}

export function getPlanId(plan: string): string {
  const ids: Record<string, string | undefined> = {
    starter: process.env.MP_PLAN_STARTER_ID,
    pro: process.env.MP_PLAN_PRO_ID,
    agency: process.env.MP_PLAN_AGENCY_ID,
  }
  const id = ids[plan]
  if (!id) throw new Error(`Plan ID not configured for: ${plan}`)
  return id
}

export function getPlanFromAmount(amount: number): string {
  if (amount === 97) return 'starter'
  if (amount === 197) return 'pro'
  if (amount === 497) return 'agency'
  return 'free'
}
