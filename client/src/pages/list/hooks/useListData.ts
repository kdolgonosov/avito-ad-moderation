import { useEffect, useState } from 'react'
import { useGetAdsListQuery } from '@/entities/ad/hooks/useGetAdsListQuery'
import type { AdsListFilters } from '@/features/ad-filters/model/types'

export const useListData = (apiFilters: AdsListFilters, page: number) => {
    const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null)

    const { ads, pagination, latestCreatedAt, isLoading, isFetching, refetch } = useGetAdsListQuery(
        apiFilters,
        { page, limit: 10 },
        {
            refetchInterval: 10_000,
        }
    )

    // Обновляем "последнее обновление" после любой успешной загрузки
    useEffect(() => {
        if (!isFetching && !isLoading) {
            setLastUpdatedAt(new Date())
        }
    }, [isFetching, isLoading])

    return {
        ads,
        pagination,
        latestCreatedAt,
        isLoading,
        isFetching,
        refetch,
        lastUpdatedAt,
    }
}
