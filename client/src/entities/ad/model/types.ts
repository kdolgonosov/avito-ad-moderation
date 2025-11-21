import type { AdsListFilters } from '@/features/ad-filters/model/types'

export type SortOrder = 'asc' | 'desc'
export interface Pagination {
    currentPage: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
}
export const AdStatus = {
    Pending: 'pending',
    Approved: 'approved',
    Rejected: 'rejected',
    Draft: 'draft',
} as const
export type AdStatus = (typeof AdStatus)[keyof typeof AdStatus]

export const AdPriority = {
    Normal: 'normal',
    Urgent: 'urgent',
} as const
export type AdPriority = (typeof AdPriority)[keyof typeof AdPriority]

export const ModerationAction = {
    Approved: 'approved',
    Rejected: 'rejected',
    RequestChanges: 'requestChanges',
} as const
export type ModerationAction = (typeof ModerationAction)[keyof typeof ModerationAction]

export interface ModerationHistoryItem {
    id: number
    action: ModerationAction
    moderatorId: number
    moderatorName: string
    comment: string
    reason: string | null
    timestamp: string
}

export interface Seller {
    id: number
    name: string
    rating: string
    registeredAt: string
    totalAds: number
}

export type AdCharacteristics = Record<string, string>

export interface Advertisement {
    id: number
    title: string
    description: string
    price: number
    categoryId: number
    category: string
    images: string[]
    status: AdStatus
    priority: AdPriority
    seller: Seller
    characteristics: AdCharacteristics
    createdAt: string
    updatedAt: string
    moderationHistory: ModerationHistoryItem[]
}

export const RejectReason = {
    ForbiddenProduct: 'Запрещённый товар',
    WrongCategory: 'Неверная категория',
    InvalidDescription: 'Некорректное описание',
    BadPhotos: 'Проблемы с фото',
    FraudSuspected: 'Подозрение на мошенничество',
    Other: 'Другое',
} as const

export type RejectReason = (typeof RejectReason)[keyof typeof RejectReason]

/**
 * Фильтры и параметры списка объявлений /ads
 */

export type AdsListPagination = {
    page: number
    limit: number
}

/**
 * для API
 */
export type AdsListRequestParams = AdsListFilters & AdsListPagination
/**
 * Ответ /ads
 */
export interface AdsListResponse {
    ads: Advertisement[]
    pagination: Pagination
}

/**
 * Ответ на POST /ads/{id}/approve|reject|request-changes
 */
export interface AdMutationResponse {
    message: string
    ad: Advertisement
}

/**
 * Тело запроса для /ads/{id}/reject
 */
export interface RejectAdRequestBody {
    reason: RejectReason
    comment?: string
}

/**
 * Тело запроса для /ads/{id}/request-changes
 *
 */
export interface RequestChangesBody {
    reason: RejectReason
    comment?: string
}
