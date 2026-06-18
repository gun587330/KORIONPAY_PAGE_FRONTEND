import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 설정 — React + CSS Modules 사용.
// CSS Modules는 Vite에 기본 내장되어 있어 별도 설정 없이 *.module.css 파일이 자동 적용됨.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  css: {
    modules: {
      // 클래스명을 "컴포넌트명__클래스명__해시" 형태로 생성 → 개발 중 어떤 컴포넌트의 스타일인지 식별 쉬움.
      localsConvention: 'camelCaseOnly',
      generateScopedName: '[name]__[local]__[hash:base64:5]',
    },
  },
})
