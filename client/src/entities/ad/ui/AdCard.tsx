import { Link as RouterLink, useLocation } from 'react-router-dom'
import BoltIcon from '@mui/icons-material/Bolt'
import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material'
import { AdPriority, type Advertisement } from '@/entities/ad/model/types'
import { getCategoryIcon } from '../model/categories'
import { StatusBadge } from './StatusBadge'

interface AdCardProps {
    ad: Advertisement
    isNew?: boolean
}

const PLACEHOLDER_IMAGE = 'https://placehold.co/300x200/cccccc/969696?text=Fallback'

export const AdCard = ({ ad, isNew }: AdCardProps) => {
    const coverSrc = ad.images?.[0] ?? PLACEHOLDER_IMAGE
    const CategoryIcon = getCategoryIcon(ad.categoryId)
    const location = useLocation()
    return (
        <Card variant='outlined'>
            <CardActionArea component={RouterLink} to={{ pathname: `/item/${ad.id}`, search: location.search }}>
                <CardContent>
                    <Stack direction='row' spacing={2}>
                        <Box
                            sx={{
                                width: 96,
                                height: 96,
                                borderRadius: 1,
                                overflow: 'hidden',
                                flexShrink: 0,
                                bgcolor: 'grey.100',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Box
                                component='img'
                                src={coverSrc}
                                alt={ad.title}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                }}
                            />
                        </Box>

                        <Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={2} sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ minWidth: 0 }}>
                                {isNew && <Chip label='Новое' color='primary' size='small' sx={{ height: 22, fontSize: 12 }} />}
                                <Typography variant='h6' noWrap>
                                    {ad.title}
                                </Typography>
                                <Typography variant='body2' color='text.secondary' noWrap sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <CategoryIcon fontSize='inherit' style={{ opacity: 0.6 }} />
                                    {ad.category} · {new Date(ad.createdAt).toLocaleString('ru-RU')}
                                </Typography>
                                <Typography variant='body1' sx={{ mt: 1 }}>
                                    {ad.price.toLocaleString('ru-RU', {
                                        style: 'currency',
                                        currency: 'RUB',
                                    })}
                                </Typography>
                            </Box>

                            <Stack spacing={1} alignItems='flex-end'>
                                <StatusBadge status={ad.status} />
                                {ad.priority === AdPriority.Urgent && (
                                    <Chip
                                        label='Срочно'
                                        color='warning'
                                        size='small'
                                        icon={<BoltIcon fontSize='small' />}
                                        sx={{
                                            fontWeight: 500,
                                        }}
                                    />
                                )}
                            </Stack>
                        </Stack>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
