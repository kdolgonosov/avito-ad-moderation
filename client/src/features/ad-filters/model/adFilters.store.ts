import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AdStatus } from '@/entities/ad/model/types'
import { INITIAL_FILTERS } from './constants'
import type { AdSortBy, AdSortOrder } from './types'

type FiltersValues = {
    status: AdStatus[]
    categoryId: number | null
    minPrice: number | null
    maxPrice: number | null
    search: string

    sortBy: AdSortBy
    sortOrder: AdSortOrder
}

export interface AdFiltersState extends FiltersValues {
    setStatus: (statuses: AdStatus[]) => void
    toggleStatus: (status: AdStatus) => void
    setCategoryId: (id: number | null) => void
    setPriceRange: (min: number | null, max: number | null) => void
    setSearch: (value: string) => void
    setSort: (sortBy: AdSortBy, sortOrder: AdSortOrder) => void
    setFilters: (next: FiltersValues) => void
    resetFilters: () => void
}

export const useAdFiltersStore = create<AdFiltersState>()(
    persist(
        set => ({
            ...INITIAL_FILTERS,
            setStatus: status => set({ status }),

            toggleStatus: status =>
                set(state => {
                    const exists = state.status.includes(status)
                    const next = exists ? state.status.filter(s => s !== status) : [...state.status, status]
                    return { status: next }
                }),

            setCategoryId: categoryId => set({ categoryId }),

            setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),

            setSearch: search => set({ search }),

            setSort: (sortBy, sortOrder) => set({ sortBy, sortOrder }),

            setFilters: next => set({ ...next }),

            resetFilters: () => set(INITIAL_FILTERS),
        }),
        {
            name: 'ad-filters',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
