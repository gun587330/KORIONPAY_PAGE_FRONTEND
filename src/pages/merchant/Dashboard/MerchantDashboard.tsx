import PageHeader from '../../../components/organisms/PageHeader'
import DateRangeSelect from '../../../components/molecules/DateRangeSelect'
import KpiGrid from '../../../components/organisms/KpiGrid'
import Panel from '../../../components/molecules/Panel'
import { useTranslation } from '../../../i18n'
import { useMerchantDashboard } from './useMerchantDashboard'
import styles from './MerchantDashboard.module.css'

/*
 * MerchantDashboard (page) — 가맹점 관리자 · 매장 운영 대시보드
 * ------------------------------------------------------------------
 * 리더/파트너 대시보드와 동일 골격(KPI + 하단 패널)을 공통 컴포넌트로 재사용.
 * 하단 패널은 Figma상 제목/설명만 있고 내용이 비어 "들어갈 자리" 주석만 남긴다.
 */
export default function MerchantDashboard() {
  const { t } = useTranslation()
  const { kpis } = useMerchantDashboard()

  return (
    <div className={styles.page}>
      <PageHeader title={t('mdash.title')}>
        <div className={styles.subRow}>
          <p className={styles.desc}>{t('mdash.desc')}</p>
          <DateRangeSelect />
        </div>
      </PageHeader>

      {/* KPI 카드 6개 */}
      <KpiGrid items={kpis} />

      {/* 하단 요약 패널 3개 (매출 표 / 최근 활동 / 공지) */}
      <div className={styles.panelGrid}>
        <Panel title={t('mdash.panel.salesTable')}>
          {/* 들어갈 자리: 매출 표/차트 */}
        </Panel>
        <Panel title={t('mdash.panel.recentActivity')} subtitle={t('mdash.panel.activityDesc')}>
          {/* 들어갈 자리: 활동 피드 */}
        </Panel>
        <Panel title={t('mdash.panel.notice')} subtitle={t('mdash.panel.activityDesc')}>
          {/* 들어갈 자리: 공지 요약 */}
        </Panel>
      </div>
    </div>
  )
}
