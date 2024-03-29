export class Column {
    _id: string
    boardId: string
    title: string
    cardOrderIds: string[]
    cards: any[]

    constructor(_id: string, boardId: string, title: string, cardOrderIds: string[], cards: any[]) {
        this._id = _id;
        this.boardId = boardId;
        this.title = title;
        this.cardOrderIds = cardOrderIds;
        this.cards = cards;
    }
}