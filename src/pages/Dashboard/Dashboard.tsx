import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/organisms/PageHeader'
import KpiGrid from '../../components/organisms/KpiGrid'
import Panel from '../../components/molecules/Panel'
import Button from '../../components/atoms/Button'
import Badge from '../../components/atoms/Badge'
import { useTranslation } from '../../i18n'
import { useDashboardData } from './useDashboardData'
import styles from './Dashboard.module.css'

/*
 * Dashboard (page) — 리더 관리자 · 국가 운영 대시보드
 * ------------------------------------------------------------------
 * 구성: 상단 헤더(제목/기간탭) + KPI 카드 그리드 + 하단 요약 패널들.
 *
 * [하단 패널 처리] 파트너 순위/가맹점 순위/최근 활동/요청/공지 패널은
 * 현재 Figma상 제목만 있고 내용이 비어 있다(미정의). 따라서 내용을 임의로 채우지 않고,
 * 각 패널에 "무엇이 들어갈 자리"인지 주석으로만 명시해 빈 공간으로 둔다.
 * (내용 정의되면 각 Panel의 children으로 실제 리스트/위젯을 넣으면 됨)
 */
export default function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [period, setPeriod] = useState('2026-06')
  const [countryScope, setCountryScope] = useState<string | undefined>()
  const {
    kpis,
    leaderProfile,
    selectedCountryScope,
    invalidScope,
    organizationSummary,
    monthlyVolume,
    feeSummary,
    riskAlerts,
    isLoading,
    error,
  } = useDashboardData(period, countryScope)

  const go = (path: string) => navigate(`/leader/${path}`)

  return (
    <div className={styles.page}>
      {/* 공통 헤더 + 국가 리더용 기간/국가 scope 입력 */}
      <PageHeader title={t('dashboard.title')}>
        <div className={styles.controls} aria-label={t('dashboard.filters.label')}>
          <label className={styles.field}>
            <span>{t('dashboard.filters.period')}</span>
            <select
              className={styles.select}
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            >
              <option value="2026-06">2026-06</option>
              <option value="30D">30D</option>
            </select>
          </label>
          <label className={styles.field}>
            <span>{t('dashboard.filters.countryScope')}</span>
            <select
              className={styles.select}
              value={selectedCountryScope}
              onChange={(event) => setCountryScope(event.target.value)}
            >
              {leaderProfile.countryScopes.map((scope) => (
                <option key={scope.code} value={scope.code}>
                  {scope.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </PageHeader>

      {invalidScope && (
        <div className={styles.validation} role="alert">
          {t('dashboard.validation.ownCountryOnly')}
        </div>
      )}
      {(isLoading || error) && (
        <div className={styles.validation} role={error ? 'alert' : 'status'}>
          {error ? t('common.apiFallback') : t('common.loading')}
        </div>
      )}

      <KpiGrid items={kpis} />

      <div className={styles.panelGrid}>
        <Panel title={t('dashboard.panel.subOrganizations')}>
          <div className={styles.list}>
            {organizationSummary.partners.map((partner) => (
              <div key={partner.id} className={styles.row}>
                <div>
                  <strong>{partner.name}</strong>
                  <span>
                    {partner.country} · {partner.merchantCount}
                    {t('dashboard.unit.merchants')}
                  </span>
                </div>
                <div className={styles.rowMeta}>
                  <span>{partner.monthlyVolume}</span>
                  <Badge accent={partner.risk === '주의' ? 'orange' : 'green'} size="sm">
                    {partner.risk}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.actions}>
            <Button onClick={() => go('partners')}>{t('dashboard.action.detail')}</Button>
          </div>
        </Panel>

        <Panel title={t('dashboard.panel.merchantSummary')}>
          <div className={styles.list}>
            {organizationSummary.merchants.map((merchant) => (
              <div key={merchant.id} className={styles.row}>
                <div>
                  <strong>{merchant.name}</strong>
                  <span>{merchant.partnerName}</span>
                </div>
                <div className={styles.rowMeta}>
                  <span>{merchant.monthlyVolume}</span>
                  <Badge accent={merchant.risk === '주의' ? 'orange' : 'green'} size="sm">
                    {merchant.risk}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.actions}>
            <Button onClick={() => go('merchants')}>{t('dashboard.action.detail')}</Button>
          </div>
        </Panel>

        <Panel title={t('dashboard.panel.monthlyVolume')}>
          <div className={styles.volumeList}>
            {monthlyVolume.map((item) => (
              <div key={item.month} className={styles.volumeRow}>
                <span>{item.month}</span>
                <strong>{item.volume}</strong>
                <small>{item.txCount} tx</small>
              </div>
            ))}
          </div>
          <div className={styles.actions}>
            <Button onClick={() => go('transactions')}>{t('dashboard.action.report')}</Button>
          </div>
        </Panel>

        <Panel title={t('dashboard.panel.feeSummary')}>
          <div className={styles.list}>
            {feeSummary.map((fee) => (
              <div key={fee.label} className={styles.row}>
                <div>
                  <strong>{fee.label}</strong>
                  <span>{fee.delta}</span>
                </div>
                <span className={styles.amount}>{fee.amount}</span>
              </div>
            ))}
          </div>
          <div className={styles.actions}>
            <Button onClick={() => go('settlement/history')}>{t('dashboard.action.report')}</Button>
          </div>
        </Panel>

        <Panel title={t('dashboard.panel.riskAlerts')}>
          <div className={styles.list}>
            {riskAlerts.map((alert) => (
              <div key={alert.id} className={styles.alertRow}>
                <Badge
                  accent={
                    alert.severity === 'high'
                      ? 'red'
                      : alert.severity === 'medium'
                        ? 'orange'
                        : 'blue'
                  }
                  size="sm"
                >
                  {alert.severity}
                </Badge>
                <div>
                  <strong>{alert.title}</strong>
                  <span>{alert.message}</span>
                  <small>{alert.target}</small>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.actions}>
            <Button onClick={() => go('transactions/failed')}>{t('dashboard.action.detail')}</Button>
          </div>
        </Panel>
      </div>
    </div>
  )
}
