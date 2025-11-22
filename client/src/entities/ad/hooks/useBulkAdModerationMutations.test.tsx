import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as api from '@/entities/ad/api/api'
import { AdPriority, AdStatus, RejectReason, type Advertisement, type RejectAdRequestBody, type RequestChangesBody } from '../model/types'
import { useBulkAdModerationMutations } from './useBulkAdModerationMutations'

vi.mock('@/entities/ad/api/api', () => ({
    postBulkApproveAds: vi.fn(),
    postBulkRejectAds: vi.fn(),
    postBulkRequestChangesAds: vi.fn(),
}))

const mockedBulkApprove = vi.mocked(api.postBulkApproveAds)
const mockedBulkReject = vi.mocked(api.postBulkRejectAds)
const mockedBulkRequestChanges = vi.mocked(api.postBulkRequestChangesAds)

const createWrapper =
    (queryClient: QueryClient) =>
    ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

const createDeferred = <T,>() => {
    let resolve!: (value: T) => void
    const promise = new Promise<T>(res => {
        resolve = res
    })
    return { promise, resolve }
}

const makeAd = (id: number): Advertisement => ({
    id,
    title: `Ad ${id}`,
    description: 'desc',
    price: 100,
    categoryId: 1,
    category: 'cat',
    images: [],
    status: AdStatus.Pending,
    priority: AdPriority.Normal,
    seller: { id: 1, name: 'Seller', rating: '5', registeredAt: '2025-01-01', totalAds: 1 },
    characteristics: {},
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
    moderationHistory: [],
})

describe('useBulkAdModerationMutations', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('bulk approve инвалидирует каждый item и список', async () => {
        const ids = [1, 2]
        mockedBulkApprove.mockResolvedValue({ ads: ids.map(makeAd) })

        const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

        const { result } = renderHook(() => useBulkAdModerationMutations(), { wrapper: createWrapper(queryClient) })

        await act(async () => {
            await result.current.approveBulkMutation.mutateAsync(ids)
        })

        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['ads', 'item', 1] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['ads', 'item', 2] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['ads', 'list'] })
    })

    test('bulk reject инвалидирует все связанные запросы', async () => {
        const ids = [5, 6]
        const body: RejectAdRequestBody = { reason: RejectReason.Other, comment: 'skip' }
        mockedBulkReject.mockResolvedValue({ ads: ids.map(makeAd) })

        const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

        const { result } = renderHook(() => useBulkAdModerationMutations(), { wrapper: createWrapper(queryClient) })

        await act(async () => {
            await result.current.rejectBulkMutation.mutateAsync({ ids, body })
        })

        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['ads', 'item', 5] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['ads', 'item', 6] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['ads', 'list'] })
    })

    test('bulk request-changes инвалидирует все связанные запросы', async () => {
        const ids = [9]
        const body: RequestChangesBody = { reason: RejectReason.Other, comment: 'fix' }
        mockedBulkRequestChanges.mockResolvedValue({ ads: ids.map(makeAd) })

        const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

        const { result } = renderHook(() => useBulkAdModerationMutations(), { wrapper: createWrapper(queryClient) })

        await act(async () => {
            await result.current.requestChangesBulkMutation.mutateAsync({ ids, body })
        })

        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['ads', 'item', 9] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['ads', 'list'] })
    })

    test('isProcessing true, пока bulk мутейшн не завершён', async () => {
        const ids = [1, 2, 3]
        const deferred = createDeferred<{ ads: Advertisement[] }>()
        mockedBulkApprove.mockReturnValue(deferred.promise)

        const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

        const { result } = renderHook(() => useBulkAdModerationMutations(), { wrapper: createWrapper(queryClient) })

        expect(result.current.isProcessing).toBe(false)

        act(() => {
            result.current.approveBulkMutation.mutate(ids)
        })

        await waitFor(() => expect(result.current.isProcessing).toBe(true))

        act(() => {
            deferred.resolve({ ads: ids.map(makeAd) })
        })

        await waitFor(() => expect(result.current.isProcessing).toBe(false))
    })
})
