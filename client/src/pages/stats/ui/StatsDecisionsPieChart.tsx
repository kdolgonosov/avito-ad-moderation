import { Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material'
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
                    Распределение решений
                </Typography>

                {!decisionsPieData && (
                    <Typography variant='body2' color='text.secondary'>
                        Нет данных за выбранный период.
                    </Typography>
                )}

                {decisionsPieData && (
                    <PieChart
                        height={chartHeight}
                        series={[
                            {
                                data: decisionsPieData,
                            },
                        ]}
                        margin={{
                            top: 8,
                            bottom: 8,
                            left: isMobile ? 0 : 0,
                            right: isMobile ? 0 : 0,
                        }}
                    />
                )}
            </CardContent>
        </Card>
    )
}
