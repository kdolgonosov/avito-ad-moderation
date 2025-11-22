import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdFiltersValues } from './types'

export interface AdFiltersPreset {
    id: string
    name: string
    filters: AdFiltersValues
    createdAt: string
}

interface AdFiltersPresetsState {
    presets: AdFiltersPreset[]
    addPreset: (name: string, filters: AdFiltersValues) => void
    removePreset: (id: string) => void
    renamePreset: (id: string, name: string) => void
}

export const useAdFiltersPresetsStore = create<AdFiltersPresetsState>()(
    persist(
        (set, get) => ({
            presets: [],
            addPreset: (name, filters) => {
                const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
                const preset: AdFiltersPreset = {
                    id,
                    name,
                    filters,
                    createdAt: new Date().toISOString(),
                }

                set({ presets: [...get().presets, preset] })
            },
            removePreset: id => {
                set({ presets: get().presets.filter(p => p.id !== id) })
            },
            renamePreset: (id, name) => {
                set({
                    presets: get().presets.map(p => (p.id === id ? { ...p, name } : p)),
                })
            },
        }),
        {
            name: 'ad-filters-presets',
        }
    )
)
