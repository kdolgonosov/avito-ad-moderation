import { createTheme, type ThemeOptions } from '@mui/material/styles'

export type ThemeMode = 'light' | 'dark'

const baseThemeOptions: ThemeOptions = {
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                },
            },
        },
    },
}

export const getTheme = (mode: ThemeMode) =>
    createTheme({
        ...baseThemeOptions,
        palette: {
            mode,
            ...(mode === 'light'
                ? {
                      primary: { main: '#1976d2' },
                      success: { main: '#2e7d32' },
                      error: { main: '#d32f2f' },
                      warning: { main: '#ed6c02' },
                  }
                : {
                      primary: { main: '#90caf9' },
                      success: { main: '#81c784' },
                      error: { main: '#e57373' },
                      warning: { main: '#ffb74d' },
                  }),
        },
    })
