import { useStatsActivity } from '@/entities/stats/hooks/useStatsActivity'
import { useStatsCategories } from '@/entities/stats/hooks/useStatsCategories'
import { useStatsDecisions } from '@/entities/stats/hooks/useStatsDecisions'
import { useStatsSummary } from '@/entities/stats/hooks/useStatsSummary'
import { StatsPeriod } from '@/entities/stats/model/types'

interface UseStatsDataParams {
    period: StatsPeriod
    from?: string | null
    to?: string | null
}

export const useStatsData = ({ period, from, to }: UseStatsDataParams) => {
    const isCustom = period === StatsPeriod.Custom

    // теперь точно boolean
    const hasValidRange = !isCustom || (!!from && !!to)
    const enabled = hasValidRange

    const queryParams = isCustom && from && to ? { period, from, to } : { period }

    const options = { enabled }

    const summaryQuery = useStatsSummary(queryParams, options)
    const activityQuery = useStatsActivity(queryParams, options)
    const decisionsQuery = useStatsDecisions(queryParams, options)
    const categoriesQuery = useStatsCategories(queryParams, options)

    const isInitialLoading = enabled && summaryQuery.isLoading && activityQuery.isLoading && decisionsQuery.isLoading && categoriesQuery.isLoading

    const isAnyFetching = summaryQuery.isFetching || activityQuery.isFetching || decisionsQuery.isFetching || categoriesQuery.isFetching

    return {
        summaryQuery,
        activityQuery,
        decisionsQuery,
        categoriesQuery,
        isInitialLoading,
        isAnyFetching,
    }
}
