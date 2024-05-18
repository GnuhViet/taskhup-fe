import { WorkSpace } from '../model/workspace.model'

export class InviteLinkCreateReq {
    type: string
    destinationId: string
}

export class InviteLinkJoinReq {
    id: string
}