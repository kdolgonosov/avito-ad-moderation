import { useEffect, useState } from 'react'

interface UseListNewItemsParams {
    ads: { id: number; createdAt: string }[]
    latestCreatedAt: Date | null
    page: number
    filtersResetKey: string
}

export const useListNewItems = ({ ads, latestCreatedAt, page, filtersResetKey }: UseListNewItemsParams) => {
    const [lastSeenCreatedAt, setLastSeenCreatedAt] = useState<Date | null>(null)
    const [newCount, setNewCount] = useState(0)
    const [newIds, setNewIds] = useState<number[]>([])

    // Сбрасываем состояние при смене фильтров или страницы
    useEffect(() => {
        setLastSeenCreatedAt(null)
        setNewCount(0)
        setNewIds([])
    }, [filtersResetKey, page])

    useEffect(() => {
        if (!ads.length || !latestCreatedAt) {
            if (newCount !== 0) setNewCount(0)
            if (newIds.length !== 0) setNewIds([])
            return
        }

        if (!lastSeenCreatedAt) {
            setLastSeenCreatedAt(latestCreatedAt)
            if (newCount !== 0) setNewCount(0)
            if (newIds.length !== 0) setNewIds([])
            return
        }

        // Появились объявления новее, чем пользователь "видел"
        if (latestCreatedAt > lastSeenCreatedAt) {
            const freshAds = ads.filter(ad => new Date(ad.createdAt) > lastSeenCreatedAt)
            const ids = freshAds.map(ad => ad.id)

            setNewCount(freshAds.length)
            setNewIds(prev => {
                if (prev.length === ids.length && prev.every((id, idx) => id === ids[idx])) {
                    return prev
                }
                return ids
            })
        } else {
            if (newCount !== 0) setNewCount(0)
            if (newIds.length !== 0) setNewIds([])
        }
    }, [ads, latestCreatedAt, lastSeenCreatedAt, newCount, newIds])

    const handleShowNew = () => {
        if (latestCreatedAt) {
            setLastSeenCreatedAt(latestCreatedAt)
        }
        setNewCount(0)
        setNewIds([])
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return {
        newCount,
        newIds,
        handleShowNew,
    }
}
