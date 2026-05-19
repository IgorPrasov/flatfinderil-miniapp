import { SlidersHorizontal, X, Check } from 'lucide-react'
import { useStore } from '@/store'
import { useTelegram } from '@/hooks/useTelegram'
import { t } from '@/i18n'
import { useState } from 'react'

// ── Constants ────────────────────────────────────────────────────────────────

const CITIES = [
  'Тель-Авив', 'Нетания', 'Хайфа', 'Беэр-Шева', 'Ашдод',
  'Петах-Тиква', 'Ришон-ле-Цион', 'Хадера', 'Реховот', 'Холон',
  'Раанана', 'Герцлия', 'Бат-Ям', 'Модиин', 'Иерусалим',
]

const ROOMS = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5+']

const RENT_PRICES_MAX = [2000, 3000, 4000, 5000, 6000, 7000, 8000, 10000, 12000, 15000, 20000]
const BUY_PRICES_MAX  = [500000, 750000, 1000000, 1500000, 2000000, 3000000, 5000000]

const PROP_TYPES = [
  { value: 'apartment', key: 'ptype_apartment' },
  { value: 'house',     key: 'ptype_house'     },
  { value: 'studio',    key: 'ptype_studio'    },
  { value: 'room',      key: 'ptype_room'      },
] as const

const INFRA_KEYS = [
  'kindergarten', 'school', 'mall', 'park', 'gym',
  'hospital', 'beach', 'transport', 'restaurant', 'synagogue', 'public_pool',
] as const

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtPrice(n: number): string {
  if (n >= 1_000_000) return `${n / 1_000_000}M₪`
  if (n >= 1_000)     return `${n / 1_000}K₪`
  return `${n}₪`
}

function roomVal(s: string): number {
  return s === '5+' ? 5 : parseFloat(s)
}

// ── Chip component ───────────────────────────────────────────────────────────

function Chip({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onPointerDown={(e) => { e.stopPropagation(); onClick() }}
      className={`px-3 py-1.5 rounded-xl text-sm border transition-colors select-none ${
        active
          ? 'border-blue-500 bg-blue-500 text-white font-medium'
          : 'border-gray-200 bg-white text-gray-700'
      }`}
    >
      {label}
    </button>
  )
}

// ── Section header ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{title}</p>
      {children}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export function SearchFiltersPanel() {
  const { filters, setFilters, resetFilters } = useStore()
  const { lang, rtl, haptic } = useTelegram()
  const [open, setOpen] = useState(false)

  const activeCount = [
    filters.deal_type,
    filters.property_types?.length,
    filters.cities?.length,
    filters.rooms_min,
    filters.rooms_max,
    filters.price_max,
    filters.price_min,
    filters.infrastructure?.length,
    filters.with_photos,
    filters.pool,
    filters.parking_min,
  ].filter(Boolean).length

  const priceOptions = filters.deal_type === 'buy' ? BUY_PRICES_MAX : RENT_PRICES_MAX

  function openPanel() { haptic('light'); setOpen(true) }
  function closePanel() { haptic('light'); setOpen(false) }
  function doReset() { haptic('medium'); resetFilters() }

  function toggleRoomsMin(r: string) {
    const v = roomVal(r)
    setFilters({ rooms_min: filters.rooms_min === v ? undefined : v })
  }
  function toggleRoomsMax(r: string) {
    const v = roomVal(r)
    setFilters({ rooms_max: filters.rooms_max === v ? undefined : v })
  }
  function togglePriceMax(p: number) {
    setFilters({ price_max: filters.price_max === p ? undefined : p })
  }
  function toggleInfra(key: string) {
    const cur = filters.infrastructure ?? []
    const has = cur.includes(key)
    setFilters({ infrastructure: has ? cur.filter((k) => k !== key) : [...cur, key] })
  }
  function toggleCity(city: string) {
    const cur = filters.cities ?? []
    const has = cur.includes(city)
    setFilters({ cities: has ? cur.filter((c) => c !== city) : [...cur, city] })
  }
  function togglePtype(value: string) {
    const cur = filters.property_types ?? []
    const has = cur.includes(value)
    setFilters({ property_types: has ? cur.filter((v) => v !== value) : [...cur, value] })
  }

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={openPanel}
        className="relative flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-700 active:bg-gray-200"
      >
        <SlidersHorizontal className="w-4 h-4" />
        {t('filters_title', lang)}
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {activeCount}
          </span>
        )}
      </button>

      {/* Bottom sheet */}
      {open && (
        <div
          className="fixed inset-0 z-50"
          style={{ touchAction: 'none' }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onPointerDown={closePanel}
          />

          {/* Sheet — positioned above backdrop via z-index */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-10 flex flex-col"
            style={{ maxHeight: '88vh' }}
            dir={rtl ? 'rtl' : 'ltr'}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {/* Handle + header */}
            <div className="flex-shrink-0 px-5 pt-4 pb-3 border-b border-gray-100">
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">{t('filters_title', lang)}</h3>
                <button
                  type="button"
                  onPointerDown={closePanel}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-2">

              {/* Deal type */}
              <Section title={t('filters_deal', lang)}>
                <div className="flex gap-2 flex-wrap">
                  {([
                    { v: undefined, k: 'filters_all'  },
                    { v: 'rent',    k: 'filters_rent' },
                    { v: 'buy',     k: 'filters_buy'  },
                  ] as const).map(({ v, k }) => (
                    <Chip
                      key={k}
                      label={t(k, lang)}
                      active={filters.deal_type === v}
                      onClick={() => setFilters({ deal_type: v, price_max: undefined, price_min: undefined })}
                    />
                  ))}
                </div>
              </Section>

              {/* Property type */}
              <Section title={t('filters_ptype', lang)}>
                <div className="flex gap-2 flex-wrap">
                  {PROP_TYPES.map(({ value, key }) => (
                    <Chip
                      key={value}
                      label={t(key, lang)}
                      active={!!filters.property_types?.includes(value)}
                      onClick={() => togglePtype(value)}
                    />
                  ))}
                </div>
              </Section>

              {/* City */}
              <Section title={t('filters_city', lang)}>
                <div className="flex gap-2 flex-wrap">
                  {CITIES.map((city) => (
                    <Chip
                      key={city}
                      label={city}
                      active={!!filters.cities?.includes(city)}
                      onClick={() => toggleCity(city)}
                    />
                  ))}
                </div>
              </Section>

              {/* Rooms min */}
              <Section title={`${t('filters_rooms', lang)} — ${t('filters_from', lang)}`}>
                <div className="flex gap-2 flex-wrap">
                  {ROOMS.map((r) => (
                    <Chip
                      key={r}
                      label={r}
                      active={filters.rooms_min === roomVal(r)}
                      onClick={() => toggleRoomsMin(r)}
                    />
                  ))}
                </div>
              </Section>

              {/* Rooms max */}
              <Section title={`${t('filters_rooms', lang)} — ${t('filters_to', lang)}`}>
                <div className="flex gap-2 flex-wrap">
                  {ROOMS.map((r) => (
                    <Chip
                      key={r}
                      label={r}
                      active={filters.rooms_max === roomVal(r)}
                      onClick={() => toggleRoomsMax(r)}
                    />
                  ))}
                </div>
              </Section>

              {/* Price max */}
              <Section title={`${t('filters_price', lang)} — до`}>
                <div className="flex gap-2 flex-wrap">
                  {priceOptions.map((p) => (
                    <Chip
                      key={p}
                      label={fmtPrice(p)}
                      active={filters.price_max === p}
                      onClick={() => togglePriceMax(p)}
                    />
                  ))}
                </div>
              </Section>

              {/* Infrastructure */}
              <Section title={t('infra_title', lang)}>
                <div className="flex gap-2 flex-wrap">
                  {INFRA_KEYS.map((key) => (
                    <Chip
                      key={key}
                      label={t(`infra_${key}` as Parameters<typeof t>[0], lang)}
                      active={!!filters.infrastructure?.includes(key)}
                      onClick={() => toggleInfra(key)}
                    />
                  ))}
                </div>
              </Section>

              {/* Toggles row */}
              <Section title={t('filters_extras', lang)}>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onPointerDown={(e) => { e.stopPropagation(); setFilters({ with_photos: filters.with_photos ? undefined : true }) }}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm text-gray-700">{t('filters_photos', lang)}</span>
                    <div className={`w-11 h-6 rounded-full transition-colors ${filters.with_photos ? 'bg-blue-500' : 'bg-gray-200'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full mt-0.5 shadow transition-transform ${filters.with_photos ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                    </div>
                  </button>
                  <button
                    type="button"
                    onPointerDown={(e) => { e.stopPropagation(); setFilters({ pool: filters.pool ? undefined : true }) }}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm text-gray-700">{t('filters_pool', lang)}</span>
                    <div className={`w-11 h-6 rounded-full transition-colors ${filters.pool ? 'bg-blue-500' : 'bg-gray-200'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full mt-0.5 shadow transition-transform ${filters.pool ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                    </div>
                  </button>
                </div>
              </Section>

            </div>

            {/* Sticky footer */}
            <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100 flex gap-3 bg-white">
              <button
                type="button"
                onPointerDown={(e) => { e.stopPropagation(); doReset() }}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-medium text-gray-600 bg-white active:bg-gray-50"
              >
                {t('filters_reset', lang)}
              </button>
              <button
                type="button"
                onPointerDown={(e) => { e.stopPropagation(); closePanel() }}
                className="flex-1 py-3 rounded-2xl bg-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-1.5 active:bg-blue-600"
              >
                <Check className="w-4 h-4" />
                {t('filters_apply', lang)}
                {activeCount > 0 && (
                  <span className="bg-white/30 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {activeCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
