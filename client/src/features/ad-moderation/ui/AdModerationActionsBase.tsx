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
    isMobile: boolean
}

export const AdModerationActionsBase = ({ isApproved, isProcessing, onApprove, onOpenDialog, isDialogOpen, isMobile }: AdModerationActionsBaseProps) => {
    const disableAll = isProcessing

    useEffect(() => {
        if (isMobile) return

        const handler = (event: KeyboardEvent) => {
            if (isDialogOpen) return
            if (event.altKey || event.ctrlKey || event.metaKey) return

            switch (event.code) {
                case 'KeyA':
                    if (!disableAll && !isApproved) {
                        event.preventDefault()
                        onApprove()
                    }
                    break

                case 'KeyD':
                    if (!disableAll) {
                        event.preventDefault()
                        onOpenDialog(ModerationDialogMode.Reject)
                    }
                    break

                case 'KeyR':
                    if (!disableAll) {
                        event.preventDefault()
                        onOpenDialog(ModerationDialogMode.Changes)
                    }
                    break
            }
        }

        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isDialogOpen, isApproved, isProcessing, isMobile, onApprove, onOpenDialog])

    const renderHotkey = (key: string) => (!isMobile ? <Kbd>{key}</Kbd> : null)
    const buttonStyle = {
        py: { xs: 1, sm: 1.5 },
        fontSize: { xs: 14, sm: 16 },
        minHeight: { xs: 40, sm: 48 },
    }
    return (
        <Box sx={{ mt: 3, mb: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }} justifyContent='space-between'>
                <Button variant='contained' color='success' fullWidth disabled={disableAll || isApproved} onClick={onApprove} sx={buttonStyle}>
                    {renderHotkey('A')}
                    Одобрить
                </Button>

                <Button variant='contained' color='error' fullWidth disabled={disableAll} onClick={() => onOpenDialog(ModerationDialogMode.Reject)} sx={buttonStyle}>
                    {renderHotkey('D')}
                    Отклонить
                </Button>

                <Button variant='contained' color='warning' fullWidth disabled={disableAll} onClick={() => onOpenDialog(ModerationDialogMode.Changes)} sx={buttonStyle}>
                    {renderHotkey('R')}
                    Доработка
                </Button>
            </Stack>
        </Box>
    )
}
