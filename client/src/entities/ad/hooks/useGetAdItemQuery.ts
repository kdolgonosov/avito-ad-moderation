import { useQuery } from '@tanstack/react-query'
import { getAdById } from '@/entities/ad/api/api'
import type { Advertisement } from '@/entities/ad/model/types'

export const useGetAdItemQuery = (id: number) => {
    return useQuery<Advertisement, Error>({
        queryKey: ['ads', 'item', id],
        queryFn: ({ signal }) => getAdById(id, signal),
        enabled: Number.isFinite(id),
    })
}
