import { useGlobalLoader } from "@/composables/useGlobalLoader"
import type { AxiosError } from "axios"
import { type Result, err, ok } from "neverthrow"
import { api } from "../lib/api"

export async function sendRconRequest<
	T,
	Payload extends object = Record<string, never>,
>(action: string, payload?: Payload): Promise<Result<T, string>> {
	const { start, stop } = useGlobalLoader()
	start()

	try {
		const body = payload ? { action, ...payload } : { action }
		const res = await api.post("/rcon", body)
		return ok(res.data.data as T)
	} catch (e) {
		const error = e as AxiosError<{ message?: string }>
		const message =
			error.response?.data?.message || error.message || "Unknown error"
		return err(message)
	} finally {
		stop()
	}
}
