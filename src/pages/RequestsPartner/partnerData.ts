import type { StatCardData } from '../../components/molecules/StatCard'
import type { Column } from '../../components/organisms/DataTable'

/*
 * 파트너 가입 요청 화면 데이터
 * ------------------------------------------------------------------
 * Figma "파트너 가입 요청"(node 1:403)에서 추출한 값 그대로 하드코딩.
 * (UI/데이터 분리 — 실데이터 연동 시 이 파일만 교체)
 */

/** 상단 요약 지표 카드 4종 */
export const PARTNER_STATS: StatCardData[] = [
  { id: 'active', label: '활성화 된 파트너', value: '136' },
  { id: 'requesting', label: '승인 신청중 파트너', value: '36', tag: '본사', tagAccent: 'orange' },
  { id: 'waiting', label: '승인 대기 파트너', value: '36' },
  { id: 'black', label: '블랙 파트너', value: '3' },
]

/** 테이블 컬럼 정의 (폭은 Figma 비율 근사) */
export const PARTNER_COLUMNS: Column[] = [
  { key: 'no', label: '번호', width: '0.5fr', align: 'center' },
  { key: 'code', label: '파트너 코드', width: '1.1fr' },
  { key: 'name', label: '파트너명', width: '1.1fr' },
  { key: 'region', label: '담당 지역', width: '0.9fr' },
  { key: 'subCount', label: '하위 가맹점 수', width: '1fr' },
  { key: 'volume', label: '월 거래액', width: '1.2fr' },
  { key: 'txCount', label: '월 거래 건수', width: '1fr' },
  { key: 'hqStatus', label: '본사승인 상태', width: '1fr' },
  { key: 'opStatus', label: '운영 상태', width: '0.9fr' },
  { key: 'date', label: '신청일', width: '1.1fr' },
  { key: 'action', label: '액션', width: '1.8fr' },
]

/** 테이블 행 원본 데이터 (액션 컬럼은 화면에서 배지로 렌더링) */
export interface PartnerRow {
  no: string
  code: string
  name: string
  region: string
  subCount: string
  volume: string
  txCount: string
  hqStatus: string
  opStatus: string
  date: string
}

export const PARTNER_ROWS: PartnerRow[] = [
  { no: '5', code: 'NG-SP-0005', name: 'Lagos Mart5', region: 'Lagos', subCount: '128', volume: '128,000 KORI', txCount: '1,560', hqStatus: '승인', opStatus: '정지', date: '2026.06.03' },
  { no: '4', code: 'NG-SP-0004', name: 'Lagos Mart4', region: 'Lagos', subCount: '128', volume: '128,000 KORI', txCount: '1,560', hqStatus: '검토중', opStatus: '대기', date: '2026.06.03' },
  { no: '3', code: 'NG-SP-0003', name: 'Lagos Mart3', region: 'Lagos', subCount: '128', volume: '128,000 KORI', txCount: '1,560', hqStatus: '자료요청', opStatus: '대기', date: '2026.06.03' },
  { no: '2', code: 'NG-SP-0002', name: 'Lagos Mart2', region: 'Lagos', subCount: '128', volume: '128,000 KORI', txCount: '1,560', hqStatus: '보류', opStatus: '대기', date: '2026.06.03' },
  { no: '1', code: 'NG-SP-0001', name: 'Lagos Mart1', region: 'Lagos', subCount: '128', volume: '128,000 KORI', txCount: '1,560', hqStatus: '승인', opStatus: '활성', date: '2026.06.03' },
]

/** 모든 행 공통 액션 배지 라벨 (Figma 동일) */
export const PARTNER_ACTIONS = ['승인요청', '정지요청', '상세'] as const
