export interface UpdateInfoRequest {
    fullName: string
    email: string
    phoneNumber: string
    bio: string
}

export interface UserInfoResponse {
    fullName: string
    username: string
    email: string
    avatar: string
    phoneNumber: string
    bio: string
    verify: boolean
}