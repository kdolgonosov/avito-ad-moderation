import { useEffect, useRef, useState } from 'react'
import { parseFiltersAndPageFromSearchParams } from '@/features/ad-filters/lib/urlState'

export const useListPagination = (searchParams: URLSearchParams, filtersResetKey: string) => {
    // инициализируем страницу из URL один раз
    const [page, setPage] = useState(() => {
        const { page } = parseFiltersAndPageFromSearchParams(searchParams)
        return page
    })

    // Были ли какие-то query-параметры на момент маунта
    const hasAnyParamsOnMountRef = useRef(searchParams.toString().length > 0)

    const prevFiltersResetKeyRef = useRef(filtersResetKey)

    const isFirstChangeAfterMountRef = useRef(true)

    useEffect(() => {
        // если ключ не изменился, то ничего не делаем
        if (filtersResetKey === prevFiltersResetKeyRef.current) return

        const hasAnyParamsOnMount = hasAnyParamsOnMountRef.current

        //  были query-параметры, страницу не сбрасываем
        if (hasAnyParamsOnMount && isFirstChangeAfterMountRef.current) {
            isFirstChangeAfterMountRef.current = false
            prevFiltersResetKeyRef.current = filtersResetKey
            return
        }

        setPage(1)
        isFirstChangeAfterMountRef.current = false
        prevFiltersResetKeyRef.current = filtersResetKey
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
