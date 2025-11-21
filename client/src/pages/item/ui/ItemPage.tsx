import { Navigate, Link as RouterLink } from 'react-router-dom'
import { Box, Button, Card, CardContent, Chip, CircularProgress, Divider, Pagination, Stack, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import { getCategoryIcon } from '@/entities/ad/model/categories'
import { AdPriority } from '@/entities/ad/model/types'
import { StatusBadge } from '@/entities/ad/ui/StatusBadge'
import { AdModerationActions } from '../../../features/ad-moderation/ui/AdModerationActions'
import { useAdItem, useAdNavigation, useModerationHistory } from '../hooks'
import { useItemKeyboardShortcuts } from '../hooks/useItemKeyboardShortcuts'
import { AdGallery } from './AdGallery'
import { ModerationHistoryRow } from './ModerationHistoryRow'

export const ItemPage = () => {
    const { ad, isLoading, isError, isInvalidId, numericId } = useAdItem()
    const { sortedHistory, historyPage, historyPageItems, totalHistoryPages, handleHistoryPageChange } = useModerationHistory(ad?.moderationHistory)
    const { isPrevDisabled, isNextDisabled, handlePrevClick, handleNextClick } = useAdNavigation(ad?.id ?? numericId)
    useItemKeyboardShortcuts({
        isPrevDisabled,
        isNextDisabled,
        onPrev: handlePrevClick,
        onNext: handleNextClick,
    })
    if (isInvalidId) {
        return <Navigate to='/list' replace />
    }

    if (isLoading) {
        return (
            <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        )
    }

    if (isError || !ad) {
        return (
            <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography variant='h6' color='error'>
                    Не удалось загрузить объявление
                </Typography>
                <Button component={RouterLink} to='/list' sx={{ mt: 2 }}>
                    Вернуться к списку
                </Button>
            </Box>
        )
    }

    const CategoryIcon = getCategoryIcon(ad.categoryId)

    return (
        <Box>
            <Box
                sx={{
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Button component={RouterLink} to='/list'>
                    ← К списку
                </Button>

                <Stack direction='row' spacing={1}>
                    <Button variant='text' size='small' disabled={isPrevDisabled} onClick={handlePrevClick}>
                        ◀ Предыдущее
                    </Button>

                    <Button variant='text' size='small' disabled={isNextDisabled} onClick={handleNextClick}>
                        Следующее ▶
                    </Button>
                </Stack>
            </Box>

            <Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2} mb={3}>
                <Box>
                    <Typography variant='h4' gutterBottom>
                        Объявление {ad.id}: {ad.title}
                    </Typography>

                    <Stack direction='row' spacing={1} alignItems='center'>
                        <StatusBadge status={ad.status} />
                        {ad.priority === AdPriority.Urgent && <Chip label='Срочное объявление' color='warning' size='small' sx={{ fontWeight: 500 }} />}
                    </Stack>
                </Box>

                <Box textAlign='right'>
                    <Typography variant='h5'>
                        {ad.price.toLocaleString('ru-RU', {
                            style: 'currency',
                            currency: 'RUB',
                        })}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                        ID: {ad.id}
                    </Typography>
                </Box>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems='stretch' mb={3}>
                <Box sx={{ flex: { xs: '1 1 auto', md: '2 1 0%' }, minWidth: 0 }}>
                    <AdGallery images={ad.images} />
                </Box>

                <Box sx={{ flex: { xs: '1 1 auto', md: '1 1 0%' }, minWidth: 0 }}>
                    <Card
                        variant='outlined'
                        sx={{
                            height: '100%',
                            bgcolor: theme => theme.palette.warning.light + '22',
                        }}
                    >
                        <CardContent>
                            <Typography variant='h6' gutterBottom>
                                История модерации
                            </Typography>

                            {!sortedHistory.length && (
                                <Typography variant='body2' color='text.secondary'>
                                    История модерации пока отсутствует.
                                </Typography>
                            )}

                            {sortedHistory.length > 0 && (
                                <Stack spacing={1.5}>
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
                                            <Pagination size='small' page={historyPage} count={totalHistoryPages} onChange={handleHistoryPageChange} />
                                        </Box>
                                    )}
                                </Stack>
                            )}
                        </CardContent>
                    </Card>
                </Box>
            </Stack>

            <Card variant='outlined'>
                <CardContent>
                    <Typography variant='h6' gutterBottom>
                        Полное описание
                    </Typography>

                    <Typography variant='body2' color='text.secondary' sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <CategoryIcon fontSize='small' style={{ opacity: 0.7 }} />
                        {ad.category} · Опубликовано {new Date(ad.createdAt).toLocaleString('ru-RU')}
                    </Typography>

                    <Typography variant='body1' sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                        {ad.description}
                    </Typography>

                    {ad.characteristics && Object.keys(ad.characteristics).length > 0 && (
                        <>
                            <Typography variant='subtitle1' gutterBottom>
                                Характеристики
                            </Typography>
                            <Table size='small' sx={{ mb: 2 }}>
                                <TableBody>
                                    {Object.entries(ad.characteristics).map(([key, value]) => (
                                        <TableRow key={key}>
                                            <TableCell sx={{ width: '35%', fontWeight: 500 }}>{key}</TableCell>
                                            <TableCell>{value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Typography variant='body2'>
                        Продавец:{' '}
                        <Box component='span' sx={{ fontWeight: 500 }}>
                            {ad.seller.name}
                        </Box>{' '}
                        · Рейтинг {ad.seller.rating} · {ad.seller.totalAds} объявлений · На сайте с {new Date(ad.seller.registeredAt).toLocaleDateString('ru-RU')}
                    </Typography>
                </CardContent>
            </Card>

            <AdModerationActions adId={ad.id} currentStatus={ad.status} />
        </Box>
    )
}
