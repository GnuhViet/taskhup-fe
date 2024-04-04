/**
 * YouTube: TrungQuanDev - Một Lập Trình Viên
 * Created by trungquandev.com's author on Jun 28, 2023
 */
import { Column } from '~/core/model/column.model'
import { Card } from '~/core/model/card.model'

/**
 * Capitalize the first letter of a string
 */
export const capitalizeFirstLetter = (val: any) => {
    if (!val) return ''
    return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

/**
 * Video 37.2 hàm generatePlaceholderCard: Cách xử lý bug logic thư viện Dnd-kit khi ColumnFC là rỗng:
 * Phía FE sẽ tự tạo ra một cái card đặc biệt: Placeholder Card, không liên quan tới Back-end
 * Card đặc biệt này sẽ được ẩn ở giao diện UI người dùng.
 * Cấu trúc Id của cái card này để Unique rất đơn giản, không cần phải làm random phức tạp:
 * "columnId-placeholder-card" (mỗi column chỉ có thể có tối đa một cái Placeholder Card)
 * Quan trọng khi tạo: phải đầy đủ: (_id, boardId, columnId, FE_PlaceholderCard)
*/
export const generatePlaceholderCard = (column: Column):Card => {
    const card= {} as Card
    card.id = 'placeholder-card'
    card.columnId = column.id
    card.FE_PlaceholderCard = true
    return card
}
