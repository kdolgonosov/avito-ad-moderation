import { Card, CardContent, Typography } from '@mui/material'
import { PieChart } from '@mui/x-charts'

interface StatsDecisionsPieChartProps {
    decisionsPieData:
        | {
              id: number
              value: number
              label: string
          }[]
        | null
}
export const StatsDecisionsPieChart = ({ decisionsPieData }: StatsDecisionsPieChartProps) => {
    return (
        <Card sx={{ minHeight: 320 }}>
            <CardContent>
                <Typography variant='h6' gutterBottom>
                    Распределение решений
                </Typography>
                {!decisionsPieData && (
                    <Typography variant='body2' color='text.secondary'>
                        Нет данных за выбранный период.
                    </Typography>
                )}
                {decisionsPieData && (
                    <PieChart
                        height={260}
                        series={[
                            {
                                data: decisionsPieData,
                            },
                        ]}
                    />
                )}
            </CardContent>
        </Card>
    )
}
