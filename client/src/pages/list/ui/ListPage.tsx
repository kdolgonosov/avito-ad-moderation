import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box, Button, CircularProgress, LinearProgress, Stack, Typography } from '@mui/material'
import { AdList } from '@/pages/list/ui/AdList'
import { AdFilters } from '@/features/ad-filters/ui/AdFilters'
import { BulkAdModerationActions } from '@/features/ad-moderation/ui/BulkAdModerationActions'
import { useBulkSelection } from '@/shared/lib/hooks/useBulkSelection'
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

    const totalItems = pagination?.totalItems ?? 0

    const { selectedIds, selectedCount, hasSelection, toggleSelect, toggleSelectAll, clearSelection } = useBulkSelection({ items: ads })
    // синхронизация URL
    useListUrlSync(uiFilters, page, setSearchParams)

    const listKey = useMemo(() => `${filtersResetKey}-${page}-${ads.map(ad => ad.id).join(',')}`, [filtersResetKey, page, ads])
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
            {hasSelection && (
                <Box
                    sx={{
                        mt: 1,
                        mb: 1,
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: 'action.hover',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                    }}
                >
                    <Typography variant='body2'>
                        Выбрано объявлений: <b>{selectedCount}</b>
                    </Typography>
                    <Stack direction='row' spacing={1}>
                        <Button size='small' onClick={toggleSelectAll}>
                            Выбрать все
                        </Button>
                        <Button size='small' onClick={clearSelection}>
                            Сбросить
                        </Button>
                    </Stack>
                </Box>
            )}
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
                    <AdList listKey={listKey} ads={ads} newIds={newIds} selectedIds={selectedIds as number[]} onToggleSelect={toggleSelect} />
                    {pagination && <ListPagination page={pagination.currentPage} count={pagination.totalPages} onChange={handlePageChange} />}
                </>
            )}
            {selectedIds.length > 0 && (
                <Box
                    sx={{
                        position: 'sticky',
                        bottom: 16,
                        zIndex: 20,
                        mb: 2,
                    }}
                >
                    <BulkAdModerationActions selectedIds={selectedIds as number[]} clearSelection={() => ''} />
                </Box>
            )}
        </>
    )
}
