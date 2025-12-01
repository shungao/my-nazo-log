import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // 【この行を追加/修正】
  base: '/my-nazo-log/', 
  // 例: リポジトリ名が 'nazo-log' の場合
  // base: '/nazo-log/',
})
