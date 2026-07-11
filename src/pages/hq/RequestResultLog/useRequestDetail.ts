import { useTranslation } from '../../../i18n'
import type { Column } from '../../../components/organisms/DataTable'
import data from './requestDetailData.json'

interface KpiRaw {
  id: string
  labelKey: string
  value: string
}

export interface DetailKpi {
  id: string
  label: string
  value: string
}

/** 상세 필드 1칸 — 라벨(번역) + 값(데이터) + 값 옆 작은 배지/강조색(선택) */
export interface DetailField {
  label: string
  value: string
  /** 값 옆에 붙는 작은 알약 배지 라벨 (예: 초기화/변경) */
  badge?: string
  /** true면 값을 청록 강조색으로 표시(Figma 신청일/승인일) */
  highlight?: boolean
}

/** 가맹점별 정보 행 원본 데이터 형태 (Figma 샘플값 하드코딩) */
export interface DetailMerchantRow {
  no: string
  partnerCode: string
  merchantCode: string
  city: string
  merchantName: string
  category: string
  monthSales: string
  monthTxCount: string
  fee: string
  lastPaidAt: string
  usage: string
}

/*
 * useRequestDetail — "요청 결과 로그" 상세정보 오버레이(파트너 정보) 데이터 훅
 * ------------------------------------------------------------------
 * requestDetailData.json(더미)을 읽어 UI 라벨은 번역, 값은 데이터 그대로 반환한다.
 * Figma상 어떤 행을 눌러도 같은 샘플 패널 하나뿐이라 행 구분 없이 단일 데이터.
 * 추후 실 연동 시 이 훅 내부만 행 식별자 기반 API 호출로 교체.
 */
export function useRequestDetail() {
  const { t } = useTranslation()

  const mapKpi = (raw: KpiRaw[]): DetailKpi[] => raw.map((k) => ({ id: k.id, label: t(k.labelKey), value: k.value }))

  /** A. 계정 정보 — 4열 × 2행 순서(Figma 배치 그대로) */
  const accountFields: DetailField[] = [
    { label: t('hqRequestResultLog.detail.field.userId'), value: data.account.userId },
    { label: t('hqRequestResultLog.detail.field.password'), value: data.account.password, badge: t('hqRequestResultLog.detail.badge.reset') },
    { label: t('hqRequestResultLog.detail.field.email'), value: data.account.email, badge: t('hqRequestResultLog.detail.badge.change') },
    { label: t('hqRequestResultLog.detail.field.telegram'), value: data.account.telegram },
    { label: t('hqRequestResultLog.detail.field.phone'), value: data.account.phone },
    { label: t('hqRequestResultLog.detail.field.twitter'), value: data.account.twitter },
    { label: t('hqRequestResultLog.detail.field.appliedAt'), value: data.account.appliedAt, highlight: true },
    { label: t('hqRequestResultLog.detail.field.approvedAt'), value: data.account.approvedAt, highlight: true },
  ]

  /** B. 기본 / 소속 정보 — 1행 4칸 + 2행(사유·지갑 주소) */
  const basicFields: DetailField[] = [
    { label: t('hqRequestResultLog.detail.field.partnerName'), value: data.basic.partnerName },
    { label: t('hqRequestResultLog.detail.field.country'), value: data.basic.country },
    { label: t('hqRequestResultLog.detail.field.region'), value: data.basic.region },
    { label: t('hqRequestResultLog.detail.field.languages'), value: data.basic.languages },
  ]
  const basicWideFields: DetailField[] = [
    { label: t('hqRequestResultLog.detail.field.directReason'), value: data.basic.directReason },
    { label: t('hqRequestResultLog.detail.field.wallet'), value: data.basic.wallet },
  ]

  /** 탭 — Figma상 '가맹점별'만 활성. 내용이 있는 탭이 하나뿐이라 표시 전용 */
  const tabs: string[] = [
    t('hqRequestResultLog.detail.tab.byMerchant'),
    t('hqRequestResultLog.detail.tab.transactions'),
    t('hqRequestResultLog.detail.tab.settlements'),
    t('hqRequestResultLog.detail.tab.adminMemo'),
  ]

  const merchantColumns: Column[] = [
    { key: 'no', label: t('hqRequestResultLog.detail.col.no'), width: '0.5fr' },
    { key: 'partnerCode', label: t('hqRequestResultLog.detail.col.partnerCode'), width: '1fr' },
    { key: 'merchantCode', label: t('hqRequestResultLog.detail.col.merchantCode'), width: '1fr' },
    { key: 'city', label: t('hqRequestResultLog.detail.col.city'), width: '0.7fr' },
    { key: 'merchantName', label: t('hqRequestResultLog.detail.col.merchantName'), width: '0.9fr' },
    { key: 'category', label: t('hqRequestResultLog.detail.col.category'), width: '0.9fr' },
    { key: 'monthSales', label: t('hqRequestResultLog.detail.col.monthSales'), width: '0.9fr' },
    { key: 'monthTxCount', label: t('hqRequestResultLog.detail.col.monthTxCount'), width: '0.9fr' },
    { key: 'fee', label: t('hqRequestResultLog.detail.col.fee'), width: '0.9fr' },
    { key: 'lastPaidAt', label: t('hqRequestResultLog.detail.col.lastPaidAt'), width: '0.9fr' },
    { key: 'usage', label: t('hqRequestResultLog.detail.col.usage'), width: '1.2fr' },
    { key: 'action', label: t('hqRequestResultLog.detail.col.action'), width: '0.7fr' },
  ]

  return {
    leaderCode: data.leaderCode,
    countryName: data.countryName,
    partnerCode: data.partnerCode,
    kpiTop: mapKpi(data.kpiTop as KpiRaw[]),
    kpiBottom: mapKpi(data.kpiBottom as KpiRaw[]),
    accountFields,
    basicFields,
    basicWideFields,
    tabs,
    periodChip: data.periodChip,
    merchantColumns,
    merchantRows: data.merchants as DetailMerchantRow[],
  }
}
