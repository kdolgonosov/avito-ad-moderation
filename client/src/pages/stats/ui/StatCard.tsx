import { Card, CardContent, Typography } from '@mui/material'

interface StatCardProps {
    title: string
    value: number | string
}

export const StatCard = ({ title, value }: StatCardProps) => {
    return (
        <Card
            variant='outlined'
            sx={{
                borderRadius: 2,
            }}
        >
            <CardContent
                sx={{
                    py: { xs: 1.5, sm: 2 },
                    px: { xs: 1.5, sm: 2 },
                }}
            >
                <Typography
                    variant='subtitle2'
                    color='text.secondary'
                    sx={{
                        fontSize: { xs: 12, sm: 14 },
                        lineHeight: 1.3,
                        mb: 0.5,
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    variant='h5'
                    sx={{
                        fontSize: { xs: '1.4rem', sm: '1.6rem' },
                        fontWeight: 600,
                        wordBreak: 'break-word',
                    }}
                >
                    {value}
                </Typography>
            </CardContent>
        </Card>
    )
}
