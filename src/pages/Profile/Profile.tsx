import { useState, type CSSProperties } from 'react'
import PageHeader from '../../components/organisms/PageHeader'
import Button from '../../components/atoms/Button'
import { useTranslation } from '../../i18n'
import { useProfile, type ProfileField } from './useProfile'
import styles from './Profile.module.css'

/*
 * Profile (page) — 내 권한 / 설정 · 프로필 정보
 * ------------------------------------------------------------------
 * 상단 상태 요약 바 + 내 코드 히어로 + A.계정 / B.소속 / D.본사 변경 요청 섹션.
 * 플로우: [본사 승인 요청] → 확인 모달 → 완료 토스트.
 * 입력은 프리필된 값으로 표시(UI 상태만, 백엔드 연동 없음 — 작업 범위 밖).
 * (Figma 기준 섹션은 A·B·D로 'C'는 존재하지 않아 그대로 둔다.)
 */
export default function Profile() {
  const { t } = useTranslation()
  const { statusItems, code, accountFields, basicFields } = useProfile()

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [saved, setSaved] = useState(false)

  // 프리필된 입력 필드 한 개 (라벨 + 값 박스)
  const renderField = (f: ProfileField) => (
    <div key={f.label} className={`${styles.field} ${f.wide ? styles.wide : ''}`}>
      <span className={styles.fieldLabel}>{f.label}</span>
      <input className={styles.input} type="text" defaultValue={f.value} />
    </div>
  )

  return (
    <div className={styles.page}>
      <PageHeader title={t('profile.title')} />

      <section className={styles.panel}>
        {/* 상단 상태 요약 바 */}
        <div className={styles.statusBar}>
          {statusItems.map((s) => (
            <div key={s.label} className={styles.statusItem}>
              <span className={styles.statusLabel}>{s.label}</span>
              <span className={styles.statusChip} style={{ '--chip': s.chip } as CSSProperties}>
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* 내 코드 히어로 */}
        <div className={styles.codeHero}>
          <span className={styles.codeLabel}>{t('profile.code.label')}</span>
          <span className={styles.codeValue}>{code}</span>
          <span className={styles.codeDesc}>{t('profile.code.desc')}</span>
        </div>

        {/* A. 계정 정보 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{t('profile.acc.title')}</h3>
          <div className={styles.grid}>{accountFields.map(renderField)}</div>
        </div>

        {/* B. 기본 / 소속 정보 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{t('profile.basic.title')}</h3>
          <div className={styles.grid}>{basicFields.map(renderField)}</div>
        </div>

        {/* D. 본사 변경 요청 정보 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{t('profile.req.title')}</h3>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>{t('profile.req.memo')}</span>
              <textarea className={styles.textarea} placeholder={t('profile.req.memoPlaceholder')} />
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>{t('profile.req.answer')}</span>
              <textarea className={styles.textarea} placeholder={t('profile.req.answerPlaceholder')} />
            </div>
          </div>

          {/* 증빙자료 첨부 */}
          <div className={styles.field}>
            <span className={styles.fieldLabel}>{t('profile.req.attach')}</span>
            <div className={styles.uploadRow}>
              <input className={styles.input} type="text" readOnly />
              <button type="button" className={styles.uploadBtn}>
                {t('profile.req.upload')}
              </button>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className={styles.buttons}>
          <Button variant="secondary">{t('profile.cancel')}</Button>
          <Button variant="primary" onClick={() => setConfirmOpen(true)}>
            {t('profile.submit')}
          </Button>
        </div>
      </section>

      {/* 확인 모달 */}
      {confirmOpen && (
        <div className={styles.overlay} onClick={() => setConfirmOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>{t('profile.modal.title')}</h3>
            <p className={styles.modalDesc}>{t('profile.modal.desc')}</p>
            <div className={styles.modalButtons}>
              <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
                {t('profile.modal.cancel')}
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setConfirmOpen(false)
                  setSaved(true)
                }}
              >
                {t('profile.modal.confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 완료 토스트 */}
      {saved && <div className={styles.toast}>{t('profile.toast')}</div>}
    </div>
  )
}
