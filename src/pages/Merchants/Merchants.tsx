import RequestListPage from '../../components/templates/RequestListPage'
import ActionBadges from '../../components/molecules/ActionBadges'
import type { TableRow } from '../../components/organisms/DataTable'
import { useTranslation } from '../../i18n'
import { useMerchants } from './useMerchants'

/*
 * Merchants (page) — 가맹점 관리 · 가맹점 전체 목록
 * ------------------------------------------------------------------
 * RequestListPage 템플릿 재사용(헤더 + 지표 섹션 + 제목 달린 테이블).
 * 데이터는 useMerchants 훅, UI 문구는 t().
 */
export default function Merchants() {
  const { t } = useTranslation()
  const { stats, columns, rows: rawRows } = useMerchants()

  // 액션은 행마다 다름(정지요청/해지요청)
  const rows: TableRow[] = rawRows.map((r) => ({
    id: r.merchantCode,
    cells: {
      no: r.no,
      city: r.city,
      partner: r.partner,
      merchantCode: r.merchantCode,
      name: r.name,
      volume: r.volume,
      txCount: r.txCount,
      avgPay: r.avgPay,
      qrUsage: r.qrUsage,
      lastTx: r.lastTx,
      action: <ActionBadges labels={r.actions} />,
    },
  }))

  return (
    <RequestListPage
      title={t('merchantList.title')}
      sectionTitle={t('merchantList.section')}
      stats={stats}
      columns={columns}
      rows={rows}
      tableTitle={t('merchantList.tableTitle')}
      toolbar={[t('common.search'), t('common.filter'), t('common.excel')]}
    />
  )
}
