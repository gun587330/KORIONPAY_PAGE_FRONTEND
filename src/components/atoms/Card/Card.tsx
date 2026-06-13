import type { HTMLAttributes, ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

/*
 * Card (atom)
 * ------------------------------------------------------------------
 * 공통 박스 외형(배경/보라 테두리/그림자)만 제공한다.
 * 패딩·정렬 등 내부 레이아웃은 className으로 덧붙여 쓴다.
 *   예) <Card className={styles.section}>...</Card>
 */
export default function Card({ className, children, ...rest }: CardProps) {
  return (
    <div className={className ? `${styles.card} ${className}` : styles.card} {...rest}>
      {children}
    </div>
  )
}
