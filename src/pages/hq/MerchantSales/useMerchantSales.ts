import { useTranslation } from '../../../i18n'
import type { StatCardData } from '../../../components/molecules/StatCard'
import type { Column } from '../../../components/organisms/DataTable'
import type { InfoItem } from '../../../components/molecules/InfoGrid'
import data from './merchantSalesData.json'

interface KpiRaw {
  id: string
  labelKey: string
  value: string
}

/** 거래 로그 행 원본 데이터 형태 (Figma 샘플값 하드코딩) */
export interface MerchantSalesLogRow {
  txNo: string
  partnerCode: string
  txAt: string
  merchantCode: string
  merchantName: string
  amount: string
  method: string
  fee: string
  net: string
  status: string
  syncStatus: string
  actions: string[]
}

/*
 * useMerchantSales (hq) — 본사어드민 "가맹점 거래내역" 데이터 훅
 * ------------------------------------------------------------------
 * LeaderSales와 동일한 상세 뷰 구조(Figma 156:312 추적 확정):
 *   가맹점 정보(제목) → 코드 미리보기 → KPI 4개 → A.계정정보 → B.기본/소속정보
 *   → C.매장 기본정보 → 탭 4개(기본 선택: 거래내역) → [거래내역 탭 전용] KPI 4개 +
 *   전체 거래 로그 표 → 하단 확인 버튼.
 * B섹션 "파트너명" 라벨은 Figma 표기 그대로 둔다(가맹점 소속 파트너 정보라 의미상 유지).
 */
export function useMerchantSales() {
  const { t } = useTranslation()

  const toStats = (items: KpiRaw[]): StatCardData[] =>
    items.map((s) => ({ id: s.id, label: t(s.labelKey), value: s.value }))

  const kpiTop = toStats(data.kpiTop as KpiRaw[])
  const kpiBottom = toStats(data.kpiBottom as KpiRaw[])

  const accountInfo: InfoItem[] = [
    { label: t('hqMerchantSales.account.loginId'), value: data.account.loginId },
    { label: t('hqMerchantSales.account.password'), value: data.account.password, actionLabel: t('common.reset') },
    { label: t('hqMerchantSales.account.email'), value: data.account.email, actionLabel: t('common.change') },
    { label: t('hqMerchantSales.account.telegram'), value: data.account.telegram },
    { label: t('hqMerchantSales.account.phone'), value: data.account.phone },
    { label: t('hqMerchantSales.account.twitter'), value: data.account.twitter },
    { label: t('hqMerchantSales.account.appliedAt'), value: data.account.appliedAt, valueColor: 'var(--color-accent-green)' },
    { label: t('hqMerchantSales.account.approvedAt'), value: data.account.approvedAt, valueColor: 'var(--color-accent-green)' },
  ]

  // 2번째 줄은 본사 직접 계약 사유(1열) 다음 칸을 비우고 KORION WALLET 주소가 3열에 옴(Figma 실측 — 4열 그리드 중 2열은 빈칸)
  const basicInfo: InfoItem[] = [
    { label: t('hqMerchantSales.basic.name'), value: data.basic.name },
    { label: t('hqMerchantSales.basic.country'), value: data.basic.country },
    { label: t('hqMerchantSales.basic.region'), value: data.basic.region },
    { label: t('hqMerchantSales.basic.language'), value: data.basic.language },
    { label: t('hqMerchantSales.basic.directContractReason'), value: data.basic.directContractReason },
    { label: '', value: '' },
    { label: t('hqMerchantSales.basic.walletAddress'), value: data.basic.walletAddress },
  ]

  const storeInfo: InfoItem[] = [
    { label: t('hqMerchantSales.store.name'), value: data.store.name },
    { label: t('hqMerchantSales.store.owner'), value: data.store.owner },
    { label: t('hqMerchantSales.store.businessType'), value: data.store.businessType },
    { label: t('hqMerchantSales.store.address'), value: data.store.address },
  ]

  const logColumns: Column[] = [
    { key: 'txNo', label: t('hqMerchantSales.col.txNo'), width: '0.6fr' },
    { key: 'partnerCode', label: t('hqMerchantSales.col.partnerCode'), width: '1.1fr' },
    { key: 'txAt', label: t('hqMerchantSales.col.txAt'), width: '1.2fr' },
    { key: 'merchantCode', label: t('hqMerchantSales.col.merchantCode'), width: '1.1fr' },
    { key: 'merchantName', label: t('hqMerchantSales.col.merchantName'), width: '0.9fr' },
    { key: 'amount', label: t('hqMerchantSales.col.amount'), width: '0.9fr' },
    { key: 'method', label: t('hqMerchantSales.col.method'), width: '0.8fr' },
    { key: 'fee', label: t('hqMerchantSales.col.fee'), width: '0.9fr' },
    { key: 'net', label: t('hqMerchantSales.col.net'), width: '0.9fr' },
    { key: 'status', label: t('hqMerchantSales.col.status'), width: '0.8fr' },
    { key: 'syncStatus', label: t('hqMerchantSales.col.syncStatus'), width: '0.9fr' },
    // 액션 컬럼: 배지 3개(상세/환불요청/지급보류)가 항상 한 줄로 들어갈 최소폭(150px)을 보장
    { key: 'action', label: t('hqMerchantSales.col.action'), width: 'minmax(150px, 1.6fr)' },
  ]

  return {
    profile: data.profile,
    kpiTop,
    accountInfo,
    basicInfo,
    storeInfo,
    kpiBottom,
    logColumns,
    logRows: data.logRows as MerchantSalesLogRow[],
  }
}
