import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ApiResponse } from '~/core/services/api.model'
import { mapObject } from '~/core/utils/mapper'
import { Role } from '~/core/model/role.model'
import { roleApi } from '../api/role.api'
import { RoleGetResp } from '~/core/services/role-services.model'
import { forEach } from 'lodash'

export interface WorkspaceSate {
    roles: Role[]
    // board: Board[]
}

const initialState: WorkspaceSate = {
    roles: []
    // board: [],
}

export const workspaceSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        setRoles: (state, action: PayloadAction<Role[]>) => {
            state.roles = action.payload
            // state.board = {} as Board
            // console.log('finish set board!!')
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(roleApi.endpoints.getWorkspaceRoles.matchFulfilled, (state, action) => {
            const apiResp = action.payload as ApiResponse<RoleGetResp[]>

            const resp = { ...apiResp?.data } as RoleGetResp[]
            const role = [] as Role[]
            forEach(resp, (item) => {
                role.push(mapObject<Role>(item, new Role()))
            })

            state.roles = [...role]
        })
    }
})

export const {
    setRoles
} = workspaceSlice.actions

export default workspaceSlice.reducer