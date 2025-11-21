import { useEffect, useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import { useAdModerationMutations } from '@/entities/ad/hooks/useAdModerationMutations'
import { AdStatus } from '@/entities/ad/model/types'
import { AdModerationDialog, type ModerationDialogMode } from '@/features/ad-moderation/ui/AdModerationDialog'

interface AdModerationActionsProps {
    adId: number
    currentStatus: AdStatus
}

export const AdModerationActions = ({ adId, currentStatus }: AdModerationActionsProps) => {
    const [dialogMode, setDialogMode] = useState<ModerationDialogMode | null>(null)

    const { approveMutation, isProcessing } = useAdModerationMutations(adId)

    const disableAll = isProcessing

    const handleOpenDialog = (mode: ModerationDialogMode) => {
        setDialogMode(mode)
    }

    const handleCloseDialog = () => {
        setDialogMode(null)
    }

    const isDialogOpen = dialogMode !== null
    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            // не трогаем, если открыт диалог
            if (isDialogOpen) return

            // игнорируем модификаторы
            if (event.altKey || event.ctrlKey || event.metaKey) return

            // не трогаем, если пользователь вводит текст
            const target = event.target as HTMLElement | null
            if (target) {
                const tag = target.tagName
                const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
                if (isTyping) return
            }

            const key = event.key.toLowerCase()

            // A — одобрить
            if (key === 'a') {
                if (!disableAll && currentStatus !== AdStatus.Approved) {
                    event.preventDefault()
                    approveMutation.mutate()
                }
                return
            }

            // D — открыть диалог отклонения
            if (key === 'd') {
                if (!disableAll) {
                    event.preventDefault()
                    handleOpenDialog('reject')
                }
            }
        }

        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isDialogOpen, disableAll, currentStatus, approveMutation])
    return (
        <>
            <Box sx={{ mt: 3, mb: 2 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent='space-between'>
                    <Button
                        variant='contained'
                        color='success'
                        fullWidth
                        disabled={disableAll || currentStatus === AdStatus.Approved}
                        onClick={() => approveMutation.mutate()}
                        sx={{ py: 1.5, fontSize: 16 }}
                    >
                        Одобрить
                    </Button>

                    <Button variant='contained' color='error' fullWidth disabled={disableAll} onClick={() => handleOpenDialog('reject')} sx={{ py: 1.5, fontSize: 16 }}>
                        Отклонить
                    </Button>

                    <Button
                        variant='contained'
                        color='warning'
                        fullWidth
                        disabled={disableAll}
                        onClick={() => handleOpenDialog('changes')}
                        sx={{ py: 1.5, fontSize: 16 }}
                    >
                        Доработка
                    </Button>
                </Stack>
            </Box>

            {dialogMode && <AdModerationDialog adId={adId} mode={dialogMode} open={isDialogOpen} onClose={handleCloseDialog} />}
        </>
    )
}
