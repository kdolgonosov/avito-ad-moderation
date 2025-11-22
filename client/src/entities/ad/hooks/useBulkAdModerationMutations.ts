import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postBulkApproveAds, postBulkRejectAds, postBulkRequestChangesAds } from '../api/api'
import type { RejectAdRequestBody, RequestChangesBody } from '../model/types'

interface UseBulkAdModerationMutationsOptions {
    onRejectSuccess?: () => void
    onRequestChangesSuccess?: () => void
}

export const useBulkAdModerationMutations = (options?: UseBulkAdModerationMutationsOptions) => {
    const queryClient = useQueryClient()

    const invalidateAfterBulkChange = (ids: number[]) => {
        ids.forEach(id => {
            queryClient.invalidateQueries({ queryKey: ['ads', 'item', id] })
        })
        queryClient.invalidateQueries({ queryKey: ['ads', 'list'] })
    }

    const approveBulkMutation = useMutation({
        mutationFn: (ids: number[]) => postBulkApproveAds(ids),
        onSuccess: (_data, ids) => {
            invalidateAfterBulkChange(ids)
        },
    })

    const rejectBulkMutation = useMutation({
        mutationFn: ({ ids, body }: { ids: number[]; body: RejectAdRequestBody }) => postBulkRejectAds(ids, body),
        onSuccess: (_data, { ids }) => {
            invalidateAfterBulkChange(ids)
            options?.onRejectSuccess?.()
        },
    })

    const requestChangesBulkMutation = useMutation({
        mutationFn: ({ ids, body }: { ids: number[]; body: RequestChangesBody }) => postBulkRequestChangesAds(ids, body),
        onSuccess: (_data, { ids }) => {
            invalidateAfterBulkChange(ids)
            options?.onRequestChangesSuccess?.()
        },
    })

    const isProcessing = approveBulkMutation.isPending || rejectBulkMutation.isPending || requestChangesBulkMutation.isPending

    return {
        approveBulkMutation,
        rejectBulkMutation,
        requestChangesBulkMutation,
        isProcessing,
    }
}
