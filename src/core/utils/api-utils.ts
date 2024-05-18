
export interface ErrorStatus {
    code: string
    message: string
}


export const handleError = (code: string, errors: ErrorStatus[], toast: any) => {
    const error = errors.find((error) => error.code === code)
    if (error) {
        toast.error(error.message, {
            position: 'bottom-right'
        })
    }
}