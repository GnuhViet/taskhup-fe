import React, { } from 'react'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'


import OutlinedInput from '@mui/material/OutlinedInput'
import Typography from '@mui/material/Typography'
import { useForm } from 'react-hook-form'
import { SubmitHandler } from 'react-hook-form'
import { ChangePasswordRequest } from '~/core/services/auth-services.model'
import { useChangePasswordMutation } from '~/core/redux/api/auth.api'
import { ApiResponse } from '~/core/services/api.model'
import { toast } from 'react-toastify'


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


const ChangePasswordFC = () => {
    const [changePassword, { isLoading: isUpdatingInfo }] = useChangePasswordMutation()
    const [showOldPassword, setShowOldPassword] = React.useState(false)
    const handleClickShowOldPassword = () => setShowOldPassword((show) => !show)
    const [showNewPassword, setShowNewPassword] = React.useState(false)
    const handleClickShowNewPassword = () => setShowNewPassword((show) => !show)

    const handleMouseDownPassword = (event: any) => { event.preventDefault() }

    const { register, handleSubmit, formState: { errors }, setError } = useForm<ChangePasswordRequest>({
        defaultValues: {
            oldPassword: '',
            newPassword: ''
        }
    })

    const onSubmit: SubmitHandler<ChangePasswordRequest> = async (data) => {
        if (data.oldPassword === data.newPassword) {
            setError('newPassword', { type: 'manual', message: 'New password cannot be the same as the old password' })
            return
        }

        try {
            const resp = await changePassword(data).unwrap() as ApiResponse<any>
            switch (resp.code) {
            case '01':
                toast.success('Change password successfully', {
                    position: 'bottom-right'
                })
                break
            case '03':
                setError('oldPassword', { type: 'manual', message: 'Password incorrect' })
                break
            default:
                break
            }
        } catch (error) {
            console.log(error)
        }
    }


    // if (!isLoadingInfoSuccess || isUpdatingAvatar || isUpdatingInfo) {
    //     return (
    //         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    //             <CircularProgress />
    //         </Box>
    //     )
    // }

    return (
        <Box sx={{ ml: '100px' }}>
            <form onSubmit={handleSubmit(onSubmit)} >
                <Box sx={{ ...borderBottom, pb: '14px' }}>
                    <Box sx={headingSx}>Change your password</Box>
                    <Box sx={textSx}>Your password must be min 4 and max 50 character containing at least 1 uppercase, 1 lowercase, 1 special character and 1 digit</Box>
                </Box>
                <Box sx={{ maxWidth: '800px' }}>
                    <FormControl sx={{ mt: '10px' }} fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Old Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showOldPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowOldPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                            {...register('oldPassword', {
                                required: 'Field is required'
                            })}
                            error={!!errors.oldPassword}
                        />
                        {errors.oldPassword && (
                            <Typography variant="caption" color="error">
                                {errors.oldPassword.message}
                            </Typography>
                        )}
                    </FormControl>

                    <FormControl sx={{ mt: '10px' }} fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder='johnDoe99@'
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowNewPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                            {...register('newPassword', {
                                required: 'Field is required',
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{4,50}$/,
                                    message: 'Field must be min 4 and max 50 character containing at least 1 uppercase, 1 lowercase, 1 special character and 1 digit'
                                }
                            })}
                            error={!!errors.newPassword}
                        />
                        {errors.newPassword && (
                            <Typography variant="caption" color="error">
                                {errors.newPassword.message}
                            </Typography>
                        )}
                    </FormControl>

                    <Box sx={{ width: '200px' }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Save change
                        </Button>
                    </Box>
                </Box>
            </form>
        </Box>
    )
}

export default ChangePasswordFC