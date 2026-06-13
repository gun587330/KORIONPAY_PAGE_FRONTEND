import PageHeader from '../../organisms/PageHeader'
import StatSection from '../../organisms/StatSection'
import DataTable, { type Column, type TableRow } from '../../organisms/DataTable'
import type { StatCardData } from '../../molecules/StatCard'
import styles from './RequestListPage.module.css'

interface RequestListPageProps {
  /** 페이지 헤더 제목 (예: "요청 관리") */
  title: string
  /** 섹션 박스 제목 (예: "파트너 가입 요청") */
  sectionTitle: string
  /** 섹션 설명 문구 (없는 화면도 있어 선택값) */
  sectionDesc?: string
  /** 상단 지표 카드 목록 */
  stats: StatCardData[]
  /** 테이블 컬럼 정의 */
  columns: Column[]
  /** 테이블 행 (액션 셀 포함, 호출 측에서 구성) */
  rows: TableRow[]
  /** 테이블 제목 (있는 화면만 — 예: "가맹점별 거래") */
  tableTitle?: string
  /** 테이블 툴바 버튼 라벨 */
  toolbar?: string[]
}

/*
 * RequestListPage (template)
 * ------------------------------------------------------------------
 * 목록 화면(가입 요청, 파트너 전체 목록 등)의 공통 레이아웃.
 *   [공통 헤더] + [지표 섹션 박스(StatSection)] + [데이터 테이블 1개]
 * 구조가 같고 데이터만 다르므로 각 화면은 데이터를 props로 넘기기만 한다.
 */
export default function RequestListPage({
  title,
  sectionTitle,
  sectionDesc,
  stats,
  columns,
  rows,
  tableTitle,
  toolbar,
}: RequestListPageProps) {
  return (
    <div className={styles.page}>
      <PageHeader title={title} />
      <StatSection title={sectionTitle} desc={sectionDesc} stats={stats} />
      <DataTable title={tableTitle} columns={columns} rows={rows} toolbar={toolbar} fill />
    </div>
  )
}
