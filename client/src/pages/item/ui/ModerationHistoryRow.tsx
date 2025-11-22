import { useState } from 'react'
import { Box, Button, Chip, Stack, Typography } from '@mui/material'
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

const MAX_COMMENT_LENGTH = 100

export const ModerationHistoryRow = ({ item }: { item: ModerationHistoryItem }) => {
    const { actionLabel, actionColor } = mapModerationActionToLabels[item.action]
    const [isCommentExpanded, setIsCommentExpanded] = useState(false)

    const hasLongComment = !!item.comment && item.comment.length > MAX_COMMENT_LENGTH

    const displayedComment = !item.comment || isCommentExpanded || !hasLongComment ? item.comment : `${item.comment.slice(0, MAX_COMMENT_LENGTH).trimEnd()}…`

    return (
        <Box
            sx={{
                p: 1.5,
                borderRadius: 1,
                border: theme => `1px solid ${theme.palette.divider}`,
            }}
        >
            <Stack direction='row' justifyContent='space-between' alignItems='flex-start' sx={{ mb: 0.75 }}>
                <Chip label={actionLabel} color={actionColor as any} size='small' />

                <Typography variant='body2' color='text.secondary'>
                    {new Date(item.timestamp).toLocaleString('ru-RU')}
                </Typography>
            </Stack>

            <Box>
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
                    <Box sx={{ mt: 0.5 }}>
                        <Typography variant='body2' component='span' sx={{ fontWeight: 500 }}>
                            Комментарий:{' '}
                        </Typography>

                        <Typography
                            variant='body2'
                            component='span'
                            sx={{
                                wordBreak: 'break-word',
                                overflowWrap: 'anywhere',
                            }}
                        >
                            {displayedComment}
                        </Typography>

                        {hasLongComment && (
                            <Button
                                variant='text'
                                size='small'
                                onClick={() => setIsCommentExpanded(prev => !prev)}
                                sx={{
                                    ml: 0.5,
                                    p: 0,
                                    minWidth: 'auto',
                                    fontSize: '0.8rem',
                                    textTransform: 'none',
                                }}
                            >
                                {isCommentExpanded ? 'Скрыть' : 'Показать ещё'}
                            </Button>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    )
}
