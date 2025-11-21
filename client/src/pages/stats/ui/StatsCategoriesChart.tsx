import { Card, CardContent, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts'

interface StatsCategoriesChartProps {
    categoriesChartData: {
        labels: string[]
        values: number[]
    } | null
}
export const StatsCategoriesChart = ({ categoriesChartData }: StatsCategoriesChartProps) => {
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant='h6' gutterBottom>
                    Проверенные объявления по категориям
                </Typography>

                {!categoriesChartData && (
                    <Typography variant='body2' color='text.secondary'>
                        Нет данных за выбранный период.
                    </Typography>
                )}

                {categoriesChartData && (
                    <BarChart
                        height={320}
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
                            top: 20,
                            right: 20,
                            bottom: 60,
                            left: 40,
                        }}
                    />
                )}
            </CardContent>
        </Card>
    )
}
