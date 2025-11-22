import { describe, expect, test } from 'vitest'
import { AdStatus } from '@/entities/ad/model/types'
import { INITIAL_FILTERS } from '../model/constants'
import { AdSortBy, AdSortOrder, type AdFiltersValues } from '../model/types'
import { buildSearchParamsFromState, parseFiltersAndPageFromSearchParams } from './urlState'

describe('urlState', () => {
    test('парсит все параметры и подставляет дефолты', () => {
        const params = new URLSearchParams({
            page: '3',
            search: 'велосипед',
            status: 'approved,rejected',
            categoryId: '12',
            minPrice: '100',
            maxPrice: '500',
            sortBy: AdSortBy.Price,
            sortOrder: AdSortOrder.Asc,
        })

        const { filters, page } = parseFiltersAndPageFromSearchParams(params)

        expect(page).toBe(3)
        expect(filters).toEqual({
            ...INITIAL_FILTERS,
            search: 'велосипед',
            status: [AdStatus.Approved, AdStatus.Rejected],
            categoryId: 12,
            minPrice: 100,
            maxPrice: 500,
            sortBy: AdSortBy.Price,
            sortOrder: AdSortOrder.Asc,
        })
    })

    test('возвращает первую страницу при некорректном page', () => {
        const params = new URLSearchParams({ page: '0' })
        const { page } = parseFiltersAndPageFromSearchParams(params)
        expect(page).toBe(1)
    })

    test('buildSearchParamsFromState формирует строку только из ненулевых значений', () => {
        const filters: AdFiltersValues = {
            ...INITIAL_FILTERS,
            search: 'телефон',
            status: [AdStatus.Pending, AdStatus.Draft],
            categoryId: 7,
            minPrice: 50,
            maxPrice: 200,
            sortBy: AdSortBy.Price,
            sortOrder: AdSortOrder.Asc,
        }

        const searchParams = buildSearchParamsFromState(filters, 2)

        expect(searchParams.get('page')).toBe('2')
        expect(searchParams.get('search')).toBe('телефон')
        expect(searchParams.get('status')).toBe(`${AdStatus.Pending},${AdStatus.Draft}`)
        expect(searchParams.get('categoryId')).toBe('7')
        expect(searchParams.get('minPrice')).toBe('50')
        expect(searchParams.get('maxPrice')).toBe('200')
        expect(searchParams.get('sortBy')).toBe(AdSortBy.Price)
        expect(searchParams.get('sortOrder')).toBe(AdSortOrder.Asc)
    })

    test('buildSearchParamsFromState не пишет дефолтные sortBy/sortOrder и page=1', () => {
        const filters: AdFiltersValues = {
            ...INITIAL_FILTERS,
            search: '',
            status: [],
            categoryId: null,
            minPrice: null,
            maxPrice: null,
            sortBy: AdSortBy.CreatedAt, // дефолт
            sortOrder: AdSortOrder.Desc, // дефолт
        }

        const searchParams = buildSearchParamsFromState(filters, 1)

        expect(searchParams.toString()).toBe('')
    })
})
