import { useMemo } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useGetAdsListQuery } from '@/entities/ad/hooks/useGetAdsListQuery'
import { parseFiltersAndPageFromSearchParams } from '@/features/ad-filters/lib/urlState'
import type { AdsListFilters } from '@/features/ad-filters/model/types'

type NavState = {
    // id объявления, с которого мы перешли на следующую страницу
    prevFromPrevPage?: number
    // страница списка, с которой пришли
    prevFromPage?: number
}

export const useAdNavigation = (currentAdId: number | null) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams] = useSearchParams()

    const navState = (location.state || {}) as NavState

    const { filters: listFiltersState, page: listPage } = parseFiltersAndPageFromSearchParams(searchParams)

    const listApiFilters: AdsListFilters = {
        search: listFiltersState.search || undefined,
        status: listFiltersState.status.length ? listFiltersState.status : undefined,
        categoryId: listFiltersState.categoryId ?? undefined,
        minPrice: listFiltersState.minPrice ?? undefined,
        maxPrice: listFiltersState.maxPrice ?? undefined,
        sortBy: listFiltersState.sortBy,
        sortOrder: listFiltersState.sortOrder,
    }

    const { ads: listAds = [], pagination: listPagination, isLoading: isListLoading } = useGetAdsListQuery(listApiFilters, { page: listPage, limit: 10 })

    const hasNextPage = !!listPagination && listPagination.currentPage < listPagination.totalPages
    const hasPrevPage = !!listPagination && listPagination.currentPage > 1

    const {
        prevAdId: rawPrevAdId,
        nextAdId,
        isAtFirstOnPage,
        isAtLastOnPage,
    } = useMemo(() => {
        if (!listAds.length || currentAdId == null) {
            return {
                prevAdId: null as number | null,
                nextAdId: null as number | null,
                isAtFirstOnPage: false,
                isAtLastOnPage: false,
            }
        }

        const index = listAds.findIndex(adItem => adItem.id === currentAdId)

        if (index === -1) {
            return {
                prevAdId: null,
                nextAdId: listAds[0]?.id ?? null,
                isAtFirstOnPage: false,
                isAtLastOnPage: false,
            }
        }

        const prev = index > 0 ? listAds[index - 1].id : null
        const next = index < listAds.length - 1 ? listAds[index + 1].id : null

        return {
            prevAdId: prev,
            nextAdId: next,
            isAtFirstOnPage: index === 0,
            isAtLastOnPage: index === listAds.length - 1,
        }
    }, [listAds, currentAdId])

    // Если мы только что перешли с предыдущей страницы на первую запись текущей,
    // используем id оттуда как prevAdId и не грузим prevPage.
    const crossPagePrevAdId =
        isAtFirstOnPage && !rawPrevAdId && navState.prevFromPrevPage != null && navState.prevFromPage === listPage - 1 ? navState.prevFromPrevPage : null

    const prevAdId = rawPrevAdId ?? crossPagePrevAdId

    const shouldLoadPrevPage = hasPrevPage && isAtFirstOnPage && !prevAdId
    const shouldLoadNextPage = hasNextPage && isAtLastOnPage && !nextAdId

    const { ads: prevPageAds = [] } = useGetAdsListQuery(listApiFilters, { page: listPage - 1, limit: 10 }, { enabled: shouldLoadPrevPage })
    const prevPageLastId = prevPageAds.length > 0 ? prevPageAds[prevPageAds.length - 1].id : null

    const { ads: nextPageAds = [] } = useGetAdsListQuery(listApiFilters, { page: listPage + 1, limit: 10 }, { enabled: shouldLoadNextPage })
    const nextPageFirstId = nextPageAds[0]?.id ?? null

    const buildSearchWithPage = (page: number) => {
        const sp = new URLSearchParams(searchParams)
        sp.set('page', String(page))
        return `?${sp.toString()}`
    }

    const handlePrevClick = () => {
        if (!listPagination) return

        if (prevAdId) {
            navigate({
                pathname: `/item/${prevAdId}`,
                search: location.search,
            })
            return
        }

        if (hasPrevPage && prevPageLastId) {
            const targetPage = listPage - 1
            navigate({
                pathname: `/item/${prevPageLastId}`,
                search: buildSearchWithPage(targetPage),
            })
        }
    }

    const handleNextClick = () => {
        if (!listPagination) return

        if (nextAdId) {
            navigate({
                pathname: `/item/${nextAdId}`,
                search: location.search,
            })
            return
        }

        if (hasNextPage && nextPageFirstId) {
            const targetPage = listPage + 1

            navigate(
                {
                    pathname: `/item/${nextPageFirstId}`,
                    search: buildSearchWithPage(targetPage),
                },
                {
                    state: {
                        prevFromPrevPage: currentAdId,
                        prevFromPage: listPage,
                    } as NavState,
                }
            )
        }
    }

    const handleExitClick = () => {
        navigate({
            pathname: '/list',
        })
    }
    const isPrevDisabled = (!prevAdId && (!hasPrevPage || !prevPageLastId)) || isListLoading
    const isNextDisabled = (!nextAdId && (!hasNextPage || !nextPageFirstId)) || isListLoading

    return {
        isListLoading,
        prevAdId,
        nextAdId,
        isPrevDisabled,
        isNextDisabled,
        handlePrevClick,
        handleNextClick,
        handleExitClick,
    }
}
