import { Stack } from '@mui/material'
import type { Advertisement } from '@/entities/ad/model/types'
import { AdCard } from '@/entities/ad/ui/AdCard'

interface AdListProps {
    ads: Advertisement[]
    newIds: number[]
    selectedIds: number[]
    onToggleSelect: (id: number) => void
}

export const AdList = ({ ads, newIds, selectedIds, onToggleSelect }: AdListProps) => {
    return (
        <Stack spacing={2}>
            {ads.map(ad => {
                const isNew = newIds ? newIds.includes(ad.id) : false

                return <AdCard key={ad.id} ad={ad} isNew={isNew} selected={selectedIds.includes(ad.id)} onToggleSelect={onToggleSelect} />
            })}
        </Stack>
    )
}
