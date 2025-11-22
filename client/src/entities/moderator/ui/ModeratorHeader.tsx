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
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 1.5, sm: 2 },
                flexWrap: 'wrap',
            }}
        >
            <Avatar
                sx={{
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                    fontSize: { xs: 20, sm: 24 },
                }}
            >
                {initials}
            </Avatar>

            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                    variant='h6'
                    sx={{
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                        wordBreak: 'break-word',
                    }}
                >
                    {name}
                </Typography>

                <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{
                        mt: 0.25,
                        fontSize: { xs: 12, sm: 13 },
                        wordBreak: 'break-all',
                    }}
                >
                    {role} • {email}
                </Typography>

                {statistics && (
                    <Stack direction='row' spacing={{ xs: 1, sm: 2 }} mt={1} flexWrap='wrap'>
                        <Typography variant='body2' sx={{ fontSize: { xs: 12, sm: 13 } }}>
                            Всего проверено: <b>{statistics.totalReviewed}</b>
                        </Typography>
                        <Typography variant='body2' sx={{ fontSize: { xs: 12, sm: 13 } }}>
                            Сегодня: <b>{statistics.todayReviewed}</b>
                        </Typography>
                        <Typography variant='body2' sx={{ fontSize: { xs: 12, sm: 13 } }}>
                            За 7 дней: <b>{statistics.thisWeekReviewed}</b>
                        </Typography>
                        <Typography variant='body2' sx={{ fontSize: { xs: 12, sm: 13 } }}>
                            За 30 дней: <b>{statistics.thisMonthReviewed}</b>
                        </Typography>
                        <Typography variant='body2' sx={{ fontSize: { xs: 12, sm: 13 } }}>
                            Среднее время рассмотрения: <b>{(statistics.averageReviewTime / 60).toFixed(1)} мин.</b>
                        </Typography>
                        <Typography variant='body2' sx={{ fontSize: { xs: 12, sm: 13 } }}>
                            Одобрение: <b>{statistics.approvalRate.toFixed(1)}%</b>
                        </Typography>
                    </Stack>
                )}
            </Box>
        </Box>
    )
}
