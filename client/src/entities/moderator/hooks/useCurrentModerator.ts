import { useQuery } from '@tanstack/react-query'
import { getCurrentModerator } from '../api/api'

export const useCurrentModerator = () => {
    return useQuery({
        queryKey: ['moderator', 'me'],
        queryFn: getCurrentModerator,
        staleTime: 5 * 60 * 1000,
    })
}
