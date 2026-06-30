import { useTranslation } from '../../../i18n'
import type { AccentKey } from '../../../types'
import type { DetailRow } from '../../../components/molecules/DetailSection'
import detail from './paymentLogDetailData.json'

/** 헤더 상태 배지 1개 */
export interface DetailStatus {
  label: string
  accent?: AccentKey
}

/** Sync 스텝퍼 1단계 */
export interface SyncStep {
  label: string
  state: 'done' | 'active' | 'pending'
}

/** 하단 푸터 액션 버튼 1개 */
export interface FooterAction {
  label: string
  variant: 'primary' | 'secondary' | 'danger'
}

interface RawRow {
  labelKey: string
  value: string
}

/*
 * usePaymentLogDetail — 전체 결제 로그 "상세" 드로어 데이터 훅
 * ------------------------------------------------------------------
 * paymentLogDetailData.json(더미)을 읽어 UI 라벨(섹션/필드/버튼)은 번역해 반환한다.
 * 필드 값(코드/해시/금액/상태 enum 등)은 CLAUDE.md 11번 규칙상 번역하지 않고 그대로 통과.
 *
 * 현재는 어느 행의 "상세"를 눌러도 같은 Figma 예시 1건을 보여준다(요구사항). 추후 실 연동 시
 * 인자로 받은 txId로 API를 호출하도록 이 훅 내부만 교체하면 드로어 컴포넌트는 그대로 동작한다.
 */
export function usePaymentLogDetail(_txId: string | null) {
  const { t } = useTranslation()

  // 라벨/값 줄: 라벨만 번역, 값은 데이터 그대로
  const toRows = (rows: RawRow[]): DetailRow[] => rows.map((r) => ({ label: t(r.labelKey), value: r.value }))

  const statuses: DetailStatus[] = detail.header.statuses as DetailStatus[]

  const syncSteps = detail.sync.steps as SyncStep[]

  const footerActions: FooterAction[] = (detail.footerActions as Array<{ labelKey: string; variant: FooterAction['variant'] }>).map(
    (a) => ({ label: t(a.labelKey), variant: a.variant }),
  )

  return {
    title: t('hqPaymentLog.detail.title'),
    // 헤더 식별자 + 메타줄(라벨은 번역, 값은 데이터)
    header: {
      id: detail.header.id,
      statuses,
      meta: [
        `${t('hqPaymentLog.detail.meta.method')}: ${detail.header.method}`,
        `${t('hqPaymentLog.detail.meta.connection')}: ${detail.header.connection}`,
        `${t('hqPaymentLog.detail.meta.country')}: ${detail.header.country}`,
        `${t('hqPaymentLog.detail.meta.createdAt')}: ${detail.header.createdAt}`,
      ].join(' · '),
    },
    sections: {
      basic: { title: t('hqPaymentLog.detail.section.a'), rows: toRows(detail.basic) },
      parties: { title: t('hqPaymentLog.detail.section.b'), rows: toRows(detail.parties) },
      localBlock: { title: t('hqPaymentLog.detail.section.c'), rows: toRows(detail.localBlock) },
      proof: { title: t('hqPaymentLog.detail.section.d'), rows: toRows(detail.proof) },
      sync: { title: t('hqPaymentLog.detail.section.e'), steps: syncSteps, statusLine: detail.sync.statusLine },
      fee: { title: t('hqPaymentLog.detail.section.f'), rows: toRows(detail.fee) },
      risk: { title: t('hqPaymentLog.detail.section.g'), rows: toRows(detail.risk) },
      memo: {
        title: t('hqPaymentLog.detail.section.h'),
        placeholder: t('hqPaymentLog.detail.memo.placeholder'),
        logs: detail.memo.logs as string[],
      },
    },
    footerActions,
  }
}
