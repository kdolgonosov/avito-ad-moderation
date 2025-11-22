import { act, renderHook } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { useBulkSelection } from './useBulkSelection'

type Item = { id: number; name: string }

describe('useBulkSelection', () => {
    const items: Item[] = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        { id: 3, name: 'c' },
    ]

    test('по умолчанию нет выбранных', () => {
        const { result } = renderHook(() => useBulkSelection({ items }))

        expect(result.current.selectedIds).toEqual([])
        expect(result.current.hasSelection).toBe(false)
        expect(result.current.isAllSelected).toBe(false)
    })

    test('toggleSelect выбирает и снимает выбор', () => {
        const { result } = renderHook(() => useBulkSelection({ items }))

        act(() => {
            result.current.toggleSelect(1)
        })
        expect(result.current.selectedIds).toEqual([1])
        expect(result.current.hasSelection).toBe(true)

        act(() => {
            result.current.toggleSelect(1)
        })
        expect(result.current.selectedIds).toEqual([])
        expect(result.current.hasSelection).toBe(false)
    })

    test('toggleSelectAll выбирает все элементы', () => {
        const { result } = renderHook(() => useBulkSelection({ items }))

        act(() => {
            result.current.toggleSelectAll()
        })

        expect(result.current.selectedIds).toEqual(items.map(i => i.id))
        expect(result.current.isAllSelected).toBe(true)
    })

    test('clearSelection очищает выбор', () => {
        const { result, rerender } = renderHook(() => useBulkSelection({ items }))

        act(() => {
            result.current.toggleSelect(2)
        })
        expect(result.current.hasSelection).toBe(true)

        act(() => {
            result.current.clearSelection()
        })
        expect(result.current.selectedIds).toEqual([])
        expect(result.current.hasSelection).toBe(false)

        // смена items тоже очищает выбор
        const newItems = [{ id: 10, name: 'x' }]
        rerender({ items: newItems })

        expect(result.current.selectedIds).toEqual([])
    })
})
