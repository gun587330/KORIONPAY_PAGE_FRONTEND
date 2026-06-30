import { useNavigate } from 'react-router-dom'
import PageHeader from '../../../components/organisms/PageHeader'
import Button from '../../../components/atoms/Button'
import { useTranslation } from '../../../i18n'
import { useApplicationDetail, type DetailField } from './useApplicationDetail'
import styles from './ApplicationDetail.module.css'

/*
 * ApplicationDetail (page) — 본사어드민 · 신청서 관리 · 제휴 / 투자 신청 상세
 * ------------------------------------------------------------------
 * 신청서 목록의 액션 배지(확인/검토/위험/삭제) 클릭 시 진입(Figma 1:16477).
 * 4개 버튼 모두 목록으로 복귀(UI 상태만 구현 — CLAUDE.md 1번 규칙상 백엔드 분기 없음).
 */
export default function ApplicationDetail() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { fields, textFields } = useApplicationDetail()

  const back = () => navigate('/hq/applications')

  // Figma 원본에 "지역" 라벨이 두 번 나오는 등 라벨 중복이 있어 key는 인덱스 기준으로 둔다.
  const renderField = (f: DetailField, index: number) => (
    <div key={index} className={styles.field}>
      <span className={styles.fieldLabel}>{f.label}</span>
      <input className={styles.input} type="text" defaultValue={f.value || undefined} placeholder={f.placeholder} />
    </div>
  )

  return (
    <div className={styles.page}>
      <PageHeader title={t('hqApplications.title')} />

      <section className={styles.panel}>
        <h2 className={styles.panelTitle}>{t('hqApplicationDetail.title')}</h2>

        <div className={styles.grid}>{fields.map(renderField)}</div>

        {textFields.map((f, index) => (
          <div key={index} className={styles.field}>
            <span className={styles.fieldLabel}>{f.label}</span>
            <textarea className={styles.textarea} defaultValue={f.value || undefined} placeholder={f.placeholder} />
          </div>
        ))}

        <div className={styles.buttons}>
          <div className={styles.buttonsLeft}>
            <Button variant="primary" onClick={back}>{t('hqApplicationDetail.action.confirm')}</Button>
            <Button variant="secondary" onClick={back}>{t('hqApplicationDetail.action.review')}</Button>
            <Button variant="secondary" onClick={back}>{t('hqApplicationDetail.action.risk')}</Button>
          </div>
          <Button variant="danger" onClick={back}>{t('hqApplicationDetail.action.delete')}</Button>
        </div>
      </section>
    </div>
  )
}
