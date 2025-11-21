import { Box, Chip, Stack, Typography } from '@mui/material'
import { ModerationAction, type ModerationHistoryItem } from '@/entities/ad/model/types'

const mapModerationActionToLabels = {
    [ModerationAction.Approved]: {
        actionLabel: 'Одобрено',
        actionColor: 'success',
    },
    [ModerationAction.Rejected]: {
        actionLabel: 'Отклонено',
        actionColor: 'error',
    },
    [ModerationAction.RequestChanges]: {
        actionLabel: 'Вернуто на доработку',
        actionColor: 'warning',
    },
}
export const ModerationHistoryRow = ({ item }: { item: ModerationHistoryItem }) => {
    const { actionLabel, actionColor } = mapModerationActionToLabels[item.action]

    return (
        <Box
            sx={{
                p: 1.5,
                borderRadius: 1,
                border: theme => `1px solid ${theme.palette.divider}`,
            }}
        >
            <Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2}>
                <Box>
                    <Chip label={actionLabel} color={actionColor as any} size='small' sx={{ mb: 0.5 }} />
                    <Typography variant='body2'>
                        Модератор:{' '}
                        <Box component='span' sx={{ fontWeight: 500 }}>
                            {item.moderatorName}
                        </Box>
                    </Typography>
                    {item.reason && (
                        <Typography variant='body2'>
                            Причина:{' '}
                            <Box component='span' sx={{ fontWeight: 500 }}>
                                {item.reason}
                            </Box>
                        </Typography>
                    )}
                    {item.comment && (
                        <Typography variant='body2' sx={{ mt: 0.5 }}>
                            Комментарий: {item.comment}
                        </Typography>
                    )}
                </Box>

                <Typography variant='body2' color='text.secondary'>
                    {new Date(item.timestamp).toLocaleString('ru-RU')}
                </Typography>
            </Stack>
        </Box>
    )
}
