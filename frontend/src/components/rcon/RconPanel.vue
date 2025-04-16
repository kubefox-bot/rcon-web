<template>
  <div class="rcon-panel">
    <div class="grid">
      <div class="panels">
        <PanelWrapper title="Commands">
          <CommandList @send="handleSend" />
        </PanelWrapper>
        <PanelWrapper title="Map Selector">
          <MapSelector @send="handleSend" />
        </PanelWrapper>

        <ManualCommand @send="handleSend" />
      </div>

      <div class="terminal">
        <TerminalView :output="output" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useServerError } from "@/composables/useServerError";
import { useServerStatus } from "@/composables/useServerStatus";
import { sendCommand } from "@/handlers";
import { onMounted, ref } from "vue";
import PanelWrapper from "./PanelWrapper.vue";
import TerminalView from "./TerminalView.vue";
import CommandList from "./panels/CommandListPanel.vue";
import ManualCommand from "./panels/ManualCommandPanel.vue";
import MapSelector from "./panels/MapSelectorPanel.vue";
import type { RconState } from "./type";

const state = ref<RconState>("ready");
const status = useServerStatus();
onMounted(() => {
	status.checkStatus();
});

const output = ref("");
const { setError, clearError } = useServerError();

const handleSend = async (cmd: string) => {
	output.value = "";
	state.value = "loading";
	const result = await sendCommand({ command: cmd });

	result
		.map((res) => res.response)
		.match(
			(res) => {
				clearError();
				output.value = res;
				state.value = "ready";
			},
			(err) => {
				output.value = `❌ ${err}`;
				setError(err);
				state.value = "ready";
			},
		);
};
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.rcon-panel {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
  box-sizing: border-box;
}

.loading {
  text-align: center;
  font-size: 1.25rem;
  color: $accent;
}

.grid {
  display: flex;
  gap: 2rem;
  align-items: stretch;
  align-items: flex-start;
  @media (max-width: 1024px) {
    flex-direction: column;
  }

  .panels {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .terminal {
    flex: 1;
    background: $bg-panel;
    border-radius: $radius;
    padding: 1rem;
    box-shadow: $shadow;
    display: flex;
    flex-direction: column;

    max-height: 100%;
  }
}
</style>
