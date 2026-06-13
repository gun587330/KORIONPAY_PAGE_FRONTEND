import SalesPage, { type SalesTable } from '../../components/templates/SalesPage'
import ActionBadges from '../../components/molecules/ActionBadges'
import type { TableRow } from '../../components/organisms/DataTable'
import { useTranslation } from '../../i18n'
import { useMerchantSales } from './useMerchantSales'

/*
 * MerchantSales (page) — 가맹점 관리 · 가맹점별 매출
 * ------------------------------------------------------------------
 * 공통 SalesPage 템플릿에 데이터 주입. 테이블 2개(가맹점별 매출 상세 액션 / 가맹점 매출).
 */
export default function MerchantSales() {
  const { t } = useTranslation()
  const { stats, t1, t2 } = useMerchantSales()
  const toolbar = [t('common.search'), t('common.filter'), t('common.excel')]

  // 테이블 1: 가맹점별 매출 (행마다 "상세" 액션)
  const t1Rows: TableRow[] = t1.rows.map((r) => ({
    id: r.code,
    cells: {
      no: r.no,
      code: r.code,
      name: r.name,
      telegram: r.telegram,
      region: r.region,
      monthRevenue: r.monthRevenue,
      monthCount: r.monthCount,
      recentActivity: r.recentActivity,
      action: <ActionBadges labels={['상세']} />,
    },
  }))

  // 테이블 2: 가맹점 매출 (액션 없음)
  const t2Rows: TableRow[] = t2.rows.map((r) => ({
    id: r.merchantCode,
    cells: {
      no: r.no,
      partner: r.partner,
      merchantCode: r.merchantCode,
      merchantName: r.merchantName,
      amount: r.amount,
      monthCount: r.monthCount,
      recentPay: r.recentPay,
      fee: r.fee,
      unsettledFee: r.unsettledFee,
      recentPay2: r.recentPay2,
      qrUsage: r.qrUsage,
    },
  }))

  const tables: SalesTable[] = [
    { id: 't1', title: t1.title, columns: t1.columns, rows: t1Rows, toolbar },
    { id: 't2', title: t2.title, columns: t2.columns, rows: t2Rows, toolbar },
  ]

  return <SalesPage title={t('merchantList.title')} sectionTitle={t('merchantSales.section')} stats={stats} tables={tables} />
}
