import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as api from '@/entities/ad/api/api'
import { AdPriority, AdStatus, RejectReason, type AdMutationResponse, type Advertisement, type RejectAdRequestBody, type RequestChangesBody } from '../model/types'
import { useAdModerationMutations } from './useAdModerationMutations'

vi.mock('@/entities/ad/api/api', () => ({
    postApproveAd: vi.fn(),
    postRejectAd: vi.fn(),
    postRequestChangesAd: vi.fn(),
}))

const mockedApprove = vi.mocked(api.postApproveAd)
const mockedReject = vi.mocked(api.postRejectAd)
const mockedRequestChanges = vi.mocked(api.postRequestChangesAd)

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

describe('useAdModerationMutations', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('апрув кладёт объявление в кэш и инвалидирует список', async () => {
        const adId = 7
        const ad = makeAd(adId)
        mockedApprove.mockResolvedValue({ message: 'ok', ad })

        const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
        const setDataSpy = vi.spyOn(queryClient, 'setQueryData')
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

        const { result } = renderHook(() => useAdModerationMutations(adId), { wrapper: createWrapper(queryClient) })

        await act(async () => {
            await result.current.approveMutation.mutateAsync()
        })

        expect(setDataSpy).toHaveBeenCalledWith(['ads', 'item', adId], ad)
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['ads', 'list'] })
    })

    test('reject вызывает колбэк успеха и обновляет кэш', async () => {
        const adId = 3
        const ad = makeAd(adId)
        const body: RejectAdRequestBody = { reason: RejectReason.Other, comment: 'не подходит' }
        mockedReject.mockResolvedValue({ message: 'rejected', ad })

        const onRejectSuccess = vi.fn()

        const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
        const setDataSpy = vi.spyOn(queryClient, 'setQueryData')
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

        const { result } = renderHook(() => useAdModerationMutations(adId, { onRejectSuccess }), {
            wrapper: createWrapper(queryClient),
        })

        await act(async () => {
            await result.current.rejectMutation.mutateAsync(body)
        })

        expect(onRejectSuccess).toHaveBeenCalledTimes(1)
        expect(setDataSpy).toHaveBeenCalledWith(['ads', 'item', adId], ad)
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['ads', 'list'] })
    })

    test('request changes вызывает колбэк успеха и обновляет кэш', async () => {
        const adId = 9
        const ad = makeAd(adId)
        const body: RequestChangesBody = { reason: RejectReason.Other, comment: 'исправьте' }
        mockedRequestChanges.mockResolvedValue({ message: 'changes', ad })

        const onRequestChangesSuccess = vi.fn()

        const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
        const setDataSpy = vi.spyOn(queryClient, 'setQueryData')
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

        const { result } = renderHook(() => useAdModerationMutations(adId, { onRequestChangesSuccess }), {
            wrapper: createWrapper(queryClient),
        })

        await act(async () => {
            await result.current.requestChangesMutation.mutateAsync(body)
        })

        expect(onRequestChangesSuccess).toHaveBeenCalledTimes(1)
        expect(setDataSpy).toHaveBeenCalledWith(['ads', 'item', adId], ad)
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['ads', 'list'] })
    })

    test('isProcessing true, пока мутейшн не завершён', async () => {
        const adId = 11
        const ad = makeAd(adId)
        const deferred = createDeferred<AdMutationResponse>()
        mockedApprove.mockReturnValue(deferred.promise)

        const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

        const { result } = renderHook(() => useAdModerationMutations(adId), { wrapper: createWrapper(queryClient) })

        expect(result.current.isProcessing).toBe(false)

        act(() => {
            result.current.approveMutation.mutate()
        })

        await waitFor(() => expect(result.current.isProcessing).toBe(true))

        act(() => {
            deferred.resolve({ message: 'ok', ad })
        })

        await waitFor(() => expect(result.current.isProcessing).toBe(false))
    })
})
