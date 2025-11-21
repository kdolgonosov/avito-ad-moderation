import { useQuery } from '@tanstack/react-query'
import { getStatsSummary, type StatsQueryParams } from '@/entities/stats/api/api'
import type { StatsSummary } from '@/entities/stats/model/types'

export interface UseStatsSummaryParams extends StatsQueryParams {
    period: StatsQueryParams['period']
}

export const useStatsSummary = (params: UseStatsSummaryParams) => {
    return useQuery<StatsSummary, Error>({
        queryKey: ['stats', 'summary', params],
        queryFn: ({ signal }) => getStatsSummary(params, signal),
        staleTime: 60_000,
    })
}
