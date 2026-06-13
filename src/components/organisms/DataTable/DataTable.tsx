import type { CSSProperties, ReactNode } from 'react'
import styles from './DataTable.module.css'

/** 테이블 컬럼 정의 */
export interface Column {
  /** 행 데이터 객체에서 이 컬럼 값을 찾을 키 */
  key: string
  /** 헤더에 표시할 라벨 */
  label: string
  /** CSS grid 트랙 폭 (예: '0.5fr', '120px'). 기본 '1fr' */
  width?: string
  /** 셀 정렬 */
  align?: 'left' | 'right' | 'center'
}

/** 테이블 한 행 — id(리스트 key) + 컬럼별 셀 내용(문자열 또는 React 노드) */
export interface TableRow {
  id: string
  cells: Record<string, ReactNode>
}

interface DataTableProps {
  columns: Column[]
  rows: TableRow[]
  /** 상단 툴바 버튼 라벨들 (예: ['검색','필터','Excel']). 동작 없는 UI. 없으면 툴바 미표시 */
  toolbar?: string[]
}

/*
 * DataTable (organism)
 * ------------------------------------------------------------------
 * 목록 화면들이 공유하는 데이터 테이블. 컬럼 정의와 행 데이터를 주입받아 그린다.
 * - 헤더/행이 같은 grid 컬럼(--cols)을 공유해 정렬이 항상 맞는다.
 * - 액션 버튼·상태 배지 등은 행 데이터의 셀에 React 노드로 직접 넣어 유연하게 표현.
 * - 정렬/검색/필터 등 동작은 작업 범위 밖(정적 표시).
 */
export default function DataTable({ columns, rows, toolbar }: DataTableProps) {
  // 컬럼 폭을 모아 grid-template-columns 값을 만든다
  const cols = columns.map((c) => c.width ?? '1fr').join(' ')
  const gridStyle = { '--cols': cols } as CSSProperties

  return (
    <div className={styles.wrap}>
      {toolbar && (
        <div className={styles.toolbar}>
          {toolbar.map((label) => (
            <button key={label} type="button" className={styles.toolbarButton}>
              {label}
            </button>
          ))}
        </div>
      )}

      {/* 헤더 행 */}
      <div className={styles.headerRow} style={gridStyle}>
        {columns.map((c) => (
          <div key={c.key} className={styles.headerCell} style={{ textAlign: c.align }}>
            {c.label}
          </div>
        ))}
      </div>

      {/* 데이터 행들 */}
      {rows.map((row) => (
        <div key={row.id} className={styles.row} style={gridStyle}>
          {columns.map((c) => (
            <div key={c.key} className={styles.cell} style={{ textAlign: c.align }}>
              {row.cells[c.key]}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
