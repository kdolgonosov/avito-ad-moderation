import { Link as RouterLink, useLocation } from 'react-router-dom'
import BoltIcon from '@mui/icons-material/Bolt'
import { Box, Card, CardActionArea, CardContent, Checkbox, Chip, Stack, Typography } from '@mui/material'
import { AdPriority, type Advertisement } from '@/entities/ad/model/types'
import { formatPrice } from '@/shared/lib/utils/format'
import { getCategoryIcon } from '../model/categories'
import { StatusBadge } from './StatusBadge'

interface AdCardProps {
    ad: Advertisement
    isNew?: boolean
    selectable?: boolean
    selected?: boolean
    onToggleSelect?: (id: number) => void
}

const PLACEHOLDER_IMAGE = 'https://placehold.co/300x200/cccccc/969696?text=Fallback'

export const AdCard = ({ ad, isNew, selectable = true, selected = false, onToggleSelect }: AdCardProps) => {
    const coverSrc = ad.images?.[0] ?? PLACEHOLDER_IMAGE
    const CategoryIcon = getCategoryIcon(ad.categoryId)
    const location = useLocation()

    return (
        <Card
            variant='outlined'
            sx={{
                position: 'relative',
                borderColor: selected ? 'primary.main' : undefined,
                boxShadow: selected ? '0 0 0 2px rgba(25,118,210,0.4)' : undefined,
            }}
        >
            {selectable && (
                <Checkbox
                    checked={selected}
                    onChange={() => onToggleSelect?.(ad.id)}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        zIndex: 10,
                        bgcolor: 'background.paper',
                        borderRadius: '4px',
                    }}
                />
            )}

            <CardActionArea
                component={RouterLink}
                to={{ pathname: `/item/${ad.id}`, search: location.search }}
                sx={{
                    alignItems: 'stretch',
                }}
            >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.5, sm: 2 }}>
                        <Box
                            sx={{
                                width: { xs: '100%', sm: 96 },
                                height: { xs: 180, sm: 96 },
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

                        <Stack
                            direction='row'
                            justifyContent='space-between'
                            alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
                            spacing={2}
                            sx={{ flex: 1, minWidth: 0 }}
                        >
                            <Box sx={{ minWidth: 0 }}>
                                {isNew && (
                                    <Chip
                                        label='Новое'
                                        color='primary'
                                        size='small'
                                        sx={{
                                            height: 22,
                                            fontSize: 12,
                                            mb: 0.5,
                                        }}
                                    />
                                )}

                                <Typography
                                    variant='subtitle1'
                                    sx={{
                                        fontWeight: 600,
                                        display: '-webkit-box',
                                        overflow: 'hidden',
                                        WebkitLineClamp: { xs: 2, sm: 1 },
                                        WebkitBoxOrient: 'vertical',
                                    }}
                                >
                                    {ad.title}
                                </Typography>

                                <Typography
                                    variant='body2'
                                    color='text.secondary'
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        mt: 0.25,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        fontSize: { xs: 12, sm: 13 },
                                    }}
                                >
                                    <CategoryIcon fontSize='inherit' style={{ opacity: 0.6 }} />
                                    {ad.category} ·{' '}
                                    {new Date(ad.createdAt).toLocaleString('ru-RU', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Typography>

                                <Typography
                                    variant='body1'
                                    sx={{
                                        mt: 1,
                                        fontSize: { xs: 16, sm: 18 },
                                        fontWeight: 600,
                                    }}
                                >
                                    {formatPrice(ad.price)}
                                </Typography>
                            </Box>

                            <Stack
                                spacing={1}
                                alignItems='flex-end'
                                sx={{
                                    minWidth: { xs: 'auto', sm: 120 },
                                }}
                            >
                                <StatusBadge status={ad.status} />

                                {ad.priority === AdPriority.Urgent && (
                                    <Chip
                                        label='Срочно'
                                        color='warning'
                                        size='small'
                                        icon={<BoltIcon fontSize='small' />}
                                        sx={{
                                            fontWeight: 500,
                                            mt: { xs: 0.5, sm: 0 },
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
