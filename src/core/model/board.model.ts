import { Column } from '~/core/model/column.model'

export class Board {
    id: string
    name: string
    title: string
    description: string
    type: string
    ownerIds: string[]
    memberIds: string[]
    columnOrderIds: string[]
    columns: Column[]
}