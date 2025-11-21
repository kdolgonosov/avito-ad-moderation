import { useQuery } from '@tanstack/react-query'
import { getStatsDecisions, type StatsQueryParams } from '@/entities/stats/api/api'
import type { UseStatsSummaryParams } from '@/entities/stats/hooks/useStatsSummary'
import type { DecisionsData } from '@/entities/stats/model/types'

/**
 * Хук для загрузки распределения решений (/stats/chart/decisions)
 */
export const useStatsDecisions = (params: UseStatsSummaryParams) => {
    return useQuery<DecisionsData, Error>({
        queryKey: ['stats', 'decisions', params],
        queryFn: ({ signal }) => getStatsDecisions(params as StatsQueryParams, signal),
        staleTime: 60_000,
    })
}
