import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { AdStatus } from '@/entities/ad/model/types'
import { parseFiltersAndPageFromSearchParams } from '@/features/ad-filters/lib/urlState'
import { useAdFiltersStore } from '@/features/ad-filters/model/adFilters.store'
import { AdSortBy, AdSortOrder } from '@/features/ad-filters/model/types'
import { useListFilters } from './useListFilters'

vi.mock('@/features/ad-filters/model/adFilters.store', () => {
    const state = {
        status: [],
        categoryId: null,
        minPrice: null,
        maxPrice: null,
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        setFilters: vi.fn(),
    }
    return {
        useAdFiltersStore: vi.fn(() => state),
    }
})

vi.mock('@/features/ad-filters/lib/urlState', () => ({
    parseFiltersAndPageFromSearchParams: vi.fn(),
}))

vi.mock('@/shared/lib/hooks/useDebouncedValue', () => ({
    useDebouncedValue: (v: any) => v,
}))

const mockedStore = vi.mocked(useAdFiltersStore)
const mockedParse = vi.mocked(parseFiltersAndPageFromSearchParams)

describe('useListFilters', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedStore.mockReturnValue({
            status: [],
            categoryId: null,
            minPrice: null,
            maxPrice: null,
            search: '',
            sortBy: AdSortBy.CreatedAt,
            sortOrder: AdSortOrder.Desc,
            setFilters: vi.fn(),
        } as any)
    })

    test('инициализирует store из searchParams один раз', () => {
        const setFilters = vi.fn()
        mockedStore.mockReturnValue({
            status: [],
            categoryId: null,
            minPrice: null,
            maxPrice: null,
            search: '',
            sortBy: AdSortBy.CreatedAt,
            sortOrder: AdSortOrder.Desc,
            setFilters,
        } as any)

        mockedParse.mockReturnValue({
            filters: {
                status: [AdStatus.Approved],
                categoryId: 1,
                minPrice: 10,
                maxPrice: 20,
                search: 'abc',
                sortBy: AdSortBy.Price,
                sortOrder: AdSortOrder.Asc,
            } as any,
            page: 1,
        })

        const params = new URLSearchParams('status=approved')

        renderHook(() => useListFilters(params))

        expect(mockedParse).toHaveBeenCalledWith(params)
        expect(setFilters).toHaveBeenCalledTimes(1)

        renderHook(() => useListFilters(params))
        expect(setFilters).toHaveBeenCalledTimes(1)
    })

    test('формирует uiFilters и apiFilters с нормализацией', () => {
        mockedStore.mockReturnValue({
            status: [AdStatus.Pending],
            categoryId: 5,
            minPrice: 100,
            maxPrice: 200,
            search: '  ab  ',
            sortBy: AdSortBy.Priority,
            sortOrder: AdSortOrder.Asc,
            setFilters: vi.fn(),
        } as any)

        mockedParse.mockReturnValue({ filters: {} as any, page: 1 })

        const { result } = renderHook(() => useListFilters(new URLSearchParams()))

        expect(result.current.uiFilters).toEqual({
            status: [AdStatus.Pending],
            categoryId: 5,
            minPrice: 100,
            maxPrice: 200,
            search: '  ab  ',
            sortBy: AdSortBy.Priority,
            sortOrder: AdSortOrder.Asc,
        })

        expect(result.current.apiFilters).toEqual({
            status: [AdStatus.Pending],
            categoryId: 5,
            minPrice: 100,
            maxPrice: 200,
            search: 'ab',
            sortBy: AdSortBy.Priority,
            sortOrder: AdSortOrder.Asc,
        })

        expect(result.current.filtersResetKey).toBe(JSON.stringify([[AdStatus.Pending], 5, 100, 200, 'ab', AdSortBy.Priority, AdSortOrder.Asc]))
    })

    test('короткий поиск (<2 символов) убирается из apiFilters', () => {
        mockedStore.mockReturnValue({
            status: [],
            categoryId: null,
            minPrice: null,
            maxPrice: null,
            search: ' x ',
            sortBy: AdSortBy.CreatedAt,
            sortOrder: AdSortOrder.Desc,
            setFilters: vi.fn(),
        } as any)

        const { result } = renderHook(() => useListFilters(new URLSearchParams()))

        expect(result.current.apiFilters.search).toBeUndefined()
    })

    test('возвращает setFilters из стора', () => {
        const setFilters = vi.fn()
        mockedStore.mockReturnValue({
            status: [],
            categoryId: null,
            minPrice: null,
            maxPrice: null,
            search: '',
            sortBy: AdSortBy.CreatedAt,
            sortOrder: AdSortOrder.Desc,
            setFilters,
        } as any)

        const { result } = renderHook(() => useListFilters(new URLSearchParams()))

        act(() => {
            result.current.setFilters({
                status: [],
                categoryId: null,
                minPrice: null,
                maxPrice: null,
                search: '',
                sortBy: AdSortBy.Price,
                sortOrder: AdSortOrder.Asc,
            })
        })

        expect(setFilters).toHaveBeenCalled()
    })
})
