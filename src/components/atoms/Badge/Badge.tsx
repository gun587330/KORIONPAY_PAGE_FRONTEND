import type { CSSProperties, ReactNode } from 'react'
import type { AccentKey } from '../../../types'
import { ACCENT_VAR } from '../../../utils/accent'
import styles from './Badge.module.css'

interface BadgeProps {
  children: ReactNode
  /** 강조색. 지정하지 않으면 중립(흐린) 색으로 표시된다. */
  accent?: AccentKey
  /** 'sm'이면 초소형(테이블 액션 배지 등 7px) */
  size?: 'sm'
}

/*
 * Badge (atom)
 * ------------------------------------------------------------------
 * 증감 수치(+10), 구분 태그(관리/본사/정산가능/주의) 등에 쓰이는 최소 단위 알약.
 * 색은 accent prop으로만 결정되며, 실제 색 값은 토큰을 거친다(하드코딩 금지 규칙).
 */
export default function Badge({ children, accent, size }: BadgeProps) {
  // accent가 있으면 CSS 변수 --accent로 주입 → 모듈 CSS가 글자색/배경에 사용
  const style = accent ? ({ '--accent': ACCENT_VAR[accent] } as CSSProperties) : undefined
  const className = size === 'sm' ? `${styles.badge} ${styles.small}` : styles.badge

  return (
    <span className={className} style={style}>
      {children}
    </span>
  )
}
