import { useParams } from 'react-router-dom'
import { Typography } from '@mui/material'

export const ItemPage = () => {
    const { id } = useParams()

    return (
        <>
            <Typography variant='h4' gutterBottom>
                Объявление #{id}
            </Typography>
            {/* здесь позже подключим widgets/AdDetails */}
        </>
    )
}
