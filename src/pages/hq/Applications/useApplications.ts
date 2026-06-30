import { useTranslation } from '../../../i18n'
import type { StatCardData } from '../../../components/molecules/StatCard'
import type { Column } from '../../../components/organisms/DataTable'
import data from './applicationsData.json'

interface StatRaw {
  id: string
  labelKey: string
  value: string
  deltaKey?: string
  deltaTone?: 'cyan' | 'red'
}

/** 신청 상태 — 확인/검토중/위험 중 하나만 활성(Figma 액션 배지 기준) */
export type ApplicationStatus = 'confirmed' | 'review' | 'risk'

/** 제휴 / 투자 신청 목록 행 원본 데이터 형태 (Figma 샘플값 하드코딩) */
export interface ApplicationListRow {
  no: string
  appliedAt: string
  type: string
  country: string
  contact: string
  company: string
  email: string
  interest: string
  status: ApplicationStatus
}

/*
 * useApplications — 본사어드민 "신청서 관리 - 제휴 / 투자 신청서" 데이터 훅
 * ------------------------------------------------------------------
 * applicationsData.json(더미)을 읽어 UI 라벨(지표/컬럼명)은 번역해 반환한다.
 * 추후 실 연동 시 이 훅 내부만 API 호출로 교체.
 */
export function useApplications() {
  const { t } = useTranslation()

  const stats: StatCardData[] = (data.stats as StatRaw[]).map((s) => ({
    id: s.id,
    label: t(s.labelKey),
    value: s.value,
    delta: s.deltaKey ? t(s.deltaKey) : undefined,
    deltaTone: s.deltaTone,
  }))

  const columns: Column[] = [
    { key: 'no', label: t('hqApplications.col.no'), width: '0.8fr' },
    { key: 'appliedAt', label: t('hqApplications.col.appliedAt'), width: '0.8fr' },
    { key: 'type', label: t('hqApplications.col.type'), width: '1fr' },
    { key: 'country', label: t('hqApplications.col.country'), width: '0.9fr' },
    { key: 'contact', label: t('hqApplications.col.contact'), width: '0.9fr' },
    { key: 'company', label: t('hqApplications.col.company'), width: '1fr' },
    { key: 'email', label: t('hqApplications.col.email'), width: '1.1fr' },
    { key: 'interest', label: t('hqApplications.col.interest'), width: '0.9fr' },
    { key: 'action', label: t('hqApplications.col.action'), width: '1.4fr' },
  ]

  /** 상태 키 → 표시 라벨(번역) + 액션 배지 강조색 */
  const statusMeta: Record<ApplicationStatus, { label: string; accent: 'cyan' | 'red' }> = {
    confirmed: { label: t('hqApplications.status.confirmed'), accent: 'cyan' },
    review: { label: t('hqApplications.status.review'), accent: 'cyan' },
    risk: { label: t('hqApplications.status.risk'), accent: 'red' },
  }

  return {
    stats,
    columns,
    rows: data.rows as ApplicationListRow[],
    statusMeta,
    deleteLabel: t('hqApplications.action.delete'),
  }
}
