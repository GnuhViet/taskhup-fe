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

export class UpdateCardCoverReq {
    file: any
    boardCardId: string
}

export class UpdateCardDateReq {
    fromDate: string
    deadlineDate: string
    boardCardId: string
    reminder: number
}

export class UpdateWorkingStatusReq {
    workingStatus: boolean
    boardCardId: string
}

export class UpdateDescriptionReq {
    description: string
    boardCardId: string
}

export class UpdateCardTitleRequest {
    title: string
    boardCardId: string
}

export class UploadAttachmentReq {
    file: any
    displayName: string
    type: string
    refId: string
}

export class DeleteAttachmentReq {
    attachmentId: string
}

export class CreateCommentReq {
    content: string
    boardCardId: string
}

export class EditCommentContentReq {
    id: string
    content: string
}

export class DeleteCommentReq {
    id: string
}