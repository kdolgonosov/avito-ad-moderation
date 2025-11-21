import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DescriptionIcon from '@mui/icons-material/Description'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import { AdStatus } from './types'

export const STATUS_LABELS: Record<AdStatus, string> = {
    [AdStatus.Pending]: 'На модерации',
    [AdStatus.Approved]: 'Одобрено',
    [AdStatus.Rejected]: 'Отклонено',
    [AdStatus.Draft]: 'На доработке',
}

export const STATUS_ICONS: Record<AdStatus, React.ElementType> = {
    [AdStatus.Pending]: HourglassEmptyIcon,
    [AdStatus.Approved]: CheckCircleIcon,
    [AdStatus.Rejected]: CancelIcon,
    [AdStatus.Draft]: DescriptionIcon,
}

export const STATUS_COLORS: Record<AdStatus, 'info' | 'success' | 'error' | 'default'> = {
    [AdStatus.Pending]: 'info',
    [AdStatus.Approved]: 'success',
    [AdStatus.Rejected]: 'error',
    [AdStatus.Draft]: 'default',
}

export const getStatusMeta = (status: AdStatus) => {
    const label = STATUS_LABELS[status]
    const Icon = STATUS_ICONS[status]
    const color = STATUS_COLORS[status]

    return { label, Icon, color }
}
