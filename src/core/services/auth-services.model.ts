export class AuthenticationRequest {
    username: string
    password: string
}

export class AuthenticationResponse {
    accessToken: string
    refreshToken: string
}

export class AuthorRequest {
    accessToken: string
    workspaceId: string
}

export class AuthorResponse {
    authorToken: string
}

export class RegisterRequest {
    username: string
    password: string
    email: string
    fullName: string
}

export class RefreshRequest {
    refreshToken: string
}

export enum Actions {
    EDIT_WORKSPACE = 'EDIT_WORKSPACE',
    MANAGE_USER = 'MANAGE_USER',
    EDIT_ROLE = 'EDIT_ROLE',
    EDIT_BOARD = 'EDIT_BOARD',
    DELETE_BOARD = 'DELETE_BOARD',
    EDIT_CARD_TEMPLATE = 'EDIT_CARD_TEMPLATE',
    EDIT_CARD = 'EDIT_CARD'
}

export class ActionsBoolean {
    EDIT_WORKSPACE: boolean
    MANAGE_USER: boolean
    EDIT_ROLE: boolean
    EDIT_BOARD: boolean
    DELETE_BOARD: boolean
    EDIT_CARD_TEMPLATE: boolean
    EDIT_CARD: boolean
}