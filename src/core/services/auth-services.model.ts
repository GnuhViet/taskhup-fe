export class AuthenticationRequest {
    username: string
    password: string
}

export class AuthenticationResponse {
    accessToken: string
    refreshToken: string
}

export class RefreshRequest {
    refreshToken: string
}