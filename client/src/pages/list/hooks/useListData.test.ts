import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useGetAdsListQuery } from '@/entities/ad/hooks/useGetAdsListQuery'
import { AdSortBy, AdSortOrder, type AdsListFilters } from '@/features/ad-filters/model/types'
import { useListData } from './useListData'

vi.mock('@/entities/ad/hooks/useGetAdsListQuery', () => ({
    useGetAdsListQuery: vi.fn(),
}))

const mockedUseGetAdsListQuery = vi.mocked(useGetAdsListQuery)

const baseReturn = {
    ads: [],
    pagination: null,
    latestCreatedAt: null,
    isLoading: false,
    isFetching: false,
    refetch: vi.fn(),
}

describe('useListData', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('прокидывает фильтры, пагинацию и опции в useGetAdsListQuery', () => {
        mockedUseGetAdsListQuery.mockReturnValue(baseReturn as any)

        const filters: AdsListFilters = {
            search: 'bike',
            sortBy: AdSortBy.Price,
            sortOrder: AdSortOrder.Asc,
        }
        const page = 2

        renderHook(() => useListData(filters, page, true))

        expect(mockedUseGetAdsListQuery).toHaveBeenCalledWith(filters, { page, limit: 10 }, { refetchInterval: 10_000, enabled: true })
    })

    test('lastUpdatedAt обновляется, когда загрузка завершилась', async () => {
        const state = {
            ...baseReturn,
            isLoading: true,
            isFetching: true,
        }
        mockedUseGetAdsListQuery.mockImplementation(() => state as any)

        const { result, rerender } = renderHook(({ enabled }) => useListData({}, 1, enabled), {
            initialProps: { enabled: true },
        })

        expect(result.current.lastUpdatedAt).toBeNull()

        act(() => {
            state.isLoading = false
            state.isFetching = false
            rerender({ enabled: true })
        })

        await waitFor(() => expect(result.current.lastUpdatedAt).toBeInstanceOf(Date))
    })
})
