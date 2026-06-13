import styles from './TopControls.module.css'

/*
 * TopControls (molecule)
 * ------------------------------------------------------------------
 * 모든 화면 우측 상단에 공통으로 놓이는 컨트롤: 언어 선택 + 로그아웃.
 * 동작은 UI만(범위 밖)이라 클릭 핸들러 없이 표기만 한다.
 */
export default function TopControls() {
  return (
    <div className={styles.controls}>
      <button type="button" className={styles.button}>
        KR · 한국어
      </button>
      <button type="button" className={styles.button}>
        Log out
      </button>
    </div>
  )
}
