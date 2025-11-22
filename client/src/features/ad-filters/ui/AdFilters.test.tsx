import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { AdStatus } from '@/entities/ad/model/types'
import { INITIAL_FILTERS } from '../model/constants'
import { AdSortBy, AdSortOrder, type AdFiltersValues } from '../model/types'
import { AdFilters } from './AdFilters'

vi.mock('./AdFiltersPresetsDialog', () => ({
    AdFiltersPresetsDialog: ({ open }: { open: boolean }) => (open ? <div data-testid='presets-dialog' /> : null),
}))

const renderWithTheme = (ui: React.ReactElement) => render(<ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>)

const activeFilters: AdFiltersValues = {
    ...INITIAL_FILTERS,
    search: 'поиск',
    status: [AdStatus.Pending],
    categoryId: 2,
    minPrice: 10,
    maxPrice: 20,
    sortBy: AdSortBy.Price,
    sortOrder: AdSortOrder.Asc,
}

describe('AdFilters', () => {
    test('изменяет строку поиска и вызывает onFiltersChange', () => {
        const onChange = vi.fn()
        renderWithTheme(<AdFilters filters={INITIAL_FILTERS} onFiltersChange={onChange} />)

        const input = screen.getByLabelText('Поиск')
        fireEvent.change(input, { target: { value: 'iphone' } })

        expect(onChange).toHaveBeenCalledWith({ ...INITIAL_FILTERS, search: 'iphone' })
    })

    test('переключает чекбокс статуса', () => {
        const onChange = vi.fn()
        renderWithTheme(<AdFilters filters={INITIAL_FILTERS} onFiltersChange={onChange} />)

        const checkbox = screen.getByLabelText('Одобрено')
        fireEvent.click(checkbox)

        expect(onChange).toHaveBeenCalledWith({
            ...INITIAL_FILTERS,
            status: [AdStatus.Approved],
        })
    })

    test('меняет сортировку через Select', () => {
        const onChange = vi.fn()
        renderWithTheme(<AdFilters filters={INITIAL_FILTERS} onFiltersChange={onChange} />)

        // MUI Select == role="combobox", а не button
        const [, sortSelect] = screen.getAllByRole('combobox')

        fireEvent.mouseDown(sortSelect)

        const option = screen.getByRole('option', { name: 'Цена: по убыванию' })
        fireEvent.click(option)

        expect(onChange).toHaveBeenCalledWith({
            ...INITIAL_FILTERS,
            sortBy: AdSortBy.Price,
            sortOrder: AdSortOrder.Desc,
        })
    })

    test('кнопка сброса возвращает INITIAL_FILTERS', () => {
        const onChange = vi.fn()
        renderWithTheme(<AdFilters filters={activeFilters} onFiltersChange={onChange} />)

        fireEvent.click(screen.getByText('Сбросить фильтры'))

        expect(onChange).toHaveBeenCalledWith(INITIAL_FILTERS)
    })

    test('Slash фокусирует поле поиска', () => {
        const onChange = vi.fn()
        renderWithTheme(<AdFilters filters={INITIAL_FILTERS} onFiltersChange={onChange} />)

        const input = screen.getByLabelText('Поиск')
        expect(input).not.toHaveFocus()

        fireEvent.keyDown(document.body, { code: 'Slash', key: '/' })

        expect(input).toHaveFocus()
    })
})
