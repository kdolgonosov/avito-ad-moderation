import { useEffect, useState } from 'react'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Box, Typography } from '@mui/material'

interface LastUpdatedInfoProps {
    lastUpdatedAt: Date | null
    isFetching: boolean
    onRefresh: () => void
}

export const LastUpdatedInfo = ({ lastUpdatedAt, isFetching, onRefresh }: LastUpdatedInfoProps) => {
    const [timeAgo, setTimeAgo] = useState('–')

    useEffect(() => {
        if (!lastUpdatedAt) {
            setTimeAgo('–')
            return
        }

        const update = () => {
            const seconds = Math.floor((Date.now() - lastUpdatedAt.getTime()) / 1000)

            if (seconds < 5) setTimeAgo('только что')
            else if (seconds < 60) setTimeAgo(`${seconds} сек назад`)
            else {
                const minutes = Math.floor(seconds / 60)
                setTimeAgo(`${minutes} мин назад`)
            }
        }

        update()
        const interval = setInterval(update, 1000)
        return () => clearInterval(interval)
    }, [lastUpdatedAt])

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant='body2' sx={{ opacity: 0.8 }}>
                Обновлено: {timeAgo}
            </Typography>

            <RefreshIcon
                onClick={onRefresh}
                sx={{
                    cursor: 'pointer',
                    opacity: 0.7,
                    transition: 'transform 0.3s ease',
                    '&:hover': { opacity: 1 },
                    ...(isFetching && {
                        animation: 'spin 1s linear infinite',
                    }),
                }}
            />
        </Box>
    )
}
