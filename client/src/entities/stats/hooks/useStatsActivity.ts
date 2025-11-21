import { useQuery } from '@tanstack/react-query'
import { getStatsActivity, type StatsQueryParams } from '@/entities/stats/api/api'
import type { UseStatsSummaryParams } from '@/entities/stats/hooks/useStatsSummary'
import type { ActivityDataPoint } from '@/entities/stats/model/types'

/**
 * Хук для загрузки данных графика активности (/stats/chart/activity)
 */
export const useStatsActivity = (params: UseStatsSummaryParams) => {
    return useQuery<ActivityDataPoint[], Error>({
        queryKey: ['stats', 'activity', params],
        queryFn: ({ signal }) => getStatsActivity(params as StatsQueryParams, signal),
        staleTime: 60_000,
    })
}
