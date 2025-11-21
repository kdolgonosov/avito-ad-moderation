import { useEffect, useMemo, useState } from 'react'

type Id = number | string

interface UseBulkSelectionOptions<T extends { id: Id }> {
    items: T[]
}

export const useBulkSelection = <T extends { id: Id }>({ items }: UseBulkSelectionOptions<T>) => {
    const [selectedIds, setSelectedIds] = useState<Id[]>([])

    useEffect(() => {
        setSelectedIds([])
    }, [items])

    const selectedCount = selectedIds.length
    const hasSelection = selectedCount > 0

    const isAllSelected = useMemo(() => items.length > 0 && selectedIds.length === items.length, [items, selectedIds])

    const toggleSelect = (id: Id) => {
        setSelectedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
    }

    const toggleSelectAll = () => {
        setSelectedIds(items.map(item => item.id))
    }

    const clearSelection = () => {
        setSelectedIds([])
    }

    return {
        selectedIds,
        selectedCount,
        hasSelection,
        isAllSelected,
        toggleSelect,
        toggleSelectAll,
        clearSelection,
    }
}
