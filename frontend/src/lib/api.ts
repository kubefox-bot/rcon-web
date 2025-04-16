import axios from "axios"

import { forceLogout } from "@/composables/useAuth"
import { jwt } from "./jwtStorage"

export const api = axios.create({
	baseURL: "/api",
})

api.interceptors.request.use((req) => {
	const tokenResult = jwt.getToken()
	tokenResult.map((token) => {
		req.headers.Authorization = `Bearer ${token}`
	})
	return req
})

api.interceptors.response.use(
	(res) => res,
	(error) => {
		if (error.response?.status === 401) {
			forceLogout()
		}
		return Promise.reject(error)
	},
)
