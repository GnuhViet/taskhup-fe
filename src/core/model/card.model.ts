export class Card {
  _id: string
  boardId: string
  columnId: string
  title: string
  description: string
  cover: string
  memberIds: string[]
  comments: string[]
  attachments: string[]
  FE_PlaceholderCard: any

  constructor(
    _id: string,
    boardId: string,
    columnId: string,
    title: string,
    description: string,
    cover: string,
    memberIds: string[],
    comments: string[],
    attachments: string[],
    FE_PlaceholderCard: any
  ) {
    this._id = _id;
    this.boardId = boardId;
    this.columnId = columnId;
    this.title = title;
    this.description = description;
    this.cover = cover;
    this.memberIds = memberIds;
    this.comments = comments;
    this.attachments = attachments;
    this.FE_PlaceholderCard = FE_PlaceholderCard;
  }
}

