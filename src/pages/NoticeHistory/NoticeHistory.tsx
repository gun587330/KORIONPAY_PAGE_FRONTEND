import PageHeader from '../../components/organisms/PageHeader'
import DataTable, { type TableRow } from '../../components/organisms/DataTable'
import MetricCard from '../../components/molecules/MetricCard'
import Badge from '../../components/atoms/Badge'
import { useTranslation } from '../../i18n'
import { useNoticeHistory } from './useNoticeHistory'
import styles from './NoticeHistory.module.css'

/*
 * NoticeHistory (page) — 알림 / 공지 · 발송 내역
 * ------------------------------------------------------------------
 * 상단 KPI 카드 5개(전체/이번달/예약대기/완료/실패) + 발송 내역 테이블.
 * 행의 "상세"는 발송 상세 보기 액션 (상세 화면은 범위 밖 — 배지 UI만).
 */
export default function NoticeHistory() {
  const { t } = useTranslation()
  const { metrics, columns, rows: rawRows } = useNoticeHistory()

  const rows: TableRow[] = rawRows.map((r) => ({
    id: r.no,
    cells: {
      no: r.no,
      sender: r.sender,
      target: r.target,
      type: r.type,
      title: r.title,
      method: r.method,
      status: r.status,
      sentDate: r.sentDate,
      action: <Badge accent="cyan" size="sm">{t('common.detail')}</Badge>,
    },
  }))

  return (
    <div className={styles.page}>
      <PageHeader title={t('notice.hist.title')} />

      {/* 상단 KPI 카드 */}
      <div className={styles.metrics}>
        {metrics.map((m) => (
          <MetricCard key={m.id} {...m} />
        ))}
      </div>

      <DataTable
        title={t('notice.hist.tableTitle')}
        columns={columns}
        rows={rows}
        toolbar={[t('common.search'), t('common.filter'), t('common.excel')]}
        fill
      />
    </div>
  )
}
