export const formatDateYMD = (date: Date): string => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}
export const formatDate = (date: string, withTime = false) => {
    const value = new Date(date)
    return withTime ? value.toLocaleString('ru-RU') : value.toLocaleDateString('ru-RU')
}

export const formatPrice = (price: number) =>
    price.toLocaleString('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
    })
