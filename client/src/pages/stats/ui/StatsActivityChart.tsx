import { Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material'
import { BarChart } from '@mui/x-charts'

interface StatsActivityChartProps {
    activityChartData: {
        xLabels: string[]
        approved: number[]
        rejected: number[]
        changes: number[]
    } | null
}

export const StatsActivityChart = ({ activityChartData }: StatsActivityChartProps) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const chartHeight = isMobile ? 220 : 260

    return (
        <Card sx={{ minHeight: { xs: 260, sm: 320 } }}>
            <CardContent
                sx={{
                    py: { xs: 1.5, sm: 2 },
                    px: { xs: 1.5, sm: 2 },
                }}
            >
                <Typography
                    variant='h6'
                    gutterBottom
                    sx={{
                        fontSize: { xs: 16, sm: 18 },
                    }}
                >
                    Активность по дням
                </Typography>

                {!activityChartData && (
                    <Typography variant='body2' color='text.secondary'>
                        Нет данных за выбранный период.
                    </Typography>
                )}

                {activityChartData && (
                    <BarChart
                        height={chartHeight}
                        xAxis={[
                            {
                                data: activityChartData.xLabels,
                                scaleType: 'band',
                            },
                        ]}
                        series={[
                            {
                                data: activityChartData.approved,
                                label: 'Одобрено',
                                color: theme.palette.success.main,
                            },
                            {
                                data: activityChartData.rejected,
                                label: 'Отклонено',
                                color: theme.palette.error.main,
                            },
                            {
                                data: activityChartData.changes,
                                label: 'На доработку',
                                color: theme.palette.warning.main,
                            },
                        ]}
                        margin={{
                            top: 16,
                            right: isMobile ? 10 : 20,
                            bottom: isMobile ? 30 : 40,
                            left: isMobile ? 30 : 40,
                        }}
                    />
                )}
            </CardContent>
        </Card>
    )
}
