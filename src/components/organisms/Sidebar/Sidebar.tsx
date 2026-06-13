import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from '../../../i18n'
import { LEADER_NAV } from './navConfig'
import styles from './Sidebar.module.css'

/*
 * Sidebar (organism)
 * ------------------------------------------------------------------
 * 리더 어드민 전 화면이 공유하는 좌측 고정 내비게이션.
 * - 메뉴 구조는 navConfig.ts에서 분리 관리 (UI와 데이터 분리).
 * - 활성 표시는 두 단계로 동작한다 (Figma 디자인 기준):
 *   1) 현재 화면이 속한 "그룹 카드" 전체가 보라색으로 강조된다.
 *   2) 그 안에서 현재 화면에 해당하는 "하위 항목" 텍스트가 시안색으로 강조된다.
 *
 * 표시되는 리더 정보(국가/코드)는 Figma 샘플 값을 그대로 하드코딩.
 * (실제 로그인 사용자 데이터 연동은 작업 범위 밖)
 */
export default function Sidebar() {
  // 현재 경로 — 어떤 그룹이 활성인지 판단하는 데 사용
  const { pathname } = useLocation()
  const { t } = useTranslation()

  /*
   * 활성 항목 판정 — "가장 긴 접두 경로" 한 개만 활성으로 선택한다.
   * - 정확히 일치하거나(`/settlement/history`), 하위 경로일 때(`/settlement/history/detail`)
   *   모두 부모 메뉴(`/settlement/history`)가 활성으로 유지된다.
   * - 동시에 `/partners`와 `/partners/sales`처럼 한쪽이 다른 쪽의 접두인 경우엔
   *   더 긴(=더 구체적인) 경로만 선택되어 중복 강조가 생기지 않는다.
   */
  const allPaths = LEADER_NAV.flatMap((g) => g.items.map((i) => i.path))
  const activePath = allPaths
    .filter((p) => pathname === p || pathname.startsWith(p + '/'))
    .sort((a, b) => b.length - a.length)[0]

  return (
    <aside className={styles.sidebar}>
      {/* 상단 브랜드 + 리더 프로필 카드
          (Figma상 브랜드/역할/프로필/전체목록/메뉴가 모두 동일 간격 8의 형제 요소라
           래퍼로 묶지 않고 사이드바의 flex gap이 직접 적용되게 둔다) */}
      <div className={styles.brand}>{t('common.brand')}</div>
      <div className={styles.role}>{t('common.role')}</div>

      <div className={styles.profileCard}>
        <div className={styles.profileCountry}>Race / Nigeria</div>
        <div className={styles.profileCode}>코드: NG-LEAD-001</div>
      </div>

      {/* "전체 목록" — 동작 미확정이라 우선 비클릭 라벨 (Sidebar.module.css 주석 참고) */}
      <div className={styles.allLabel}>{t('common.allList')}</div>

      {/* 메뉴 그룹 목록 */}
      <nav className={styles.nav}>
        {LEADER_NAV.map((group) => {
          // 그룹에 속한 항목 중 하나라도 활성 경로면 그룹 전체를 활성 처리
          const isGroupActive = group.items.some((item) => item.path === activePath)

          return (
            <div
              key={group.titleKey}
              className={isGroupActive ? `${styles.group} ${styles.groupActive}` : styles.group}
            >
              <div
                className={
                  isGroupActive ? `${styles.groupTitle} ${styles.groupTitleActive}` : styles.groupTitle
                }
              >
                {t(group.titleKey)}
              </div>

              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  // 활성 판정은 NavLink 내장 isActive 대신 위에서 계산한 activePath로 한다.
                  // (상세 등 하위 경로에서도 부모 메뉴를 활성 유지 + 접두 중복 강조 방지)
                  className={
                    item.path === activePath ? `${styles.item} ${styles.itemActive}` : styles.item
                  }
                >
                  {t(item.labelKey)}
                </NavLink>
              ))}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
