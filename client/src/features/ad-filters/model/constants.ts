import { AdStatus } from '@/entities/ad/model/types'
import { AdSortBy, AdSortOrder } from './types'

export const STATUS_OPTIONS: { value: AdStatus; label: string }[] = [
    { value: AdStatus.Pending, label: 'На модерации' },
    { value: AdStatus.Approved, label: 'Одобрено' },
    { value: AdStatus.Rejected, label: 'Отклонено' },
    { value: AdStatus.Draft, label: 'На доработке' },
]

export const SORT_OPTIONS: { value: string; label: string; sortBy: AdSortBy; sortOrder: AdSortOrder }[] = [
    {
        value: 'createdAt_desc',
        label: 'Сначала новые',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    },
    {
        value: 'createdAt_asc',
        label: 'Сначала старые',
        sortBy: 'createdAt',
        sortOrder: 'asc',
    },
    {
        value: 'price_asc',
        label: 'Цена: по возрастанию',
        sortBy: 'price',
        sortOrder: 'asc',
    },
    {
        value: 'price_desc',
        label: 'Цена: по убыванию',
        sortBy: 'price',
        sortOrder: 'desc',
    },
    {
        value: 'priority_desc',
        label: 'Сначала срочные',
        sortBy: 'priority',
        sortOrder: 'desc',
    },
    {
        value: 'priority_asc',
        label: 'Сначала обычные',
        sortBy: 'priority',
        sortOrder: 'asc',
    },
]

export const INITIAL_FILTERS = {
    status: [],
    categoryId: null,
    minPrice: null,
    maxPrice: null,
    search: '',
    sortBy: AdSortBy.CreatedAt,
    sortOrder: AdSortOrder.Desc,
}
