import type { StatCardData } from '../../components/molecules/StatCard'
import type { Column } from '../../components/organisms/DataTable'

/*
 * 가맹점 가입 요청 화면 데이터
 * ------------------------------------------------------------------
 * Figma "가맹점 가입 요청"(node 1:599)에서 추출한 값 그대로 하드코딩.
 */

/** 상단 요약 지표 카드 4종 (태그 없음) */
export const MERCHANT_STATS: StatCardData[] = [
  { id: 'active', label: '활성화 된 가맹점', value: '136' },
  { id: 'recommended', label: '파트너 추천 가맹점', value: '36' },
  { id: 'direct', label: '다이렉트 신청 가맹점', value: '3' },
  { id: 'black', label: '블랙 가맹점', value: '3' },
]

/** 테이블 컬럼 정의 (파트너와 컬럼 구성이 다름) */
export const MERCHANT_COLUMNS: Column[] = [
  { key: 'no', label: '번호', width: '0.5fr', align: 'center' },
  { key: 'code', label: '코드', width: '1.1fr' },
  { key: 'name', label: '가맹점 명', width: '1.2fr' },
  { key: 'telegram', label: 'Telegram ID', width: '1.1fr' },
  { key: 'region', label: '담당 지역', width: '0.9fr' },
  { key: 'industry', label: '업종', width: '0.9fr' },
  { key: 'opStatus', label: '운영상태', width: '0.9fr' },
  { key: 'date', label: '신청일', width: '1.1fr' },
  { key: 'action', label: '액션', width: '1.8fr' },
]

/** 테이블 행 원본 데이터 */
export interface MerchantRow {
  no: string
  code: string
  name: string
  telegram: string
  region: string
  industry: string
  opStatus: string
  date: string
}

export const MERCHANT_ROWS: MerchantRow[] = [
  { no: '5', code: 'NG-SP-0005', name: 'Lagos Mart5', telegram: '@samuel5', region: 'Lagos', industry: '카페', opStatus: '대기', date: '2026.06.03' },
  { no: '4', code: 'NG-SP-0004', name: 'Lagos Mart4', telegram: '@samuel4', region: 'Lagos', industry: '노래방', opStatus: '대기', date: '2026.06.03' },
  { no: '3', code: 'NG-MER-0001', name: 'Lagos Mart3', telegram: '@samuel3', region: 'Lagos', industry: 'PC방', opStatus: '대기', date: '2026.06.03' },
  { no: '2', code: 'NG-MER-0002', name: 'Lagos Mart2', telegram: '@samuel2', region: 'Lagos', industry: '중국집', opStatus: '대기', date: '2026.06.03' },
  { no: '1', code: 'NG-SP-0001', name: 'Lagos Mart1', telegram: '@samuel1', region: 'Lagos', industry: '편의점', opStatus: '대기', date: '2026.06.03' },
]

/** 모든 행 공통 액션 배지 라벨 (Figma 동일) */
export const MERCHANT_ACTIONS = ['승인', '거절', '보류', '자료요청', '상세'] as const
