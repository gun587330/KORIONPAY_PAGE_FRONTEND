import { useState } from 'react'
import PageHeader from '../../../components/organisms/PageHeader'
import DataTable, { type TableRow } from '../../../components/organisms/DataTable'
import Card from '../../../components/atoms/Card'
import StatCard from '../../../components/molecules/StatCard'
import InfoGrid from '../../../components/molecules/InfoGrid'
import FilterTabs from '../../../components/molecules/FilterTabs'
import ActionBadges from '../../../components/molecules/ActionBadges'
import { useTranslation } from '../../../i18n'
import { useLeaderSales } from './useLeaderSales'
import styles from './LeaderSales.module.css'

/* 탭 인덱스 — "거래내역"이 Figma 기본 선택 탭(인덱스 2), "정산내역"은 3 */
const HISTORY_TAB_INDEX = 2
const SETTLEMENT_TAB_INDEX = 3

/*
 * LeaderSales (page) — 본사어드민 · 국가 리더 관리 · 국가 리더별 거래내역
 * ------------------------------------------------------------------
 * Figma 좌표를 끝까지 따라가 보니 전체가 하나의 패널(Card) 안에 다음 순서로
 * 들어있었다: 큰 제목 "리더 정보" → 코드 미리보기 → KPI 4개 → A.계정정보 →
 * B.기본/소속정보 → 탭 5개(기본 선택: 거래내역) → [거래내역 탭 전용] KPI 5개 +
 * 전체 거래 로그 표 → 하단 액션 버튼. 탭별 콘텐츠를 다 확인하지 못해 "거래내역"
 * 외 4개 탭은 전환 UI만 두고 내용은 "구현 예정"으로 둔다(사용자 확인됨).
 */
export default function LeaderSales() {
  const { t } = useTranslation()
  const { profile, kpiTop, accountInfo, basicInfo, kpiBottom, logColumns, logRows, settlement, settlementColumns } = useLeaderSales()
  const [tab, setTab] = useState(HISTORY_TAB_INDEX)

  const rows: TableRow[] = logRows.map((r) => ({
    id: r.txNo,
    cells: {
      txNo: r.txNo,
      partnerCode: r.partnerCode,
      txAt: r.txAt,
      merchantCode: r.merchantCode,
      merchantName: r.merchantName,
      amount: r.amount,
      method: r.method,
      fee: r.fee,
      net: r.net,
      status: r.status,
      syncStatus: r.syncStatus,
      action: <ActionBadges labels={r.actions} size="xs" />,
    },
  }))

  const settlementRows: TableRow[] = settlement.rows.map((r, i) => ({
    id: `${r.period}-${i}`,
    cells: {
      no: r.no,
      appliedDate: r.appliedDate,
      period: r.period,
      totalAmount: r.totalAmount,
      leaderAmount: r.leaderAmount,
      partnerAmount: r.partnerAmount,
      held: r.held,
      status: r.status,
      paidDate: r.paidDate,
      action: <ActionBadges labels={[t('common.detail')]} size="sm" />,
    },
  }))

  const tabLabels = [
    t('hqLeaderSales.tab.partners'),
    t('hqLeaderSales.tab.merchants'),
    t('hqLeaderSales.tab.history'),
    t('hqLeaderSales.tab.settlement'),
    t('hqLeaderSales.tab.memo'),
  ]

  return (
    <div className={styles.page}>
      <PageHeader title={t('hqLeaderSales.title')} />

      <Card className={styles.panel}>
        <h2 className={styles.entityTitle}>{t('hqLeaderSales.entityTitle')}</h2>

        {/* 코드 미리보기 — 좌: 캡션+배지 / 우: 코드 라벨+큰 값(우측 정렬) */}
        <div className={styles.codePanel}>
          <div className={styles.codePanelLeft}>
            <span className={styles.codePanelLabel}>{profile.topLabel}</span>
            <div className={styles.codeBadges}>
              <span className={styles.parentBadge}>{profile.parentBadge}</span>
              <span className={styles.countryBadge}>{profile.country}</span>
            </div>
          </div>
          <div className={styles.codePanelRight}>
            <span className={styles.codeKeyLabel}>{t('hqLeaderSales.codeLabel')}</span>
            <span className={styles.codeValue}>{profile.code}</span>
          </div>
        </div>

        <div className={styles.kpiRow4}>
          {kpiTop.map((s) => (
            <StatCard key={s.id} {...s} dense />
          ))}
        </div>

        <div className={styles.sectionBox}>
          <h3 className={styles.sectionTitle}>{t('hqLeaderSales.section.account')}</h3>
          <InfoGrid items={accountInfo} />
        </div>

        <div className={styles.sectionBox}>
          <h3 className={styles.sectionTitle}>{t('hqLeaderSales.section.basic')}</h3>
          <InfoGrid items={basicInfo} />
        </div>

        <FilterTabs labels={tabLabels} activeIndex={tab} onChange={setTab} variant="outline" />

        {tab === HISTORY_TAB_INDEX ? (
          <>
            <div className={styles.kpiRow5}>
              {kpiBottom.map((s) => (
                <StatCard key={s.id} {...s} dense />
              ))}
            </div>
            <DataTable
              title={t('hqLeaderSales.logTitle')}
              columns={logColumns}
              rows={rows}
              toolbar={[t('common.search'), t('common.filter'), t('common.excel')]}
              inlineToolbar
              largeText
            />
          </>
        ) : tab === SETTLEMENT_TAB_INDEX ? (
          <>
            {/* Figma에 이 탭 전용 디자인이 없어, 리더 본인용 "정산 내역" 화면과 동일한 요약 카드+표를 재사용(사용자 확인됨) */}
            <div className={styles.settleTopRow}>
              <div className={styles.settleCard}>
                <span className={`${styles.settleChip} ${styles.settleChipGray}`}>{t('settle.hist.lastDate')}</span>
                <span className={styles.settleValue}>{settlement.lastSettleDate}</span>
              </div>
              <div className={`${styles.settleCard} ${styles.settleCardCurrent}`}>
                <div className={styles.settleCardHead}>
                  <span className={`${styles.settleChip} ${styles.settleChipTeal}`}>{t('settle.hist.thisRequest')}</span>
                  <span className={styles.settleStatusBadge}>{settlement.status}</span>
                </div>
                <span className={`${styles.settleValue} ${styles.settleValueTeal}`}>{settlement.thisRequestAmount}</span>
              </div>
            </div>
            <DataTable
              title={t('settle.hist.tableTitle')}
              columns={settlementColumns}
              rows={settlementRows}
              toolbar={[t('common.search'), t('common.filter'), t('common.excel')]}
            />
          </>
        ) : (
          <p className={styles.tabPlaceholder}>{t('common.comingSoon')}</p>
        )}

        {/* Figma 레이어명은 "본사 정산 요청 보내기"지만, 버튼 안 실제 텍스트는 "확인"뿐이라 그대로 표기 */}
        <div className={styles.actionRow}>
          <button type="button" className={styles.confirmButton}>
            {t('hqLeaderSales.confirmButton')}
          </button>
        </div>
      </Card>
    </div>
  )
}
