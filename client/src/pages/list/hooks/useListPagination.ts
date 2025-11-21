import { useEffect, useState } from 'react'
import { parseFiltersAndPageFromSearchParams } from '@/features/ad-filters/lib/urlState'

export const useListPagination = (searchParams: URLSearchParams, filtersResetKey: string) => {
    const [page, setPage] = useState(() => {
        const { page } = parseFiltersAndPageFromSearchParams(searchParams)
        return page
    })

    useEffect(() => {
        setPage(1)
    }, [filtersResetKey])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [page])

    const handlePageChange = (_: unknown, newPage: number) => {
        setPage(newPage)
    }

    return {
        page,
        setPage,
        handlePageChange,
    }
}
