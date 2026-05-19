import { Heart } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { ListingCard } from '@/components/listing/ListingCard'
import { getFavorites } from '@/api/listings'
import { useStore } from '@/store'
import { useTelegram } from '@/hooks/useTelegram'

export function FavoritesPage({ onSelect }: { onSelect: (id: number) => void }) {
  const { favoriteIds } = useStore()
  const { user } = useTelegram()

  const { data: serverFavs = [], isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => getFavorites(user?.id ?? 0),
    enabled: !!user?.id,
    staleTime: 60_000,
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (serverFavs.length === 0 && favoriteIds.size === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
        <Heart className="w-16 h-16 mb-4 opacity-20" />
        <p className="font-medium text-gray-600">Нет избранных</p>
        <p className="text-sm mt-2">Нажмите ❤️ на любом объявлении</p>
      </div>
    )
  }

  // Merge server + local favorites (deduplicate by id)
  const combined = [...serverFavs]
  // Local-only favs have no data unless we fetched them — just show server ones for now

  return (
    <div className="p-4 pb-24">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Избранное</h2>
      <div className="grid grid-cols-2 gap-3">
        {combined.map((l) => (
          <ListingCard
            key={l.id}
            listing={l}
            compact
            onClick={() => onSelect(l.id)}
          />
        ))}
      </div>
    </div>
  )
}
