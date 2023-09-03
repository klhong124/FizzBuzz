<script setup lang="ts">
import { useElevator } from "~/store/elevator";
const elevator = useElevator();
const selectedFloor = computed(() => elevator.selectedFloor);

const input = ref("");
watch(input, (value) => {
  if (value && !isNaN(parseInt(value)) && parseInt(value) >= 0) {
    elevator.selectedFloor = parseInt(value);
  }
});

watch(selectedFloor, () => {
  input.value = selectedFloor.value.toString();
});
</script>

<template>
  <div class="absolute bottom-0 -translate-x-1/2 left-1/2">
    <div class="glass">
      <label
        for="default-input"
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Type below to select a floor:</label
      >
      <input
        type="text"
        v-model="input"
        class="border border-gray-300 text-gray-900 text-sm rounded-lg block w-96 p-2.5"
      />
    </div>
  </div>
</template>
