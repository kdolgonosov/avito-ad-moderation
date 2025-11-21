import { Avatar, Box, Stack, Typography } from '@mui/material'
import { useCurrentModerator } from '../hooks/useCurrentModerator'

export const ModeratorHeader = () => {
    const { data: moderator, isLoading, isError } = useCurrentModerator()

    if (isLoading) {
        return (
            <Box
                sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    border: theme => `1px solid ${theme.palette.divider}`,
                }}
            >
                <Typography variant='body2' color='text.secondary'>
                    Загрузка информации о модераторе…
                </Typography>
            </Box>
        )
    }

    if (isError || !moderator) {
        return (
            <Box
                sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    border: theme => `1px solid ${theme.palette.divider}`,
                }}
            >
                <Typography variant='body2' color='error'>
                    Не удалось загрузить информацию о модераторе
                </Typography>
            </Box>
        )
    }

    const { name, email, role, statistics } = moderator

    const initials = name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()

    return (
        <Box
            sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                border: theme => `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
            }}
        >
            <Avatar sx={{ width: 56, height: 56 }}>{initials}</Avatar>

            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant='h6' noWrap>
                    {name}
                </Typography>
                <Typography variant='body2' color='text.secondary' noWrap>
                    {role} • {email}
                </Typography>

                {statistics && (
                    <Stack direction='row' spacing={2} mt={1} flexWrap='wrap'>
                        <Typography variant='body2'>
                            Всего проверено: <b>{statistics.totalReviewed}</b>
                        </Typography>
                        <Typography variant='body2'>
                            Сегодня: <b>{statistics.todayReviewed}</b>
                        </Typography>
                        <Typography variant='body2'>
                            За 7 дней: <b>{statistics.thisWeekReviewed}</b>
                        </Typography>
                        <Typography variant='body2'>
                            За 30 дней: <b>{statistics.thisMonthReviewed}</b>
                        </Typography>
                        <Typography variant='body2'>
                            Среднее время рассмотрения: <b>{(statistics.averageReviewTime / 60).toFixed(1)} мин.</b>
                        </Typography>
                        <Typography variant='body2'>
                            Одобрение: <b>{statistics.approvalRate.toFixed(1)}%</b>
                        </Typography>
                    </Stack>
                )}
            </Box>
        </Box>
    )
}
