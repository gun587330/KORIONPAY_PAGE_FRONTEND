import type { NavGroup } from '../types'

/*
 * 가맹점(매장) 어드민 사이드바 메뉴 구조 (IA)
 * ------------------------------------------------------------------
 * 출처: Figma 가맹점 어드민 사이드바(54:2886 하위).
 * 가맹점은 본인 매장의 정보·거래·정산 기록만 조회하는 최소 역할이다.
 *   - 요청/관리 권한 없음, 거래 로그·정산 내역 조회 중심
 *   - "파트너 소식지"(전체 공지) 수신
 * 경로(path)는 basePath('/merchant') 기준 상대 경로. 공통 화면은 리더/파트너와
 * 같은 상대 경로를 써서 컴포넌트를 재사용한다.
 */
export const MERCHANT_NAV: NavGroup[] = [
  {
    titleKey: 'nav.group.dashboard',
    items: [{ labelKey: 'nav.item.dashboard', path: 'dashboard' }],
  },
  {
    titleKey: 'nav.group.transactions',
    items: [
      { labelKey: 'nav.item.merchantTxAll', path: 'transactions' },
      { labelKey: 'nav.item.merchantTxRefund', path: 'transactions/refund' },
    ],
  },
  {
    titleKey: 'nav.group.settlement',
    items: [{ labelKey: 'nav.item.settlementHistory', path: 'settlement/history' }],
  },
  {
    titleKey: 'nav.group.partnerNotices',
    items: [{ labelKey: 'nav.item.hqNoticesAll', path: 'hq-notices' }],
  },
  {
    titleKey: 'nav.group.settings',
    items: [
      { labelKey: 'nav.item.profile', path: 'settings/profile' },
      { labelKey: 'nav.item.activityLog', path: 'settings/activity-log' },
    ],
  },
]
