import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'

interface LayoutProps {
    children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant='h6' sx={{ flexGrow: 1 }}>
                        Система модерации объявлений
                    </Typography>
                    <Button color='inherit' component={RouterLink} to='/list'>
                        Список
                    </Button>
                    <Button color='inherit' component={RouterLink} to='/stats'>
                        Статистика
                    </Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ flex: 1, py: 3 }}>{children}</Container>
        </Box>
    )
}
