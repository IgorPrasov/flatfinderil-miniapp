import { LogIn, Star, Bell, MessageSquare, FileText, ChevronRight } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'
import { Button } from '@/components/ui/Button'

export function CabinetPage() {
  const { user, webapp } = useTelegram()

  const isLoggedIn = user && user.id !== 0

  function openBot() {
    webapp?.openTelegramLink('https://t.me/FlatFinderILBot')
  }

  const MENU = [
    { icon: Star, label: 'Мои подписки', sub: 'Управление алертами и подпиской', action: openBot },
    { icon: Bell, label: 'Уведомления', sub: 'Настройка нотификаций', action: openBot },
    { icon: MessageSquare, label: 'Мои объявления', sub: 'Добавленные мной', action: openBot },
    { icon: FileText, label: 'Документы', sub: 'Загруженные файлы', action: openBot },
  ]

  return (
    <div className="p-4 pb-24">
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
                <p className="font-bold">Гость</p>
                <p className="text-blue-100 text-sm">Войдите через Telegram</p>
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
            Открыть в Telegram
          </Button>
        )}
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4">
        {MENU.map(({ icon: Icon, label, sub, action }, i) => (
          <button
            key={label}
            onClick={action}
            className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors ${
              i > 0 ? 'border-t border-gray-50' : ''
            }`}
          >
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{label}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
          </button>
        ))}
      </div>

      {/* About */}
      <div className="bg-gray-50 rounded-2xl p-4 text-center">
        <p className="text-sm font-semibold text-gray-700">FlatFinder IL</p>
        <p className="text-xs text-gray-400 mt-0.5">Поиск жилья в Израиле</p>
        <button onClick={openBot} className="mt-3 text-xs text-blue-500 font-medium">
          @FlatFinderILBot
        </button>
      </div>
    </div>
  )
}
