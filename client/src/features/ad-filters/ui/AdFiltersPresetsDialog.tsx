import { useState } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import { useAdFiltersPresetsStore } from '../model/adFiltersPresets.store'
import type { AdFiltersValues } from '../model/types'

interface AdFiltersPresetsDialogProps {
    open: boolean
    onClose: () => void
    currentFilters: AdFiltersValues
    onApplyPreset: (filters: AdFiltersValues) => void
}

export const AdFiltersPresetsDialog = ({ open, onClose, currentFilters, onApplyPreset }: AdFiltersPresetsDialogProps) => {
    const { presets, addPreset, removePreset } = useAdFiltersPresetsStore()
    const [presetName, setPresetName] = useState('')

    const handleSaveCurrent = () => {
        const name = presetName.trim() || `Пресет ${presets.length + 1}`
        addPreset(name, currentFilters)
        setPresetName('')
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle>Сохранённые наборы фильтров</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <Box>
                        <Typography variant='subtitle2' gutterBottom>
                            Сохранить текущие фильтры
                        </Typography>
                        <Stack direction='row' spacing={1}>
                            <TextField
                                size='small'
                                label='Название пресета'
                                placeholder='Например: “Срочные объявления на модерации”'
                                value={presetName}
                                onChange={e => setPresetName(e.target.value)}
                                fullWidth
                            />
                            <Button variant='contained' onClick={handleSaveCurrent} disabled={!presetName}>
                                Сохранить
                            </Button>
                        </Stack>
                    </Box>

                    <Box>
                        <Typography variant='subtitle2' gutterBottom>
                            Мои пресеты
                        </Typography>
                        {presets.length === 0 ? (
                            <Typography variant='body2' color='text.secondary'>
                                Пока нет сохранённых пресетов. Настройте фильтры и сохраните их через форму выше.
                            </Typography>
                        ) : (
                            <List dense>
                                {presets.map(preset => (
                                    <ListItem
                                        key={preset.id}
                                        disableGutters
                                        secondaryAction={
                                            <>
                                                <Tooltip title='Применить пресет'>
                                                    <IconButton
                                                        edge='end'
                                                        sx={{ mr: 1 }}
                                                        color='success'
                                                        onClick={() => {
                                                            onApplyPreset(preset.filters)
                                                            onClose()
                                                        }}
                                                    >
                                                        <CheckIcon fontSize='small' />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title='Удалить пресет'>
                                                    <IconButton edge='end' onClick={() => removePreset(preset.id)} color='error'>
                                                        <DeleteIcon fontSize='small' />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        }
                                    >
                                        <ListItemText
                                            primary={preset.name}
                                            secondary={
                                                <Typography variant='caption' color='text.secondary'>
                                                    {new Date(preset.createdAt).toLocaleString()}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Закрыть</Button>
            </DialogActions>
        </Dialog>
    )
}
