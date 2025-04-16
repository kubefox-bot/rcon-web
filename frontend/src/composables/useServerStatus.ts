import { disconnect, sendCommand } from "@/handlers"
import type { Result } from "neverthrow"
import { ref } from "vue"

const output = ref("")
const isLoading = ref(false)
const statusText = ref("🟡 Неизвестно")

export function useServerStatus() {
	const setStatus = (status: string) => {
		statusText.value = status
	}

	const send = async (command: string): Promise<Result<string, string>> => {
		isLoading.value = true
		output.value = ""

		const result = await sendCommand({ command })
		isLoading.value = false

		result
			.map((res) => res.response)
			.match(
				(res) => {
					output.value = res
					// статус можно анализировать по ответу (если не WS)
					if (command === "status") {
						if (res.includes("hostname") || res.includes("map")) {
							setStatus("🟢 Онлайн")
						} else {
							setStatus("🔴 Оффлайн")
						}
					}
				},
				(err) => {
					output.value = `❌ ${err}`
				},
			)

		return result.map((r) => r.response)
	}

	const checkStatus = () => send("status")

	const restartMap = () => send("mp_restartgame 1")

	const clearOutput = () => {
		output.value = ""
	}

	const logout = async () => {
		await disconnect()
		statusText.value = "🔌 Отключено"
		output.value = ""
	}

	return {
		output,
		isLoading,
		statusText,
		setStatus,
		checkStatus,
		restartMap,
		logout,
		send,
		clearOutput,
	}
}
