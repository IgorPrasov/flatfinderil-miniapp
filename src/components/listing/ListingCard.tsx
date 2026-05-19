import { Heart, MapPin, AlertTriangle, Copy } from 'lucide-react'
import { clsx } from 'clsx'
import { useStore } from '@/store'
import { useTelegram } from '@/hooks/useTelegram'
import { Badge } from '@/components/ui/Badge'
import { t } from '@/i18n'
import type { Listing } from '@/types'

interface Props {
  listing: Listing
  onClick?: () => void
  compact?: boolean
}

export function ListingCard({ listing, onClick, compact }: Props) {
  const { favoriteIds, toggleFavorite, addToCompare, compareList } = useStore()
  const { lang, haptic } = useTelegram()
  const isFav = favoriteIds.has(listing.id)
  const inCompare = compareList.some((l) => l.id === listing.id)

  const photo = listing.photos?.find((p) => p.length > 20) ?? listing.photos?.[0]

  const price = listing.price
    ? listing.deal_type === 'rent'
      ? `₪${listing.price.toLocaleString()}${t('card_per_month', lang)}`
      : `₪${listing.price.toLocaleString()}`
    : '—'

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
              <AlertTriangle className="w-3 h-3 mr-1" />
              {t('card_suspicious', lang)}
            </Badge>
          )}
          {listing.is_duplicate && (
            <Badge color="yellow">
              <Copy className="w-3 h-3 mr-1" />
              {t('card_duplicate', lang)}
            </Badge>
          )}
          {listing.poster_type === 'private' && <Badge color="green">{t('card_private', lang)}</Badge>}
          {listing.poster_type === 'agent' && <Badge color="blue">{t('card_agent', lang)}</Badge>}
        </div>

        {/* Favorite */}
        <button
          className={clsx(
            'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center',
            isFav ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-500'
          )}
          onClick={(e) => {
            e.stopPropagation()
            haptic()
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
          <p className="font-bold text-lg text-gray-900 leading-tight">{price}</p>
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{listing.city}{listing.district ? `, ${listing.district}` : ''}</span>
        </div>

        {!compact && (
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
            {listing.rooms && (
              <span>{listing.rooms} {t('card_rooms', lang)}</span>
            )}
            {listing.area && <span>{listing.area} м²</span>}
            {listing.floor != null && listing.floors_total && (
              <span className="text-gray-400">{listing.floor}/{listing.floors_total} {t('card_floor', lang)}</span>
            )}
          </div>
        )}

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
            {inCompare ? t('card_compare_in', lang) : t('card_compare_add', lang)}
          </button>
        )}
      </div>
    </div>
  )
}
