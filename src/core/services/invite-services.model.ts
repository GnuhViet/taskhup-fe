export class InviteLinkCreateReq {
    type: string
    destinationId: string
}

export class SendEmailInviteLinkReq {
    email: string
    content: string
    destinationId: string
}

export class InviteLinkJoinReq {
    id: string
}