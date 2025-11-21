import { useEffect, useMemo } from 'react'
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material'
import { useThemeStore } from '@/features/ui-theme-switch/model/themeMode.store'
import { getTheme } from '@/shared/config/theme'

interface ThemeProviderProps {
    children: React.ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const mode = useThemeStore(s => s.mode)
    const hydrate = useThemeStore(s => s.hydrate)

    useEffect(() => {
        hydrate()
    }, [hydrate])

    const theme = useMemo(() => getTheme(mode), [mode])

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    )
}
