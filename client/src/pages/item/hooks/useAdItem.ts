import { useParams } from 'react-router-dom'
import { useGetAdItemQuery } from '@/entities/ad/hooks/useGetAdItemQuery'

export const useAdItem = () => {
    const { id } = useParams<{ id: string }>()
    const numericId = Number(id)
    const isInvalidId = !id || Number.isNaN(numericId)

    const { data: ad, isLoading, isError } = useGetAdItemQuery(isInvalidId ? 0 : numericId)

    return {
        ad,
        isLoading,
        isError,
        isInvalidId,
        numericId: isInvalidId ? null : numericId,
    }
}
