import RequestListPage from '../../../components/templates/RequestListPage'
import ActionBadges from '../../../components/molecules/ActionBadges'
import type { TableRow } from '../../../components/organisms/DataTable'
import { useTranslation } from '../../../i18n'
import { usePartnerMerchantRequests, PARTNER_MERCHANT_ACTIONS } from './usePartnerMerchantRequests'

/*
 * PartnerRequestsMerchant (page) — 파트너 · 요청 관리(가맹점 가입 요청)
 * ------------------------------------------------------------------
 * 리더의 요청 화면과 동일한 RequestListPage 템플릿 재사용. 데이터/액션만 파트너용.
 * 파트너는 가맹점 가입정보를 확인하고 리더에게 최종 승인요청을 보낸다.
 */
export default function PartnerRequestsMerchant() {
  const { t } = useTranslation()
  const { stats, columns, rows: rawRows } = usePartnerMerchantRequests()

  const rows: TableRow[] = rawRows.map((r) => ({
    id: r.code,
    cells: {
      no: r.no,
      code: r.code,
      name: r.name,
      telegram: r.telegram,
      region: r.region,
      industry: r.industry,
      opStatus: r.opStatus,
      date: r.date,
      action: <ActionBadges labels={PARTNER_MERCHANT_ACTIONS} />,
    },
  }))

  return (
    <RequestListPage
      title={t('requests.title')}
      sectionTitle={t('preq.sectionTitle')}
      sectionDesc={t('preq.sectionDesc')}
      stats={stats}
      columns={columns}
      rows={rows}
      toolbar={[t('common.search'), t('common.filter'), t('common.excel')]}
    />
  )
}
