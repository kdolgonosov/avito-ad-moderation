import { Box, CircularProgress } from '@mui/material'

export const PageLoader = () => (
    <Box
        sx={{
            py: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
        }}
    >
        <CircularProgress size={64} thickness={4} />
    </Box>
)
