import { Fragment, useState } from 'react'
import PageHeader from '../../components/organisms/PageHeader'
import Button from '../../components/atoms/Button'
import InfoGrid from '../../components/molecules/InfoGrid'
import ActionBadges from '../../components/molecules/ActionBadges'
import DataTable, { type TableRow } from '../../components/organisms/DataTable'
import { useTranslation } from '../../i18n'
import { useSettlementRequest } from './useSettlementRequest'
import styles from './SettlementRequest.module.css'

/** 정산 계산 수식의 금액 카드 */
function AmountCard({ label, value, unit, variant }: { label: string; value: string; unit: string; variant?: 'minus' | 'final' }) {
  const cls = [styles.amountCard, variant === 'minus' && styles.amountCardMinus, variant === 'final' && styles.amountCardFinal]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={cls}>
      <span className={styles.amountLabel}>{label}</span>
      <span className={styles.amountValue}>
        {value}
        <span className={styles.amountUnit}>{unit}</span>
      </span>
    </div>
  )
}

/*
 * SettlementRequest (page) — 수수료/정산 · 정산 신청
 * 플로우: 기본(긴) 화면 → [본사 정산 요청] → 확인 폼(가운데) → [보내기] → 완료 토스트
 * 박스 외형은 Figma 정산 화면 전용(보라 테두리/검은 그림자/시안 히어로 등) — 모듈 CSS 참고.
 */
export default function SettlementRequest() {
  const { t } = useTranslation()
  const [step, setStep] = useState<'default' | 'form'>('default')
  const [submitted, setSubmitted] = useState(false)

  const {
    banner, stats, calc, feeStructure, autoDesc, autoHighlight, autoStats,
    partnerTable, directTable, heldTable, summary, checks, formFields,
  } = useSettlementRequest()

  const detailCell = <ActionBadges labels={['보기']} />
  const ptRows: TableRow[] = partnerTable.rows.map((r) => ({ id: r.code, cells: { ...r, detail: detailCell } }))
  const dtRows: TableRow[] = directTable.rows.map((r) => ({ id: r.code, cells: { ...r, detail: detailCell } }))
  const htRows: TableRow[] = heldTable.rows.map((r) => ({ id: r.txNo, cells: { ...r, detail: detailCell } }))

  // ===== 플로우 2·3: 확인 폼 + 완료 토스트 (가운데) =====
  if (step === 'form') {
    return (
      <div className={styles.page}>
        <PageHeader title={t('settle.req.title')} />
        <div className={styles.formWrap}>
          <section className={styles.formCard}>
            <h2 className={styles.formTitle}>{t('settle.req.cardTitle')}</h2>
            <p className={styles.formDesc}>{t('settle.req.cardDesc')}</p>
            <div className={styles.formFields}>
              {formFields.map((f) => (
                <Fragment key={f.label}>
                  <span className={styles.fieldLabel}>{f.label}</span>
                  <span className={styles.fieldValue}>{f.value}</span>
                </Fragment>
              ))}
            </div>
            <div className={styles.formButtons}>
              <Button variant="secondary" onClick={() => setStep('default')}>{t('settle.req.cancel')}</Button>
              <Button variant="primary" onClick={() => setSubmitted(true)}>{t('settle.req.submit')}</Button>
            </div>
          </section>
          {submitted && <div className={styles.toast}>{t('settle.req.toast')}</div>}
        </div>
      </div>
    )
  }

  // ===== 플로우 1: 기본(긴) 화면 =====
  return (
    <div className={styles.page}>
      <PageHeader title={t('settle.req.title')} />

      {/* 요약 배너 */}
      <div className={styles.bannerBox}>
        <div className={styles.bannerHead}>
          <p className={styles.notice}>{banner.notice}</p>
          <span className={styles.statusBadge}>{t('settle.req.statusOk')}</span>
        </div>
        <InfoGrid
          items={[
            { label: t('settle.req.banner.lastDate'), value: banner.lastDate },
            { label: t('settle.req.banner.period'), value: banner.period },
            { label: t('settle.req.banner.exclude'), value: banner.exclude },
            { label: t('settle.req.banner.method'), value: banner.method },
          ]}
        />
      </div>

      {/* 지표 8개 — 감싸는 박스 없이 독립 카드 4×2 */}
      <div className={styles.kpiGrid}>
        {stats.map((s) => (
          <div key={s.id} className={styles.kpiCard}>
            <span className={styles.kpiLabel}>{s.label}</span>
            <span className={styles.kpiValue}>{s.value}</span>
            {s.note && <span className={styles.kpiNote}>{s.note}</span>}
          </div>
        ))}
      </div>

      {/* 정산 가능 금액 계산 (시안 히어로 박스) */}
      <div className={styles.calcHero}>
        <h3 className={styles.sectionTitle}>{t('settle.req.calc.title')}</h3>
        <p className={styles.sectionDesc}>{t('settle.req.calc.desc')}</p>
        <div className={styles.formula}>
          <AmountCard label={t('settle.req.calc.partnerProfit')} value={calc.partnerProfit} unit={calc.unit} />
          <span className={styles.formulaOp}>+</span>
          <AmountCard label={t('settle.req.calc.directProfit')} value={calc.directProfit} unit={calc.unit} />
          <span className={styles.formulaOp}>−</span>
          <AmountCard label={t('settle.req.calc.held')} value={calc.held} unit={calc.unit} variant="minus" />
          <span className={styles.formulaOp}>=</span>
          <AmountCard label={t('settle.req.calc.final')} value={calc.final} unit={calc.unit} variant="final" />
        </div>
      </div>

      {/* 수수료 구조 (별도 박스) */}
      <div className={styles.feeBox}>
        <h3 className={styles.sectionTitle}>{t('settle.req.fee.title')}</h3>
        {feeStructure.map((row, i) => (
          <div key={i} className={styles.feeRow}>
            <span className={styles.feeCat}>{row[0]}</span>
            {row.slice(1).map((stepLabel, j) => (
              <Fragment key={j}>
                {j > 0 && <span className={styles.feeArrow}>→</span>}
                <span className={styles.feeStep}>{stepLabel}</span>
              </Fragment>
            ))}
          </div>
        ))}
      </div>

      {/* 자동 정산 안내 (별도 박스) */}
      <div className={styles.autoBox}>
        <h3 className={styles.sectionTitle}>{t('settle.req.auto.title')}</h3>
        <p className={styles.sectionDesc}>{autoDesc}</p>
        <div className={styles.autoHighlight}>{autoHighlight}</div>
        <div className={styles.summaryGrid}>
          {autoStats.map((s) => (
            <div key={s.id} className={styles.summaryCard}>
              <span className={styles.kpiLabel}>{s.label}</span>
              <span className={styles.kpiValue}>{s.value}</span>
              {s.note && <span className={styles.kpiNote}>{s.note}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* 파트너별 수수료 수익 */}
      <div className={styles.sectionBox}>
        <h3 className={styles.sectionTitle}>{t('settle.req.pt.title')}</h3>
        <p className={styles.sectionDesc}>{partnerTable.desc}</p>
        <DataTable columns={partnerTable.columns} rows={ptRows} bare />
      </div>

      {/* 직계약 가맹점 수수료 수익 */}
      <div className={styles.sectionBox}>
        <h3 className={styles.sectionTitle}>{t('settle.req.dt.title')}</h3>
        <p className={styles.sectionDesc}>{directTable.desc}</p>
        <DataTable columns={directTable.columns} rows={dtRows} bare />
      </div>

      {/* 보류 / 제외 거래 */}
      <div className={styles.sectionBox}>
        <h3 className={styles.sectionTitle}>{t('settle.req.ht.title')}</h3>
        <p className={styles.sectionDesc}>{heldTable.desc}</p>
        <DataTable columns={heldTable.columns} rows={htRows} bare />
      </div>

      {/* 본사 정산 요청 (최종 요청 폼) */}
      <div className={styles.sectionBox}>
        <h3 className={styles.sectionTitle}>{t('settle.req.final.title')}</h3>
        <p className={styles.sectionDesc}>{t('settle.req.final.desc')}</p>
        <div className={styles.fieldGrid}>
          <FieldCard label={t('settle.req.final.period')} value={summary.period} />
          <FieldCard label={t('settle.req.final.lastDate')} value={summary.lastDate} />
          <FieldCard label={t('settle.req.final.finalAmount')} value={summary.finalAmount} />
          <FieldCard label={t('settle.req.final.autoSettle')} value={summary.autoSettle} />
          <FieldCard label={t('settle.req.final.held')} value={summary.held} />
          <FieldCard label={t('settle.req.final.requestAmount')} value={summary.requestAmount} />
          <FieldCard label={t('settle.req.final.wallet')} value={summary.wallet} />
          <FieldCard label={t('settle.req.final.currency')} value={summary.currency} />
          <div className={styles.fieldCard}>
            <span className={styles.fieldLabel}>{t('settle.req.final.memo')}</span>
            <textarea className={styles.memo} placeholder={summary.memoPlaceholder} />
          </div>
        </div>

        <div className={styles.checks}>
          {checks.map((c, i) => (
            <label key={i} className={styles.check}>
              <input type="checkbox" defaultChecked /> {c}
            </label>
          ))}
        </div>

        <div className={styles.requestBtnRow}>
          <Button variant="primary" onClick={() => setStep('form')}>{t('settle.req.requestBtn')}</Button>
        </div>
      </div>
    </div>
  )
}

/** 최종 요청 폼의 작은 필드 카드 (라벨 + 값) */
function FieldCard({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.fieldCard}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.fieldValue}>{value}</span>
    </div>
  )
}
