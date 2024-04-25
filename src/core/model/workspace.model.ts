import { Board } from './board.model'

export class WorkSpace {
    id: string
    title: string
    description: string
    type: string
    canCreateBoard: boolean
    boards: Board[]
}