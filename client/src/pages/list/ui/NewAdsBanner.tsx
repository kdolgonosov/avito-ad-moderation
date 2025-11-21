import { Alert, Box, Button } from '@mui/material'

interface NewAdsBannerProps {
    newCount: number
    onShowNew: () => void
}

export const NewAdsBanner = ({ newCount, onShowNew }: NewAdsBannerProps) => {
    if (newCount <= 0) return null

    return (
        <Box
            sx={{
                position: 'sticky',
                top: 16,
                zIndex: 20,
                mb: 2,
            }}
        >
            <Alert
                severity='info'
                action={
                    <Button color='inherit' size='small' onClick={onShowNew}>
                        Показать
                    </Button>
                }
            >
                Новых объявлений: {newCount}
            </Alert>
        </Box>
    )
}
