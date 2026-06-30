import PageHeader from '../../../components/organisms/PageHeader'
import DataTable, { type TableRow } from '../../../components/organisms/DataTable'
import ActionBadges from '../../../components/molecules/ActionBadges'
import { useTranslation } from '../../../i18n'
import { useSettlementHistory, type HistoryStatus } from './useSettlementHistory'
import styles from './SettlementHistory.module.css'

/** 기간 필터 — Figma상 활성값 하나만 노출(데이터 토큰이라 번역 안 함) */
const PERIOD_FILTER = '30 D'

/** 상태 enum → 표시 색 클래스 (검토=주황 / 완료=초록 / 보류=호박) */
const STATUS_CLASS: Record<HistoryStatus, string> = {
  review: styles.stReview,
  done: styles.stDone,
  hold: styles.stHold,
}

/*
 * HqSettlementHistory (page) — 본사어드민 · 수수료/정산 · 정산 내역(목록)
 * ------------------------------------------------------------------
 * 본사가 처리한 리더 정산 내역을 조회하는 목록 화면.
 * 기간 필터 칩 + KPI 12개 + "리더 정산 신청 목록" 테이블.
 * 행 '상세'는 정산 내역 상세 폼(추후 Figma 확정 후 라우트 연결)으로 진입 예정 — 현재 표시 전용.
 */
export default function HqSettlementHistory() {
  const { t } = useTranslation()
  const { kpis, columns, rows: rawRows, statusLabel, statusAction, detailLabel, section } = useSettlementHistory()

  const rows: TableRow[] = rawRows.map((r, index) => ({
    // 신청 ID가 샘플상 중복돼 있어 index로 key를 구분
    id: `${r.id}-${index}`,
    cells: {
      id: r.id,
      date: r.date,
      processedAt: r.processedAt,
      code: r.code,
      partnerName: r.partnerName,
      country: r.country,
      period: r.period,
      totalAmount: r.totalAmount,
      partnerProfit: r.partnerProfit,
      directProfit: r.directProfit,
      partnerSettle: r.partnerSettle,
      held: r.held,
      finalAmount: r.finalAmount,
      status: <span className={STATUS_CLASS[r.status]}>{statusLabel[r.status]}</span>,
      action: <ActionBadges labels={[detailLabel, statusAction[r.status]]} accentByLabel={{}} size="xs" solid />,
    },
  }))

  return (
    <div className={styles.page}>
      <PageHeader title={t('hqSettle.hist.title')}>
        {/* 기간 필터 칩 (활성값) */}
        <div className={styles.filterRow}>
          <span className={styles.periodChip}>{PERIOD_FILTER}</span>
        </div>
      </PageHeader>

      {/* KPI 12개 — 감싸는 박스 없이 4×3 독립 카드 */}
      <div className={styles.kpiGrid}>
        {kpis.map((k) => (
          <div key={k.id} className={`${styles.kpiCard} ${k.highlight ? styles.kpiCardHighlight : ''}`}>
            <span className={styles.kpiLabel}>{k.label}</span>
            <span className={styles.kpiValue}>{k.value}</span>
            <span className={styles.kpiNote}>{k.note}</span>
          </div>
        ))}
      </div>

      {/* 리더 정산 신청 목록 */}
      <DataTable
        title={section}
        columns={columns}
        rows={rows}
        toolbar={[t('common.search'), t('common.filter'), t('hqSettle.req.toolbar.excel')]}
        fill
        inlineToolbar
        mutedText
      />
    </div>
  )
}
