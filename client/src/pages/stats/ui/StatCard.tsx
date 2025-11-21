import { Card, CardContent, Typography } from '@mui/material'

interface StatCardProps {
    title: string
    value: number | string
}

export const StatCard = ({ title, value }: StatCardProps) => {
    return (
        <Card>
            <CardContent>
                <Typography variant='subtitle2' color='text.secondary'>
                    {title}
                </Typography>
                <Typography variant='h5'>{value}</Typography>
            </CardContent>
        </Card>
    )
}
