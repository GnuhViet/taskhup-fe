import React, { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import CircleAvatar from '~/components/Common/CircleAvatar'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Textarea from '@mui/joy/Textarea'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CircularProgress from '@mui/material/CircularProgress'

import OutlinedInput from '@mui/material/OutlinedInput'
import Typography from '@mui/material/Typography'
import { useForm } from 'react-hook-form'
import { SubmitHandler } from 'react-hook-form'
import { useGetUserInfoQuery, useUpdateAvatarMutation, useUpdateInfoMutation } from '~/core/redux/api/user.api'
import { ApiResponse } from '~/core/services/api.model'
import { toast } from 'react-toastify'
import { UpdateInfoRequest } from '~/core/services/user-services.model'

const InfomationFC = () => {
    const { data: apiResponse, isSuccess: isLoadingInfoSuccess, refetch } = useGetUserInfoQuery({})
    const [updateInfo, { isLoading: isUpdatingInfo }] = useUpdateInfoMutation()
    const response = apiResponse as ApiResponse<any>
    const userInfo = response?.data
    const [updateAvatar, { isLoading: isUpdatingAvatar }] = useUpdateAvatarMutation()
    const { register, handleSubmit, formState: { errors, isDirty, isValid }, reset } = useForm<UpdateInfoRequest>({
        defaultValues: {
            email: userInfo?.email,
            fullName: userInfo?.fullName,
            phoneNumber: userInfo?.phoneNumber,
            bio: userInfo?.bio
        }
    })

    const fileInputRef = useRef(null)

    useEffect(() => {
        if (isLoadingInfoSuccess) {
            reset({
                email: userInfo?.email,
                fullName: userInfo?.fullName,
                phoneNumber: userInfo?.phoneNumber,
                bio: userInfo?.bio,
            });
        }
    }, [isLoadingInfoSuccess, reset, userInfo]);


    const onSubmit: SubmitHandler<UpdateInfoRequest> = async (data) => {
        console.log(data)
        try {
            await updateInfo(data)
            toast.success('Update information successfully', {
                position: 'bottom-right'
            })
            refetch()
        } catch (error) {
            console.log(error)
        }
    }

    const handleIconButtonClick = () => {
        fileInputRef.current.click()
    }

    const handleFileChange = async (event: any) => {
        const file = event.target.files[0]
        try {
            await updateAvatar(file)
            toast.success('Update avatar successfully', {
                position: 'bottom-right'
            })
            refetch()
        } catch (error) {
            console.log(error)
        }
    }

    if (!isLoadingInfoSuccess || isUpdatingAvatar || isUpdatingInfo) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{ ml: '100px' }}>
            <form onSubmit={handleSubmit(onSubmit)} >
                <Box sx={{ display: 'flex', mb: '40px   ' }}>
                    <Box sx={{ mr: '40px', position: 'relative' }}>
                        <CircleAvatar
                            src={userInfo.avatar}
                            alt='T'
                            sx={{ width: '160px', height: '160px' }}
                        />
                        <Box sx={{ position: 'absolute', right: '0', bottom: '0' }}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <IconButton
                                aria-label="delete"
                                size="medium"
                                onClick={handleIconButtonClick}
                                sx={{
                                    bgcolor: '#E9F2FF',
                                    '&:hover': {
                                        bgcolor: '#DCDFE4'
                                    }
                                }}
                            >
                                <EditOutlinedIcon fontSize="inherit" />
                            </IconButton>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '60%', justifyContent: 'center' }}>
                        <Typography variant='h4' sx={{ mb: '12px' }}>{userInfo.username}</Typography>
                        {
                            userInfo.verify
                                ? (
                                    <Typography variant='body1'>Verified account ✅</Typography>
                                )
                                : (
                                    <Typography variant='body1'>Unverified account</Typography>
                                )
                        }
                    </Box>
                </Box>
                <Box sx={{ maxWidth: '800px' }}>
                    <FormControl sx={{ mt: '10px' }} fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-username">Full name</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-username"
                            type="text"
                            label="Full name"
                            placeholder='John Doe'
                            {...register('fullName', {
                                required: 'Field is required'
                            })}
                            error={!!errors.fullName}
                        />
                        {errors.fullName && (
                            <Typography variant="caption" color="error">
                                {errors.fullName.message}
                            </Typography>
                        )}
                    </FormControl>
                    <FormControl sx={{ mt: '10px' }} fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-username">Email</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-email"
                            type="text"
                            label="Email"
                            placeholder='JohnDoe99@gmail.com'
                            {...register('email', {
                                required: 'Field is required',
                                maxLength: {
                                    value: 50,
                                    message: 'Field is too long'
                                },
                                pattern: {
                                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                                    message: 'Invalid email'
                                }
                            })}
                            error={!!errors.email}
                        />
                        {errors.email && (
                            <Typography variant="caption" color="error">
                                {errors.email.message}
                            </Typography>
                        )}
                    </FormControl>
                    <FormControl sx={{ mt: '10px' }} fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-username">Phone number</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-email"
                            type="text"
                            label="Phone number"
                            placeholder='0123456789'
                            {...register('phoneNumber', {
                                required: 'Field is required',
                                minLength: {
                                    value: 8,
                                    message: 'Phone number should be 11 digits'
                                },
                                pattern: {
                                    value: /^\d+$/, // number only regex
                                    message: 'Invalid phone number'
                                }
                            })}
                            error={!!errors.phoneNumber}
                        />
                        {errors.email && (
                            <Typography variant="caption" color="error">
                                {errors.phoneNumber.message}
                            </Typography>
                        )}
                    </FormControl>
                    <FormControl sx={{ width: '100%', mt: '12px' }}>
                        <Textarea
                            minRows={6}
                            placeholder='Bio'
                            {...register('bio', {
                                maxLength: {
                                    value: 2000,
                                    message: 'Field is too long'
                                }
                            })}
                        />
                    </FormControl>

                    <Box sx={{ width: '200px' }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={!isDirty}
                        >
                            Save change
                        </Button>
                    </Box>
                </Box>
            </form>
        </Box>
    )
}

export default InfomationFC