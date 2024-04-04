import axios from 'axios'
import { API_ROOT } from '~/core/utils/constants'

const API_URL = `${API_ROOT}/api/v1/board`

export const getAllBoard = async () => {
    const response = await axios.get(`${API_URL}`)
    return response.data
}

export const getBoard = async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
}