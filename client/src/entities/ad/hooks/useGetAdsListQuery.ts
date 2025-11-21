import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAdsList } from '@/entities/ad/api/api'
import type { AdsListPagination, AdsListRequestParams, AdsListResponse } from '@/entities/ad/model/types'
import type { AdsListFilters } from '@/features/ad-filters/model/types'

interface UseGetAdsListOptions {
    refetchInterval?: number | false
    enabled?: boolean
}

export const useGetAdsListQuery = (filters: AdsListFilters, pagination: AdsListPagination, options: UseGetAdsListOptions = {}) => {
    const params: AdsListRequestParams = useMemo(
        () => ({
            ...filters,
            ...pagination,
        }),
        [filters, pagination]
    )

    const query = useQuery<AdsListResponse, Error>({
        queryKey: ['ads', 'list', params],
        queryFn: ({ signal }) => getAdsList(params, signal),
        staleTime: 10_000,
        refetchInterval: options.refetchInterval ?? false,
        refetchOnWindowFocus: false,
        enabled: options.enabled ?? true,
    })

    const meta = query.data?.pagination
    const currentPage = meta?.currentPage ?? pagination.page
    const totalPages = meta?.totalPages ?? 0
    const totalItems = meta?.totalItems ?? 0

    const ads = query.data?.ads ?? []

    const latestCreatedAt = ads[0]?.createdAt ? new Date(ads[0].createdAt) : null

    return {
        ...query,
        ads,
        pagination: meta,
        currentPage,
        totalPages,
        totalItems,
        latestCreatedAt,
    }
}
