import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as api from '@/entities/ad/api/api'
import { AdPriority, AdStatus, type Advertisement } from '../model/types'
import { useGetAdItemQuery } from './useGetAdItemQuery'

vi.mock('@/entities/ad/api/api', () => ({
    getAdById: vi.fn(),
}))

const mockedGetAdById = vi.mocked(api.getAdById)

const createWrapper =
    (queryClient: QueryClient) =>
    ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

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

describe('useGetAdItemQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('возвращает данные объявления и пробрасывает signal', async () => {
        const adId = 42
        const ad = makeAd(adId)
        mockedGetAdById.mockResolvedValue(ad)

        const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
        const { result } = renderHook(() => useGetAdItemQuery(adId), { wrapper: createWrapper(queryClient) })

        await waitFor(() => expect(result.current.data).toEqual(ad))

        expect(mockedGetAdById).toHaveBeenCalledWith(adId, expect.any(AbortSignal))
    })

    test('не делает запрос, если id не конечное число', () => {
        const badId = Number.NaN

        const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
        const { result } = renderHook(() => useGetAdItemQuery(badId), { wrapper: createWrapper(queryClient) })

        expect(result.current.isEnabled).toBe(false)
        expect(mockedGetAdById).not.toHaveBeenCalled()
    })
})
