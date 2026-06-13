import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/organisms/PageHeader'
import DataTable, { type TableRow } from '../../components/organisms/DataTable'
import Badge from '../../components/atoms/Badge'
import { useTranslation } from '../../i18n'
import { useSettlementHistory } from './useSettlementHistory'
import styles from './SettlementHistory.module.css'

/*
 * SettlementHistory (page) — 수수료/정산 · 정산 내역
 * ------------------------------------------------------------------
 * 상단 요약 칩(마지막 정산일/이번 요청액) + 상태 필터 탭 + 정산 내역 테이블.
 * 행의 "상세"는 정산 상세 화면(/settlement/history/detail)으로 연결.
 */
export default function SettlementHistory() {
  const { t } = useTranslation()
  const { lastSettleDate, thisRequestAmount, tabs, columns, rows: rawRows } = useSettlementHistory()
  // 이번 요청 카드의 배지와 상태 드롭다운은 같은 상태를 공유한다(동기화).
  // 드롭다운에서 고른 값이 곧 카드 우측 상단 배지에 그대로 표시된다.
  // 기본값은 tabs[0]="본사 검토중".
  const [status, setStatus] = useState(tabs[0])

  const rows: TableRow[] = rawRows.map((r) => ({
    id: r.period, // 정산번호가 모두 동일해 기간을 식별자로 사용
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
      // 상세 → 정산 상세 화면으로 이동
      action: (
        <Link to="/settlement/history/detail">
          <Badge accent="cyan" size="sm">상세</Badge>
        </Link>
      ),
    },
  }))

  return (
    <div className={styles.page}>
      <PageHeader title={t('settle.hist.title')} />

      {/* 상단: 마지막 정산일 카드 + 이번 요청 카드 + 상태 드롭다운 */}
      <div className={styles.topRow}>
        <div className={styles.sCard}>
          <span className={`${styles.sChip} ${styles.sChipGray}`}>{t('settle.hist.lastDate')}</span>
          <span className={styles.sValue}>{lastSettleDate}</span>
        </div>
        <div className={`${styles.sCard} ${styles.sCardCurrent}`}>
          {/* 우측 상단에 상태 선택 토글(드롭다운)을 카드 안에 직접 배치 */}
          <div className={styles.sCardHead}>
            <span className={`${styles.sChip} ${styles.sChipTeal}`}>{t('settle.hist.thisRequest')}</span>
            <select
              className={styles.statusSelect}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="정산 상태 선택"
            >
              {tabs.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <span className={`${styles.sValue} ${styles.sValueTeal}`}>{thisRequestAmount}</span>
        </div>
      </div>

      {/* 정산 내역 테이블 */}
      <DataTable
        title={t('settle.hist.tableTitle')}
        columns={columns}
        rows={rows}
        toolbar={[t('common.search'), t('common.filter'), t('common.excel')]}
        fill
      />
    </div>
  )
}
