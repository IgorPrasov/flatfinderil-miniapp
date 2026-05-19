import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft, Heart, Phone, Calendar,
  MapPin, AlertTriangle, Copy, TrendingUp,
  CheckCircle, ChevronLeft, ChevronRight, GitCompare
} from 'lucide-react'
import { getListing, getListingAI, bookViewing } from '@/api/listings'
import { useStore } from '@/store'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useTelegram } from '@/hooks/useTelegram'

interface Props {
  listingId: number
  onBack: () => void
}

export function ListingDetailPage({ listingId, onBack }: Props) {
  const { favoriteIds, toggleFavorite, addToCompare, compareList } = useStore()
  const { user, haptic, notify, webapp } = useTelegram()
  const [photoIdx, setPhotoIdx] = useState(0)
  const [showBooking, setShowBooking] = useState(false)
  const [bookDate, setBookDate] = useState('')
  const [bookMsg, setBookMsg] = useState('')
  const [bookLoading, setBookLoading] = useState(false)
  const [bookDone, setBookDone] = useState(false)

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => getListing(listingId),
  })

  const { data: ai } = useQuery({
    queryKey: ['listing-ai', listingId],
    queryFn: () => getListingAI(listingId),
    enabled: !!listing,
    staleTime: 5 * 60_000,
  })

  const isFav = favoriteIds.has(listingId)
  const inCompare = compareList.some((l) => l.id === listingId)
  const photos = listing?.photos?.filter((p) => p.length > 20) ?? []

  useEffect(() => {
    setPhotoIdx(0)
  }, [listingId])

  async function handleBookViewing() {
    if (!listing || !bookDate) return
    setBookLoading(true)
    try {
      await bookViewing({ listing_id: listingId, user_id: user?.id ?? 0, date: bookDate, message: bookMsg })
      setBookDone(true)
      notify('success')
    } catch {
      notify('error')
    } finally {
      setBookLoading(false)
    }
  }

  function handleContact() {
    haptic('medium')
    if (listing?.poster_username) {
      webapp?.openTelegramLink(`https://t.me/${listing.poster_username}`)
    } else if (listing?.poster_phone) {
      webapp?.openLink(`tel:${listing.poster_phone}`)
    }
  }

  if (isLoading || !listing) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const priceDiff = ai?.valuation && listing.price
    ? Math.round(((listing.price - ai.valuation) / ai.valuation) * 100)
    : null

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24">
      {/* Photos */}
      <div className="relative h-64 bg-gray-100 shrink-0">
        {photos.length > 0 ? (
          <>
            <img
              src={photos[photoIdx]}
              alt=""
              className="w-full h-full object-cover"
            />
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setPhotoIdx((i) => Math.max(0, i - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center"
                  disabled={photoIdx === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPhotoIdx((i) => Math.min(photos.length - 1, i + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center"
                  disabled={photoIdx === photos.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {photos.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${i === photoIdx ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🏠</div>
        )}

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3">
          <button
            onClick={onBack}
            className="w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => { haptic(); toggleFavorite(listingId) }}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${isFav ? 'bg-red-500 text-white' : 'bg-black/40 text-white'}`}
            >
              <Heart className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Title + price */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <p className="text-2xl font-bold text-gray-900">
              ₪{listing.price?.toLocaleString()}
              {listing.deal_type === 'rent' && <span className="text-sm text-gray-400 font-normal">/мес</span>}
            </p>
            <div className="flex flex-col items-end gap-1">
              {listing.is_suspicious && <Badge color="red"><AlertTriangle className="w-3 h-3 mr-1" />Подозрительно</Badge>}
              {listing.is_duplicate && <Badge color="yellow"><Copy className="w-3 h-3 mr-1" />Дубль</Badge>}
              {!listing.is_suspicious && !listing.is_duplicate && <Badge color="green"><CheckCircle className="w-3 h-3 mr-1" />Проверено</Badge>}
            </div>
          </div>

          {listing.address && (
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {listing.address}
            </div>
          )}
          {!listing.address && (
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {listing.city}{listing.district ? `, ${listing.district}` : ''}
            </div>
          )}
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-3 gap-3">
          {listing.rooms && (
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-gray-900">{listing.rooms}</p>
              <p className="text-xs text-gray-500 mt-0.5">комнат</p>
            </div>
          )}
          {listing.area && (
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-gray-900">{listing.area}</p>
              <p className="text-xs text-gray-500 mt-0.5">м²</p>
            </div>
          )}
          {listing.floor != null && (
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-gray-900">{listing.floor}{listing.floors_total ? `/${listing.floors_total}` : ''}</p>
              <p className="text-xs text-gray-500 mt-0.5">этаж</p>
            </div>
          )}
        </div>

        {/* AI Valuation */}
        {ai?.valuation && (
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <p className="text-sm font-semibold text-purple-700">AI Оценка рынка</p>
            </div>
            <p className="text-lg font-bold text-purple-900">
              ₪{ai.valuation.toLocaleString()}
              {listing.deal_type === 'rent' && <span className="text-sm font-normal text-purple-600">/мес</span>}
            </p>
            {priceDiff !== null && (
              <p className={`text-sm mt-1 ${priceDiff > 10 ? 'text-red-600' : priceDiff < -10 ? 'text-green-600' : 'text-gray-600'}`}>
                {priceDiff > 10
                  ? `⚠️ Завышено на ${priceDiff}% от рыночной цены`
                  : priceDiff < -10
                  ? `✅ Ниже рынка на ${Math.abs(priceDiff)}% — выгодное предложение`
                  : '✅ Соответствует рыночной цене'}
              </p>
            )}
          </div>
        )}

        {/* Suspicious warning */}
        {listing.is_suspicious && listing.suspicion_reason && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <p className="text-sm font-semibold text-red-700">Подозрительное объявление</p>
            </div>
            <p className="text-sm text-red-600">{listing.suspicion_reason}</p>
          </div>
        )}

        {/* Description */}
        {listing.description && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Описание</p>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
          </div>
        )}

        {/* Infrastructure */}
        {listing.infrastructure && listing.infrastructure.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Удобства</p>
            <div className="flex flex-wrap gap-2">
              {listing.infrastructure.map((item) => (
                <span key={item} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Poster */}
        {(listing.poster_name || listing.poster_type) && (
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">Продавец</p>
            <p className="font-medium text-gray-800">{listing.poster_name ?? (listing.poster_type === 'agent' ? 'Агент' : 'Частное лицо')}</p>
            {listing.poster_type && (
              <Badge color={listing.poster_type === 'private' ? 'green' : 'blue'} className="mt-1">
                {listing.poster_type === 'private' ? 'Частник' : 'Агент'}
              </Badge>
            )}
          </div>
        )}

        {/* Compare button */}
        <button
          onClick={() => { haptic(); listing && addToCompare(listing) }}
          className={`w-full py-2.5 rounded-xl text-sm font-medium border transition-colors ${
            inCompare ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600'
          }`}
        >
          <GitCompare className="w-4 h-4 inline mr-2" />
          {inCompare ? 'Убрать из сравнения' : 'Добавить к сравнению'}
        </button>
      </div>

      {/* Action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 safe-bottom flex gap-3">
        <Button
          variant="secondary"
          onClick={() => setShowBooking(true)}
          className="flex-1"
        >
          <Calendar className="w-4 h-4" />
          Просмотр
        </Button>
        <Button
          onClick={handleContact}
          className="flex-1"
        >
          <Phone className="w-4 h-4" />
          Связаться
        </Button>
      </div>

      {/* Booking modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowBooking(false)} />
          <div className="relative w-full bg-white rounded-t-3xl p-5">
            <h3 className="text-lg font-semibold mb-4">📅 Записаться на просмотр</h3>
            {bookDone ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="font-medium text-gray-800">Запрос отправлен!</p>
                <p className="text-sm text-gray-500 mt-1">Владелец свяжется с вами</p>
                <Button className="mt-4 w-full" onClick={() => { setShowBooking(false); setBookDone(false) }}>
                  Готово
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="text-sm text-gray-500 mb-1 block">Дата и время</label>
                  <input
                    type="datetime-local"
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <div className="mb-4">
                  <label className="text-sm text-gray-500 mb-1 block">Сообщение (необязательно)</label>
                  <textarea
                    value={bookMsg}
                    onChange={(e) => setBookMsg(e.target.value)}
                    placeholder="Удобное время, вопросы..."
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none"
                  />
                </div>
                <Button
                  onClick={handleBookViewing}
                  loading={bookLoading}
                  disabled={!bookDate}
                  size="lg"
                >
                  Отправить запрос
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
