export function getContrastTextColor(bgColor: string) {
    if (!bgColor) {
        return '#000000' // Default to black text
    }

    // Convert hex color to RGB
    const rgb = parseInt(bgColor.slice(1), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = rgb & 0xff

    // Calculate the brightness of the color
    const brightness = (r * 299 + g * 587 + b * 114) / 1000

    // Return black text for bright colors and white text for dark colors
    return brightness > 155 ? '#000000' : '#FFFFFF'
}