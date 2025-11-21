import { useStatsActivity } from '@/entities/stats/hooks/useStatsActivity'
import { useStatsCategories } from '@/entities/stats/hooks/useStatsCategories'
import { useStatsDecisions } from '@/entities/stats/hooks/useStatsDecisions'
import { useStatsSummary } from '@/entities/stats/hooks/useStatsSummary'
import type { StatsPeriod } from '@/entities/stats/model/types'

interface UseStatsDataParams {
    period: StatsPeriod
}

export const useStatsData = ({ period }: UseStatsDataParams) => {
    const queryParams = { period }

    const summaryQuery = useStatsSummary(queryParams)
    const activityQuery = useStatsActivity(queryParams)
    const decisionsQuery = useStatsDecisions(queryParams)
    const categoriesQuery = useStatsCategories(queryParams)

    const isInitialLoading = summaryQuery.isLoading && activityQuery.isLoading && decisionsQuery.isLoading && categoriesQuery.isLoading

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
