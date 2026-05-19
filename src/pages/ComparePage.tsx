import { X } from 'lucide-react'
import { useStore } from '@/store'

function Row({ label, values }: { label: string; values: (string | number | boolean | undefined)[] }) {
  const allSame = values.every((v) => v === values[0])
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `120px repeat(${values.length}, 1fr)` }}>
      <div className="text-xs text-gray-400 self-center">{label}</div>
      {values.map((v, i) => (
        <div
          key={i}
          className={`text-sm font-medium py-2 px-2 rounded-lg text-center ${
            !allSame && v != null ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'
          }`}
        >
          {v == null ? '—' : typeof v === 'boolean' ? (v ? '✅' : '❌') : String(v)}
        </div>
      ))}
    </div>
  )
}

export function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useStore()

  if (compareList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
        <p className="text-5xl mb-4">📊</p>
        <p className="font-medium text-gray-600">Нет объявлений для сравнения</p>
        <p className="text-sm mt-2">Добавляйте до 3 квартир из поиска</p>
      </div>
    )
  }

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Сравнение</h2>
        <button onClick={clearCompare} className="text-sm text-red-500">
          Очистить
        </button>
      </div>

      {/* Photo row */}
      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: `120px repeat(${compareList.length}, 1fr)` }}>
        <div />
        {compareList.map((l) => {
          const photo = l.photos?.find((p) => p.length > 20)
          return (
            <div key={l.id} className="relative">
              <div className="h-24 rounded-xl overflow-hidden bg-gray-100">
                {photo ? (
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>
                )}
              </div>
              <button
                onClick={() => removeFromCompare(l.id)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
              <p className="text-xs text-gray-500 mt-1 truncate">{l.city}</p>
            </div>
          )
        })}
      </div>

      {/* Comparison rows */}
      <div className="space-y-2">
        <Row label="Цена ₪" values={compareList.map((l) => l.price?.toLocaleString())} />
        <Row label="Комнаты" values={compareList.map((l) => l.rooms)} />
        <Row label="Площадь м²" values={compareList.map((l) => l.area)} />
        <Row label="Этаж" values={compareList.map((l) => l.floor)} />
        <Row label="Тип" values={compareList.map((l) => l.property_type)} />
        <Row label="Парковка" values={compareList.map((l) => l.parking)} />
        <Row label="Бассейн" values={compareList.map((l) => l.pool)} />
        <Row label="Продавец" values={compareList.map((l) => l.poster_type === 'private' ? 'Частник' : 'Агент')} />
        <Row label="AI оценка ₪" values={compareList.map((l) => l.ai_valuation?.toLocaleString())} />
        <Row label="Подозрительно" values={compareList.map((l) => l.is_suspicious)} />
        <Row label="Дубль" values={compareList.map((l) => l.is_duplicate)} />
      </div>
    </div>
  )
}
