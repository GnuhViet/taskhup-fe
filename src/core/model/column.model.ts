import { Card } from '~/core/model/card.model'

export class Column {
    id: string
    boardId: string
    title: string
    cardOrderIds: string[]
    cards: Card[]
}