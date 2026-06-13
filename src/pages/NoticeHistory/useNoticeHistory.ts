import { useTranslation } from '../../i18n'
import type { Column } from '../../components/organisms/DataTable'
import type { MetricCardData } from '../../components/molecules/MetricCard'
import data from './noticeHistoryData.json'

/** 발송 내역 행 원본 데이터 형태 */
export interface NoticeHistoryRow {
  no: string
  sender: string
  target: string
  type: string
  title: string
  method: string
  status: string
  sentDate: string
}

/** JSON의 KPI 원본 (라벨/보조라벨은 키 또는 리터럴) */
interface MetricRaw {
  id: string
  labelKey: string
  value: string
  note?: string
  noteKey?: string
  chip: string
  chipSolid?: boolean
}

/*
 * useNoticeHistory — 알림/공지 · 발송 내역 데이터 훅
 * ------------------------------------------------------------------
 * 상단 KPI 카드 5개 + 발송 내역 테이블. UI 라벨/컬럼명은 번역, 행 값은 데이터 그대로.
 * KPI의 보조라벨은 UI 설명이면 noteKey(번역), 날짜 등 데이터면 note(리터럴)로 둔다.
 */
export function useNoticeHistory() {
  const { t } = useTranslation()

  const metrics: MetricCardData[] = (data.metrics as MetricRaw[]).map((m) => ({
    id: m.id,
    label: t(m.labelKey),
    value: m.value,
    note: m.note ?? (m.noteKey ? t(m.noteKey) : undefined),
    chip: m.chip,
    chipSolid: m.chipSolid,
  }))

  const columns: Column[] = [
    { key: 'no', label: t('notice.hist.col.no'), width: '0.6fr' },
    { key: 'sender', label: t('notice.hist.col.sender'), width: '0.9fr' },
    { key: 'target', label: t('notice.hist.col.target'), width: '0.9fr' },
    { key: 'type', label: t('notice.hist.col.type'), width: '1fr' },
    { key: 'title', label: t('notice.hist.col.title'), width: '1.6fr' },
    { key: 'method', label: t('notice.hist.col.method'), width: '0.8fr' },
    { key: 'status', label: t('notice.hist.col.status'), width: '1fr' },
    { key: 'sentDate', label: t('notice.hist.col.sentDate'), width: '1fr' },
    { key: 'action', label: t('notice.hist.col.action'), width: '0.8fr' },
  ]

  return {
    metrics,
    columns,
    rows: data.rows as NoticeHistoryRow[],
  }
}
