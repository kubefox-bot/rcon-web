import { afterEach, beforeEach, expect, test } from "bun:test"
import { AxiosError } from "axios"
import { useAuth } from "../src/composables/useAuth"
import { useGlobalLoader } from "../src/composables/useGlobalLoader"
import { connectToServer, disconnect, sendCommand } from "../src/handlers"
import { api } from "../src/lib/api"
import { jwt } from "../src/lib/jwtStorage"

const originalAdapter = api.defaults.adapter
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage")
const savedValues = new Map<string, string>()

beforeEach(() => {
	savedValues.clear()
	Object.defineProperty(globalThis, "localStorage", {
		configurable: true,
		value: {
			getItem: (key: string) => savedValues.get(key) ?? null,
			setItem: (key: string, value: string) => savedValues.set(key, value),
			removeItem: (key: string) => savedValues.delete(key),
		},
	})
})

afterEach(() => {
	api.defaults.adapter = originalAdapter
	if (originalStorage) {
		Object.defineProperty(globalThis, "localStorage", originalStorage)
	} else {
		Reflect.deleteProperty(globalThis, "localStorage")
	}
})

test("login preserves the backend's invalid-password error", async () => {
	api.defaults.adapter = async (config) => {
		throw new AxiosError(
			"Request failed",
			"ERR_BAD_REQUEST",
			config,
			undefined,
			{
				config,
				status: 401,
				statusText: "Unauthorized",
				headers: {},
				data: { error: "Invalid password" },
			},
		)
	}

	const auth = useAuth()
	const result = await auth.login("incorrect-password")
	expect(result.isErr()).toBe(true)
	if (result.isErr()) expect(result.error).toBe("Invalid password")
	expect(auth.isAuthenticated.value).toBe(false)
	expect(jwt.getToken().isErr()).toBe(true)
})

test("login stores a successful token and sends only the password", async () => {
	api.defaults.adapter = async (config) => {
		expect(config.url).toBe("/login")
		expect(JSON.parse(config.data)).toEqual({ password: "test-password" })
		return {
			config,
			status: 200,
			statusText: "OK",
			headers: {},
			data: { access_token: "test-token" },
		}
	}

	const auth = useAuth()
	expect((await auth.login("test-password")).isOk()).toBe(true)
	expect(jwt.getToken()._unsafeUnwrap()).toBe("test-token")
	expect(auth.isAuthenticated.value).toBe(true)
})

test("login falls back safely for a non-string backend error", async () => {
	api.defaults.adapter = async (config) => {
		throw new AxiosError(
			"Request failed",
			"ERR_BAD_RESPONSE",
			config,
			undefined,
			{
				config,
				status: 500,
				statusText: "Error",
				headers: {},
				data: { error: { detail: "internal" }, message: 42 },
			},
		)
	}

	const result = await useAuth().login("test-password")
	expect(result.isErr()).toBe(true)
	if (result.isErr()) expect(result.error).toBe("Login failed")
})

test("connect sends the tagged payload and returns the declared outcome", async () => {
	api.defaults.adapter = async (config) => {
		expect(config.url).toBe("/rcon")
		expect(JSON.parse(config.data)).toEqual({
			action: "connect",
			host: "localhost",
			port: 27050,
			password: "enc:test",
		})
		return {
			config,
			status: 200,
			statusText: "OK",
			headers: {},
			data: {
				status: "ok",
				message: "Connected to RCON",
				data: { host: "localhost", port: 27050 },
			},
		}
	}

	const result = await connectToServer({
		host: "localhost",
		port: 27050,
		password: "enc:test",
	})
	expect(result._unsafeUnwrap()).toBe("connected")
})

test("disconnect sends no connection fields and returns the declared outcome", async () => {
	api.defaults.adapter = async (config) => {
		expect(JSON.parse(config.data)).toEqual({ action: "disconnect" })
		return {
			config,
			status: 200,
			statusText: "OK",
			headers: {},
			data: { status: "ok", message: "Disconnected from RCON", data: null },
		}
	}

	expect((await disconnect())._unsafeUnwrap()).toBe("disconnected")
})

test("commands preserve the server response", async () => {
	api.defaults.adapter = async (config) => {
		expect(JSON.parse(config.data)).toEqual({
			action: "command",
			command: "status",
		})
		return {
			config,
			status: 200,
			statusText: "OK",
			headers: {},
			data: { status: "ok", data: { response: "hostname: test-server" } },
		}
	}

	expect((await sendCommand({ command: "status" }))._unsafeUnwrap()).toEqual({
		response: "hostname: test-server",
	})
})

test("failed RCON requests preserve the error and stop the loader", async () => {
	api.defaults.adapter = async (config) => {
		throw new AxiosError(
			"Request failed",
			"ERR_BAD_REQUEST",
			config,
			undefined,
			{
				config,
				status: 400,
				statusText: "Bad Request",
				headers: {},
				data: { status: "error", message: "Not connected" },
			},
		)
	}

	const result = await sendCommand({ command: "status" })
	expect(result.isErr()).toBe(true)
	if (result.isErr()) expect(result.error).toBe("Not connected")
	expect(useGlobalLoader().isLoading.value).toBe(false)
})
