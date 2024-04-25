export class Token {
    accessToken: string
    refreshToken: string
    authorToken: AuthorToken
}

export class AuthorToken {
    authorToken: string
    workspaceId: string
}