import { useEffect, useMemo, useState } from 'react'
import type { ModerationHistoryItem } from '@/entities/ad/model/types'
import { HISTORY_PAGE_SIZE } from '../model/constants'

export const useModerationHistory = (history: ModerationHistoryItem[] | undefined) => {
    const [historyPage, setHistoryPage] = useState(1)

    useEffect(() => {
        setHistoryPage(1)
    }, [history])

    const sortedHistory = useMemo(() => (history ?? []).slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [history])

    const totalHistoryPages = sortedHistory.length > 0 ? Math.ceil(sortedHistory.length / HISTORY_PAGE_SIZE) : 0

    const historyPageItems = useMemo(() => {
        if (!sortedHistory.length) return []
        const start = (historyPage - 1) * HISTORY_PAGE_SIZE
        const end = start + HISTORY_PAGE_SIZE
        return sortedHistory.slice(start, end)
    }, [sortedHistory, historyPage])

    const handleHistoryPageChange = (_: unknown, page: number) => {
        setHistoryPage(page)
    }

    return {
        sortedHistory,
        historyPage,
        historyPageItems,
        totalHistoryPages,
        handleHistoryPageChange,
    }
}
