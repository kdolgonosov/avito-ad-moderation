import { StatsPeriod } from '@/entities/stats/model/types'

export const PERIOD_LABELS: Record<StatsPeriod, string> = {
    [StatsPeriod.Today]: 'Сегодня',
    [StatsPeriod.Week]: 'Последние 7 дней',
    [StatsPeriod.Month]: 'Последние 30 дней',
    [StatsPeriod.Custom]: 'Произвольный',
}
