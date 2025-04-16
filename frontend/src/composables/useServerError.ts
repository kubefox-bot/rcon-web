import { ref } from "vue";

const errorMessage = ref<string | null>(null);

export function useServerError() {
	const setError = (message: string) => {
		errorMessage.value = message;
	};

	const clearError = () => {
		errorMessage.value = null;
	};

	return {
		errorMessage,
		setError,
		clearError,
	};
}
