export interface ModeratorStats {
    totalReviewed: number
    todayReviewed: number
    thisWeekReviewed: number
    thisMonthReviewed: number
    approvalRate: number
    averageReviewTime: number
}

export interface Moderator {
    id: number
    name: string
    email: string
    role: string
    permissions: string[]
    statistics: ModeratorStats
}
