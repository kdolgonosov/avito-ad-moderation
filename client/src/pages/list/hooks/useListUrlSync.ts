import { useEffect } from 'react'
import type { SetURLSearchParams } from 'react-router-dom'
import { buildSearchParamsFromState } from '@/features/ad-filters/lib/urlState'
import type { AdFiltersValues } from '@/features/ad-filters/model/types'

export const useListUrlSync = (filtersForUi: AdFiltersValues, page: number, setSearchParams: SetURLSearchParams) => {
    useEffect(() => {
        const params = buildSearchParamsFromState(filtersForUi, page)
        setSearchParams(params, { replace: true })
    }, [filtersForUi, page, setSearchParams])
}
