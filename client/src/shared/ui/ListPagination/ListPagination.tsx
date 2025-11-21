import type { ChangeEvent } from 'react'
import { Box, Pagination } from '@mui/material'

interface ListPaginationProps {
    page: number
    count: number
    onChange: (event: ChangeEvent<unknown>, value: number) => void
}

export const ListPagination = ({ page, count, onChange }: ListPaginationProps) => {
    if (count <= 1) {
        return null
    }

    return (
        <Box display='flex' justifyContent='center' mt={3}>
            <Pagination page={page} count={count} onChange={onChange} />
        </Box>
    )
}
