import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Button from '../../../components/atoms/Button'
import AuthShell from '../AuthShell'
import { useTranslation } from '../../../i18n'
import {
  checkSignupAvailability,
  createSignupApplication,
  sendEmailVerification,
  validateReferralCode,
  confirmEmailVerification,
  sendTelegramVerification,
  confirmTelegramVerification,
  type SignupAvailabilityField,
} from '../../../services/korionChongApi'
import data from './signupData.json'
import styles from './RoleSignup.module.css'

interface ModeDef {
  key: string
  labelKey: string
  descKey: string
  type: 'code' | 'hq'
  codePlaceholder?: string
  confirmed?: string
}
const CFG = data as Record<
  string,
  { titleKey: string; subtitleKey: string; modes: ModeDef[]; store: boolean }
>

/** 입력 한 칸 (라벨 + placeholder, 선택적으로 우측 버튼/넓게) */
interface FieldDef {
  name: keyof SignupForm
  labelKey: string
  placeholder: string
  type?: string
  buttonKey?: string
  action?: 'availability' | 'sendEmail' | 'confirmEmail' | 'sendTelegram' | 'confirmTelegram'
  availabilityField?: SignupAvailabilityField
  wide?: boolean
}

interface SignupForm {
  loginId: string
  email: string
  emailCode: string
  password: string
  passwordConfirm: string
  telegram: string
  telegramCode: string
  whatsapp: string
  twitter: string
  companyName: string
  contactName: string
  country: string
  region: string
  language: string
  integrationPlan: string
  storeName: string
  ownerName: string
  address: string
  industry: string
  evidenceNote: string
  walletAddress: string
  referralCode: string
}

/* A. 계정 정보 */
const ACCOUNT_FIELDS: FieldDef[] = [
  { name: 'loginId', labelKey: 'auth.signup.f.id', placeholder: '중복 확인 필요', buttonKey: 'auth.signup.btn.dupCheck', action: 'availability', availabilityField: 'loginId' },
  { name: 'email', labelKey: 'auth.signup.f.email', placeholder: 'example@email.com', buttonKey: 'auth.signup.btn.sendCode', action: 'sendEmail' },
  { name: 'emailCode', labelKey: 'auth.signup.f.emailCode', placeholder: '인증번호', buttonKey: 'auth.signup.btn.verify', action: 'confirmEmail' },
  { name: 'password', labelKey: 'auth.signup.f.pw', placeholder: '8자 이상', type: 'password' },
  { name: 'passwordConfirm', labelKey: 'auth.signup.f.pwConfirm', placeholder: '8자 이상', type: 'password' },
  { name: 'telegram', labelKey: 'auth.signup.f.telegram', placeholder: '@telegram_id', buttonKey: 'auth.signup.btn.sendCode', action: 'sendTelegram' },
  { name: 'telegramCode', labelKey: 'auth.signup.f.telegramCode', placeholder: '인증번호', buttonKey: 'auth.signup.btn.verify', action: 'confirmTelegram' },
  { name: 'whatsapp', labelKey: 'auth.signup.f.phone', placeholder: '+234 000 000 0000', buttonKey: 'auth.signup.btn.dupCheck', action: 'availability', availabilityField: 'phone' },
  { name: 'twitter', labelKey: 'auth.signup.f.twitter', placeholder: '선택 입력' },
]

/* B. 기본 / 소속 정보 */
const BASIC_FIELDS: FieldDef[] = [
  { name: 'companyName', labelKey: 'auth.signup.f.name', placeholder: '예: Samuel O.' },
  { name: 'country', labelKey: 'auth.signup.f.country', placeholder: 'NG' },
  { name: 'region', labelKey: 'auth.signup.f.region', placeholder: 'Lagos Island, Ikeja' },
  { name: 'language', labelKey: 'auth.signup.f.language', placeholder: 'English, Local Language' },
  { name: 'integrationPlan', labelKey: 'auth.signup.f.hqReason', placeholder: '선택 시 필수', wide: true },
]

/* D. 매장 기본 정보 (가맹점만) */
const STORE_FIELDS: FieldDef[] = [
  { name: 'storeName', labelKey: 'auth.signup.f.storeName', placeholder: 'Kori Cafe Lagos' },
  { name: 'ownerName', labelKey: 'auth.signup.f.owner', placeholder: '대표자명' },
  { name: 'address', labelKey: 'auth.signup.f.address', placeholder: '주소 입력' },
  { name: 'industry', labelKey: 'auth.signup.f.industry', placeholder: '카페 / 리테일' },
]

const AGREEMENTS = ['1', '2', '3', '4', '5', '6']

/*
 * RoleSignup (page) — 역할별 회원가입 (파트너/가맹점)
 * ------------------------------------------------------------------
 * 가입 방식 탭(리더 코드/파트너 코드/본사 직접) + A.계정 / B.기본·소속 / C.Wallet
 *  (+ 가맹점: D.매장 정보) + 동의 체크 + 가입 신청.
 * 중복 확인/이메일/Telegram 인증을 통과해야 확인 모달과 가입 신청 제출이 가능하다.
 */
export default function RoleSignup() {
  const { role } = useParams<{ role: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [done, setDone] = useState(false)
  const [mode, setMode] = useState('leader')
  const [busy, setBusy] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [checks, setChecks] = useState({
    loginId: false,
    emailVerified: false,
    telegramVerified: false,
    whatsapp: false,
    walletAddress: false,
    referralCode: false,
  })
  const [agreements, setAgreements] = useState<Record<string, boolean>>(
    Object.fromEntries(AGREEMENTS.map((key) => [key, false])),
  )
  const [form, setForm] = useState<SignupForm>({
    loginId: '',
    email: '',
    emailCode: '',
    password: '',
    passwordConfirm: '',
    telegram: '',
    telegramCode: '',
    whatsapp: '',
    twitter: '',
    companyName: '',
    contactName: '',
    country: '',
    region: '',
    language: '',
    integrationPlan: '',
    storeName: '',
    ownerName: '',
    address: '',
    industry: '',
    evidenceNote: '',
    walletAddress: '',
    referralCode: '',
  })

  if (!role || !CFG[role]) return <Navigate to="/login" replace />
  const cfg = CFG[role]
  const requestId = `signup-${role}-${form.loginId || form.email || 'draft'}`

  const updateField = (name: keyof SignupForm, value: string) => {
    setForm((current) => ({ ...current, [name]: value }))
    if (name === 'loginId') setChecks((current) => ({ ...current, loginId: false }))
    if (name === 'email') setChecks((current) => ({ ...current, emailVerified: false }))
    if (name === 'telegram') setChecks((current) => ({ ...current, telegramVerified: false }))
    if (name === 'whatsapp') setChecks((current) => ({ ...current, whatsapp: false }))
    if (name === 'walletAddress') setChecks((current) => ({ ...current, walletAddress: false }))
    if (name === 'referralCode') setChecks((current) => ({ ...current, referralCode: false }))
  }

  const runAction = async (field: FieldDef) => {
    setStatusMessage('')
    setBusy(true)
    try {
      if (field.action === 'availability' && field.availabilityField) {
        const value = form[field.name]
        if (!value.trim()) throw new Error('값을 입력한 뒤 확인하세요.')
        const result = await checkSignupAvailability(field.availabilityField, value.trim())
        if (field.availabilityField === 'loginId') {
          setChecks((current) => ({ ...current, loginId: result.available }))
        }
        if (field.availabilityField === 'whatsapp') {
          setChecks((current) => ({ ...current, whatsapp: result.available }))
        }
        if (field.availabilityField === 'phone') {
          setChecks((current) => ({ ...current, whatsapp: result.available }))
        }
        setStatusMessage(result.available ? '사용 가능한 값입니다.' : '이미 사용 중인 값입니다.')
      }
      if (field.action === 'sendEmail') {
        if (!form.email.trim()) throw new Error('이메일을 입력하세요.')
        setChecks((current) => ({ ...current, emailVerified: false }))
        await sendEmailVerification(form.email.trim(), requestId)
        setStatusMessage('이메일 인증번호 발송 요청이 완료되었습니다.')
      }
      if (field.action === 'confirmEmail') {
        if (!form.email.trim() || !form.emailCode.trim()) throw new Error('이메일과 인증번호를 입력하세요.')
        await confirmEmailVerification(form.email.trim(), form.emailCode.trim(), requestId)
        setChecks((current) => ({ ...current, emailVerified: true }))
        setStatusMessage('이메일 인증이 완료되었습니다.')
      }
      if (field.action === 'sendTelegram') {
        if (!form.telegram.trim()) throw new Error('Telegram ID를 입력하세요.')
        setChecks((current) => ({ ...current, telegramVerified: false }))
        await sendTelegramVerification(form.telegram.trim(), requestId)
        setStatusMessage('Telegram 인증번호 발송 요청이 완료되었습니다.')
      }
      if (field.action === 'confirmTelegram') {
        if (!form.telegram.trim() || !form.telegramCode.trim()) throw new Error('Telegram ID와 인증번호를 입력하세요.')
        await confirmTelegramVerification(form.telegram.trim(), form.telegramCode.trim(), requestId)
        setChecks((current) => ({ ...current, telegramVerified: true }))
        setStatusMessage('Telegram 인증이 완료되었습니다.')
      }
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : '요청 처리 중 오류가 발생했습니다.')
    } finally {
      setBusy(false)
    }
  }

  const checkReferral = async (code: string) => {
    if (!code.trim()) return
    setStatusMessage('')
    setBusy(true)
    try {
      const result = await validateReferralCode(code.trim())
      setChecks((current) => ({ ...current, referralCode: result.valid }))
      setStatusMessage(result.valid ? '유효한 소속 코드입니다.' : '사용할 수 없는 소속 코드입니다.')
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : '코드 확인 중 오류가 발생했습니다.')
    } finally {
      setBusy(false)
    }
  }

  const checkWalletAddress = async () => {
    setStatusMessage('')
    setBusy(true)
    try {
      if (!form.walletAddress.trim()) throw new Error('Wallet 주소를 입력하세요.')
      const result = await checkSignupAvailability('walletAddress', form.walletAddress.trim())
      setChecks((current) => ({ ...current, walletAddress: result.available }))
      setStatusMessage(result.available ? '등록 가능한 KORION Wallet 주소입니다.' : '이미 등록되었거나 검토 중인 Wallet 주소입니다.')
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Wallet 확인 중 오류가 발생했습니다.')
    } finally {
      setBusy(false)
    }
  }

  const normalizeCountry = (value: string) => {
    const code = value.trim().toUpperCase()
    return /^[A-Z]{2}$/.test(code) ? code : undefined
  }

  const submitApplication = async () => {
    setStatusMessage('')
    setBusy(true)
    try {
      const applicantType = role === 'merchant' ? 'MERCHANT' : 'PARTNER'
      const companyName = applicantType === 'MERCHANT'
        ? form.storeName.trim()
        : form.companyName.trim()
      const contactName = applicantType === 'MERCHANT'
        ? form.ownerName.trim()
        : form.contactName.trim() || form.companyName.trim()
      if (!form.loginId.trim() || !form.email.trim() || !form.password || !companyName || !contactName) {
        throw new Error('아이디, 비밀번호, 이메일, 이름/매장명은 필수입니다.')
      }
      if (form.password !== form.passwordConfirm) {
        throw new Error('비밀번호 확인이 일치하지 않습니다.')
      }
      const response = await createSignupApplication({
        applicantType,
        loginId: form.loginId.trim(),
        password: form.password,
        email: form.email.trim(),
        companyName,
        contactName,
        phone: form.whatsapp.trim() || undefined,
        telegram: form.telegram.trim() || undefined,
        whatsapp: form.whatsapp.trim() || undefined,
        referralCode: mode === 'hq' ? undefined : form.referralCode.trim() || undefined,
        country: normalizeCountry(form.country),
        region: form.region.trim() || undefined,
        city: undefined,
        address: form.address.trim() || undefined,
        businessType: form.industry.trim() || undefined,
        walletAddress: form.walletAddress.trim() || undefined,
        integrationPlan: [form.integrationPlan, form.industry, form.language].filter(Boolean).join('\n') || undefined,
        evidenceNote: form.evidenceNote.trim() || undefined,
        requestId,
      })
      setConfirmOpen(false)
      setDone(true)
      setStatusMessage(`가입 신청이 접수되었습니다. 상태: ${response.status}`)
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : '가입 신청 중 오류가 발생했습니다.')
    } finally {
      setBusy(false)
    }
  }

  const validateBeforeConfirm = () => {
    const applicantType = role === 'merchant' ? 'MERCHANT' : 'PARTNER'
    const companyName = applicantType === 'MERCHANT' ? form.storeName.trim() : form.companyName.trim()
    const contactName = applicantType === 'MERCHANT' ? form.ownerName.trim() : form.contactName.trim() || form.companyName.trim()
    if (!form.loginId.trim() || !form.password || !form.passwordConfirm || !form.email.trim()) {
      return '아이디, 비밀번호, 이메일은 필수입니다.'
    }
    if (form.password !== form.passwordConfirm) {
      return '비밀번호 확인이 일치하지 않습니다.'
    }
    if (!checks.loginId) {
      return '아이디 중복 확인을 완료하세요.'
    }
    if (!checks.emailVerified) {
      return '이메일 인증번호 확인을 완료하세요.'
    }
    if (!form.telegram.trim() || !checks.telegramVerified) {
      return 'Telegram 인증을 완료하세요.'
    }
    if (!form.whatsapp.trim() || !checks.whatsapp) {
      return '휴대폰 / WhatsApp 중복 확인을 완료하세요.'
    }
    if (!companyName || !contactName || !form.country.trim() || !form.region.trim() || !form.language.trim()) {
      return '이름/소속, 국가, 지역, 활동 가능 언어는 필수입니다.'
    }
    if (!normalizeCountry(form.country)) {
      return '국가는 ISO 2자리 코드로 입력하세요. 예: KR, NG'
    }
    if (!form.walletAddress.trim() || !checks.walletAddress) {
      return 'KORION Wallet 주소 확인을 완료하세요.'
    }
    if (mode !== 'hq' && (!form.referralCode.trim() || !checks.referralCode)) {
      return '소속 코드를 확인하세요.'
    }
    if (applicantType === 'MERCHANT' && (!form.address.trim() || !form.industry.trim())) {
      return '가맹점 주소와 업종은 필수입니다.'
    }
    if (applicantType === 'MERCHANT' && !form.evidenceNote.trim()) {
      return '가맹점 검증자료를 입력하세요.'
    }
    if (!AGREEMENTS.every((key) => agreements[key])) {
      return '필수 동의 항목을 모두 체크하세요.'
    }
    return ''
  }

  const openConfirmModal = () => {
    const error = validateBeforeConfirm()
    if (error) {
      setStatusMessage(error)
      return
    }
    setStatusMessage('')
    setConfirmOpen(true)
  }

  const toggleAgreement = (key: string, checked: boolean) => {
    setAgreements((current) => ({ ...current, [key]: checked }))
  }

  const toggleAllAgreements = (checked: boolean) => {
    setAgreements(Object.fromEntries(AGREEMENTS.map((key) => [key, checked])))
  }

  const renderFields = (fields: FieldDef[]) =>
    fields.map((f) => (
      <div key={f.labelKey} className={`${styles.field} ${f.wide ? styles.wide : ''}`}>
        <span className={styles.fieldLabel}>{t(f.labelKey)}</span>
        <div className={styles.inputRow}>
          <input
            className={styles.input}
            type={f.type ?? 'text'}
            placeholder={f.placeholder}
            value={form[f.name]}
            onChange={(e) => updateField(f.name, e.target.value)}
            aria-label={t(f.labelKey)}
          />
          {f.buttonKey && (
            <button type="button" className={styles.smallBtn} disabled={busy} onClick={() => runAction(f)}>
              {t(f.buttonKey)}
            </button>
          )}
        </div>
      </div>
    ))

  return (
    <AuthShell title={t(cfg.titleKey)} subtitle={t(cfg.subtitleKey)}>
      <section className={styles.panel}>
        {/* 가입 방식 카드 — 각 카드에 추천인(코드) 입력란 포함. 선택 시 보더 강조 */}
        <div className={styles.modes}>
          {cfg.modes.map((m) => {
            const selected = mode === m.key
            return (
              <button
                key={m.key}
                type="button"
                className={`${styles.modeCard} ${selected ? styles.modeCardActive : ''}`}
                onClick={() => setMode(m.key)}
              >
                <span className={styles.modeBadge}>{t(m.labelKey)}</span>
                <span className={styles.modeDesc}>{t(m.descKey)}</span>

                {m.type === 'code' ? (
                  // 추천인(리더/파트너) 코드 입력 + 코드 확인 버튼.
                  // '확인 완료' 상태 배지는 입력란 안 우측에 겹쳐 표시(Figma 기준).
                  <div className={styles.codeRow}>
                    <div className={styles.codeInputWrap}>
                      <input
                        className={styles.codeInput}
                        type="text"
                        placeholder={m.codePlaceholder}
                        value={form.referralCode || (selected ? m.confirmed ?? '' : '')}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateField('referralCode', e.target.value)}
                      />
                      <span className={styles.codeConfirmed}>{t('auth.signup.codeConfirmed')}</span>
                    </div>
                    <span className={styles.codeCheckBtn} onClick={(e) => {
                      e.stopPropagation()
                      checkReferral(form.referralCode)
                    }}>{t('auth.signup.btn.codeCheck')}</span>
                  </div>
                ) : (
                  // 본사 직접 계약: 본사 검토 필요 배지
                  <span className={styles.hqBadge}>{t('auth.signup.hqReview')}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* A. 계정 정보 */}
        <h3 className={styles.sectionTitle}>{t('auth.signup.sec.account')}</h3>
        <div className={styles.grid}>{renderFields(ACCOUNT_FIELDS)}</div>

        {/* B. 기본 / 소속 정보 */}
        <h3 className={styles.sectionTitle}>{t('auth.signup.sec.basic')}</h3>
        <div className={styles.grid}>{renderFields(BASIC_FIELDS)}</div>

        {/* C. KORION Wallet 연결 */}
        <h3 className={styles.sectionTitle}>{t('auth.signup.sec.wallet')}</h3>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>{t('auth.signup.f.wallet')}</span>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              type="text"
              placeholder="TRON 네트워크 Wallet 주소"
              value={form.walletAddress}
              onChange={(e) => updateField('walletAddress', e.target.value)}
            />
            <button type="button" className={styles.smallBtn} disabled={busy} onClick={checkWalletAddress}>
              {t('auth.signup.btn.walletLink')}
            </button>
          </div>
        </div>

        {statusMessage && <div className={styles.inlineNotice}>{statusMessage}</div>}

        {/* D. 매장 기본 정보 (가맹점만) */}
        {cfg.store && (
          <>
            <h3 className={styles.sectionTitle}>{t('auth.signup.sec.store')}</h3>
            <div className={styles.grid}>{renderFields(STORE_FIELDS)}</div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>{t('auth.signup.f.evidence')}</span>
              <div className={styles.inputRow}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="사업자/매장 검증자료 링크 또는 메모"
                  value={form.evidenceNote}
                  onChange={(e) => updateField('evidenceNote', e.target.value)}
                  aria-label={t('auth.signup.f.evidence')}
                />
              </div>
            </div>
          </>
        )}

        {/* 동의 체크 */}
        <h3 className={styles.sectionTitle}>{t('auth.signup.sec.agree')}</h3>
        <label className={`${styles.agree} ${styles.agreeAll}`}>
          <input
            type="checkbox"
            checked={AGREEMENTS.every((key) => agreements[key])}
            onChange={(e) => toggleAllAgreements(e.target.checked)}
          /> {t('auth.signup.agreeAll')}
        </label>
        {AGREEMENTS.map((n) => (
          <label key={n} className={styles.agree}>
            <input
              type="checkbox"
              checked={agreements[n]}
              onChange={(e) => toggleAgreement(n, e.target.checked)}
            /> {t(`auth.signup.agree.${n}`)}
          </label>
        ))}

        {/* 버튼 */}
        <div className={styles.buttons}>
          <Button variant="secondary" onClick={() => navigate('/login')}>
            {t('auth.signup.cancel')}
          </Button>
          <Button variant="primary" onClick={openConfirmModal}>
            {t('auth.signup.submit')}
          </Button>
        </div>
      </section>

      {/* 확인 모달 */}
      {confirmOpen && (
        <div className={styles.overlay} onClick={() => setConfirmOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>{t('auth.signup.modal.title')}</h3>
            <p className={styles.modalDesc}>{t('auth.signup.modal.desc')}</p>
            <div className={styles.modalButtons}>
              <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
                {t('auth.signup.cancel')}
              </Button>
              <Button
                variant="primary"
                onClick={submitApplication}
              >
                {t('auth.signup.submit')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 완료 토스트 → 해당 역할 로그인 화면으로 */}
      {done && (
        <div
          className={styles.toast}
          onClick={() => navigate(`/login/${role}`)}
          role="status"
        >
          {t('auth.signup.toast')}
        </div>
      )}
    </AuthShell>
  )
}
