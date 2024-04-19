// export class ApiResponse<T> {
//     data: T
//     error: any
//     isLoading: boolean
// }

export class ApiResponse<T> {
    httpStatus: string
    serviceStatus: string
    message: string
    code: string
    data: T
}