import { Navigate, Link as RouterLink } from 'react-router-dom'
import { Box, Button, Card, CardContent, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import { AdModerationActions } from '@/features/ad-moderation/ui/AdModerationActions'
import { Kbd } from '@/shared/ui'
import { useAdItem, useAdNavigation, useModerationHistory } from '../hooks'
import { useItemKeyboardShortcuts } from '../hooks/useItemKeyboardShortcuts'
import { AdGallery } from './AdGallery'
import { CharacteristicsSection } from './CharacteristicsSection'
import { ItemHeaderSection } from './ItemHeaderSection'
import { ModerationHistorySection } from './ModerationHistorySection'
import { SellerInfoSection } from './SellerInfoSection'

export const ItemPage = () => {
    const { ad, isLoading, isError, isInvalidId, numericId } = useAdItem()
    const { sortedHistory, historyPage, historyPageItems, totalHistoryPages, handleHistoryPageChange } = useModerationHistory(ad?.moderationHistory)
    const { isPrevDisabled, isNextDisabled, handlePrevClick, handleNextClick, handleExitClick } = useAdNavigation(ad?.id ?? numericId)

    useItemKeyboardShortcuts({
        isPrevDisabled,
        isNextDisabled,
        onPrev: handlePrevClick,
        onNext: handleNextClick,
        onExit: handleExitClick,
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

    return (
        <Box>
            <Box
                sx={{
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 16,
                    zIndex: 20,
                }}
            >
                <Button component={RouterLink} to='/list' variant='contained' size='medium' onClick={handleExitClick}>
                    <Kbd>Esc</Kbd> К списку
                </Button>

                <Stack direction='row' spacing={1}>
                    <Button variant='contained' size='medium' disabled={isPrevDisabled} onClick={handlePrevClick}>
                        <Kbd>←</Kbd> Предыдущее
                    </Button>

                    <Button variant='contained' size='medium' disabled={isNextDisabled} onClick={handleNextClick}>
                        Следующее <Kbd>→</Kbd>
                    </Button>
                </Stack>
            </Box>

            <ItemHeaderSection ad={ad} />

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: '1fr 1fr',
                    },
                    gap: 3,
                    mb: 3,
                    alignItems: 'stretch',
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <AdGallery images={ad.images} />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    <ModerationHistorySection
                        sortedHistory={sortedHistory}
                        historyPage={historyPage}
                        totalHistoryPages={totalHistoryPages}
                        historyPageItems={historyPageItems}
                        onPageChange={handleHistoryPageChange}
                    />
                </Box>
            </Box>

            <Card variant='outlined'>
                <CardContent>
                    <SellerInfoSection seller={ad.seller} />

                    <Divider sx={{ my: 2 }} />

                    <Typography variant='body1' sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                        {ad.description}
                    </Typography>

                    <CharacteristicsSection characteristics={ad.characteristics} />
                </CardContent>
            </Card>

            <Box
                sx={{
                    position: 'sticky',
                    bottom: 16,
                    zIndex: 20,
                    mb: 2,
                }}
            >
                <AdModerationActions adId={ad.id} currentStatus={ad.status} />
            </Box>
        </Box>
    )
}
