import axios from "axios"

const getApiBaseUrl = () => import.meta.env.VITE_API_BASE_URL

export const http = axios.create({
	baseURL: getApiBaseUrl(),
	timeout: 15000,
})
