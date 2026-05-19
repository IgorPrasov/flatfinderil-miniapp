import { Search, Map, Heart, Calculator, User } from 'lucide-react'
import { clsx } from 'clsx'
import { useStore } from '@/store'
import { useTelegram } from '@/hooks/useTelegram'

const TABS = [
  { id: 'search',     icon: Search,     label: { ru: 'Поиск',     he: 'חיפוש',   en: 'Search' } },
  { id: 'map',        icon: Map,        label: { ru: 'Карта',     he: 'מפה',     en: 'Map' } },
  { id: 'favorites',  icon: Heart,      label: { ru: 'Избранное', he: 'מועדפים', en: 'Saved' } },
  { id: 'calculator', icon: Calculator, label: { ru: 'Ипотека',   he: 'משכנתה',  en: 'Mortgage' } },
  { id: 'cabinet',    icon: User,       label: { ru: 'Кабинет',   he: 'אזור אישי', en: 'Cabinet' } },
] as const

export function BottomNav() {
  const { activeTab, setActiveTab } = useStore()
  const { lang, haptic } = useTelegram()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-bottom z-40">
      <div className="flex items-stretch">
        {TABS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            className={clsx(
              'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors',
              activeTab === id ? 'text-blue-500' : 'text-gray-400'
            )}
            onClick={() => {
              haptic('light')
              setActiveTab(id)
            }}
          >
            <Icon
              className={clsx('w-5 h-5', activeTab === id && 'stroke-2')}
              fill={activeTab === id && id === 'favorites' ? 'currentColor' : 'none'}
            />
            <span>{label[lang as keyof typeof label] ?? label.ru}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
