const API_BASE_URL = (import.meta.env.VITE_KORION_CHONG_API_URL ?? '').replace(/\/$/, '')

function buildUrl(path: string, query?: Record<string, string | number | undefined>) {
  const params = new URLSearchParams()
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value))
  })
  const suffix = params.toString() ? `?${params.toString()}` : ''
  return `${API_BASE_URL}${path}${suffix}`
}

function leaderHeaders() {
  return {
    'X-Leader-Id':
      window.localStorage.getItem('korion.leaderId') ??
      import.meta.env.VITE_KORION_LEADER_ID ??
      '1',
    'X-Country-Scopes':
      window.localStorage.getItem('korion.countryScopes') ??
      import.meta.env.VITE_KORION_COUNTRY_SCOPES ??
      'KR,JP',
  }
}

async function getJson<T>(path: string, query?: Record<string, string | number | undefined>) {
  const response = await fetch(buildUrl(path, query), {
    headers: leaderHeaders(),
  })
  if (!response.ok) {
    throw new Error(`KORION Chong API ${response.status}`)
  }
  return response.json() as Promise<T>
}

async function postJson<T>(path: string, body: unknown) {
  const response = await fetch(buildUrl(path), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    let detail = ''
    try {
      const payload = (await response.json()) as { code?: string; message?: string }
      detail = payload.code ?? payload.message ?? ''
    } catch {
      detail = ''
    }
    throw new Error(detail || `KORION Chong API ${response.status}`)
  }
  return response.json() as Promise<T>
}

export interface LeaderDashboardApiResponse {
  leaderProfile: {
    leaderId: number
    userId: number
    loginId: string
    status: 'COUNTRY_LEADER_APPROVED'
    countryScopes: string[]
  }
  kpis: {
    approvedPartnerCount: number
    approvedMerchantCount: number
    completedTransactionAmount: string
    confirmedCommissionAmount: string
  }
  organizationSummary: {
    partnerCount: number
    merchantCount: number
  }
  monthlyVolume: Array<{
    month: string
    amount: string
    transactionCount: number
  }>
  feeSummary: {
    countryLeaderFee: string
    salesPartnerFee: string
    korionFee: string
  }
  riskAlerts: Array<{
    type: string
    severity: 'low' | 'medium' | 'high'
    message: string
  }>
}

export interface LeaderPartnerApiResponse {
  items: Array<{
    partnerId: number
    userId: number
    loginId: string
    country: string
    region?: string
    city?: string
    status: 'SALES_PARTNER_APPROVED'
    merchantCount: number
    completedTransactionAmount: string
    lastActivityAt?: string
  }>
  page?: {
    page: number
    size: number
    totalItems: number
  }
}

export function fetchLeaderDashboard(period: string, countryScope: string) {
  return getJson<LeaderDashboardApiResponse>('/api/leader/dashboard', {
    period,
    countryScope,
  })
}

export function fetchLeaderPartners(countryScope: string, page = 0, size = 20) {
  return getJson<LeaderPartnerApiResponse>('/api/leader/partners', {
    countryScope,
    status: 'SALES_PARTNER_APPROVED',
    page,
    size,
  })
}

export type SignupAvailabilityField =
  | 'loginId'
  | 'email'
  | 'telegram'
  | 'whatsapp'
  | 'walletAddress'

export interface AvailabilityApiResponse {
  available: boolean
  field: SignupAvailabilityField
  resultCode: 'AVAILABLE' | 'DUPLICATE'
  messageKey: string
}

export interface ReferralCodeValidationApiResponse {
  valid: boolean
  code: string
  codeType?: string
  ownerPartnerId?: number
  country?: string
  city?: string
  resultCode: string
  messageKey: string
}

export interface SignupApplicationApiRequest {
  applicantType: 'PARTNER' | 'MERCHANT'
  loginId: string
  password: string
  email: string
  companyName: string
  contactName: string
  phone?: string
  telegram?: string
  whatsapp?: string
  referralCode?: string
  country?: string
  region?: string
  city?: string
  address?: string
  businessType?: string
  walletAddress?: string
  integrationPlan?: string
  evidenceNote?: string
  requestId?: string
}

export interface SignupApplicationApiResponse {
  applicationId: number
  status: 'REQUESTED'
  resultCode: 'SIGNUP_APPLICATION_SUBMITTED'
  messageKey: string
  walletStored: boolean
}

export interface EmailVerificationSendApiResponse {
  resultCode: 'EMAIL_VERIFICATION_SENT'
  messageKey: string
  expiresAt: string
}

export interface EmailVerificationConfirmApiResponse {
  verified: boolean
  resultCode: 'EMAIL_VERIFIED'
  messageKey: string
}

export interface WalletLinkVerifyApiResponse {
  verified: boolean
  authStatus: 'VERIFIED'
  resultCode: 'WALLET_VERIFIED'
  messageKey: string
}

export function checkSignupAvailability(field: SignupAvailabilityField, value: string) {
  return getJson<AvailabilityApiResponse>('/api/auth/availability', { field, value })
}

export function validateReferralCode(code: string) {
  return getJson<ReferralCodeValidationApiResponse>(`/api/auth/referral-codes/${encodeURIComponent(code)}/validate`)
}

export function sendEmailVerification(email: string, requestId?: string) {
  return postJson<EmailVerificationSendApiResponse>('/api/auth/email-verifications/send', {
    email,
    requestId,
  })
}

export function confirmEmailVerification(email: string, code: string, requestId?: string) {
  return postJson<EmailVerificationConfirmApiResponse>('/api/auth/email-verifications/confirm', {
    email,
    code,
    requestId,
  })
}

export function verifyWalletLink(
  applicantType: 'PARTNER' | 'MERCHANT',
  email: string,
  walletAddress: string,
  nonce: string,
  signature: string,
  requestId?: string,
) {
  return postJson<WalletLinkVerifyApiResponse>('/api/auth/wallet-links/verify', {
    applicantType,
    email,
    walletAddress,
    nonce,
    signature,
    requestId,
  })
}

export function createSignupApplication(payload: SignupApplicationApiRequest) {
  return postJson<SignupApplicationApiResponse>('/api/auth/signup-applications', payload)
}
