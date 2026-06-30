import { useTranslation } from '../../../i18n'
import type { Column } from '../../../components/organisms/DataTable'
import data from './settlementRequestData.json'

interface KpiRaw {
  labelKey: string
  value: string
  noteKey: string
}

/** 정산 신청 상태 enum — 검토/완료/보류. 표시 라벨은 데이터 값(번역 대상 아님) */
export type RequestStatus = 'review' | 'done' | 'hold'

/** 리더 정산 신청 행 (Figma 샘플값 하드코딩) */
export interface RequestRow {
  id: string
  date: string
  applicant: string
  partnerName: string
  country: string
  period: string
  totalAmount: string
  partnerProfit: string
  directProfit: string
  partnerSettle: string
  held: string
  finalAmount: string
  status: RequestStatus
}

/** KPI 카드 (라벨만 번역) */
export interface KpiItem {
  id: string
  label: string
  value: string
  note: string
}

/*
 * useSettlementRequest — 본사어드민 · 수수료/정산 · 정산 신청(목록) 데이터 훅
 * ------------------------------------------------------------------
 * settlementRequestData.json(더미)을 읽어 UI 라벨(KPI/컬럼명/액션)은 번역해 반환한다.
 * 상태/코드/금액/이름 등 행 데이터 값은 번역하지 않는다(CLAUDE.md 11번).
 * 추후 실 연동 시 이 훅 내부만 API 호출로 교체.
 */
export function useSettlementRequest() {
  const { t } = useTranslation()

  const kpis: KpiItem[] = (data.kpis as KpiRaw[]).map((k) => ({
    id: k.labelKey,
    label: t(k.labelKey),
    value: k.value,
    note: t(k.noteKey),
  }))

  const columns: Column[] = [
    { key: 'id', label: t('hqSettle.req.col.id'), width: '1.5fr' },
    { key: 'date', label: t('hqSettle.req.col.date'), width: '0.9fr' },
    { key: 'applicant', label: t('hqSettle.req.col.applicant'), width: '1fr' },
    { key: 'partnerName', label: t('hqSettle.req.col.partnerName'), width: '1fr' },
    { key: 'country', label: t('hqSettle.req.col.country'), width: '0.9fr' },
    { key: 'period', label: t('hqSettle.req.col.period'), width: '1.5fr' },
    { key: 'totalAmount', label: t('hqSettle.req.col.totalAmount'), width: '1fr', align: 'right' },
    { key: 'partnerProfit', label: t('hqSettle.req.col.partnerProfit'), width: '0.8fr', align: 'right' },
    { key: 'directProfit', label: t('hqSettle.req.col.directProfit'), width: '0.8fr', align: 'right' },
    { key: 'partnerSettle', label: t('hqSettle.req.col.partnerSettle'), width: '0.8fr', align: 'right' },
    { key: 'held', label: t('hqSettle.req.col.held'), width: '0.6fr', align: 'right' },
    { key: 'finalAmount', label: t('hqSettle.req.col.finalAmount'), width: '0.9fr', align: 'right' },
    { key: 'status', label: t('hqSettle.req.col.status'), width: '0.9fr' },
    { key: 'action', label: t('hqSettle.req.col.action'), width: '1.2fr' },
  ]

  /** 상태 enum → 표시 라벨(데이터 값) + 행 액션 2번째 버튼 라벨(번역) */
  const statusLabel: Record<RequestStatus, string> = {
    review: '정산검토',
    done: '정산완료',
    hold: '정산보류',
  }
  const statusAction: Record<RequestStatus, string> = {
    review: t('hqSettle.req.action.review'),
    done: t('hqSettle.req.action.review'),
    hold: t('hqSettle.req.action.hold'),
  }

  return {
    kpis,
    columns,
    rows: data.rows as RequestRow[],
    statusLabel,
    statusAction,
    detailLabel: t('hqSettle.req.action.detail'),
    chipAutoInclude: t('hqSettle.req.chip.autoInclude'),
    chipExcludeToday: t('hqSettle.req.chip.excludeToday'),
    section: t('hqSettle.req.section'),
    subtitle: t('hqSettle.req.subtitle'),
  }
}
