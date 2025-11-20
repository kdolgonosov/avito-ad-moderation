import axios from 'axios'
import { API_URL } from '@/shared/config/apiConfig'

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})
