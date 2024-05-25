export class RoleGetResp {
    id: string
    name: string
    color: string
    createBy: string
    createDate: string
    actionCode: string[]
    member: string[]
}

export class RoleCreateReq {
    name: string
    color: string
    actionCode: string[]
}

export class RoleUpdateReq {
    id: string
    name: string
    actionCode: string[]
}

export class ChangeMemberRoleReq {
    roleId: string
    memberId: string
}