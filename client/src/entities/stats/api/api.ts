import qs from 'qs'
import type { ActivityDataPoint, CategoriesChartData, DecisionsData, StatsPeriod, StatsSummary } from '@/entities/stats/model/types'
import { apiClient } from '@/shared/api/client'

export interface StatsQueryParams {
    period?: StatsPeriod
    startDate?: string // YYYY-MM-DD
    endDate?: string // YYYY-MM-DD
}

const STATS_PATH = '/stats'

/**
 * GET /stats/summary
 */
export const getStatsSummary = async (params: StatsQueryParams, signal?: AbortSignal): Promise<StatsSummary> => {
    const { data } = await apiClient.get<StatsSummary>(`${STATS_PATH}/summary`, {
        params,
        signal,
        paramsSerializer: params => qs.stringify(params, { skipNulls: true }),
    })
    return data
}

/**
 * GET /stats/chart/activity
 */
export const getStatsActivity = async (params: StatsQueryParams, signal?: AbortSignal): Promise<ActivityDataPoint[]> => {
    const { data } = await apiClient.get<ActivityDataPoint[]>(`${STATS_PATH}/chart/activity`, {
        params,
        signal,
        paramsSerializer: params => qs.stringify(params, { skipNulls: true }),
    })
    return data
}

/**
 * GET /stats/chart/decisions
 */
export const getStatsDecisions = async (params: StatsQueryParams, signal?: AbortSignal): Promise<DecisionsData> => {
    const { data } = await apiClient.get<DecisionsData>(`${STATS_PATH}/chart/decisions`, {
        params,
        signal,
        paramsSerializer: params => qs.stringify(params, { skipNulls: true }),
    })
    return data
}

/**
 * GET /stats/chart/categories
 */
export const getStatsCategories = async (params: StatsQueryParams, signal?: AbortSignal): Promise<CategoriesChartData> => {
    const { data } = await apiClient.get<CategoriesChartData>(`${STATS_PATH}/chart/categories`, {
        params,
        signal,
        paramsSerializer: params => qs.stringify(params, { skipNulls: true }),
    })
    return data
}
