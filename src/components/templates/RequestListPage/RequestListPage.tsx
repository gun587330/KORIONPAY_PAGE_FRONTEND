import PageHeader from '../../organisms/PageHeader'
import Card from '../../atoms/Card'
import StatCard, { type StatCardData } from '../../molecules/StatCard'
import DataTable, { type Column, type TableRow } from '../../organisms/DataTable'
import styles from './RequestListPage.module.css'

interface RequestListPageProps {
  /** 페이지 헤더 제목 (예: "요청 관리") */
  title: string
  /** 섹션 박스 제목 (예: "파트너 가입 요청") */
  sectionTitle: string
  /** 섹션 설명 문구 */
  sectionDesc: string
  /** 상단 지표 카드 목록 */
  stats: StatCardData[]
  /** 테이블 컬럼 정의 */
  columns: Column[]
  /** 테이블 행 (액션 셀 포함, 호출 측에서 구성) */
  rows: TableRow[]
  /** 테이블 툴바 버튼 라벨 */
  toolbar?: string[]
}

/*
 * RequestListPage (template)
 * ------------------------------------------------------------------
 * "요청 관리" 계열 목록 화면(파트너/가맹점 가입 요청 등)의 공통 레이아웃.
 * 구조가 동일하고 데이터만 다르므로, 각 화면은 데이터를 props로 넘기기만 한다.
 *   [공통 헤더] + [섹션 박스: 제목/설명 + 지표 카드] + [데이터 테이블]
 */
export default function RequestListPage({
  title,
  sectionTitle,
  sectionDesc,
  stats,
  columns,
  rows,
  toolbar,
}: RequestListPageProps) {
  return (
    <div className={styles.page}>
      <PageHeader title={title} />

      {/* 섹션 박스 — 제목 + 설명 + 지표 카드 */}
      <Card className={styles.section}>
        <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
        <p className={styles.sectionDesc}>{sectionDesc}</p>

        <div className={styles.statGrid}>
          {stats.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>
      </Card>

      {/* 데이터 테이블 */}
      <DataTable columns={columns} rows={rows} toolbar={toolbar} />
    </div>
  )
}
