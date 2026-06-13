import { useState } from 'react'
import styles from './DateRangeSelect.module.css'

/** 기간 옵션 (Figma 표기 그대로). 기본 선택은 1D. */
const RANGE_OPTIONS = ['1D', '7D', '14D', '30D', '90D', '180D', '365D'] as const

/*
 * DateRangeSelect (molecule)
 * ------------------------------------------------------------------
 * 우측 정렬 기간 선택 드롭다운. 기본값 1D.
 * 선택 값은 로컬 state로만 관리한다 — 데이터가 Figma 샘플 하드코딩이라
 * 기간을 바꿔도 수치는 변하지 않는다. (실제 기간별 조회는 작업 범위 밖)
 */
export default function DateRangeSelect() {
  const [range, setRange] = useState<string>('1D')

  return (
    <div className={styles.wrap}>
      <select
        className={styles.select}
        value={range}
        onChange={(e) => setRange(e.target.value)}
        aria-label="기간 선택"
      >
        {RANGE_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}
