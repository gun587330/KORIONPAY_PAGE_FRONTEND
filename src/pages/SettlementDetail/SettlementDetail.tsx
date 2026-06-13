import PageHeader from '../../components/organisms/PageHeader'
import Card from '../../components/atoms/Card'
import Button from '../../components/atoms/Button'
import InfoGrid from '../../components/molecules/InfoGrid'
import ActionBadges from '../../components/molecules/ActionBadges'
import DataTable, { type TableRow } from '../../components/organisms/DataTable'
import { useTranslation } from '../../i18n'
import { useSettlementDetail } from './useSettlementDetail'
import styles from './SettlementDetail.module.css'

/*
 * SettlementDetail (page) — 수수료/정산 · 정산 상세
 * ------------------------------------------------------------------
 * 정산 내역의 "상세"에서 진입. 하나의 패널 안에 A~E 섹션.
 *   A 기본정보 / B 금액요약 (InfoGrid) · C 파트너 자동정산 / D 직계약 가맹점 / E 보류·제외 (서브 테이블)
 * 공통 컴포넌트(Card, InfoGrid, DataTable bare, Badge, Button) 재사용.
 */
export default function SettlementDetail() {
  const { t } = useTranslation()
  const {
    no,
    status,
    basicInfo,
    amountSummary,
    partnerColumns,
    partnerRows,
    merchantColumns,
    merchantRows,
    heldColumns,
    heldRows,
  } = useSettlementDetail()

  // C/D: "보기" 액션 포함, E: 액션 없음
  const partnerTableRows: TableRow[] = partnerRows.map((r) => ({
    id: r.code,
    cells: { ...r, detail: <ActionBadges labels={['보기']} /> },
  }))
  const merchantTableRows: TableRow[] = merchantRows.map((r) => ({
    id: r.code,
    cells: { ...r, detail: <ActionBadges labels={['보기']} /> },
  }))
  const heldTableRows: TableRow[] = heldRows.map((r) => ({ id: r.txNo, cells: { ...r } }))

  return (
    <div className={styles.page}>
      <PageHeader title={t('settle.detail.title')} />

      <Card className={styles.panel}>
        {/* 패널 헤더: 정산번호(좌) + 상태 토글 배지(우 끝) */}
        <div className={styles.panelHead}>
          <h2 className={styles.panelTitle}>
            {no} {t('settle.detail.detailWord')}
          </h2>
          <span className={styles.reviewBadge}>{status}</span>
        </div>

        {/* A. 정산 기본 정보 (독립 박스) */}
        <section className={`${styles.section} ${styles.sectionBox}`}>
          <h3 className={styles.sectionTitle}>{t('settle.detail.a.title')}</h3>
          <InfoGrid items={basicInfo} />
        </section>

        {/* B. 정산 금액 요약 (독립 박스) */}
        <section className={`${styles.section} ${styles.sectionBox}`}>
          <h3 className={styles.sectionTitle}>{t('settle.detail.b.title')}</h3>
          <InfoGrid items={amountSummary} />
        </section>

        {/* C. 파트너별 자동 정산 내역 (테이블 박스) */}
        <section className={`${styles.section} ${styles.sectionBoxTable}`}>
          <h3 className={styles.sectionTitleLg}>{t('settle.detail.c.title')}</h3>
          <p className={styles.sectionDesc}>{t('settle.detail.c.desc')}</p>
          <DataTable columns={partnerColumns} rows={partnerTableRows} bare />
        </section>

        {/* D. 직계약 가맹점 정산 내역 (테이블 박스) */}
        <section className={`${styles.section} ${styles.sectionBoxTable}`}>
          <h3 className={styles.sectionTitleLg}>{t('settle.detail.d.title')}</h3>
          <p className={styles.sectionDesc}>{t('settle.detail.d.desc')}</p>
          <DataTable columns={merchantColumns} rows={merchantTableRows} bare />
        </section>

        {/* E. 보류 / 제외 거래 (테이블 박스) */}
        <section className={`${styles.section} ${styles.sectionBoxTable}`}>
          <h3 className={styles.sectionTitleLg}>{t('settle.detail.e.title')}</h3>
          <p className={styles.sectionDesc}>{t('settle.detail.e.desc')}</p>
          <DataTable columns={heldColumns} rows={heldTableRows} bare />
        </section>

        {/* 본사 정산 요청 버튼 */}
        <div className={styles.confirmRow}>
          <Button variant="primary">{t('settle.detail.confirm')}</Button>
        </div>
      </Card>
    </div>
  )
}
