import { useTranslation } from '../../../i18n'
import { useApplicationDetail, type DetailField } from '../ApplicationDetail/useApplicationDetail'
import styles from './ApplicationDetailOverlay.module.css'

interface Props {
  open: boolean
  onClose: () => void
}

/*
 * ApplicationDetailOverlay — 신청서 상세 오버레이 (Figma 1:16618)
 * ------------------------------------------------------------------
 * 신청서 관리 목록에서 행 클릭 시 현재 페이지 위에 모달 형태로 노출.
 * 별도 라우트 없이 open prop으로만 제어한다.
 * backdrop 클릭 또는 4개 버튼(확인·검토·위험·삭제) 클릭 시 닫힘.
 */
export default function ApplicationDetailOverlay({ open, onClose }: Props) {
  const { t } = useTranslation()
  const { fields, textFields } = useApplicationDetail()

  if (!open) return null

  // Figma 원본에 '지역' 라벨이 두 번 나와 key는 인덱스 기준
  const renderField = (f: DetailField, index: number) => (
    <div key={index} className={styles.field}>
      <span className={styles.fieldLabel}>{f.label}</span>
      <input
        className={styles.input}
        type="text"
        defaultValue={f.value || undefined}
        placeholder={f.placeholder}
      />
    </div>
  )

  return (
    <div className={styles.backdrop} onClick={onClose}>
      {/* stopPropagation: 패널 안 클릭이 backdrop 클릭으로 버블링되지 않도록 */}
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('hqApplicationDetail.title')}</h2>
          <div className={styles.divider} />
        </div>

        <div className={styles.grid}>{fields.map(renderField)}</div>

        {textFields.map((f, index) => (
          <div key={index} className={styles.field}>
            <span className={styles.fieldLabel}>{f.label}</span>
            <textarea
              className={styles.textarea}
              defaultValue={f.value || undefined}
              placeholder={f.placeholder}
            />
          </div>
        ))}

        <div className={styles.buttons}>
          <div className={styles.buttonsLeft}>
            <button className={styles.btnConfirm} onClick={onClose}>
              {t('hqApplicationDetail.action.confirm')}
            </button>
            <button className={styles.btnSecondary} onClick={onClose}>
              {t('hqApplicationDetail.action.review')}
            </button>
            <button className={styles.btnSecondary} onClick={onClose}>
              {t('hqApplicationDetail.action.risk')}
            </button>
          </div>
          <button className={styles.btnDelete} onClick={onClose}>
            {t('hqApplicationDetail.action.delete')}
          </button>
        </div>
      </div>
    </div>
  )
}
