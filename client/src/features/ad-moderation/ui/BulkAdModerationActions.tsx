import { useState } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'
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
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const handleOpenDialog = (mode: ModerationDialogMode) => {
        if (!hasSelection) return
        setDialogMode(mode)
    }

    const handleCloseDialog = () => {
        setDialogMode(null)
        clearSelection()
    }

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
                isMobile={isMobile}
                onApprove={handleApprove}
                onOpenDialog={handleOpenDialog}
            />

            {dialogMode && <BulkAdModerationDialog selectedIds={selectedIds} mode={dialogMode} open={isDialogOpen} onClose={handleCloseDialog} />}
        </>
    )
}
