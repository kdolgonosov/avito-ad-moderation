import { Stack } from '@mui/material'
import type { Advertisement } from '@/entities/ad/model/types'
import { AdCard } from '@/entities/ad/ui/AdCard'
import { AnimatedItem, AnimatedList } from '@/shared/ui'

interface AdListProps {
    ads: Advertisement[]
    newIds: number[]
    selectedIds: number[]
    onToggleSelect: (id: number) => void
    listKey: string // для корректной анимации
}

export const AdList = ({ ads, newIds, selectedIds, onToggleSelect, listKey }: AdListProps) => {
    return (
        <AnimatedList listKey={listKey}>
            <Stack spacing={2}>
                {ads.map(ad => {
                    const isNew = newIds ? newIds.includes(ad.id) : false

                    return (
                        <AnimatedItem key={ad.id}>
                            <AdCard ad={ad} isNew={isNew} selected={selectedIds.includes(ad.id)} onToggleSelect={onToggleSelect} />
                        </AnimatedItem>
                    )
                })}
            </Stack>
        </AnimatedList>
    )
}
