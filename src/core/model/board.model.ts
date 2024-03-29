export class Board {
  id: string
  name: string
  _id: string
  title: string
  description: string
  type: string
  ownerIds: string[]
  memberIds: string[]
  columnOrderIds: string[]
  columns: any[]

  constructor(id: string, name: string, _id: string, title: string, description: string, type: string, ownerIds: string[], memberIds: string[], columnOrderIds: string[], columns: any[]) {
    this.id = id;
    this.name = name;
    this._id = _id;
    this.title = title;
    this.description = description;
    this.type = type;
    this.ownerIds = ownerIds;
    this.memberIds = memberIds;
    this.columnOrderIds = columnOrderIds;
    this.columns = columns;
  }
}