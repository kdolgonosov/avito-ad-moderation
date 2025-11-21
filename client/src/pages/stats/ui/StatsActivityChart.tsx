import { Card, CardContent, Typography } from '@mui/material'
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
    return (
        <Card sx={{ minHeight: 320 }}>
            <CardContent>
                <Typography variant='h6' gutterBottom>
                    Активность по дням
                </Typography>
                {!activityChartData && (
                    <Typography variant='body2' color='text.secondary'>
                        Нет данных за выбранный период.
                    </Typography>
                )}
                {activityChartData && (
                    <BarChart
                        height={260}
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
                            },
                            {
                                data: activityChartData.rejected,
                                label: 'Отклонено',
                            },
                            {
                                data: activityChartData.changes,
                                label: 'На доработку',
                            },
                        ]}
                        margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
                    />
                )}
            </CardContent>
        </Card>
    )
}
