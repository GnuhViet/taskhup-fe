import { WorkSpace } from '../model/workspace.model'

export class WorkSpaceCreateReq {
    title: string
    type: string
    description: string
}

export class GetWorkSpaceResp {
    joinedWorkSpaces: WorkSpace[]
    guestWorkSpaces: WorkSpace[]
}

export class JoinRequestADRequest {
    userIds: string[]
}