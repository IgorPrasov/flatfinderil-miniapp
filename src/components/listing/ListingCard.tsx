import { Heart, MapPin, BedDouble, Maximize2, AlertTriangle, Copy } from 'lucide-react'
import { clsx } from 'clsx'
import { useStore } from '@/store'
import { Badge } from '@/components/ui/Badge'
import type { Listing } from '@/types'

interface Props {
  listing: Listing
  onClick?: () => void
  compact?: boolean
}

export function ListingCard({ listing, onClick, compact }: Props) {
  const { favoriteIds, toggleFavorite, addToCompare, compareList } = useStore()
  const isFav = favoriteIds.has(listing.id)
  const inCompare = compareList.some((l) => l.id === listing.id)

  const photo = listing.photos?.find((p) => p.length > 20) ?? listing.photos?.[0]

  const price = listing.price
    ? listing.deal_type === 'rent'
      ? `₪${listing.price.toLocaleString()}/мес`
      : `₪${listing.price.toLocaleString()}`
    : 'Цена не указана'

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform"
      onClick={onClick}
    >
      {/* Photo */}
      <div className={clsx('relative bg-gray-100', compact ? 'h-36' : 'h-48')}>
        {photo ? (
          <img src={photo} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🏠</div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {listing.is_suspicious && (
            <Badge color="red">
              <AlertTriangle className="w-3 h-3 mr-1" /> Подозрительно
            </Badge>
          )}
          {listing.is_duplicate && (
            <Badge color="yellow">
              <Copy className="w-3 h-3 mr-1" /> Дубль
            </Badge>
          )}
          {listing.poster_type === 'private' && <Badge color="green">Частник</Badge>}
          {listing.poster_type === 'agent' && <Badge color="blue">Агент</Badge>}
        </div>

        {/* Favorite button */}
        <button
          className={clsx(
            'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center',
            isFav ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-500'
          )}
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(listing.id)
          }}
        >
          <Heart className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
        </button>

        {/* AI Score */}
        {listing.ai_score != null && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
            AI {listing.ai_score}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-bold text-lg text-gray-900 leading-tight">
            {price}
          </p>
          {listing.ai_valuation && listing.price && listing.ai_valuation < listing.price * 0.9 && (
            <Badge color="yellow">Переоценено</Badge>
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{listing.city}{listing.district ? `, ${listing.district}` : ''}</span>
        </div>

        {!compact && (
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
            {listing.rooms && (
              <span className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5" /> {listing.rooms} к
              </span>
            )}
            {listing.area && (
              <span className="flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5" /> {listing.area} м²
              </span>
            )}
            {listing.floor && listing.floors_total && (
              <span className="text-gray-400">{listing.floor}/{listing.floors_total} эт</span>
            )}
          </div>
        )}

        {/* Compare toggle */}
        {!compact && (
          <button
            className={clsx(
              'mt-2 text-xs px-2 py-1 rounded-lg transition-colors',
              inCompare ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
            )}
            onClick={(e) => {
              e.stopPropagation()
              addToCompare(listing)
            }}
          >
            {inCompare ? '✓ В сравнении' : '+ Сравнить'}
          </button>
        )}
      </div>
    </div>
  )
}
