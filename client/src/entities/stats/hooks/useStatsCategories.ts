import { useQuery } from '@tanstack/react-query'
import { getStatsCategories, type StatsQueryParams } from '@/entities/stats/api/api'
import type { CategoriesChartData } from '@/entities/stats/model/types'

/**
 * Хук для загрузки распределения по категориям (/stats/chart/categories)
 */
export const useStatsCategories = (params: StatsQueryParams, options?: { enabled?: boolean }) => {
    return useQuery<CategoriesChartData, Error>({
        queryKey: ['stats', 'categories', params],
        queryFn: ({ signal }) => getStatsCategories(params as StatsQueryParams, signal),
        staleTime: 60_000,
        enabled: options?.enabled,
    })
}
