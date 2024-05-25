import { Card } from '~/core/model/card.model'
import { Column } from '../model/column.model'

export class BoardColumnCreateReq {
    title: string
}

export class BoardColumnCreateResp {
    id: string
    boardId: string
    title: string
}

export class BoardColumnMoveReq {
    columnOrderIds: string[]
}

export class BoardCardCreateReq {
    boardColumnId: string
    title: string
}

export class BoardCardCreateResp {
    id: string
    title: string
    boardId: string
    columnId: string
}

export class BoardCardMoveReq {
    cardId: string
    fromColumnId: string
    toColumnId: string
    cardOrderIds: string[]
    card: Card
}

export class BoardDtoResp {
    id: string
    name: string
    title: string
    description: string
    type: string
    ownerIds: string[]
    memberIds: string[]
    columnOrderIds: string
    columns: BoardColumnDtoResp[]
}

export class BoardColumnDtoResp {
    id: string
    boardId: string
    title: string
    cardOrderIds: string
    cards: BoardColumnDtoResp[]
}

export class BoardCardDtoResp {
    id: string
    boardId: string
    columnId: string
    title: string
    description: string
    cover: string
    memberIds: string[]
    comments: string[]
    attachments: string[]
    FE_PlaceholderCard: any
}

export class BoardCreateReq {
    title: string
    background: string
    workspaceId: string
}

export class BoardCreateResp {
    id: string
    title: string
    background: string
    workspaceId: string
}

export class CardTemplateCreateLabelReq {
    title: string
    colorCode: string
    templateId: string
}