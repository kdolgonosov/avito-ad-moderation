import React from 'react'
import { Box, Button, Typography } from '@mui/material'

interface ErrorFallbackProps {
    onReset: () => void
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ onReset }) => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
            }}
        >
            <Typography variant='h5'>Что-то пошло не так</Typography>
            <Typography variant='body2' color='text.secondary'>
                Попробуйте перезагрузить страницу. Если ошибка повторяется, напишите, пожалуйста, в поддержку.
            </Typography>
            <Button variant='contained' onClick={onReset}>
                Перезагрузить
            </Button>
        </Box>
    )
}
