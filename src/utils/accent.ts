import type { AccentKey } from '../types'

/*
 * AccentKey → tokens.css의 CSS 변수 매핑
 * ------------------------------------------------------------------
 * 컴포넌트는 이 값을 인라인 스타일의 `--accent` 변수로 주입해 사용한다.
 *   예) style={{ '--accent': ACCENT_VAR['cyan'] }}
 * 이렇게 하면 색 값 자체를 컴포넌트에 하드코딩하지 않고 토큰을 거치게 된다.
 */
export const ACCENT_VAR: Record<AccentKey, string> = {
  cyan: 'var(--color-accent-cyan)',
  blue: 'var(--color-accent-blue)',
  purple: 'var(--color-accent-purple)',
  green: 'var(--color-accent-green)',
  orange: 'var(--color-accent-orange)',
  red: 'var(--color-accent-red)',
  amber: 'var(--color-accent-amber)',
}
