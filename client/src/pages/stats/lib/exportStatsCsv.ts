import type { CategoriesChartData, DecisionsData, StatsPeriod, StatsSummary } from '@/entities/stats/model/types'
import { PERIOD_LABELS } from '../model/constants'

interface ExportCsvParams {
    period: StatsPeriod
    summary?: StatsSummary
    decisions?: DecisionsData
    categories?: CategoriesChartData
}

export const exportStatsCsv = ({ period, summary, decisions, categories }: ExportCsvParams) => {
    const lines: string[] = []

    lines.push(`Период;${PERIOD_LABELS[period]}`)
    lines.push('')

    if (summary) {
        lines.push('Общая статистика')
        lines.push(['Всего проверено', 'Сегодня', 'За неделю', 'За месяц', '% одобрено', '% отклонено', '% на доработку', 'Среднее время проверки'].join(';'))
        lines.push(
            [
                summary.totalReviewed,
                summary.totalReviewedToday,
                summary.totalReviewedThisWeek,
                summary.totalReviewedThisMonth,
                summary.approvedPercentage,
                summary.rejectedPercentage,
                summary.requestChangesPercentage,
                summary.averageReviewTime,
            ].join(';')
        )
        lines.push('')
    }

    if (decisions) {
        lines.push('Распределение решений')
        lines.push('Одобрено;Отклонено;На доработку')
        lines.push([decisions.approved, decisions.rejected, decisions.requestChanges].join(';'))
        lines.push('')
    }

    if (categories && Object.keys(categories).length > 0) {
        lines.push('По категориям')
        lines.push('Категория;Количество')
        Object.entries(categories).forEach(([name, value]) => {
            lines.push(`${name};${value}`)
        })
    }

    const csvContent = lines.join('\n')
    const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `moderation-stats-${period}.csv`
    link.click()

    URL.revokeObjectURL(url)
}
