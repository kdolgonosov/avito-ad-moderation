import type { AdStatus } from '@/entities/ad/model/types'

export const AdSortOrder = {
    Asc: 'asc',
    Desc: 'desc',
} as const
export type AdSortOrder = (typeof AdSortOrder)[keyof typeof AdSortOrder]

export const AdSortBy = {
    CreatedAt: 'createdAt',
    Price: 'price',
    Priority: 'priority',
} as const
export type AdSortBy = (typeof AdSortBy)[keyof typeof AdSortBy]

export type AdFiltersValues = {
    status: AdStatus[]
    categoryId: number | null
    minPrice: number | null
    maxPrice: number | null
    search: string
    sortBy: AdSortBy
    sortOrder: AdSortOrder
}
export type AdsListFilters = {
    search?: string
    status?: AdStatus[]
    categoryId?: number
    minPrice?: number
    maxPrice?: number
    sortBy?: AdSortBy
    sortOrder?: AdSortOrder
}
