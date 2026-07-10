import { useTranslation } from '../../../i18n'
import type { StatCardData } from '../../../components/molecules/StatCard'
import type { Column } from '../../../components/organisms/DataTable'
import data from './leadersData.json'

interface StatRaw {
  id: string
  labelKey: string
  value: string
  deltaKey?: string
}

/** 리더 상태 — 승인/정지 중 하나만 활성(Figma 액션 토글 배지 기준) */
export type LeaderStatus = 'approved' | 'suspended'

/** 국가 리더 전체 목록 행 원본 데이터 형태 (Figma 샘플값 하드코딩) */
export interface LeaderListRow {
  no: string
  appliedAt: string
  leaderCode: string
  country: string
  partnerName: string
  subPartnerCount: string
  subMerchantCount: string
  monthVolume: string
  monthTxCount: string
  unsettledFee: string
  status: LeaderStatus
}

/*
 * useLeaders — 본사어드민 "국가 리더 전체 목록" 데이터 훅
 * ------------------------------------------------------------------
 * leadersData.json(더미)을 읽어 UI 라벨(지표/컬럼명)은 번역해 반환한다.
 * 리더 어드민의 usePartners와 컬럼이 달라(리더 코드/파트너명 등) 별도 화면으로 작성.
 * 추후 실 연동 시 이 훅 내부만 API 호출로 교체.
 */
export function useLeaders() {
  const { t } = useTranslation()

  const stats: StatCardData[] = (data.stats as StatRaw[]).map((s) => ({
    id: s.id,
    label: t(s.labelKey),
    value: s.value,
    delta: s.deltaKey ? t(s.deltaKey) : undefined,
  }))

  const columns: Column[] = [
    { key: 'no', label: t('hqLeaderList.col.no'), width: '1fr' },
    { key: 'appliedAt', label: t('hqLeaderList.col.appliedAt'), width: '1fr' },
    { key: 'leaderCode', label: t('hqLeaderList.col.leaderCode'), width: '1.1fr' },
    { key: 'country', label: t('hqLeaderList.col.country'), width: '0.9fr' },
    { key: 'partnerName', label: t('hqLeaderList.col.partnerName'), width: '0.9fr' },
    { key: 'subPartnerCount', label: t('hqLeaderList.col.subPartnerCount'), width: '0.9fr' },
    { key: 'subMerchantCount', label: t('hqLeaderList.col.subMerchantCount'), width: '0.9fr' },
    { key: 'monthVolume', label: t('hqLeaderList.col.monthVolume'), width: '1fr' },
    { key: 'monthTxCount', label: t('hqLeaderList.col.monthTxCount'), width: '0.9fr' },
    { key: 'unsettledFee', label: t('hqLeaderList.col.unsettledFee'), width: '1fr' },
    { key: 'action', label: t('hqLeaderList.col.action'), width: '1.3fr' },
  ]

  /*
   * 상태 키 → 표시 라벨 + 액션 배지 강조색 + solid 여부.
   * Figma 기준: 활성 "승인"은 녹색 65% 틴트(size sm, solid=false),
   * 활성 "정지"는 빨강 솔리드(solid=true). 비활성·상세 배지는 호출부에서 항상 solid 회색.
   * (상태/액션 라벨은 데이터 값이라 번역하지 않는다 — CLAUDE.md 규칙 11)
   */
  const statusMeta: Record<LeaderStatus, { label: string; accent: 'green' | 'red'; solid: boolean }> = {
    approved: { label: '승인', accent: 'green', solid: false },
    suspended: { label: '정지', accent: 'red', solid: true },
  }

  return { stats, columns, rows: data.rows as LeaderListRow[], statusMeta, detailLabel: '상세' }
}
