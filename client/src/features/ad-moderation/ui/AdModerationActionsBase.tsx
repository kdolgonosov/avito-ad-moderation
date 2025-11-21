import { useEffect } from 'react'
import { Box, Button, Stack } from '@mui/material'
import { Kbd } from '@/shared/ui'
import { ModerationDialogMode } from '../model/types'

interface AdModerationActionsBaseProps {
    isApproved: boolean
    isProcessing: boolean
    onApprove: () => void
    onOpenDialog: (mode: ModerationDialogMode) => void
    isDialogOpen: boolean
}

export const AdModerationActionsBase = ({ isApproved, isProcessing, onApprove, onOpenDialog, isDialogOpen }: AdModerationActionsBaseProps) => {
    const disableAll = isProcessing

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (isDialogOpen) return
            if (event.altKey || event.ctrlKey || event.metaKey) return

            const key = event.key.toLowerCase()

            if (key === 'a' && !disableAll && !isApproved) {
                event.preventDefault()
                onApprove()
                return
            }

            if (key === 'd' && !disableAll) {
                event.preventDefault()
                onOpenDialog(ModerationDialogMode.Reject)
                return
            }

            if (key === 'r' && !disableAll) {
                event.preventDefault()
                onOpenDialog(ModerationDialogMode.Changes)
                return
            }
        }

        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isDialogOpen, isApproved, isProcessing, onApprove, onOpenDialog])

    return (
        <Box sx={{ mt: 3, mb: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent='space-between'>
                <Button variant='contained' color='success' fullWidth disabled={disableAll || isApproved} onClick={onApprove} sx={{ py: 1.5, fontSize: 16 }}>
                    <Kbd>A</Kbd>
                    Одобрить
                </Button>

                <Button
                    variant='contained'
                    color='error'
                    fullWidth
                    disabled={disableAll}
                    onClick={() => onOpenDialog(ModerationDialogMode.Reject)}
                    sx={{ py: 1.5, fontSize: 16 }}
                >
                    <Kbd>D</Kbd>
                    Отклонить
                </Button>

                <Button
                    variant='contained'
                    color='warning'
                    fullWidth
                    disabled={disableAll}
                    onClick={() => onOpenDialog(ModerationDialogMode.Changes)}
                    sx={{ py: 1.5, fontSize: 16 }}
                >
                    <Kbd>R</Kbd>
                    Доработка
                </Button>
            </Stack>
        </Box>
    )
}
