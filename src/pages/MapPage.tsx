import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { searchListings } from '@/api/listings'
import { useStore } from '@/store'
import { useTelegram } from '@/hooks/useTelegram'
import { t } from '@/i18n'
import type { Listing } from '@/types'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function makeIcon(price: number, suspicious: boolean, duplicate: boolean) {
  const color = suspicious ? '#ef4444' : duplicate ? '#f59e0b' : '#3b82f6'
  const label = price > 0
    ? price >= 1_000_000 ? `₪${(price / 1_000_000).toFixed(1)}M` : `₪${Math.round(price / 1000)}K`
    : '?'
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};color:#fff;border:2px solid white;border-radius:20px;padding:2px 8px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${label}</div>`,
    iconAnchor: [24, 16],
  })
}

function FitBounds({ listings }: { listings: Listing[] }) {
  const map = useMap()
  useEffect(() => {
    const pts = listings.filter((l) => l.lat && l.lng).map((l) => [l.lat!, l.lng!] as [number, number])
    if (pts.length > 0) map.fitBounds(pts, { padding: [40, 40], maxZoom: 14 })
  }, [listings, map])
  return null
}

export function MapPage({ onSelect }: { onSelect: (id: number) => void }) {
  const { filters } = useStore()
  const { lang } = useTelegram()

  const { data, isLoading } = useQuery({
    queryKey: ['listings', filters],
    queryFn: () => searchListings(filters, 0, 500),
    staleTime: 60_000,
  })
  const listings = data?.listings ?? []

  const geoListings = listings.filter((l) => l.lat && l.lng)

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/50">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <MapContainer center={[32.0853, 34.7818]} zoom={10} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
        {geoListings.length > 0 && <FitBounds listings={geoListings} />}
        {geoListings.map((l) => (
          <Marker
            key={l.id}
            position={[l.lat!, l.lng!]}
            icon={makeIcon(l.price, !!l.is_suspicious, !!l.is_duplicate)}
            eventHandlers={{ click: () => onSelect(l.id) }}
          >
            <Popup closeButton={false} offset={[0, -10]}>
              <div className="text-sm">
                <p className="font-bold">₪{l.price?.toLocaleString()}</p>
                <p className="text-gray-500">{l.city}</p>
                {l.rooms && <p>{l.rooms} {t('card_rooms', lang)}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute top-4 left-4 z-10 bg-white rounded-xl px-3 py-1.5 shadow-md text-sm font-medium text-gray-700">
        📍 {geoListings.length} {t('map_on_map', lang)}
      </div>
    </div>
  )
}
