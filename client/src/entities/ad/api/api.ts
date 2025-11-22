import qs from 'qs'
import type { AdMutationResponse, AdsListResponse, Advertisement, RejectAdRequestBody, RequestChangesBody } from '@/entities/ad/model/types'
import type { AdsListFilters } from '@/features/ad-filters/model/types'
import { apiClient } from '@/shared/api/client'

const ADS_PATH = '/ads'

/**
 * GET /ads
 * Cписок объявлений с фильтрами и пагинацией
 */
export const getAdsList = async (filters: AdsListFilters, signal?: AbortSignal): Promise<AdsListResponse> => {
    const { data } = await apiClient.get<AdsListResponse>(ADS_PATH, {
        params: filters,
        signal,
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat', skipNulls: true }),
    })
    return data
}

/**
 * GET /ads/{id}
 * Детальная информация об объявлении
 */
export const getAdById = async (id: number, signal?: AbortSignal): Promise<Advertisement> => {
    const { data } = await apiClient.get<Advertisement>(`${ADS_PATH}/${id}`, {
        signal,
    })

    return data
}

/**
 * POST /ads/{id}/approve
 * Одобрить объявление
 */
export const postApproveAd = async (id: number): Promise<AdMutationResponse> => {
    const { data } = await apiClient.post<AdMutationResponse>(`${ADS_PATH}/${id}/approve`)
    return data
}

/**
 * POST /ads/{id}/reject
 * Отклонить объявление с указанием причины и комментария
 */
export const postRejectAd = async (id: number, body: RejectAdRequestBody): Promise<AdMutationResponse> => {
    const { data } = await apiClient.post<AdMutationResponse>(`${ADS_PATH}/${id}/reject`, body)
    return data
}

/**
 * POST /ads/{id}/request-changes
 * Вернуть объявление на доработку с причиной и комментарием.
 */
export const postRequestChangesAd = async (id: number, body: RequestChangesBody): Promise<AdMutationResponse> => {
    const { data } = await apiClient.post<AdMutationResponse>(`${ADS_PATH}/${id}/request-changes`, body)
    return data
}

export interface BulkAdMutationResponse {
    ads: AdMutationResponse['ad'][]
}

export const postBulkApproveAds = async (ids: number[]): Promise<BulkAdMutationResponse> => {
    const results = await Promise.all(ids.map(id => postApproveAd(id)))
    return { ads: results.map(r => r.ad) }
}

export const postBulkRejectAds = async (ids: number[], body: RejectAdRequestBody): Promise<BulkAdMutationResponse> => {
    const results = await Promise.all(ids.map(id => postRejectAd(id, body)))
    return { ads: results.map(r => r.ad) }
}

export const postBulkRequestChangesAds = async (ids: number[], body: RequestChangesBody): Promise<BulkAdMutationResponse> => {
    const results = await Promise.all(ids.map(id => postRequestChangesAd(id, body)))
    return { ads: results.map(r => r.ad) }
}
