import { useState } from 'react'
import RequestListPage from '../../../components/templates/RequestListPage'
import ActionBadges from '../../../components/molecules/ActionBadges'
import DetailSection from '../../../components/molecules/DetailSection'
import DetailDrawer from '../../../components/organisms/DetailDrawer'
import Badge from '../../../components/atoms/Badge'
import Button from '../../../components/atoms/Button'
import type { TableRow } from '../../../components/organisms/DataTable'
import type { AccentKey } from '../../../types'
import { ACCENT_VAR } from '../../../utils/accent'
import { useTranslation } from '../../../i18n'
import { usePaymentLog } from './usePaymentLog'
import { usePaymentLogDetail, type SyncStep } from './usePaymentLogDetail'
import styles from './PaymentLog.module.css'

/** 액션 컬럼에서 드로어를 여는 배지(데이터 enum). 나머지는 정산 처리 배지. */
const DETAIL_LABEL = '상세'
/** 정산 처리 배지 색: 지급완료=초록 / 보류해제=주황 / 지급보류=중립 */
const SETTLE_ACCENT: Record<string, AccentKey> = { 지급완료: 'green', 보류해제: 'amber' }

/*
 * PaymentLog (page) — 본사어드민 · 결제 모니터링 · 전체 결제 로그
 * ------------------------------------------------------------------
 * 구조: [헤더] + [KPI 카드 10개(박스 없는 그리드)] + [결제 로그 테이블 1개] + [상세 Drawer].
 * RequestListPage 템플릿을 재사용하고, 표의 "상세" 배지를 누르면 우측 DetailDrawer가 열린다.
 *
 * 참고: Figma 프레임 헤더 텍스트가 "가맹점 관리 - 가맹점 전체 목록"으로 박혀 있으나
 * 이는 복붙 leftover다(같은 텍스트가 hqMerchantList.title에 그대로 존재). 실제 화면은
 * 사이드바 "결제 모니터링 > 전체 결제 로그"이므로 제목을 해당 메뉴명으로 둔다.
 */
export default function PaymentLog() {
  const { t } = useTranslation()
  const { pageTitle, title, kpis, columns, rows: rawRows } = usePaymentLog()

  // 어느 행의 "상세"를 눌렀는지(=드로어 열림 여부). null이면 닫힘.
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const detail = usePaymentLogDetail(selectedId)

  // Sync 스텝 상태 → 스타일 클래스 매핑(완료/진행/대기)
  const stepStateClass: Record<SyncStep['state'], string> = {
    done: styles.stepDone,
    active: styles.stepActive,
    pending: styles.stepPending,
  }

  const rows: TableRow[] = rawRows.map((r) => ({
    id: r.id,
    cells: {
      ...r,
      // 상태는 알약이 아니라 색 글자(성공=초록/실패=빨강/대기=주황) — 색은 토큰 변수로 주입
      status: (
        <span className={styles.status} style={{ color: ACCENT_VAR[r.statusAccent] }}>
          {r.status}
        </span>
      ),
      // 액션: 정산 처리 배지(정적) + 클릭 가능한 "상세" 배지(드로어 오픈)
      action: (
        <div className={styles.actionCell}>
          <ActionBadges labels={r.actions.filter((a) => a !== DETAIL_LABEL)} accentByLabel={SETTLE_ACCENT} size="xs" />
          <button type="button" className={styles.detailButton} onClick={() => setSelectedId(r.id)}>
            <Badge size="xs">{t('common.detail')}</Badge>
          </button>
        </div>
      ),
    },
  }))

  const { sections } = detail

  return (
    <>
      <RequestListPage
        title={pageTitle}
        stats={kpis}
        statsBare
        columns={columns}
        rows={rows}
        tableTitle={title}
        toolbar={[t('common.search'), t('common.filter'), t('common.excel')]}
        toolbarInline
        tableMutedText
        /* 15컬럼이라 가로폭은 컨테이너에 고정하고, 긴 값은 가로 스크롤 대신 다음 줄로 줄바꿈해 끝까지 보이게 */
        tableFluid
        tableWrapCells
      />

      <DetailDrawer
        open={selectedId !== null}
        onClose={() => setSelectedId(null)}
        title={detail.title}
        headerExtra={
          <div className={styles.drawerHead}>
            <span className={styles.drawerId}>{detail.header.id}</span>
            <div className={styles.statusRow}>
              {detail.header.statuses.map((s) => (
                <Badge key={s.label} accent={s.accent} size="xs">
                  {s.label}
                </Badge>
              ))}
            </div>
            <p className={styles.metaLine}>{detail.header.meta}</p>
          </div>
        }
        footer={detail.footerActions.map((a) => (
          <Button key={a.label} variant={a.variant}>
            {a.label}
          </Button>
        ))}
      >
        <DetailSection title={sections.basic.title} rows={sections.basic.rows} />
        <DetailSection title={sections.parties.title} rows={sections.parties.rows} />
        <DetailSection title={sections.localBlock.title} rows={sections.localBlock.rows} />
        <DetailSection title={sections.proof.title} rows={sections.proof.rows} />

        {/* E. Sync / 서버 검증 — 표가 아니라 단계 스텝퍼 + 상태 설명줄 */}
        <DetailSection title={sections.sync.title}>
          <div className={styles.stepper}>
            {sections.sync.steps.map((step, i) => (
              <div key={step.label} className={styles.step}>
                <span className={`${styles.stepNode} ${stepStateClass[step.state]}`}>{step.label}</span>
                {i < sections.sync.steps.length - 1 && <span className={styles.stepConnector} aria-hidden="true" />}
              </div>
            ))}
          </div>
          <p className={styles.syncStatus}>{sections.sync.statusLine}</p>
        </DetailSection>

        <DetailSection title={sections.fee.title} rows={sections.fee.rows} />
        <DetailSection title={sections.risk.title} rows={sections.risk.rows} />

        {/* H. 관리자 메모 — 입력칸(정적, 동작 없음) + 메모 로그 */}
        <DetailSection title={sections.memo.title}>
          {/* 작업 범위상 동작 없음(읽기 전용 표시용) */}
          <textarea className={styles.memoInput} placeholder={sections.memo.placeholder} readOnly />
          <ul className={styles.memoLogs}>
            {sections.memo.logs.map((log, i) => (
              <li key={i}>{log}</li>
            ))}
          </ul>
        </DetailSection>
      </DetailDrawer>
    </>
  )
}
