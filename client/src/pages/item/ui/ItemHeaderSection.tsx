import { Box, Chip, Stack, Typography } from '@mui/material'
import { getCategoryIcon } from '@/entities/ad/model/categories'
import { AdPriority, type Advertisement } from '@/entities/ad/model/types'
import { StatusBadge } from '@/entities/ad/ui/StatusBadge'
import { formatDate, formatPrice } from '@/shared/lib/utils/format'

interface ItemHeaderSectionProps {
    ad: Advertisement
}

export const ItemHeaderSection = ({ ad }: ItemHeaderSectionProps) => {
    const CategoryIcon = getCategoryIcon(ad.categoryId)

    return (
        <>
            <Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2} mb={3}>
                <Box>
                    <Typography variant='h4' gutterBottom>
                        {ad.title}
                    </Typography>

                    <Stack direction='row' spacing={1} alignItems='center'>
                        <StatusBadge status={ad.status} />
                        {ad.priority === AdPriority.Urgent && <Chip label='Срочное объявление' color='warning' size='small' sx={{ fontWeight: 500 }} />}
                    </Stack>
                </Box>

                <Box textAlign='right'>
                    <Typography variant='h5'>{formatPrice(ad.price)}</Typography>
                    <Typography variant='body2' color='text.secondary'>
                        ID: {ad.id}
                    </Typography>
                </Box>
            </Stack>

            <Typography variant='body2' color='text.secondary' sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <CategoryIcon fontSize='small' style={{ opacity: 0.7 }} />
                {ad.category} · Опубликовано {formatDate(ad.createdAt, true)}
            </Typography>
        </>
    )
}
