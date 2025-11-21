import { useState } from 'react'
import { useBulkAdModerationMutations } from '@/entities/ad/hooks/useBulkAdModerationMutations'
import { BulkAdModerationDialog } from '@/features/ad-moderation/ui/BulkAdModerationDialog'
import type { ModerationDialogMode } from '../model/types'
import { AdModerationActionsBase } from './AdModerationActionsBase'

interface BulkAdModerationActionsProps {
    selectedIds: number[]
    clearSelection: () => void
}

export const BulkAdModerationActions = ({ selectedIds, clearSelection }: BulkAdModerationActionsProps) => {
    const [dialogMode, setDialogMode] = useState<ModerationDialogMode | null>(null)

    const { approveBulkMutation, isProcessing } = useBulkAdModerationMutations()

    const hasSelection = selectedIds.length > 0
    const isDialogOpen = dialogMode !== null

    const handleOpenDialog = (mode: ModerationDialogMode) => {
        if (!hasSelection) return
        setDialogMode(mode)
    }

    const handleCloseDialog = () => setDialogMode(null)

    const handleApprove = () => {
        if (!hasSelection) return
        approveBulkMutation.mutate(selectedIds, {
            onSuccess: () => {
                clearSelection()
            },
        })
    }

    return (
        <>
            <AdModerationActionsBase
                isApproved={false}
                isProcessing={isProcessing || !hasSelection}
                isDialogOpen={isDialogOpen}
                onApprove={handleApprove}
                onOpenDialog={handleOpenDialog}
            />

            {dialogMode && (
                <BulkAdModerationDialog
                    selectedIds={selectedIds}
                    mode={dialogMode}
                    open={isDialogOpen}
                    onClose={handleCloseDialog}
                    // onAfterSuccess={clearSelection}
                />
            )}
        </>
    )
}
