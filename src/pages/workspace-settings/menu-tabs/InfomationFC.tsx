import React, { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
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
import { ApiResponse } from '~/core/services/api.model'
import { toast } from 'react-toastify'
import { UpdateInfoRequest } from '~/core/services/user-services.model'
import { useGetWorkSpaceInfoQuery, useUpdateAvatarMutation, useUpdateInfoMutation } from '~/core/redux/api/workspace.api'
import SquareAvatar from '~/components/Common/SquareAvatar'
import { UpdateWorkspaceInfoRequest } from '~/core/services/workspace-services.model'
import { Can } from '~/core/utils/access-control'
import { AbilityContext } from '~/core/utils/access-control'

const avatarSx = {
    minWidth: '60px',
    minHeight: '60px',
    width: '140px',
    height: '140px',
    fontSize: '80px',
    mr: '12px'
}

const WorkSpaceInfoFC = () => {
    const ability = React.useContext(AbilityContext)
    const { data: apiResponse, isSuccess: isLoadingInfoSuccess, refetch } = useGetWorkSpaceInfoQuery({})
    const [updateInfo, { isLoading: isUpdatingInfo }] = useUpdateInfoMutation()
    const response = apiResponse as ApiResponse<any>
    const workspaceInfo = response?.data
    const [updateAvatar, { isLoading: isUpdatingAvatar }] = useUpdateAvatarMutation()
    const { register, handleSubmit, formState: { errors, isDirty, isValid }, reset } = useForm<UpdateWorkspaceInfoRequest>({
        defaultValues: {
            title: workspaceInfo?.title,
            website: workspaceInfo?.website,
            description: workspaceInfo?.description
        }
    })

    const fileInputRef = useRef(null)

    useEffect(() => {
        if (isLoadingInfoSuccess) {
            reset({
                title: workspaceInfo?.title,
                website: workspaceInfo?.website,
                description: workspaceInfo?.description
            })
        }
    }, [isLoadingInfoSuccess, reset, workspaceInfo])


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
                        <SquareAvatar sx={avatarSx} src={workspaceInfo.avatarUrl} alt={workspaceInfo.title.charAt(0)} />
                        <Box sx={{ position: 'absolute', right: '14px', bottom: '2px' }}>
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
                        <Typography variant='h4' sx={{ mb: '12px' }}>Owner: @{workspaceInfo.ownerName}</Typography>
                        {
                            true
                                ? (
                                    <Typography variant='body1'>Upgraded ✅</Typography>
                                )
                                : (
                                    <Typography variant='body1'>Un Upgraded</Typography>
                                )
                        }
                    </Box>
                </Box>
                <Box sx={{ maxWidth: '800px' }}>
                    <FormControl sx={{ mt: '10px' }} fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-username">Title</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-username"
                            type="text"
                            label="Title"
                            placeholder='Marketing Team'
                            {...register('title', {
                                required: 'Field is required'
                            })}
                            error={!!errors.title}
                            disabled={ability.cannot('edit', 'workspace')}
                        />
                        {errors.title && (
                            <Typography variant="caption" color="error">
                                {errors.title.message}
                            </Typography>
                        )}
                    </FormControl>
                    <FormControl sx={{ mt: '10px' }} fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-username">Website Link</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-email"
                            type="text"
                            label="Website"
                            placeholder='abc.com'
                            {...register('website')}
                            error={!!errors.website}
                            disabled={ability.cannot('edit', 'workspace')}
                        />
                        {errors.website && (
                            <Typography variant="caption" color="error">
                                {errors.website.message}
                            </Typography>
                        )}
                    </FormControl>
                    <FormControl sx={{ width: '100%', mt: '12px' }}>
                        <Textarea
                            minRows={6}
                            placeholder='Description...'
                            {...register('description', {
                                required: 'Field is required',
                                maxLength: {
                                    value: 2000,
                                    message: 'Field is too long'
                                }
                            })}
                            disabled={ability.cannot('edit', 'workspace')}
                        />
                    </FormControl>

                    <Can I="edit" a="workspace">
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
                    </Can>
                </Box>
            </form>
        </Box>
    )
}

export default WorkSpaceInfoFC