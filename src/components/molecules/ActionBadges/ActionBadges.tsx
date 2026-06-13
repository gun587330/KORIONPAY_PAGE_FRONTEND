import Badge from '../../atoms/Badge'
import styles from './ActionBadges.module.css'

interface ActionBadgesProps {
  /** 표시할 액션 라벨들 (예: ['승인', '거절', '보류', '자료요청', '상세']) */
  labels: readonly string[]
}

/*
 * ActionBadges (molecule)
 * ------------------------------------------------------------------
 * 테이블 액션 컬럼에 들어가는 작은 시안 배지 묶음. 동작 없는 UI(표시 전용).
 */
export default function ActionBadges({ labels }: ActionBadgesProps) {
  return (
    <div className={styles.actions}>
      {labels.map((label) => (
        <Badge key={label} accent="cyan" size="sm">
          {label}
        </Badge>
      ))}
    </div>
  )
}
