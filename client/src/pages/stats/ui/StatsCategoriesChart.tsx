import { Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material'
import { BarChart } from '@mui/x-charts'

interface StatsCategoriesChartProps {
    categoriesChartData: {
        labels: string[]
        values: number[]
    } | null
}

export const StatsCategoriesChart = ({ categoriesChartData }: StatsCategoriesChartProps) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const chartHeight = isMobile ? 240 : 320

    return (
        <Card sx={{ mb: 3 }}>
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
                    Проверенные объявления по категориям
                </Typography>

                {!categoriesChartData && (
                    <Typography variant='body2' color='text.secondary'>
                        Нет данных за выбранный период.
                    </Typography>
                )}

                {categoriesChartData && (
                    <BarChart
                        height={chartHeight}
                        xAxis={[
                            {
                                data: categoriesChartData.labels,
                                scaleType: 'band',
                            },
                        ]}
                        series={[
                            {
                                data: categoriesChartData.values,
                                label: 'Количество',
                            },
                        ]}
                        margin={{
                            top: 16,
                            right: isMobile ? 8 : 20,
                            bottom: isMobile ? 70 : 80,
                            left: isMobile ? 32 : 40,
                        }}
                    />
                )}
            </CardContent>
        </Card>
    )
}
