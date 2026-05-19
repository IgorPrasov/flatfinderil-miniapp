import { LogIn, Star, Bell, MessageSquare, FileText, ChevronRight } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'
import { Button } from '@/components/ui/Button'
import { t } from '@/i18n'

export function CabinetPage() {
  const { user, webapp, lang, rtl } = useTelegram()
  const isLoggedIn = user && user.id !== 0

  function openBot() {
    webapp?.openTelegramLink('https://t.me/FlatFinderILBot')
  }

  const MENU = [
    { icon: Star,         labelKey: 'cabinet_subscriptions', subKey: 'cabinet_sub_sub' },
    { icon: Bell,         labelKey: 'cabinet_notifications', subKey: 'cabinet_notif_sub' },
    { icon: MessageSquare,labelKey: 'cabinet_listings',      subKey: 'cabinet_listings_sub' },
    { icon: FileText,     labelKey: 'cabinet_docs',          subKey: 'cabinet_docs_sub' },
  ] as const

  return (
    <div className="p-4 pb-24" dir={rtl ? 'rtl' : 'ltr'}>
      {/* Profile card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white mb-5">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
            {isLoggedIn ? user.first_name[0].toUpperCase() : '?'}
          </div>
          <div>
            {isLoggedIn ? (
              <>
                <p className="font-bold text-lg">{user.first_name} {user.last_name ?? ''}</p>
                {user.username && <p className="text-blue-100 text-sm">@{user.username}</p>}
                <p className="text-blue-100 text-xs mt-0.5">ID: {user.id}</p>
              </>
            ) : (
              <>
                <p className="font-bold">{t('cabinet_guest', lang)}</p>
                <p className="text-blue-100 text-sm">{t('cabinet_login', lang)}</p>
              </>
            )}
          </div>
        </div>
        {!isLoggedIn && (
          <Button
            variant="secondary"
            className="mt-4 w-full bg-white text-blue-600 hover:bg-blue-50"
            onClick={openBot}
          >
            <LogIn className="w-4 h-4" />
            {t('cabinet_open_bot', lang)}
          </Button>
        )}
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4">
        {MENU.map(({ icon: Icon, labelKey, subKey }, i) => (
          <button
            key={labelKey}
            onClick={openBot}
            className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors ${i > 0 ? 'border-t border-gray-50' : ''}`}
          >
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{t(labelKey, lang)}</p>
              <p className="text-xs text-gray-400">{t(subKey, lang)}</p>
            </div>
            <ChevronRight className={`w-4 h-4 text-gray-300 shrink-0 ${rtl ? 'rotate-180' : ''}`} />
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-2xl p-4 text-center">
        <p className="text-sm font-semibold text-gray-700">FlatFinder IL</p>
        <p className="text-xs text-gray-400 mt-0.5">{t('cabinet_about', lang)}</p>
        <button onClick={openBot} className="mt-3 text-xs text-blue-500 font-medium">
          @FlatFinderILBot
        </button>
      </div>
    </div>
  )
}
