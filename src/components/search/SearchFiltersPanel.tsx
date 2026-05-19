import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store'

const CITIES = ['Тель-Авив', 'Нетания', 'Хайфа', 'Беэр-Шева', 'Ашдод', 'Петах-Тиква', 'Ришон-ле-Цион', 'Хадера', 'Натания', 'Реховот', 'Холон', 'Раанана']
const PROP_TYPES = [
  { value: 'apartment', label: 'Квартира' },
  { value: 'house', label: 'Дом' },
  { value: 'studio', label: 'Студия' },
  { value: 'room', label: 'Комната' },
  { value: 'commercial', label: 'Коммерческая' },
]

export function SearchFiltersPanel() {
  const { filters, setFilters, resetFilters } = useStore()
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
        Фильтры
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Фильтры</h3>
              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Deal type */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Тип сделки</p>
              <div className="flex gap-2">
                {[
                  { v: undefined, l: 'Все' },
                  { v: 'rent', l: 'Аренда' },
                  { v: 'buy', l: 'Купить' },
                ].map(({ v, l }) => (
                  <button
                    key={l}
                    onClick={() => setFilters({ deal_type: v as 'rent' | 'buy' | undefined })}
                    className={`px-3 py-1.5 rounded-xl text-sm border transition-colors ${
                      filters.deal_type === v
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Property types */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Тип недвижимости</p>
              <div className="flex flex-wrap gap-2">
                {PROP_TYPES.map(({ value, label }) => {
                  const sel = filters.property_types?.includes(value)
                  return (
                    <button
                      key={value}
                      onClick={() => {
                        const cur = filters.property_types ?? []
                        setFilters({
                          property_types: sel
                            ? cur.filter((t) => t !== value)
                            : [...cur, value],
                        })
                      }}
                      className={`px-3 py-1.5 rounded-xl text-sm border transition-colors ${
                        sel
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Cities */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Город</p>
              <div className="flex flex-wrap gap-2">
                {CITIES.map((city) => {
                  const sel = filters.cities?.includes(city)
                  return (
                    <button
                      key={city}
                      onClick={() => {
                        const cur = filters.cities ?? []
                        setFilters({
                          cities: sel ? cur.filter((c) => c !== city) : [...cur, city],
                        })
                      }}
                      className={`px-3 py-1.5 rounded-xl text-sm border transition-colors ${
                        sel
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 text-gray-600'
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
              <p className="text-sm text-gray-500 mb-2">Комнаты</p>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="от"
                  value={filters.rooms_min ?? ''}
                  onChange={(e) => setFilters({ rooms_min: e.target.value ? +e.target.value : undefined })}
                  className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="number"
                  placeholder="до"
                  value={filters.rooms_max ?? ''}
                  onChange={(e) => setFilters({ rooms_max: e.target.value ? +e.target.value : undefined })}
                  className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Price */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Цена (₪)</p>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="от"
                  value={filters.price_min ?? ''}
                  onChange={(e) => setFilters({ price_min: e.target.value ? +e.target.value : undefined })}
                  className="w-28 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="number"
                  placeholder="до"
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
              <span className="text-sm text-gray-700">Только с фото</span>
            </label>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={resetFilters} className="flex-1">
                Сбросить
              </Button>
              <Button onClick={() => setOpen(false)} className="flex-1">
                Применить
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
