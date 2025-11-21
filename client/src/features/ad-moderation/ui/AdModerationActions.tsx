import { useState } from 'react'
import { useAdModerationMutations } from '@/entities/ad/hooks/useAdModerationMutations'
import { AdStatus } from '@/entities/ad/model/types'
import { AdModerationDialog } from '@/features/ad-moderation/ui/AdModerationDialog'
import type { ModerationDialogMode } from '../model/types'
import { AdModerationActionsBase } from './AdModerationActionsBase'

interface AdModerationActionsProps {
    adId: number
    currentStatus: AdStatus
}

export const AdModerationActions = ({ adId, currentStatus }: AdModerationActionsProps) => {
    const [dialogMode, setDialogMode] = useState<ModerationDialogMode | null>(null)

    const { approveMutation, isProcessing } = useAdModerationMutations(adId)

    const isApproved = currentStatus === AdStatus.Approved
    const isDialogOpen = dialogMode !== null

    const handleOpenDialog = (mode: ModerationDialogMode) => setDialogMode(mode)
    const handleCloseDialog = () => setDialogMode(null)

    return (
        <>
            <AdModerationActionsBase
                isApproved={isApproved}
                isProcessing={isProcessing}
                isDialogOpen={isDialogOpen}
                onApprove={() => approveMutation.mutate()}
                onOpenDialog={handleOpenDialog}
            />

            {dialogMode && <AdModerationDialog adId={adId} mode={dialogMode} open={isDialogOpen} onClose={handleCloseDialog} />}
        </>
    )
}
