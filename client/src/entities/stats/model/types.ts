export const StatsPeriod = {
    Today: 'today',
    Week: 'week',
    Month: 'month',
    Custom: 'custom',
} as const
export type StatsPeriod = (typeof StatsPeriod)[keyof typeof StatsPeriod]

export interface StatsSummary {
    totalReviewed: number
    totalReviewedToday: number
    totalReviewedThisWeek: number
    totalReviewedThisMonth: number
    approvedPercentage: number
    rejectedPercentage: number
    requestChangesPercentage: number
    averageReviewTime: number
}

export interface ActivityDataPoint {
    date: string
    approved: number
    rejected: number
    requestChanges: number
}

/**
 * Ответ /stats/chart/decisions
 */
export interface DecisionsData {
    approved: number
    rejected: number
    requestChanges: number
}

/**
 * Ответ /stats/chart/categories
 * Ключ – название категории, значение – количество
 */
export type CategoriesChartData = Record<string, number>

/**
 * Параметры периода для запросов статистики
 */
export interface StatsQueryParams {
    period?: StatsPeriod
    startDate?: string
    endDate?: string
}
