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
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent='space-between'
                alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
                spacing={{ xs: 1.5, sm: 2 }}
                mb={{ xs: 2, sm: 3 }}
            >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        variant='h4'
                        gutterBottom
                        sx={{
                            fontSize: {
                                xs: '1.4rem',
                                sm: '2.125rem',
                            },
                            wordBreak: 'break-word',
                        }}
                    >
                        {ad.title}
                    </Typography>

                    <Stack direction='row' spacing={1} alignItems='center' sx={{ flexWrap: 'wrap', rowGap: 0.5 }}>
                        <StatusBadge status={ad.status} />
                        {ad.priority === AdPriority.Urgent && (
                            <Chip
                                label='Срочное объявление'
                                color='warning'
                                size='small'
                                sx={{
                                    fontWeight: 500,
                                    fontSize: { xs: 11, sm: 12 },
                                }}
                            />
                        )}
                    </Stack>
                </Box>

                <Box
                    sx={{
                        textAlign: { xs: 'left', sm: 'right' },
                        mt: { xs: 0.5, sm: 0 },
                    }}
                >
                    <Typography
                        variant='h5'
                        sx={{
                            fontSize: { xs: '1.2rem', sm: '1.5rem' },
                            fontWeight: 600,
                        }}
                    >
                        {formatPrice(ad.price)}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ fontSize: { xs: 12, sm: 13 } }}>
                        ID: {ad.id}
                    </Typography>
                </Box>
            </Stack>

            <Typography
                variant='body2'
                color='text.secondary'
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mb: 1,
                    fontSize: { xs: 12, sm: 13 },
                    flexWrap: 'wrap',
                }}
            >
                <CategoryIcon fontSize='small' style={{ opacity: 0.7 }} />
                <span>
                    {ad.category} · Опубликовано {formatDate(ad.createdAt, true)}
                </span>
            </Typography>
        </>
    )
}
