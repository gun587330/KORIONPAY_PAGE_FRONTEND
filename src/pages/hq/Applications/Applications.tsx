import { useState } from 'react'
import RequestListPage from '../../../components/templates/RequestListPage'
import ActionBadges from '../../../components/molecules/ActionBadges'
import type { TableRow } from '../../../components/organisms/DataTable'
import type { AccentKey } from '../../../types'
import { useTranslation } from '../../../i18n'
import { useApplications } from './useApplications'
import ApplicationDetailOverlay from './ApplicationDetailOverlay'

/*
 * Applications (page) — 본사어드민 · 신청서 관리 · 제휴 / 투자 신청서
 * ------------------------------------------------------------------
 * RequestListPage 템플릿 재사용. 액션 컬럼은 라벨 목록형(ActionBadges)이 아니라
 * "확인/검토/위험" 중 그 행의 현재 상태 하나만 색이 켜지는 상태 표시 + "삭제" 액션이라
 * 행마다 accentByLabel을 동적으로 만들어 넘긴다(라벨 자체는 항상 4개 고정).
 */
export default function Applications() {
  const { t } = useTranslation()
  const [showDetail, setShowDetail] = useState(false)
  const { stats, columns, rows: rawRows, statusMeta, deleteLabel } = useApplications()

  const rows: TableRow[] = rawRows.map((r, index) => {
    const labels = [statusMeta.confirmed.label, statusMeta.review.label, statusMeta.risk.label, deleteLabel]
    const active = statusMeta[r.status]
    const accentByLabel: Record<string, AccentKey> = { [active.label]: active.accent }
    // 활성 배지만 상태별 solid 규칙을 따르고, 비활성·삭제 배지는 항상 solid 회색(Figma 기준)
    const solidByLabel: Record<string, boolean> = Object.fromEntries(
      labels.map((label) => [label, label === active.label ? active.solid : true]),
    )

    return {
      id: `${r.no}-${index}`,
      cells: {
        no: r.no,
        appliedAt: r.appliedAt,
        type: r.type,
        country: r.country,
        contact: r.contact,
        company: r.company,
        email: r.email,
        interest: r.interest,
        action: <ActionBadges labels={labels} accentByLabel={accentByLabel} solidByLabel={solidByLabel} size="xs" equalWidth />,
      },
    }
  })

  return (
    <>
      <RequestListPage
        title={t('hqApplications.title')}
        statsBare
        stats={stats}
        columns={columns}
        rows={rows}
        tableTitle={t('hqApplications.section')}
        toolbar={[t('common.search'), t('common.filter'), t('common.excel')]}
        toolbarInline
        tableMutedText
        tableHeaderBar
        onRowClick={() => setShowDetail(true)}
      />
      <ApplicationDetailOverlay open={showDetail} onClose={() => setShowDetail(false)} />
    </>
  )
}
