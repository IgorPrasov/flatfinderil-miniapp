import { create } from 'zustand'
import type { Listing, SearchFilters } from '@/types'

interface AppState {
  // Search
  filters: SearchFilters
  setFilters: (f: Partial<SearchFilters>) => void
  resetFilters: () => void

  // Compare
  compareList: Listing[]
  addToCompare: (l: Listing) => void
  removeFromCompare: (id: number) => void
  clearCompare: () => void

  // Favorites (local cache)
  favoriteIds: Set<number>
  toggleFavorite: (id: number) => void

  // Active tab
  activeTab: 'search' | 'map' | 'favorites' | 'calculator' | 'cabinet'
  setActiveTab: (t: AppState['activeTab']) => void
}

const defaultFilters: SearchFilters = {}

export const useStore = create<AppState>((set, get) => ({
  filters: defaultFilters,
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  resetFilters: () => set({ filters: defaultFilters }),

  compareList: [],
  addToCompare: (l) => {
    const cur = get().compareList
    if (cur.length >= 3 || cur.some((x) => x.id === l.id)) return
    set({ compareList: [...cur, l] })
  },
  removeFromCompare: (id) =>
    set((s) => ({ compareList: s.compareList.filter((l) => l.id !== id) })),
  clearCompare: () => set({ compareList: [] }),

  favoriteIds: new Set(),
  toggleFavorite: (id) =>
    set((s) => {
      const next = new Set(s.favoriteIds)
      next.has(id) ? next.delete(id) : next.add(id)
      return { favoriteIds: next }
    }),

  activeTab: 'search',
  setActiveTab: (t) => set({ activeTab: t }),
}))
