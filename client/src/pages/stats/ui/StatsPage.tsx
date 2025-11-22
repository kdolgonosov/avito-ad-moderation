import { useMemo, useRef, useState } from 'react'
import { Box, Button, CircularProgress, LinearProgress, Stack, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useCurrentModerator } from '@/entities/moderator/hooks/useCurrentModerator'
import { ModeratorHeader } from '@/entities/moderator/ui/ModeratorHeader'
import { StatsPeriod } from '@/entities/stats/model/types'
import { formatDateYMD } from '@/shared/lib/utils/format'
import { DateRangePicker } from '@/shared/ui'
import { useStatsData } from '../hooks/useStatsData'
import { StatCard } from './StatCard'
import { StatsActivityChart } from './StatsActivityChart'
import { StatsCategoriesChart } from './StatsCategoriesChart'
import { StatsDecisionsPieChart } from './StatsDecisionsPieChart'

export const StatsPage = () => {
    const [period, setPeriod] = useState<StatsPeriod>(StatsPeriod.Today)
    const { data: moderator } = useCurrentModerator()

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const [focusKey, setFocusKey] = useState(0)
    const [customRange, setCustomRange] = useState<[Date | null, Date | null]>([null, null])
    const [customFrom, customTo] = customRange

    const reportRef = useRef<HTMLDivElement | null>(null)

    const fromStr = period === StatsPeriod.Custom && customFrom ? formatDateYMD(customFrom) : undefined
    const toStr = period === StatsPeriod.Custom && customTo ? formatDateYMD(customTo) : undefined
    const isCustomIncomplete = period === StatsPeriod.Custom && (!customFrom || !customTo)

    const { summaryQuery, activityQuery, decisionsQuery, categoriesQuery, isInitialLoading, isAnyFetching } = useStatsData({
        period,
        from: fromStr,
        to: toStr,
    })

    const handlePeriodChange = (_: unknown, value: StatsPeriod | null) => {
        if (!value) return

        setPeriod(value)

        if (value === StatsPeriod.Custom) {
            setFocusKey(focusKey + 1) // триггерим фокус
        } else {
            setCustomRange([null, null]) // сброс диапазона
        }
    }

    const handleExportCsv = async () => {
        if (period === StatsPeriod.Custom && isCustomIncomplete) return

        const { exportStatsCsv } = await import('../lib/exportStatsCsv')

        await exportStatsCsv({
            period,
            summary: summaryQuery.data,
            decisions: decisionsQuery.data,
            categories: categoriesQuery.data,
            from: fromStr,
            to: toStr,
        })
    }
    const handleExportPdf = async () => {
        if (!reportRef.current) return
        if (!moderator) return
        if (period === StatsPeriod.Custom && isCustomIncomplete) return

        try {
            const { exportStatsPdf } = await import('../lib/exportStatsPdf')

            await exportStatsPdf({
                container: reportRef.current,
                moderatorInfo: `${moderator.name}, ${moderator.role}, ${moderator.email}`,
                period,
                from: fromStr,
                to: toStr,
            })
        } catch (error) {
            console.error('Ошибка при формировании PDF', error)
        }
    }
    // const handleExportPdf = async () => {
    //     if (!reportRef.current) return
    //     if (!moderator) return
    //     if (period === StatsPeriod.Custom && isCustomIncomplete) return

    //     try {
    //         await exportStatsPdf({
    //             container: reportRef.current,
    //             moderatorInfo: `${moderator.name}, ${moderator.role}, ${moderator.email}`,
    //             period,
    //             from: fromStr,
    //             to: toStr,
    //         })
    //     } catch (error) {
    //         console.error('Ошибка при формировании PDF', error)
    //     }
    // }

    // данные для чартов
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
    const isExportDisabled = isInitialLoading || (period === StatsPeriod.Custom && isCustomIncomplete) || !moderator

    return (
        <Box>
            <ModeratorHeader />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    mb: 3,
                    gap: 2,
                    flexWrap: 'wrap',
                }}
            >
                <Typography
                    variant='h5'
                    sx={{
                        fontSize: { xs: '1.3rem', sm: '1.5rem' },
                    }}
                >
                    Статистика
                </Typography>

                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 1.5, md: 2 }}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    flexWrap='wrap'
                    sx={{ width: { xs: '100%', md: 'auto' } }}
                >
                    <ToggleButtonGroup
                        size='small'
                        color='primary'
                        value={period}
                        exclusive
                        onChange={handlePeriodChange}
                        sx={{
                            flexWrap: 'wrap',
                        }}
                    >
                        <ToggleButton value={StatsPeriod.Today}>Сегодня</ToggleButton>
                        <ToggleButton value={StatsPeriod.Week}>7 дней</ToggleButton>
                        <ToggleButton value={StatsPeriod.Month}>30 дней</ToggleButton>
                        <ToggleButton value={StatsPeriod.Custom}>Период</ToggleButton>
                    </ToggleButtonGroup>

                    {period === StatsPeriod.Custom && (
                        <DateRangePicker
                            focusTrigger={focusKey}
                            value={{
                                start: customFrom,
                                end: customTo,
                            }}
                            onChange={({ start, end }) => {
                                setCustomRange([start, end])
                            }}
                        />
                    )}

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                        <Button variant='outlined' size='small' onClick={handleExportCsv} disabled={isExportDisabled || !summary} fullWidth={isMobile}>
                            Экспорт CSV
                        </Button>
                        <Button variant='outlined' size='small' onClick={handleExportPdf} disabled={isExportDisabled || !summary} fullWidth={isMobile}>
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
                                sm: 'repeat(4, minmax(0, 1fr))',
                            },
                            gap: 2,
                            mb: 3,
                        }}
                    >
                        <StatCard title='Всего проверено' value={summary?.totalReviewed ?? '—'} />
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
