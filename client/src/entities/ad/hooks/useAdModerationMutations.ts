import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postApproveAd, postRejectAd, postRequestChangesAd } from '@/entities/ad/api/api'
import type { RejectAdRequestBody, RequestChangesBody } from '@/entities/ad/model/types'

interface UseAdModerationMutationsOptions {
    onRejectSuccess?: () => void
    onRequestChangesSuccess?: () => void
}

export const useAdModerationMutations = (adId: number, options?: UseAdModerationMutationsOptions) => {
    const queryClient = useQueryClient()

    const invalidateAfterChange = (updated: any) => {
        const ad = updated?.ad ?? updated
        queryClient.setQueryData(['ads', 'item', adId], ad)
        queryClient.invalidateQueries({ queryKey: ['ads', 'list'] })
    }

    const approveMutation = useMutation({
        mutationFn: () => postApproveAd(adId),
        onSuccess: data => {
            invalidateAfterChange(data)
        },
    })

    const rejectMutation = useMutation({
        mutationFn: (body: RejectAdRequestBody) => postRejectAd(adId, body),
        onSuccess: data => {
            invalidateAfterChange(data)
            options?.onRejectSuccess?.()
        },
    })

    const requestChangesMutation = useMutation({
        mutationFn: (body: RequestChangesBody) => postRequestChangesAd(adId, body),
        onSuccess: data => {
            invalidateAfterChange(data)
            options?.onRequestChangesSuccess?.()
        },
    })

    const isProcessing = approveMutation.isPending || rejectMutation.isPending || requestChangesMutation.isPending

    return {
        approveMutation,
        rejectMutation,
        requestChangesMutation,
        isProcessing,
    }
}
