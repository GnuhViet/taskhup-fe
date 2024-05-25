export function convertDate(dateStr: string) {
    if (!dateStr) return 'wrong-date-format'

    const date = new Date(dateStr)

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // January is 0!
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
}

export function isBlank(value: any): boolean {
    return value === null || value === undefined || value.toString().trim() === '';
}