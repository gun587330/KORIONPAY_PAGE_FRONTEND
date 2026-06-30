import Card from '../../atoms/Card'
import StatCard, { type StatCardData } from '../../molecules/StatCard'
import styles from './StatSection.module.css'

interface StatSectionProps {
  /** 섹션 제목 (없으면 미표시) */
  title?: string
  /** 섹션 설명 문구 (없으면 미표시) */
  desc?: string
  /** 표시할 지표 카드 목록 */
  stats: StatCardData[]
  /** true면 Card 외형(배경/테두리/그림자) 없이 카드 그리드만 렌더(title/desc도 같이 생략) — Figma상 KPI 카드가 박스 없이 바로 떠있는 화면용 */
  bare?: boolean
}

/*
 * StatSection (organism)
 * ------------------------------------------------------------------
 * 박스(Card) 안에 (제목/설명 +) 지표 카드 그리드를 담는 공통 섹션.
 * 요청 화면(파트너/가맹점 가입 요청), 파트너 목록, 파트너별 매출 등에서 재사용한다.
 */
export default function StatSection({ title, desc, stats, bare }: StatSectionProps) {
  const grid = (
    <div className={bare ? `${styles.grid} ${styles.gridBare}` : styles.grid}>
      {stats.map((stat) => (
        <StatCard key={stat.id} {...stat} />
      ))}
    </div>
  )

  if (bare) return grid

  return (
    <Card className={styles.section}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {desc && <p className={styles.desc}>{desc}</p>}
      {grid}
    </Card>
  )
}
