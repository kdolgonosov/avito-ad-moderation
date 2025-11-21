import { useMemo, useRef, useState } from 'react'
import { Box, Button, CircularProgress, LinearProgress, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import type { StatsPeriod } from '@/entities/stats/model/types'
import { useStatsData } from '../hooks/useStatsData'
import { exportStatsCsv } from '../lib/exportStatsCsv'
import { exportStatsPdf } from '../lib/exportStatsPdf'
import { StatCard } from './StatCard'
import { StatsActivityChart } from './StatsActivityChart'
import { StatsCategoriesChart } from './StatsCategoriesChart'
import { StatsDecisionsPieChart } from './StatsDecisionsPieChart'

export const StatsPage = () => {
    const [period, setPeriod] = useState<StatsPeriod>('today')
    const reportRef = useRef<HTMLDivElement | null>(null)
    const { summaryQuery, activityQuery, decisionsQuery, categoriesQuery, isInitialLoading, isAnyFetching } = useStatsData({ period })

    const handlePeriodChange = (_: unknown, value: StatsPeriod | null) => {
        if (!value) return
        setPeriod(value)
    }
    const handleExportCsv = () => {
        exportStatsCsv({
            period,
            summary: summaryQuery.data,
            decisions: decisionsQuery.data,
            categories: categoriesQuery.data,
        })
    }

    const handleExportPdf = async () => {
        if (!reportRef.current) return

        try {
            await exportStatsPdf({
                container: reportRef.current,
                period,
            })
        } catch (error) {
            console.error('Ошибка при формировании PDF', error)
        }
    }

    // Подготовка данных для чартов
    const activityChartData = useMemo(() => {
        if (!activityQuery.data || activityQuery.data.length === 0) return null

        return {
            xLabels: activityQuery.data.map(p => p.date),
            approved: activityQuery.data.map(p => p.approved),
            rejected: activityQuery.data.map(p => p.rejected),
            changes: activityQuery.data.map(p => p.requestChanges),
        }
    }, [activityQuery.data])

    const decisionsPieData = useMemo(() => {
        const d = decisionsQuery.data
        if (!d) return null
        const { approved, rejected, requestChanges } = d
        const total = approved + rejected + requestChanges
        if (!total) return null

        return [
            { id: 0, value: approved, label: 'Одобрено' },
            { id: 1, value: rejected, label: 'Отклонено' },
            { id: 2, value: requestChanges, label: 'На доработку' },
        ]
    }, [decisionsQuery.data])

    const categoriesChartData = useMemo(() => {
        const c = categoriesQuery.data
        if (!c || Object.keys(c).length === 0) return null

        const labels = Object.keys(c)
        const values = Object.values(c)

        return { labels, values }
    }, [categoriesQuery.data])

    const summary = summaryQuery.data

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    gap: 2,
                    flexWrap: 'wrap',
                }}
            >
                <Typography variant='h4'>Статистика модератора</Typography>

                <Stack direction='row' spacing={2} alignItems='center' flexWrap='wrap'>
                    <ToggleButtonGroup size='small' color='primary' value={period} exclusive onChange={handlePeriodChange}>
                        <ToggleButton value='today'>Сегодня</ToggleButton>
                        <ToggleButton value='week'>7 дней</ToggleButton>
                        <ToggleButton value='month'>30 дней</ToggleButton>
                    </ToggleButtonGroup>

                    <Stack direction='row' spacing={1}>
                        <Button variant='outlined' size='small' onClick={handleExportCsv}>
                            Экспорт CSV
                        </Button>
                        <Button variant='outlined' size='small' onClick={handleExportPdf}>
                            PDF отчёт
                        </Button>
                    </Stack>
                </Stack>
            </Box>

            {isAnyFetching && !isInitialLoading && <LinearProgress sx={{ mb: 2 }} />}

            {isInitialLoading && (
                <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            )}

            {!isInitialLoading && (
                <Box ref={reportRef}>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, minmax(0, 1fr))',
                                md: 'repeat(4, minmax(0, 1fr))',
                            },
                            gap: 2,
                            mb: 3,
                        }}
                    >
                        <StatCard title='Всего проверено' value={summary?.totalReviewed ?? '—'} />
                        <StatCard title='Сегодня' value={summary?.totalReviewedToday ?? '—'} />
                        <StatCard title='За 7 дней' value={summary?.totalReviewedThisWeek ?? '—'} />
                        <StatCard title='За 30 дней' value={summary?.totalReviewedThisMonth ?? '—'} />
                    </Box>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(3, minmax(0, 1fr))',
                            },
                            gap: 2,
                            mb: 3,
                        }}
                    >
                        <StatCard title='% одобрено' value={summary ? `${summary.approvedPercentage.toFixed(1)}%` : '—'} />
                        <StatCard title='% отклонено' value={summary ? `${summary.rejectedPercentage.toFixed(1)}%` : '—'} />
                        <StatCard title='% на доработку' value={summary ? `${summary.requestChangesPercentage.toFixed(1)}%` : '—'} />
                    </Box>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: '2fr 1fr',
                            },
                            gap: 3,
                            mb: 3,
                        }}
                    >
                        <StatsActivityChart activityChartData={activityChartData} />

                        <StatsDecisionsPieChart decisionsPieData={decisionsPieData} />
                    </Box>

                    <StatsCategoriesChart categoriesChartData={categoriesChartData} />
                </Box>
            )}
        </Box>
    )
}
