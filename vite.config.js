import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

// https://vite.dev/config/
export default defineConfig(() => {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')?.[1]
  const base = repo ? `/${repo}/` : '/'
  return {
    base,
    plugins: [react()],
  }
})
