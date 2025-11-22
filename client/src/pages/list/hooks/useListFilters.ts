import { useEffect, useMemo } from 'react'
import { parseFiltersAndPageFromSearchParams } from '@/features/ad-filters/lib/urlState'
import { useAdFiltersStore } from '@/features/ad-filters/model/adFilters.store'
import type { AdFiltersValues, AdsListFilters } from '@/features/ad-filters/model/types'
import { useDebouncedValue } from '@/shared/lib/hooks/useDebouncedValue'

let lastInitKey: string | null = null

export const useListFilters = (searchParams: URLSearchParams) => {
    const { status, categoryId, minPrice, maxPrice, search, sortBy, sortOrder, setFilters } = useAdFiltersStore()

    // Инициализация фильтров из URL один раз для конкретной строки параметров
    useEffect(() => {
        const key = searchParams.toString()
        if (!key) return

        if (lastInitKey === key) return
        lastInitKey = key

        const { filters } = parseFiltersAndPageFromSearchParams(searchParams)
        setFilters(filters)
    }, [searchParams, setFilters])

    // Значения для UI
    const uiFilters: AdFiltersValues = useMemo(
        () => ({
            status,
            categoryId,
            minPrice,
            maxPrice,
            search,
            sortBy,
            sortOrder,
        }),
        [status, categoryId, minPrice, maxPrice, search, sortBy, sortOrder]
    )

    const debouncedSearch = useDebouncedValue(search, 500)
    const debouncedMinPrice = useDebouncedValue(minPrice, 500)
    const debouncedMaxPrice = useDebouncedValue(maxPrice, 500)

    const normalizedSearch = debouncedSearch.trim()
    const searchForApi = normalizedSearch.length >= 2 ? normalizedSearch : ''

    // Значения для запроса в API
    const apiFilters: AdsListFilters = useMemo(
        () => ({
            search: searchForApi || undefined,
            status: status.length ? status : undefined,
            categoryId: categoryId ?? undefined,
            minPrice: debouncedMinPrice ?? undefined,
            maxPrice: debouncedMaxPrice ?? undefined,
            sortBy,
            sortOrder,
        }),
        [searchForApi, status, categoryId, debouncedMinPrice, debouncedMaxPrice, sortBy, sortOrder]
    )

    // Ключ, по которому будем сбрасывать страницу и счётчики новых объявлений
    const filtersResetKey = useMemo(
        () => JSON.stringify([status, categoryId, debouncedMinPrice ?? null, debouncedMaxPrice ?? null, searchForApi, sortBy, sortOrder]),
        [status, categoryId, debouncedMinPrice, debouncedMaxPrice, searchForApi, sortBy, sortOrder]
    )

    return {
        uiFilters,
        apiFilters,
        filtersResetKey,
        setFilters,
    }
}
