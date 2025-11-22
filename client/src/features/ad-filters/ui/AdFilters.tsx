import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, FormControl, InputAdornment, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography, type SelectChangeEvent } from '@mui/material'
import { CATEGORIES, getCategoryIcon } from '@/entities/ad/model/categories'
import { STATUS_ICONS } from '@/entities/ad/model/status'
import type { AdStatus } from '@/entities/ad/model/types'
import { StatusBadge } from '@/entities/ad/ui/StatusBadge'
import { Kbd } from '@/shared/ui'
import { INITIAL_FILTERS, SORT_OPTIONS, STATUS_OPTIONS } from '../model/constants'
import type { AdFiltersValues } from '../model/types'
import { AdFiltersPresetsDialog } from './AdFiltersPresetsDialog'

interface AdFiltersBarProps {
    filters: AdFiltersValues
    onFiltersChange: (next: AdFiltersValues) => void
}

export const AdFilters = ({ filters, onFiltersChange }: AdFiltersBarProps) => {
    const [isPresetsOpen, setIsPresetsOpen] = useState(false)

    const searchInputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code !== 'Slash' || event.altKey || event.ctrlKey || event.metaKey) return

            const target = event.target as HTMLElement | null
            if (target) {
                const tag = target.tagName
                const isEditable = tag === 'INPUT' || tag === 'TEXTAREA' || target.hasAttribute('contenteditable')

                if (isEditable) return
            }

            event.preventDefault()
            if (searchInputRef.current) {
                searchInputRef.current.focus()
                searchInputRef.current.select()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({
            ...filters,
            search: event.target.value,
        })
    }

    const handleStatusChange = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value
        const statusList = typeof value === 'string' ? value.split(',') : value

        onFiltersChange({
            ...filters,
            status: statusList as AdStatus[],
        })
    }

    const handleSortChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value
        const option = SORT_OPTIONS.find(o => o.value === value)
        if (!option) return

        onFiltersChange({
            ...filters,
            sortBy: option.sortBy,
            sortOrder: option.sortOrder,
        })
    }

    const handleMinPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
        const raw = event.target.value
        const num = raw === '' ? null : Number(raw)

        onFiltersChange({
            ...filters,
            minPrice: Number.isNaN(num) ? null : num,
        })
    }

    const handleMaxPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
        const raw = event.target.value
        const num = raw === '' ? null : Number(raw)

        onFiltersChange({
            ...filters,
            maxPrice: Number.isNaN(num) ? null : num,
        })
    }

    const handleResetFilters = () => {
        onFiltersChange(INITIAL_FILTERS)
    }

    const currentSortValue = SORT_OPTIONS.find(o => o.sortBy === filters.sortBy && o.sortOrder === filters.sortOrder)?.value ?? 'createdAt_desc'

    const hasActiveFilters =
        filters.search.trim() !== INITIAL_FILTERS.search ||
        filters.status.length > 0 ||
        filters.categoryId !== INITIAL_FILTERS.categoryId ||
        filters.minPrice !== INITIAL_FILTERS.minPrice ||
        filters.maxPrice !== INITIAL_FILTERS.maxPrice ||
        filters.sortBy !== INITIAL_FILTERS.sortBy ||
        filters.sortOrder !== INITIAL_FILTERS.sortOrder

    return (
        <Paper
            elevation={0}
            sx={{
                mb: 2,
                px: 2,
                py: 1.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Stack spacing={2}>
                {/* Поиск */}
                <TextField
                    inputRef={searchInputRef}
                    size='small'
                    label='Поиск'
                    placeholder='Название объявления...'
                    value={filters.search}
                    onChange={handleQueryChange}
                    sx={{ minWidth: 320, flexShrink: 0 }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <SearchIcon fontSize='small' />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <Typography variant='caption'>
                                        Нажмите <Kbd>/</Kbd>
                                    </Typography>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                <Stack direction='row' spacing={2} flexWrap='wrap' useFlexGap alignItems='center'>
                    {/* Статус */}
                    <FormControl size='small' sx={{ minWidth: 180 }}>
                        <InputLabel id='ad-status-label'>Статус</InputLabel>
                        <Select
                            labelId='ad-status-label'
                            label='Статус'
                            multiple
                            value={filters.status as string[]}
                            onChange={handleStatusChange}
                            renderValue={selected => {
                                const statuses = selected as AdStatus[]

                                if (!statuses.length) {
                                    return 'Все статусы'
                                }

                                return (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {statuses.map(status => (
                                            <StatusBadge key={status} status={status} size='small' variant='outlined' />
                                        ))}
                                    </Box>
                                )
                            }}
                        >
                            {STATUS_OPTIONS.map(option => {
                                const Icon = STATUS_ICONS[option.value]
                                return (
                                    <MenuItem key={option.value} value={option.value}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Icon fontSize='small' />
                                            {option.label}
                                        </Box>
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    {/* Категория */}
                    <FormControl size='small' sx={{ minWidth: 190 }}>
                        <InputLabel id='ad-category-label'>Категория</InputLabel>
                        <Select
                            labelId='ad-category-label'
                            label='Категория'
                            value={filters.categoryId === null ? '' : String(filters.categoryId)}
                            onChange={e => {
                                const raw = e.target.value
                                const id = raw === '' ? null : Number(raw)

                                onFiltersChange({
                                    ...filters,
                                    categoryId: id,
                                })
                            }}
                            renderValue={selected => {
                                if (selected === '') return 'Все категории'

                                const index = Number(selected)
                                const Icon = getCategoryIcon(index)

                                return (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Icon fontSize='small' />
                                        {CATEGORIES[index]}
                                    </Box>
                                )
                            }}
                        >
                            <MenuItem value=''>
                                <em>Все категории</em>
                            </MenuItem>

                            {CATEGORIES.map((label, index) => {
                                const Icon = getCategoryIcon(index)
                                return (
                                    <MenuItem key={index} value={index}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Icon fontSize='small' />
                                            {label}
                                        </Box>
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    {/* Цена от / до */}
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0 }}>
                        <TextField
                            size='small'
                            label='Цена от'
                            type='number'
                            inputProps={{ min: 0 }}
                            value={filters.minPrice ?? ''}
                            onChange={handleMinPriceChange}
                            sx={{ width: 120 }}
                        />
                        <TextField
                            size='small'
                            label='До'
                            type='number'
                            inputProps={{ min: 0 }}
                            value={filters.maxPrice ?? ''}
                            onChange={handleMaxPriceChange}
                            sx={{ width: 120 }}
                        />
                    </Box>

                    {/* Сортировка */}
                    <FormControl size='small' sx={{ minWidth: 190 }}>
                        <InputLabel id='ad-sort-label'>Сортировка</InputLabel>
                        <Select labelId='ad-sort-label' label='Сортировка' value={currentSortValue} onChange={handleSortChange}>
                            {SORT_OPTIONS.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
                {hasActiveFilters && (
                    <Stack direction='row' spacing={1} justifyContent='flex-end'>
                        <Button variant='outlined' size='small' onClick={() => setIsPresetsOpen(true)}>
                            Сохраненные фильтры
                        </Button>
                        <Button variant='text' onClick={handleResetFilters}>
                            Сбросить фильтры
                        </Button>
                    </Stack>
                )}
                {!hasActiveFilters && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant='outlined' size='small' onClick={() => setIsPresetsOpen(true)}>
                            Сохраненные фильтры
                        </Button>
                    </Box>
                )}
            </Stack>
            <AdFiltersPresetsDialog open={isPresetsOpen} onClose={() => setIsPresetsOpen(false)} currentFilters={filters} onApplyPreset={onFiltersChange} />
        </Paper>
    )
}
