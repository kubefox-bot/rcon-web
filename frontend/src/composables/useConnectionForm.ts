import { ref } from "vue";

const host = ref("");
const port = ref(27050);
const password = ref("");

export function useConnectionForm() {
	return {
		host,
		port,
		password,
	};
}
