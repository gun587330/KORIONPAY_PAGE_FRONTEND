import type { AccentKey } from '../../../types'
import Badge from '../../atoms/Badge'
import styles from './StatCard.module.css'

/** StatCard 한 장의 데이터 모델 */
export interface StatCardData {
  /** React 리스트 key */
  id: string
  /** 지표 이름 (예: "활성화 된 파트너") */
  label: string
  /** 표시 값 (예: "136") — Figma 표기 그대로 */
  value: string
  /** 값 옆 태그 (예: "본사"). 없으면 미표시 */
  tag?: string
  /** 태그 강조색 */
  tagAccent?: AccentKey
}

/*
 * StatCard (molecule)
 * ------------------------------------------------------------------
 * 목록 화면 상단의 요약 지표 카드. 라벨 + 값 + (선택) 태그로 구성.
 * 데이터는 props로만 주입받는다(로직 없음).
 */
export default function StatCard({ label, value, tag, tagAccent }: StatCardData) {
  return (
    <article className={styles.card}>
      <span className={styles.label}>{label}</span>
      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        {tag && <Badge accent={tagAccent}>{tag}</Badge>}
      </div>
    </article>
  )
}
