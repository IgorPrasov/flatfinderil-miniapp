import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store'
import { useTelegram } from '@/hooks/useTelegram'
import { t } from '@/i18n'

const CITIES = ['Тель-Авив', 'Нетания', 'Хайфа', 'Беэр-Шева', 'Ашдод', 'Петах-Тиква', 'Ришон-ле-Цион', 'Хадера', 'Реховот', 'Холон', 'Раанана', 'Герцлия']

const PROP_TYPES = [
  { value: 'apartment', key: 'ptype_apartment' },
  { value: 'house',     key: 'ptype_house' },
  { value: 'studio',    key: 'ptype_studio' },
  { value: 'room',      key: 'ptype_room' },
  { value: 'commercial',key: 'ptype_commercial' },
] as const

export function SearchFiltersPanel() {
  const { filters, setFilters, resetFilters } = useStore()
  const { lang, rtl } = useTelegram()
  const [open, setOpen] = useState(false)

  const activeCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : true)
  ).length

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-700"
      >
        <SlidersHorizontal className="w-4 h-4" />
        {t('filters_title', lang)}
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div
            className="relative w-full bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto"
            dir={rtl ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{t('filters_title', lang)}</h3>
              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Deal type */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">{t('filters_deal', lang)}</p>
              <div className="flex gap-2">
                {[
                  { v: undefined,  k: 'filters_all'  },
                  { v: 'rent',     k: 'filters_rent' },
                  { v: 'buy',      k: 'filters_buy'  },
                ].map(({ v, k }) => (
                  <button
                    key={k}
                    onClick={() => setFilters({ deal_type: v as 'rent' | 'buy' | undefined })}
                    className={`px-3 py-1.5 rounded-xl text-sm border transition-colors ${
                      filters.deal_type === v
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {t(k as Parameters<typeof t>[0], lang)}
                  </button>
                ))}
              </div>
            </div>

            {/* Property types */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">{t('filters_ptype', lang)}</p>
              <div className="flex flex-wrap gap-2">
                {PROP_TYPES.map(({ value, key }) => {
                  const sel = filters.property_types?.includes(value)
                  return (
                    <button
                      key={value}
                      onClick={() => {
                        const cur = filters.property_types ?? []
                        setFilters({
                          property_types: sel ? cur.filter((tp) => tp !== value) : [...cur, value],
                        })
                      }}
                      className={`px-3 py-1.5 rounded-xl text-sm border transition-colors ${
                        sel ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {t(key, lang)}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Cities */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">{t('filters_city', lang)}</p>
              <div className="flex flex-wrap gap-2">
                {CITIES.map((city) => {
                  const sel = filters.cities?.includes(city)
                  return (
                    <button
                      key={city}
                      onClick={() => {
                        const cur = filters.cities ?? []
                        setFilters({ cities: sel ? cur.filter((c) => c !== city) : [...cur, city] })
                      }}
                      className={`px-3 py-1.5 rounded-xl text-sm border transition-colors ${
                        sel ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {city}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Rooms */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">{t('filters_rooms', lang)}</p>
              <div className="flex gap-2 items-center">
                <input
                  type="number" placeholder={t('filters_from', lang)}
                  value={filters.rooms_min ?? ''}
                  onChange={(e) => setFilters({ rooms_min: e.target.value ? +e.target.value : undefined })}
                  className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="number" placeholder={t('filters_to', lang)}
                  value={filters.rooms_max ?? ''}
                  onChange={(e) => setFilters({ rooms_max: e.target.value ? +e.target.value : undefined })}
                  className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Price */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">{t('filters_price', lang)}</p>
              <div className="flex gap-2 items-center">
                <input
                  type="number" placeholder={t('filters_from', lang)}
                  value={filters.price_min ?? ''}
                  onChange={(e) => setFilters({ price_min: e.target.value ? +e.target.value : undefined })}
                  className="w-28 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="number" placeholder={t('filters_to', lang)}
                  value={filters.price_max ?? ''}
                  onChange={(e) => setFilters({ price_max: e.target.value ? +e.target.value : undefined })}
                  className="w-28 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* With photos */}
            <label className="flex items-center gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.with_photos ?? false}
                onChange={(e) => setFilters({ with_photos: e.target.checked || undefined })}
                className="w-4 h-4 accent-blue-500"
              />
              <span className="text-sm text-gray-700">{t('filters_photos', lang)}</span>
            </label>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={resetFilters} className="flex-1">
                {t('filters_reset', lang)}
              </Button>
              <Button onClick={() => setOpen(false)} className="flex-1">
                {t('filters_apply', lang)}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
