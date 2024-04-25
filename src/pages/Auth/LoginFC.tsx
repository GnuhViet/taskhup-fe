import React, { useEffect } from 'react'

import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import { SubmitHandler, useForm } from 'react-hook-form'
import { AuthenticationRequest, AuthenticationResponse } from '~/core/services/auth-services.model'
import { CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import { VisibilityOff, Visibility } from '@mui/icons-material'
import { useLoginMutation } from '~/core/redux/api/auth.api'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials } from '~/core/redux/slices/authSlice'
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

const LoginFC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const token = useSelector((state: any) => state.authReducer.token.accessToken)

    useEffect(() => {
        if (token) {
            navigate('/home')
        }
    }, [token, navigate])

    const [showPassword, setShowPassword] = React.useState(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show)
    const handleMouseDownPassword = (event: any) => { event.preventDefault() }


    const [login, { isLoading }] = useLoginMutation()

    const form = useForm<AuthenticationRequest>({
        defaultValues: {
            username: '',
            password: ''
        }
    })

    const { register, handleSubmit, formState } = form
    const { errors } = formState


    const onSubmit: SubmitHandler<AuthenticationRequest> = async (data) => {
        try {
            const authReq = {} as AuthenticationRequest
            authReq.username = data.username
            authReq.password = data.password

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
                    Sign in
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ maxWidth: 'sm' }} margin='normal' >
                        <FormControl sx={{ m: '10px 0 10px 0' }} fullWidth variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-username">Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-username"
                                type="text"
                                label="Username"
                                {...register('username', {
                                    required: 'Field is required'
                                })}
                                error={!!errors.username}
                            />
                            {errors.username && (
                                <Typography variant="caption" color="error">
                                    {errors.username.message}
                                </Typography>
                            )}
                        </FormControl>

                        <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
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
                                    required: 'Field is required'
                                })}
                                error={!!errors.password}
                            />
                            {errors.password && (
                                <Typography variant="caption" color="error">
                                    {errors.password.message}
                                </Typography>
                            )}
                        </FormControl>
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2" onClick={() => navigate('/forgor-passowrd')}>
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2" onClick={() => navigate('/register')}>
                                    {'Don\'t have an account? Sign Up'}
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

export default LoginFC