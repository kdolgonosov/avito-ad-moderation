import { INITIAL_FILTERS } from '../model/constants'
import { AdSortBy, AdSortOrder, type AdFiltersValues } from '../model/types'

export function parseFiltersAndPageFromSearchParams(searchParams: URLSearchParams): { filters: AdFiltersValues; page: number } {
    const initial = INITIAL_FILTERS

    const pageParam = searchParams.get('page')
    const searchParam = searchParams.get('search') ?? initial.search
    const statusParam = searchParams.get('status')
    const categoryParam = searchParams.get('categoryId')
    const minPriceParam = searchParams.get('minPrice')
    const maxPriceParam = searchParams.get('maxPrice')
    const sortByParam = searchParams.get('sortBy') as AdSortBy | null
    const sortOrderParam = searchParams.get('sortOrder') as AdSortOrder | null

    const filters: AdFiltersValues = {
        ...initial,
        search: searchParam,
        status: statusParam ? (statusParam.split(',') as AdFiltersValues['status']) : initial.status,
        categoryId: categoryParam ? Number(categoryParam) : initial.categoryId,
        minPrice: minPriceParam ? Number(minPriceParam) : initial.minPrice,
        maxPrice: maxPriceParam ? Number(maxPriceParam) : initial.maxPrice,
        sortBy: sortByParam ?? initial.sortBy,
        sortOrder: sortOrderParam ?? initial.sortOrder,
    }

    const page = pageParam && !Number.isNaN(Number(pageParam)) && Number(pageParam) > 0 ? Number(pageParam) : 1

    return { filters, page }
}

export function buildSearchParamsFromState(filters: AdFiltersValues, page: number): URLSearchParams {
    const params = new URLSearchParams()

    if (page > 1) {
        params.set('page', String(page))
    }

    if (filters.search.trim()) {
        params.set('search', filters.search.trim())
    }

    if (filters.status.length) {
        params.set('status', filters.status.join(','))
    }

    if (filters.categoryId !== null) {
        params.set('categoryId', String(filters.categoryId))
    }

    if (filters.minPrice !== null) {
        params.set('minPrice', String(filters.minPrice))
    }

    if (filters.maxPrice !== null) {
        params.set('maxPrice', String(filters.maxPrice))
    }

    if (filters.sortBy !== AdSortBy.CreatedAt) {
        params.set('sortBy', filters.sortBy)
    }

    if (filters.sortOrder !== AdSortOrder.Desc) {
        params.set('sortOrder', filters.sortOrder)
    }

    return params
}
