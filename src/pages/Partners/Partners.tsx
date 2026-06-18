import RequestListPage from '../../components/templates/RequestListPage'
import ActionBadges from '../../components/molecules/ActionBadges'
import type { TableRow } from '../../components/organisms/DataTable'
import { useTranslation } from '../../i18n'
import { usePartners } from './usePartners'

/*
 * Partners (page) — 파트너 관리 · 파트너 전체 목록
 * ------------------------------------------------------------------
 * 요청 화면과 동일한 RequestListPage 템플릿을 재사용한다(헤더 + 섹션 박스 + 테이블).
 * 데이터는 usePartners 훅(하드코딩 JSON), UI 문구는 t()로 받는다.
 */
export default function Partners() {
  const { t } = useTranslation()
  const { stats, columns, rows: rawRows, isLoading, error } = usePartners()

  // 액션은 행마다 다르므로(정지요청/해제요청) 각 행의 actions를 사용
  const rows: TableRow[] = rawRows.map((r) => ({
    id: r.partner,
    cells: {
      no: r.no,
      partner: r.partner,
      name: r.name,
      telegram: r.telegram,
      region: r.region,
      subCount: r.subCount,
      volume: r.volume,
      txCount: r.txCount,
      hqStatus: r.hqStatus,
      opStatus: r.opStatus,
      lastTx: r.lastTx,
      action: <ActionBadges labels={r.actions} />,
    },
  }))

  return (
    <RequestListPage
      title={t('partnerList.title')}
      sectionTitle={t('partnerList.section')}
      sectionDesc={error ? t('common.apiFallback') : isLoading ? t('common.loading') : undefined}
      stats={stats}
      columns={columns}
      rows={rows}
      toolbar={[t('common.search'), t('common.filter'), t('common.excel')]}
    />
  )
}
