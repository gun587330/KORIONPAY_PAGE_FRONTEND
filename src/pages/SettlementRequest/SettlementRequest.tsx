import { Fragment, useState, type CSSProperties } from 'react'
import PageHeader from '../../components/organisms/PageHeader'
import Button from '../../components/atoms/Button'
import InfoGrid from '../../components/molecules/InfoGrid'
import ActionBadges from '../../components/molecules/ActionBadges'
import DataTable, { type TableRow } from '../../components/organisms/DataTable'
import { useTranslation } from '../../i18n'
import { useSettlementRequest } from './useSettlementRequest'
import styles from './SettlementRequest.module.css'

/** 분배 게이지 세그먼트 색 (본사/리더/파트너) */
const ROLE_COLOR: Record<string, string> = { hq: '#7c5cff', leader: '#24e6b8', partner: '#f6c85a' }

/** 정산 계산 수식의 금액 카드 (add: 시안 / minus: 빨강 / final: 그라데이션) */
function AmountCard({ variant, label, value, unit }: { variant: 'add' | 'minus' | 'final'; label: string; value: string; unit: string }) {
  if (variant === 'final') {
    return (
      <div className={`${styles.amountCard} ${styles.amountFinal}`}>
        <span className={styles.amountTitle}>{label}</span>
        <span className={styles.amountValueRow}>
          <span className={styles.amountValue}>{value}</span>
          <span className={styles.amountUnit}>{unit}</span>
        </span>
      </div>
    )
  }
  const isMinus = variant === 'minus'
  const valCls = isMinus ? styles.valRed : styles.valTeal
  return (
    <div className={`${styles.amountCard} ${isMinus ? styles.amountMinus : styles.amountAdd}`}>
      <span className={`${styles.amountChip} ${isMinus ? styles.amountChipRed : styles.amountChipTeal}`}>{label}</span>
      <span className={styles.amountValueRow}>
        <span className={`${styles.amountValue} ${valCls}`}>{value}</span>
        <span className={`${styles.amountUnit} ${valCls}`}>{unit}</span>
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
    banner, kpis, calc, feeStructure, autoDesc, autoHighlight, autoStats,
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

      {/* 지표 8개 — 감싸는 박스 없이 독립 카드 4×2, 제목 칩은 카드별 색 */}
      <div className={styles.kpiGrid}>
        {kpis.map((k) => (
          <div key={k.id} className={styles.kpiCard}>
            <span
              className={`${styles.kpiLabel} ${k.chipSolid ? styles.kpiLabelSolid : styles.kpiLabelTranslucent}`}
              style={{ '--chip': k.chip } as CSSProperties}
            >
              {k.label}
            </span>
            <span className={styles.kpiValue}>{k.value}</span>
            {k.note && <span className={styles.kpiNote}>{k.note}</span>}
          </div>
        ))}
      </div>

      {/* 정산 가능 금액 계산 (시안 히어로 박스) */}
      <div className={styles.calcHero}>
        <h3 className={styles.sectionTitle}>{t('settle.req.calc.title')}</h3>
        <p className={styles.sectionDesc}>{t('settle.req.calc.desc')}</p>
        <div className={styles.formula}>
          <AmountCard variant="add" label={t('settle.req.calc.partnerProfit')} value={calc.partnerProfit} unit={calc.unit} />
          <span className={styles.formulaOp}>+</span>
          <AmountCard variant="add" label={t('settle.req.calc.directProfit')} value={calc.directProfit} unit={calc.unit} />
          <span className={styles.formulaOp}>−</span>
          <AmountCard variant="minus" label={t('settle.req.calc.held')} value={calc.held} unit={calc.unit} />
          <span className={styles.formulaOp}>=</span>
          <AmountCard variant="final" label={t('settle.req.calc.final')} value={calc.final} unit={calc.unit} />
        </div>

        {/* 분배 게이지 바 (본사/리더/파트너) */}
        <div className={styles.gauges}>
          {calc.gauges.map((segs, gi) => (
            <div key={gi} className={styles.gaugeGroup}>
              <div className={styles.gaugeBar}>
                {segs.filter((s) => s.pct > 0).map((s, si) => (
                  <span key={si} className={styles.gaugeSeg} style={{ flexGrow: s.pct, backgroundColor: ROLE_COLOR[s.role] }} />
                ))}
              </div>
              <div className={styles.gaugeLabels}>
                {segs.map((s, si) => (
                  <span key={si} style={{ flexGrow: s.pct || 0.001 }}>{s.label}</span>
                ))}
              </div>
            </div>
          ))}
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
              <span className={styles.summaryLabel}>{s.label}</span>
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
