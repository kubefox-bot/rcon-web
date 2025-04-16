import { ref, watch } from "vue"

export function usePersistentPanelState(id: string, defaultOpen = true) {
	const storageKey = `panel-state:${id}`
	const saved = localStorage.getItem(storageKey)
	const isOpen = ref(saved ? saved === "true" : defaultOpen)

	watch(isOpen, (val) => {
		localStorage.setItem(storageKey, String(val))
	})

	const toggle = () => {
		isOpen.value = !isOpen.value
	}

	return {
		isOpen,
		toggle,
	}
}
