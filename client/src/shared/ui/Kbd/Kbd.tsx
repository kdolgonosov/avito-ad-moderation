import { Box } from '@mui/material'

export const Kbd = ({ children }: { children: React.ReactNode }) => (
    <Box
        component='span'
        sx={theme => ({
            ml: 1,
            mr: 1,
            px: 1,
            py: '2px',
            borderRadius: '4px',
            bgcolor: theme.palette.background.paper,
            color: 'text.primary',
            fontSize: '12px',
            fontFamily: 'ui-monospace, monospace',
            border: `1px solid ${theme.palette.divider}`,
        })}
    >
        {children}
    </Box>
)
