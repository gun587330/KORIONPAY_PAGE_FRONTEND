import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Globe2, LogOut } from 'lucide-react'
import { useTranslation } from '../../../i18n'
import { clearAuthSession } from '../../../services/authSession'
import styles from './TopControls.module.css'

/*
 * TopControls (molecule)
 * ------------------------------------------------------------------
 * 모든 화면 우측 상단 컨트롤: 언어 전환 + 로그아웃.
 * - 언어 버튼: 현재 언어를 표시하고, 클릭하면 한↔영을 전환한다(toggleLang).
 * - 로그아웃: 로그인/회원가입 허브(/login)로 이동(실제 세션 로직은 범위 밖).
 */
export default function TopControls() {
  const { lang, setLang, t } = useTranslation()
  const navigate = useNavigate()
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const languageMenuRef = useRef<HTMLDivElement | null>(null)
  const languageOptions = [
    { code: 'ko' as const, label: 'KR', name: '한국어' },
    { code: 'en' as const, label: 'EN', name: 'English' },
  ]
  const currentLanguage = languageOptions.find((option) => option.code === lang) ?? languageOptions[0]

  useEffect(() => {
    if (!languageMenuOpen) return
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setLanguageMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [languageMenuOpen])

  const logout = () => {
    clearAuthSession()
    navigate('/login')
  }

  return (
    <div className={styles.controls}>
      <div
        className={styles.langMenu}
        ref={languageMenuRef}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setLanguageMenuOpen(false)
          }
        }}
      >
        <button
          type="button"
          className={`${styles.button} ${styles.langButton}`}
          aria-haspopup="listbox"
          aria-expanded={languageMenuOpen}
          onClick={() => setLanguageMenuOpen((open) => !open)}
        >
          <Globe2 size={14} aria-hidden="true" />
          <span>{currentLanguage.label}</span>
          <ChevronDown size={13} aria-hidden="true" />
        </button>
        {languageMenuOpen && (
          <div className={styles.langDropdown} role="listbox" aria-label="Language">
            {languageOptions.map((option) => (
              <button
                key={option.code}
                type="button"
                className={`${styles.langOption} ${option.code === lang ? styles.langOptionActive : ''}`}
                role="option"
                aria-selected={option.code === lang}
                onClick={() => {
                  setLang(option.code)
                  setLanguageMenuOpen(false)
                }}
              >
                <span className={styles.langOptionCode}>{option.label}</span>
                <span>{option.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        className={`${styles.button} ${styles.iconButton}`}
        onClick={logout}
        aria-label={t('common.logout')}
        title={t('common.logout')}
      >
        <LogOut size={16} aria-hidden="true" />
      </button>
    </div>
  )
}
