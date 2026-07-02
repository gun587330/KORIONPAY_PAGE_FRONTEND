import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronDown, Globe2 } from 'lucide-react'
import { useTranslation } from '../../../i18n'
import styles from './AuthShell.module.css'

interface AuthShellProps {
  /** 큰 화면 제목 (예: "로그인 / 회원가입 메인", "리더 로그인") */
  title: string
  /** 브랜드 아래 한 줄 설명 */
  subtitle: string
  children: ReactNode
}

/*
 * AuthShell (auth 공통 레이아웃)
 * ------------------------------------------------------------------
 * 로그인/회원가입 화면이 공유하는 골격: 배경 글로우 + 브랜드 헤더(+언어 토글) + 제목 + 콘텐츠.
 * 사이드바 없는 공개 화면이라 AdminLayout과 별개의 셸을 둔다.
 */
export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
  const { lang, setLang, t } = useTranslation()
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

  return (
    <div className={styles.page}>
      {/* 배경 네온 글로우 (장식, 기능 없음) */}
      <div className={`${styles.glow} ${styles.glowPurple}`} aria-hidden="true" />
      <div className={`${styles.glow} ${styles.glowCyan}`} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.brandRow}>
            <span className={styles.brand}>{t('auth.brand')}</span>
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
                className={styles.langButton}
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
          </div>
          <p className={styles.subtitle}>{subtitle}</p>
          <h1 className={styles.title}>{title}</h1>
        </header>

        {children}
      </div>
    </div>
  )
}
