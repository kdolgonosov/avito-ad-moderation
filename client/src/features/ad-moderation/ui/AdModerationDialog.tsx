import { useMediaQuery, useTheme } from '@mui/material'
import { useAdModerationMutations } from '@/entities/ad/hooks/useAdModerationMutations'
import { type RejectAdRequestBody, type RequestChangesBody } from '@/entities/ad/model/types'
import { ModerationDialogMode } from '../model/types'
import { AdModerationDialogBase } from './AdModerationDialogBase'

interface AdModerationDialogProps {
    adId: number
    mode: ModerationDialogMode
    open: boolean
    onClose: () => void
}

export const AdModerationDialog = ({ adId, mode, open, onClose }: AdModerationDialogProps) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const { rejectMutation, requestChangesMutation, isProcessing } = useAdModerationMutations(adId, {
        onRejectSuccess: onClose,
        onRequestChangesSuccess: onClose,
    })

    const handleSubmit = (body: RejectAdRequestBody | RequestChangesBody) => {
        if (mode === ModerationDialogMode.Reject) {
            rejectMutation.mutate(body as RejectAdRequestBody)
        } else {
            requestChangesMutation.mutate(body as RequestChangesBody)
        }
    }

    const title = mode === ModerationDialogMode.Reject ? 'Отклонить объявление' : 'Вернуть на доработку'

    return <AdModerationDialogBase mode={mode} open={open} isProcessing={isProcessing} onClose={onClose} onSubmit={handleSubmit} title={title} isMobile={isMobile} />
}
