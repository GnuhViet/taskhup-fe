import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

import OutlinedInput from '@mui/material/OutlinedInput'
import { useForm } from 'react-hook-form'
import { SubmitHandler } from 'react-hook-form'
import { useGetUserEmailInfoQuery } from '~/core/redux/api/user.api'
import { ApiResponse } from '~/core/services/api.model'
import { toast } from 'react-toastify'
import { UpdateInfoRequest } from '~/core/services/user-services.model'
import { useConfirmMailTokenMutation, useValidateMailMutation } from '~/core/redux/api/auth.api'
import OTPInput from '~/components/Common/OtpInput'


const headingSx = {
    fontSize: '18px',
    fontWeight: '500',
    color: '#172b4d',
    mb: '12px'
}

const textSx = {
    fontSize: '13px',
    fontWeight: '300',
    color: '#172b4d'
}

const borderBottom = {
    borderBottom: '1px solid #DCDFE4'
}


const VerifyMailFC = () => {
    const [otp, setOtp] = useState('')
    const { data: apiResponse, isSuccess: isLoadingInfoSuccess, refetch } = useGetUserEmailInfoQuery({})
    const [validateEmail, { isLoading: isValidateEmail }] = useValidateMailMutation()
    const [confirmMailToken, { isLoading: isConfirmMailToken }] = useConfirmMailTokenMutation()
    const response = apiResponse as ApiResponse<any>
    const userInfo = response?.data

    const { register, handleSubmit, reset } = useForm<UpdateInfoRequest>({
        defaultValues: {
            email: userInfo?.email
        }
    })

    useEffect(() => {
        if (isLoadingInfoSuccess) {
            reset({
                email: userInfo?.email
            })
        }
    }, [isLoadingInfoSuccess, reset, userInfo])


    const onSubmit: SubmitHandler<UpdateInfoRequest> = async (data) => {
        console.log(otp)
        try {
            await validateEmail({})
            toast.success('Otp sended', {
                position: 'bottom-right'
            })
            refetch()
        } catch (error) {
            console.log(error)
        }
    }

    const sendToken = async (event: any) => {
        event.preventDefault()
        console.log(otp)
        try {
            const resp = await confirmMailToken(otp).unwrap() as ApiResponse<any>
            toast.success('Confirm success', {
                position: 'bottom-right'
            })
        } catch (error) {
            const resp = error.data as ApiResponse<any>
            switch (resp.code) {
            case 'token.expired':
                toast.error('Token expired', {
                    position: 'bottom-right'
                })
                break
            case 'token.invalid':
                toast.error('Token invalid', {
                    position: 'bottom-right'
                })
                break
            case 'token.max-attempts':
                toast.error('Too many attempts, please re-send token', {
                    position: 'bottom-right'
                })
                refetch()
                break
            default:
                break
            }
        }
    }

    if (!isLoadingInfoSuccess || isValidateEmail) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{ ml: '100px' }}>
            {!userInfo.confirmStatus
                ?
                <Box>
                    {
                        userInfo?.verify
                            ?
                            <Box sx={{ ...borderBottom, pb: '14px' }}>
                                <Box sx={headingSx}>Email verified</Box>
                                <Box sx={textSx}>Your email has been verified</Box>
                            </Box>
                            :
                            <Box sx={{ ...borderBottom, pb: '14px' }}>
                                <Box sx={headingSx}>Verify your email address</Box>
                                <Box sx={textSx}>When verified, you can choose the app to send notification to your email or not</Box>
                            </Box>
                    }
                    <form onSubmit={handleSubmit(onSubmit)} >

                        <Box sx={{ maxWidth: '800px' }}>
                            <FormControl sx={{ mt: '10px' }} fullWidth variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-username">Email</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-email"
                                    type="text"
                                    label="Email"
                                    disabled={userInfo?.verify === true}
                                    {...register('email')}
                                />
                            </FormControl>

                            <Box sx={{ width: '200px' }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    disabled={userInfo?.verify === true}
                                >
                                    Send otp
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Box>
                :
                <Box>
                    <Box sx={{ ...borderBottom, pb: '14px' }}>
                        <Box sx={headingSx}>Verify your email address</Box>
                        <Box sx={textSx}>When verified, you can choose the app to send notification to your email or not</Box>
                    </Box>
                    <form onSubmit={sendToken} >

                        <Box sx={{ maxWidth: '800px' }}>
                            <FormControl sx={{ mt: '10px' }} fullWidth variant="outlined">
                                <OTPInput otp={otp} setOtp={setOtp} length={6} />
                            </FormControl>

                            <Box sx={{ width: '200px' }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    disabled={userInfo?.verify === true}
                                >
                                    Send otp
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Box>
            }

        </Box>
    )
}

export default VerifyMailFC