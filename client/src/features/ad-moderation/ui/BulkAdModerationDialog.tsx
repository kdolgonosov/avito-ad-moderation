import { useBulkAdModerationMutations } from '@/entities/ad/hooks/useBulkAdModerationMutations'
import { type RejectAdRequestBody, type RequestChangesBody } from '@/entities/ad/model/types'
import { ModerationDialogMode } from '../model/types'
import { AdModerationDialogBase } from './AdModerationDialogBase'

interface BulkAdModerationDialogProps {
    selectedIds: number[]
    mode: ModerationDialogMode
    open: boolean
    onClose: () => void
}

export const BulkAdModerationDialog = ({ selectedIds, mode, open, onClose }: BulkAdModerationDialogProps) => {
    const { rejectBulkMutation, requestChangesBulkMutation, isProcessing } = useBulkAdModerationMutations({
        onRejectSuccess: onClose,
        onRequestChangesSuccess: onClose,
    })
    const handleSubmit = (body: RejectAdRequestBody | RequestChangesBody) => {
        if (mode === ModerationDialogMode.Reject) {
            rejectBulkMutation.mutate({
                ids: selectedIds,
                body: body as RejectAdRequestBody,
            })
        } else {
            requestChangesBulkMutation.mutate({
                ids: selectedIds,
                body: body as RequestChangesBody,
            })
        }
    }

    const title = mode === ModerationDialogMode.Reject ? `Отклонить выбранные (${selectedIds.length})` : `Вернуть выбранные на доработку (${selectedIds.length})`

    return <AdModerationDialogBase mode={mode} open={open} isProcessing={isProcessing} onClose={onClose} onSubmit={handleSubmit} title={title} />
}
