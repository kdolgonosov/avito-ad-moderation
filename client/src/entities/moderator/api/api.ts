import { apiClient } from '@/shared/api/client'
import type { Moderator } from '../model/types'

export const getCurrentModerator = async (): Promise<Moderator> => {
    const { data } = await apiClient.get<Moderator>('/moderators/me')
    return data
}
