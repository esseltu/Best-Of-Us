import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const homepage = process.env.npm_package_homepage
  const baseFromHomepage = homepage ? new URL(homepage).pathname : '/'
  const base = command === 'build' ? baseFromHomepage : '/'
  return {
    base,
    plugins: [react()],
  }
})
