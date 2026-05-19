import axios from 'axios'

// Railway bot-gateway API base
const BASE = import.meta.env.VITE_API_URL ?? 'https://flatfinderil-bot-production.up.railway.app'

export const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach Telegram initData for auth on every request
api.interceptors.request.use((config) => {
  const initData = window.Telegram?.WebApp?.initData
  if (initData) {
    config.headers['X-Telegram-Init-Data'] = initData
  }
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    console.error('[API]', err?.response?.status, err?.config?.url, err?.message)
    return Promise.reject(err)
  }
)
