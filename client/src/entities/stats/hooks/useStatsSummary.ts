import { useQuery } from '@tanstack/react-query'
import { getStatsSummary, type StatsQueryParams } from '@/entities/stats/api/api'
import type { StatsSummary } from '@/entities/stats/model/types'

export const useStatsSummary = (params: StatsQueryParams, options?: { enabled?: boolean }) => {
    return useQuery<StatsSummary, Error>({
        queryKey: ['stats', 'summary', params],
        queryFn: ({ signal }) => getStatsSummary(params, signal),
        staleTime: 60_000,
        enabled: options?.enabled,
    })
}
