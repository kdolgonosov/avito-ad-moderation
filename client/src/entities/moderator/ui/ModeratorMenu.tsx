import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { useCurrentModerator } from '../hooks/useCurrentModerator'

export const ModeratorMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const { data: moderator, isLoading, isError } = useCurrentModerator()

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant='body2' sx={{ mr: 1 }}>
                    Загрузка…
                </Typography>
                <Avatar sx={{ width: 32, height: 32 }} />
            </Box>
        )
    }

    if (isError || !moderator) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant='body2' sx={{ mr: 1 }}>
                    Ошибка
                </Typography>
                <Avatar sx={{ width: 32, height: 32 }} />
            </Box>
        )
    }

    const { name, role } = moderator

    const initials = name
        .split(' ')
        .map(x => x[0])
        .join('')
        .toUpperCase()

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}
                onClick={handleOpen}
            >
                <Box sx={{ textAlign: 'right', mr: 1 }}>
                    <Typography variant='body1'>{name}</Typography>
                    <Typography variant='caption' sx={{ opacity: 0.8 }}>
                        {role}
                    </Typography>
                </Box>

                <IconButton size='small' sx={{ p: 0 }}>
                    <Avatar>{initials}</Avatar>
                </IconButton>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem component={RouterLink} to='/stats' onClick={handleClose}>
                    Cтатистика
                </MenuItem>
                <MenuItem component={RouterLink} to='/stats' disabled>
                    Выйти
                </MenuItem>
            </Menu>
        </>
    )
}
