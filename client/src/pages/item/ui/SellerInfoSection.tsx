import { Box, Rating, Stack, Typography } from '@mui/material'
import type { Advertisement } from '@/entities/ad/model/types'
import { formatDate } from '@/shared/lib/utils/format'

interface SellerInfoSectionProps {
    seller: Advertisement['seller']
}

export const SellerInfoSection = ({ seller }: SellerInfoSectionProps) => {
    const initials = seller.name
        .split(' ')
        .filter(Boolean)
        .map(part => part[0])
        .slice(0, 2)
        .join('')

    const registeredAt = formatDate(seller.registeredAt)

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.5,
            }}
        >
            <Stack direction='row' spacing={1.5} alignItems='center'>
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        bgcolor: theme => theme.palette.grey[200],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                    }}
                >
                    {initials}
                </Box>

                <Box>
                    <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                        {seller.name}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                        На сайте с {registeredAt}
                    </Typography>
                </Box>
            </Stack>

            <Stack direction='row' spacing={1} alignItems='center'>
                <Rating value={Number(seller.rating)} precision={0.1} size='small' readOnly />
                <Typography sx={{ fontWeight: 600 }}>{seller.rating}</Typography>
                <Typography variant='caption' color='text.secondary'>
                    · {seller.totalAds} объявлений
                </Typography>
            </Stack>
        </Box>
    )
}
