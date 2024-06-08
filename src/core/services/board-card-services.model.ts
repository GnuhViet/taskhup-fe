export class SelectTemplateRequest {
    templateId: string
    boardCardId: string
}

export class SelectLabelRequest {
    boardCardLabelValue: string[]
    boardCardId: string
}

export class SelectFieldRequest {
    customFieldValue: any[]
    boardCardId: string
}

export class UpdateFieldValueRequest {
    customFieldValue: any
    boardCardId: string
}

export class UpdateMemberRequest {
    members: any[]
    boardCardId: string
}

export class UpdateWatchCardReq {
    boardCardId: string
    isWatch: boolean
}

export class UpdateCheckListRequest {
    checkListValue: any[]
    boardCardId: string
}

export class UpdateCheckListValueReq {
    id: string
    checked: boolean
    boardCardId: string
}