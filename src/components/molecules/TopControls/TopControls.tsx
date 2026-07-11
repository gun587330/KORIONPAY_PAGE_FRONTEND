import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCircle2, Globe2, LogOut, X } from 'lucide-react'
import { useTranslation } from '../../../i18n'
import { clearAuthSession } from '../../../services/authSession'
import styles from './TopControls.module.css'

type NotificationItem = {
  id: string
  title: string
  description: string
  time: string
  read?: boolean
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = []

export default function TopControls() {
  const { lang, toggleLang, t } = useTranslation()
  const navigate = useNavigate()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS)
  const langLabel = lang === 'ko' ? 'KR · 한국어' : 'EN · English'
  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications])

  const confirmLogout = () => {
    clearAuthSession()
    setLogoutOpen(false)
    navigate('/login')
  }

  const markRead = (id: string) => {
    setNotifications((items) => items.map((item) => (item.id === id ? { ...item, read: true } : item)))
  }

  return (
    <div className={styles.controls}>
      <div className={styles.notificationShell}>
        <button
          type="button"
          className={`${styles.button} ${styles.iconButton}`}
          aria-label={t('common.notifications')}
          aria-expanded={notificationOpen}
          aria-haspopup="dialog"
          onClick={() => setNotificationOpen((open) => !open)}
        >
          <Bell size={16} aria-hidden="true" />
          {unreadCount > 0 && (
            <span className={styles.badge} aria-label={t('common.notifications.count')}>
              {unreadCount}
            </span>
          )}
        </button>
        {notificationOpen && (
          <div className={styles.notificationPanel} role="dialog" aria-label={t('common.notifications.title')}>
            <div className={styles.notificationHead}>
              <div>
                <strong>{t('common.notifications.title')}</strong>
                <span>{t('common.notifications.summary')}</span>
              </div>
              <button
                type="button"
                className={styles.panelIconButton}
                aria-label={t('common.close')}
                onClick={() => setNotificationOpen(false)}
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>
            <div className={styles.notificationList}>
              {notifications.length === 0 ? (
                <div className={styles.emptyNotice}>{t('common.notifications.empty')}</div>
              ) : (
                notifications.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={[styles.notificationItem, item.read && styles.notificationItemRead].filter(Boolean).join(' ')}
                    onClick={() => markRead(item.id)}
                  >
                    <span className={styles.notificationTitle}>{item.title}</span>
                    <span className={styles.notificationDesc}>{item.description}</span>
                    <span className={styles.notificationMeta}>
                      <time>{item.time}</time>
                      <span>{item.read ? t('common.notifications.confirmed') : t('common.notifications.confirm')}</span>
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <button type="button" className={styles.button} onClick={toggleLang}>
        <Globe2 size={16} aria-hidden="true" />
        <span>{langLabel}</span>
      </button>

      <button type="button" className={styles.button} onClick={() => setLogoutOpen(true)}>
        <LogOut size={16} aria-hidden="true" />
        <span>{t('common.logout')}</span>
      </button>

      {logoutOpen &&
        createPortal(
          <div className={styles.logoutOverlay} role="dialog" aria-modal="true" aria-label={t('common.logout.completeTitle')}>
            <section className={styles.logoutDialog}>
              <CheckCircle2 size={34} aria-hidden="true" />
              <h2>{t('common.logout.completeTitle')}</h2>
              <p>{t('common.logout.completeMessage')}</p>
              <button type="button" className={styles.logoutConfirmButton} onClick={confirmLogout}>
                {t('common.logout.goHome')}
              </button>
            </section>
          </div>,
          document.body,
        )}
    </div>
  )
}
