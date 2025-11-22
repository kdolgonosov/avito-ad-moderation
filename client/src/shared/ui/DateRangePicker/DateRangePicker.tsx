import { ru } from 'date-fns/locale/ru'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useEffect, useRef } from 'react'
import { Box, TextField, useTheme } from '@mui/material'
import { formatDateYMD } from '@/shared/lib/utils/format'
import 'react-datepicker/dist/react-datepicker.css'
import './DateRangePicker.css'

registerLocale('ru', ru)

export interface DateRangeValue {
    start: Date | null
    end: Date | null
}

interface DateRangePickerProps {
    value: DateRangeValue
    onChange: (value: DateRangeValue) => void
    focusTrigger?: any
    label?: string
}

export const DateRangePicker = ({ value, onChange, focusTrigger, label = 'Период' }: DateRangePickerProps) => {
    const { start, end } = value
    const theme = useTheme()
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (focusTrigger && inputRef.current) {
            inputRef.current.focus()
        }
    }, [focusTrigger])

    const isDark = theme.palette.mode === 'dark'

    const rootClassName = `stats-date-range-picker ${isDark ? 'stats-date-range-picker--dark' : 'stats-date-range-picker--light'}`
    return (
        <Box className={rootClassName}>
            <DatePicker
                locale='ru'
                selectsRange
                startDate={start}
                endDate={end}
                onChange={(update: [Date | null, Date | null]) => {
                    onChange({ start: update[0], end: update[1] })
                }}
                maxDate={new Date()}
                customInput={
                    <TextField
                        size='small'
                        variant='outlined'
                        label={label}
                        inputRef={inputRef}
                        value={start && end ? `${formatDateYMD(start)} — ${formatDateYMD(end)}` : ''}
                    />
                }
                shouldCloseOnSelect={false}
                withPortal={false}
                dateFormat='dd.MM.yyyy'
            />
        </Box>
    )
}
