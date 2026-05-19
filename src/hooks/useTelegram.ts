import { useEffect, useState } from 'react'
import type { TelegramWebApp, TelegramUser } from '@/types'

const tg = (): TelegramWebApp | undefined => window.Telegram?.WebApp

export function useTelegram() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const app = tg()
    if (app) {
      app.ready()
      app.expand()
      setReady(true)
    } else {
      // Dev mode — no Telegram
      setReady(true)
    }
  }, [])

  const user: TelegramUser | undefined = tg()?.initDataUnsafe?.user ?? {
    id: 0,
    first_name: 'Dev User',
    language_code: 'ru',
  }

  const lang = user?.language_code?.startsWith('he')
    ? 'he'
    : user?.language_code?.startsWith('en')
    ? 'en'
    : 'ru'

  const isDark = tg()?.colorScheme === 'dark'

  function haptic(type: 'light' | 'medium' | 'heavy' = 'light') {
    tg()?.HapticFeedback?.impactOccurred(type)
  }

  function notify(type: 'success' | 'error' | 'warning') {
    tg()?.HapticFeedback?.notificationOccurred(type)
  }

  function showMainButton(text: string, onClick: () => void) {
    const btn = tg()?.MainButton
    if (!btn) return
    btn.setText(text)
    btn.show()
    btn.enable()
    btn.onClick(onClick)
    return () => btn.offClick(onClick)
  }

  function hideMainButton() {
    tg()?.MainButton?.hide()
  }

  function showBackButton(onClick: () => void) {
    const btn = tg()?.BackButton
    if (!btn) return
    btn.show()
    btn.onClick(onClick)
    return () => btn.offClick(onClick)
  }

  function hideBackButton() {
    tg()?.BackButton?.hide()
  }

  return {
    ready,
    user,
    lang,
    isDark,
    haptic,
    notify,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    initData: tg()?.initData ?? '',
    webapp: tg(),
  }
}
