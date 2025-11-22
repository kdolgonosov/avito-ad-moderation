import { Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import type { Advertisement } from '@/entities/ad/model/types'

interface CharacteristicsSectionProps {
    characteristics: Advertisement['characteristics']
}

export const CharacteristicsSection = ({ characteristics }: CharacteristicsSectionProps) => {
    if (!characteristics || Object.keys(characteristics).length === 0) return null

    return (
        <>
            <Typography variant='subtitle1' gutterBottom>
                Характеристики
            </Typography>

            <Table
                size='small'
                sx={{
                    mb: 2,
                    maxWidth: 400,
                    borderCollapse: 'collapse',
                    '& tr:nth-of-type(odd)': {
                        backgroundColor: theme => theme.palette.action.hover,
                    },
                    '& td': {
                        py: 0.6,
                        px: 1.2,
                        borderBottom: theme => `1px solid ${theme.palette.divider}`,
                        verticalAlign: 'top',
                    },
                }}
            >
                <TableBody>
                    {Object.entries(characteristics).map(([key, value]) => (
                        <TableRow key={key}>
                            <TableCell
                                sx={{
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    pr: 2,
                                    color: 'text.primary',
                                }}
                            >
                                {key}
                            </TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>{value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}
