import { jwt } from "@/lib";
import { api } from "@/lib/api";
import type { AxiosError } from "axios";
import { type Result, err, ok } from "neverthrow";
import { computed, ref } from "vue";
import { useAppStep } from "./useAppStep";
import { useFlashMessage } from "./useFlashMessage";

const isAuthenticated = ref(jwt.isAuthenticated());

export function useAuth() {
	const flash = useFlashMessage();
	const { setStep } = useAppStep();

	const login = async (
		password: string,
	): Promise<Result<"logged-in", string>> => {
		try {
			const res = await api.post("/login", { password });
			const token = res.data.access_token;
			if (!token) return err("No token in response");

			jwt.setToken(token);
			isAuthenticated.value = true;
			return ok("logged-in");
		} catch (error) {
			const axiosError = error as AxiosError<{ message?: string }>;

			isAuthenticated.value = false;
			const message = axiosError.response?.data?.message || "Login failed";
			flash.show(`❌ ${message}`);

			return err(message);
		}
	};

	const logout = (forceMessage = false) => {
		jwt.removeToken();
		isAuthenticated.value = false;
		setStep("auth");

		if (forceMessage) {
			flash.show("Сессия истекла. Войдите снова.");
		}
	};

	return {
		isAuthenticated: computed(() => isAuthenticated.value),
		login,
		logout,
	};
}

export const forceLogout = () => useAuth().logout(true);
