import { Box, Card, CardContent, Pagination, Stack, Typography } from '@mui/material'
import type { useModerationHistory } from '../hooks'
import { ModerationHistoryRow } from './ModerationHistoryRow'

interface ModerationHistorySectionProps {
    sortedHistory: ReturnType<typeof useModerationHistory>['sortedHistory']
    historyPage: number
    totalHistoryPages: number
    historyPageItems: ReturnType<typeof useModerationHistory>['historyPageItems']
    onPageChange: ReturnType<typeof useModerationHistory>['handleHistoryPageChange']
}

export const ModerationHistorySection = ({ sortedHistory, historyPage, totalHistoryPages, historyPageItems, onPageChange }: ModerationHistorySectionProps) => {
    return (
        <Card
            variant='outlined'
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: theme => theme.palette.warning.light + '22',
            }}
        >
            <CardContent
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Typography variant='h6' gutterBottom>
                    История модерации
                </Typography>

                {!sortedHistory.length && (
                    <Typography variant='body2' color='text.secondary'>
                        История модерации пока отсутствует.
                    </Typography>
                )}

                {sortedHistory.length > 0 && (
                    <Stack spacing={1.5} sx={{ flex: 1 }}>
                        {historyPageItems.map(item => (
                            <ModerationHistoryRow key={item.id} item={item} />
                        ))}

                        {totalHistoryPages > 1 && (
                            <Box
                                sx={{
                                    pt: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Pagination size='small' page={historyPage} count={totalHistoryPages} onChange={onPageChange} />
                            </Box>
                        )}
                    </Stack>
                )}
            </CardContent>
        </Card>
    )
}
