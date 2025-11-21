import { useSearchParams } from 'react-router-dom'
import { Box, CircularProgress, LinearProgress, Typography } from '@mui/material'
import { AdList } from '@/pages/list/ui/AdList'
import { AdFilters } from '@/features/ad-filters/ui/AdFilters'
import { ListPagination } from '@/shared/ui'
import { useListData, useListFilters, useListNewItems, useListPagination, useListUrlSync } from '../hooks'
import { LastUpdatedInfo } from './LastUpdatedInfo'
import { NewAdsBanner } from './NewAdsBanner'

export const ListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    // фильтры
    const { uiFilters, apiFilters, filtersResetKey, setFilters } = useListFilters(searchParams)

    // пагинация
    const { page, handlePageChange } = useListPagination(searchParams, filtersResetKey)

    // данные списка
    const { ads, pagination, latestCreatedAt, isLoading, isFetching, refetch, lastUpdatedAt } = useListData(apiFilters, page)

    // новые объявления
    const { newCount, newIds, handleShowNew } = useListNewItems({
        ads,
        latestCreatedAt,
        page,
        filtersResetKey,
    })

    // синхронизация URL
    useListUrlSync(uiFilters, page, setSearchParams)

    const totalItems = pagination?.totalItems ?? 0

    return (
        <>
            <Typography variant='h4' gutterBottom>
                Список объявлений
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                    color: 'text.secondary',
                }}
            >
                {isLoading ? <CircularProgress size='small' /> : <Typography variant='body2'>Найдено {totalItems} объявлений</Typography>}

                {!isLoading && <LastUpdatedInfo lastUpdatedAt={lastUpdatedAt} isFetching={isFetching} onRefresh={() => refetch()} />}
            </Box>

            <AdFilters filters={uiFilters} onFiltersChange={setFilters} />

            {isFetching && !isLoading && <LinearProgress sx={{ mb: 1 }} />}

            <NewAdsBanner newCount={newCount} onShowNew={handleShowNew} />

            {isLoading && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 6,
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            {!isLoading && ads.length === 0 && (
                <Box
                    sx={{
                        py: 4,
                        textAlign: 'center',
                        color: 'text.secondary',
                    }}
                >
                    <Typography variant='body1'>Объявлений не найдено. Попробуйте изменить параметры фильтра.</Typography>
                </Box>
            )}

            {!isLoading && ads.length > 0 && (
                <>
                    <AdList ads={ads} newIds={newIds} />
                    {pagination && <ListPagination page={pagination.currentPage} count={pagination.totalPages} onChange={handlePageChange} />}
                </>
            )}
        </>
    )
}
