import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as api from '@/entities/ad/api/api'
import { AdSortBy, AdSortOrder, type AdsListFilters } from '@/features/ad-filters/model/types'
import { AdPriority, AdStatus, type AdsListPagination, type AdsListResponse, type Advertisement } from '../model/types'
import { useGetAdsListQuery } from './useGetAdsListQuery'

vi.mock('@/entities/ad/api/api', () => ({
    getAdsList: vi.fn(),
}))

const mockedGetAdsList = vi.mocked(api.getAdsList)

const createWrapper =
    (queryClient: QueryClient) =>
    ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

const makeAd = (id: number, createdAt = '2025-01-02T10:00:00.000Z'): Advertisement => ({
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
    createdAt,
    updatedAt: createdAt,
    moderationHistory: [],
})

describe('useGetAdsListQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('возвращает список, пробрасывает signal и считает мета-данные', async () => {
        const filters: AdsListFilters = { search: 'abc', sortBy: AdSortBy.CreatedAt, sortOrder: AdSortOrder.Desc }
        const pagination: AdsListPagination = { page: 2, limit: 10 }
        const ads = [makeAd(1, '2025-03-01T00:00:00.000Z'), makeAd(2, '2025-02-01T00:00:00.000Z')]
        const response: AdsListResponse = {
            ads,
            pagination: {
                currentPage: 2,
                totalItems: 50,
                totalPages: 5,
                itemsPerPage: 10,
            },
        }

        mockedGetAdsList.mockResolvedValue(response)

        const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
        const { result } = renderHook(() => useGetAdsListQuery(filters, pagination), { wrapper: createWrapper(queryClient) })

        await waitFor(() => expect(result.current.data).toEqual(response))

        expect(mockedGetAdsList).toHaveBeenCalledWith({ ...filters, ...pagination }, expect.any(AbortSignal))
        expect(result.current.ads).toEqual(ads)
        expect(result.current.currentPage).toBe(2)
        expect(result.current.totalPages).toBe(5)
        expect(result.current.totalItems).toBe(50)
        expect(result.current.latestCreatedAt).toEqual(new Date('2025-03-01T00:00:00.000Z'))
    })

    test('не делает запрос при enabled=false', () => {
        const filters: AdsListFilters = {}
        const pagination: AdsListPagination = { page: 1, limit: 10 }

        const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
        const { result } = renderHook(() => useGetAdsListQuery(filters, pagination, { enabled: false }), {
            wrapper: createWrapper(queryClient),
        })

        expect(result.current.isEnabled).toBe(false)
        expect(mockedGetAdsList).not.toHaveBeenCalled()
    })
})
