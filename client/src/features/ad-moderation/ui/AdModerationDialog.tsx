import { useState, type ChangeEvent } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material'
import { useAdModerationMutations } from '@/entities/ad/hooks/useAdModerationMutations'
import { RejectReason, type RejectAdRequestBody, type RequestChangesBody } from '@/entities/ad/model/types'
import { REJECT_REASONS } from '../model/constants'

export type ModerationDialogMode = 'reject' | 'changes'

interface AdModerationDialogProps {
    adId: number
    mode: ModerationDialogMode
    open: boolean
    onClose: () => void
}

export const AdModerationDialog = ({ adId, mode, open, onClose }: AdModerationDialogProps) => {
    const [reason, setReason] = useState<RejectReason>(RejectReason.ForbiddenProduct)
    const [comment, setComment] = useState('')
    const [touched, setTouched] = useState(false)

    const resetLocalState = () => {
        setReason(RejectReason.ForbiddenProduct)
        setComment('')
        setTouched(false)
    }

    const handleClose = () => {
        resetLocalState()
        onClose()
    }

    const { rejectMutation, requestChangesMutation, isProcessing } = useAdModerationMutations(adId, {
        onRejectSuccess: handleClose,
        onRequestChangesSuccess: handleClose,
    })

    const handleReasonChange = (event: ChangeEvent<HTMLInputElement>) => {
        setReason(event.target.value as RejectReason)
    }

    const handleCommentChange = (event: ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value)
    }

    const isCommentRequired = reason === 'Другое'
    const hasError = !reason || (isCommentRequired && comment.trim().length === 0)
    const showError = touched && hasError

    const handleSubmit = () => {
        setTouched(true)
        if (hasError) return

        const body: RejectAdRequestBody = {
            reason,
            ...(comment.trim() ? { comment: comment.trim() } : {}),
        }

        if (mode === 'reject') {
            rejectMutation.mutate(body)
        } else {
            requestChangesMutation.mutate(body as RequestChangesBody)
        }
    }

    const title = mode === 'reject' ? 'Отклонить объявление' : 'Вернуть на доработку'

    return (
        <Dialog open={open} onClose={isProcessing ? undefined : handleClose} fullWidth maxWidth='sm'>
            <DialogTitle>{title}</DialogTitle>

            <DialogContent dividers>
                <FormControl component='fieldset' sx={{ mt: 1 }}>
                    <FormLabel component='legend'>Причина</FormLabel>
                    <RadioGroup value={reason} onChange={handleReasonChange}>
                        {REJECT_REASONS.map(r => (
                            <FormControlLabel key={r} value={r} control={<Radio />} label={r} />
                        ))}
                    </RadioGroup>
                </FormControl>

                <TextField
                    label='Комментарий модератора'
                    multiline
                    minRows={3}
                    fullWidth
                    sx={{ mt: 2 }}
                    value={comment}
                    onChange={handleCommentChange}
                    onBlur={() => setTouched(true)}
                    required={isCommentRequired}
                    error={showError}
                    helperText={showError ? (isCommentRequired ? 'Для причины «Другое» комментарий обязателен' : 'Укажите причину') : ''}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} disabled={isProcessing}>
                    Отмена
                </Button>
                <Button variant='contained' color={mode === 'reject' ? 'error' : 'warning'} onClick={handleSubmit} disabled={isProcessing}>
                    Подтвердить
                </Button>
            </DialogActions>
        </Dialog>
    )
}
