import { createTheme, type ThemeOptions } from '@mui/material/styles'

export type ThemeMode = 'light' | 'dark'

const baseThemeOptions: ThemeOptions = {
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
}

export const getTheme = (mode: ThemeMode) =>
    createTheme({
        ...baseThemeOptions,
        palette: {
            mode,
            primary: {
                main: '#1976d2',
            },
            success: {
                main: '#2e7d32',
            },
            error: {
                main: '#d32f2f',
            },
            warning: {
                main: '#ed6c02',
            },
        },
    })
