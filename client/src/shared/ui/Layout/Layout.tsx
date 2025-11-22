import React from 'react'
import { Link } from 'react-router-dom'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import { ModeratorMenu } from '@/entities/moderator/ui/ModeratorMenu'
import { ThemeSwitcher } from '@/features/ui-theme-switch/ui/ThemeSwitcher'

interface LayoutProps {
    children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant='h6' sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }} component={Link} to='/list'>
                        Модерации объявлений
                    </Typography>
                    <Button color='inherit' component={Link} to='/list' sx={{ mr: 4 }}>
                        объявления
                    </Button>
                    <ThemeSwitcher />
                    <ModeratorMenu />
                </Toolbar>
            </AppBar>
            <Container sx={{ flex: 1, py: 3 }}>{children}</Container>
        </Box>
    )
}
