import { create } from 'zustand'
import type { ThemeMode } from '@/shared/config/theme'

const THEME_STORAGE_KEY = 'theme-mode'

interface ThemeState {
    mode: ThemeMode
    setMode: (mode: ThemeMode) => void
    toggleMode: () => void
    hydrate: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    mode: 'light',

    setMode: mode => {
        set({ mode })

        if (typeof window !== 'undefined') {
            window.localStorage.setItem(THEME_STORAGE_KEY, mode)
        }
    },

    toggleMode: () => {
        const nextMode: ThemeMode = get().mode === 'light' ? 'dark' : 'light'
        get().setMode(nextMode)
    },

    hydrate: () => {
        if (typeof window === 'undefined') return

        const saved = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null

        if (saved === 'light' || saved === 'dark') {
            set({ mode: saved })
            return
        }

        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

        set({ mode: prefersDark ? 'dark' : 'light' })
    },
}))

export const useThemeMode = () => {
    const mode = useThemeStore(s => s.mode)
    const setMode = useThemeStore(s => s.setMode)
    const toggleMode = useThemeStore(s => s.toggleMode)

    return { mode, setMode, toggleMode }
}
