import { Box, Chip } from '@mui/material'
import { getStatusMeta } from '@/entities/ad/model/status'
import type { AdStatus } from '@/entities/ad/model/types'

interface StatusBadgeProps {
    status: AdStatus
    size?: 'small' | 'medium'
    variant?: 'filled' | 'outlined'
}

export const StatusBadge = ({ status, size = 'small', variant = 'filled' }: StatusBadgeProps) => {
    const { label, Icon, color } = getStatusMeta(status)

    const chipColor = variant === 'filled' ? color : 'default'

    return (
        <Chip
            size={size}
            color={chipColor}
            variant={variant}
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Icon fontSize='small' />
                    {label}
                </Box>
            }
        />
    )
}
