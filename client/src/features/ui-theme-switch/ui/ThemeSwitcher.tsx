import { Brightness4, Brightness7 } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import { useThemeMode } from '../model/themeMode.store'

export const ThemeSwitcher = () => {
    const { mode, toggleMode } = useThemeMode()

    const isDark = mode === 'dark'

    return (
        <Tooltip title={isDark ? 'Светлая тема' : 'Тёмная тема'}>
            <IconButton color='inherit' onClick={toggleMode}>
                {isDark ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
        </Tooltip>
    )
}
