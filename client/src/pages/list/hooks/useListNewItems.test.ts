import { act, renderHook } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import { useListNewItems } from './useListNewItems'

describe('useListNewItems', () => {
    const now = new Date('2025-03-10T10:00:00.000Z')
    const later = new Date('2025-03-10T10:05:00.000Z')

    const baseAds = [
        { id: 1, createdAt: now.toISOString() },
        { id: 2, createdAt: now.toISOString() },
    ]

    test('сбрасывает состояние при смене фильтров/страницы', () => {
        const { result, rerender } = renderHook(({ page, filtersResetKey }) => useListNewItems({ ads: baseAds, latestCreatedAt: now, page, filtersResetKey }), {
            initialProps: { page: 1, filtersResetKey: 'a' },
        })

        expect(result.current.newCount).toBe(0)

        rerender({ page: 2, filtersResetKey: 'a' })
        expect(result.current.newCount).toBe(0)
        expect(result.current.newIds).toEqual([])

        rerender({ page: 2, filtersResetKey: 'b' })
        expect(result.current.newIds).toEqual([])
    })

    test('фиксирует новые объявления, появившиеся после lastSeen', () => {
        const { result, rerender } = renderHook(({ ads, latestCreatedAt }) => useListNewItems({ ads, latestCreatedAt, page: 1, filtersResetKey: 'k' }), {
            initialProps: { ads: baseAds, latestCreatedAt: now },
        })

        expect(result.current.newCount).toBe(0)

        const freshAds = [
            { id: 3, createdAt: later.toISOString() },
            { id: 4, createdAt: later.toISOString() },
        ]

        rerender({ ads: [...freshAds, ...baseAds], latestCreatedAt: later })

        expect(result.current.newCount).toBe(2)
        expect(result.current.newIds).toEqual([3, 4])
    })

    test('handleShowNew сбрасывает счётчик и скроллит наверх', () => {
        const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

        const { result, rerender } = renderHook(({ ads, latestCreatedAt }) => useListNewItems({ ads, latestCreatedAt, page: 1, filtersResetKey: 'k' }), {
            initialProps: { ads: baseAds, latestCreatedAt: now },
        })

        // имитируем появление новых
        rerender({ ads: [{ id: 10, createdAt: later.toISOString() }, ...baseAds], latestCreatedAt: later })

        expect(result.current.newCount).toBe(1)

        act(() => {
            result.current.handleShowNew()
        })

        expect(result.current.newCount).toBe(0)
        expect(result.current.newIds).toEqual([])
        expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })

        scrollSpy.mockRestore()
    })
})
