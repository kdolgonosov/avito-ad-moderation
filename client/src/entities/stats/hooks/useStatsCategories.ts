import { useQuery } from '@tanstack/react-query'
import { getStatsCategories, type StatsQueryParams } from '@/entities/stats/api/api'
import type { UseStatsSummaryParams } from '@/entities/stats/hooks/useStatsSummary'
import type { CategoriesChartData } from '@/entities/stats/model/types'

/**
 * Хук для загрузки распределения по категориям (/stats/chart/categories)
 */
export const useStatsCategories = (params: UseStatsSummaryParams) => {
    return useQuery<CategoriesChartData, Error>({
        queryKey: ['stats', 'categories', params],
        queryFn: ({ signal }) => getStatsCategories(params as StatsQueryParams, signal),
        staleTime: 60_000,
    })
}
