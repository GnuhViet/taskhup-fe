import React from 'react'

import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import { SubmitHandler, useForm } from 'react-hook-form'
import { AuthenticationResponse, RegisterRequest } from '~/core/services/auth-services.model'
import { CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import { VisibilityOff, Visibility } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import { setCredentials } from '~/core/redux/slices/authSlice'
import { useRegisterMutation } from '~/core/redux/api/auth.api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}

const RegisterFC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = React.useState(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show)
    const handleMouseDownPassword = (event: any) => { event.preventDefault() }


    const [login, { isLoading }] = useRegisterMutation()

    const form = useForm<RegisterRequest>({
        defaultValues: {
            username: '',
            password: '',
            email: '',
            fullName: ''
        }
    })

    const { register, handleSubmit, formState } = form
    const { errors } = formState


    const onSubmit: SubmitHandler<RegisterRequest> = async (data) => {
        try {
            const authReq = {} as RegisterRequest
            authReq.username = data.username
            authReq.password = data.password
            authReq.email = data.email
            authReq.fullName = data.fullName

            const authResp = await login(authReq).unwrap() as AuthenticationResponse
            await dispatch(setCredentials(authResp))
            navigate('/home')
        } catch (err) {
            if (!err?.originalStatus) {
                // isLoading: true until timeout occurs
                toast('No Server Response', {
                    position: 'bottom-right'
                })
            } else if (err.originalStatus === 400) {
                toast('Missing Username or Password')
            } else if (err.originalStatus === 401) {
                toast('Unauthorized')
            } else {
                toast('Login Failed')
            }
        }
    }

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register new account
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ maxWidth: 'sm' }} margin='normal' >
                        <FormControl sx={{ mt: '10px' }} fullWidth variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-username">Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-username"
                                type="text"
                                label="Username"
                                placeholder='JohnDoe99'
                                {...register('username', {
                                    required: 'Field is required',
                                    maxLength: {
                                        value: 50,
                                        message: 'Field is too long'
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z0-9._]{6,}$/,
                                        message: 'Field must be min 5 character and not containing special character'
                                    }
                                })}
                                error={!!errors.username}
                            />
                            {errors.username && (
                                <Typography variant="caption" color="error">
                                    {errors.username.message}
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
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder='johnDoe99@'
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                {...register('password', {
                                    required: 'Field is required',
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{4,50}$/,
                                        message: 'Field must be min 4 and max 50 character containing at least 1 uppercase, 1 lowercase, 1 special character and 1 digit'
                                    }
                                })}
                                error={!!errors.password}
                            />
                            {errors.password && (
                                <Typography variant="caption" color="error">
                                    {errors.password.message}
                                </Typography>
                            )}
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Register
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2" onClick={() => navigate('/forgor-passowrd')}>
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2" onClick={() => navigate('/login')}>
                                    {'Already have an account? Login'}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </form>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </>
    )
}

export default RegisterFC