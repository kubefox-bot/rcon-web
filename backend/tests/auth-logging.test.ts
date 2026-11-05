import { expect, test } from "bun:test"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const waitForHealth = async (url: string) => {
	const timeoutMs = 3000
	const retryDelayMs = 20
	const deadline = Date.now() + timeoutMs
	while (Date.now() < deadline) {
		try {
			if ((await fetch(url)).status === 200) return
		} catch {
			// The child process may not have bound its socket yet.
		}
		await Bun.sleep(retryDelayMs)
	}
	throw new Error("Backend did not become healthy")
}

test("login accepts valid credentials, rejects invalid ones, and never logs either", async () => {
	const listener = Bun.listen({
		hostname: "127.0.0.1",
		port: 0,
		socket: { data: () => {} },
	})
	const port = listener.port
	listener.stop(true)
	const cwd = await mkdtemp(join(tmpdir(), "rcon-auth-test-"))
	const password = "auth-logging-test-secret"
	const rejectedPassword = "rejected-auth-logging-test-secret"
	const backend = Bun.spawn({
		cmd: [fileURLToPath(new URL("../target/debug/rcon-api", import.meta.url))],
		cwd,
		env: {
			AUTH_TOKEN: password,
			ENCRYPTION_KEY: "12345678901234567890123456789012",
			ENCRYPTION_METHOD: "chacha",
			PORT: String(port),
			RUST_LOG: "trace",
		},
		stdout: "pipe",
		stderr: "pipe",
	})
	const stdout = new Response(backend.stdout).text()
	const stderr = new Response(backend.stderr).text()
	const baseUrl = `http://127.0.0.1:${port}/api`

	try {
		await waitForHealth(`${baseUrl}/health`)

		const rejected = await fetch(`${baseUrl}/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ password: rejectedPassword }),
		})
		expect(rejected.status).toBe(401)
		expect(await rejected.json()).toEqual({ error: "Invalid password" })

		const accepted = await fetch(`${baseUrl}/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ password }),
		})
		expect(accepted.status).toBe(200)
		const body = await accepted.json()
		expect(typeof body.access_token).toBe("string")
		const authorized = await fetch(`${baseUrl}/rcon`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${body.access_token}`,
			},
			body: JSON.stringify({ action: "disconnect" }),
		})
		expect(authorized.status).toBe(200)
		const unauthorized = await fetch(`${baseUrl}/rcon`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ action: "disconnect" }),
		})
		expect(unauthorized.status).toBe(401)

		backend.kill()
		await backend.exited
		const logs = `${await stdout}\n${await stderr}`
		expect(logs).not.toContain(password)
		expect(logs).not.toContain(rejectedPassword)
		expect(logs).not.toContain(body.access_token)
	} finally {
		if (backend.exitCode === null && backend.signalCode === null) backend.kill()
		await backend.exited
		await rm(cwd, { recursive: true, force: true })
	}
})
