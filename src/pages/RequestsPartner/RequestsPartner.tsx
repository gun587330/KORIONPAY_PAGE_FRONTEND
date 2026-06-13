import RequestListPage from '../../components/templates/RequestListPage'
import ActionBadges from '../../components/molecules/ActionBadges'
import type { TableRow } from '../../components/organisms/DataTable'
import {
  PARTNER_STATS,
  PARTNER_COLUMNS,
  PARTNER_ROWS,
  PARTNER_ACTIONS,
} from './partnerData'

/*
 * RequestsPartner (page) — 요청 관리 · 파트너 가입 요청
 * ------------------------------------------------------------------
 * 공통 RequestListPage 템플릿에 파트너 데이터를 주입한다.
 * (테이블/버튼은 정적 표시 — 데이터는 Figma 샘플 하드코딩)
 */
export default function RequestsPartner() {
  // 원본 행 → 테이블 행 변환 (액션 컬럼은 공통 ActionBadges로 렌더링)
  const rows: TableRow[] = PARTNER_ROWS.map((r) => ({
    id: r.code,
    cells: {
      no: r.no,
      code: r.code,
      name: r.name,
      region: r.region,
      subCount: r.subCount,
      volume: r.volume,
      txCount: r.txCount,
      hqStatus: r.hqStatus,
      opStatus: r.opStatus,
      date: r.date,
      action: <ActionBadges labels={PARTNER_ACTIONS} />,
    },
  }))

  return (
    <RequestListPage
      title="요청 관리"
      sectionTitle="파트너 가입 요청"
      sectionDesc="리더가 가입정보를 확인하고 본사에 최종 승인요청하면 본사에서 승인 / 보류 / 거절 / 자료요청을 결정합니다."
      stats={PARTNER_STATS}
      columns={PARTNER_COLUMNS}
      rows={rows}
      toolbar={['검색', '필터', 'Excel']}
    />
  )
}
