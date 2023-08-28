<script setup lang="ts">
import { useElevator } from "~/store/elevator";
const elevator = useElevator();
const input = ref("");
watch(input, (value) => {
  if (value && !isNaN(parseInt(value))) {
    elevator.selectedFloor = parseInt(value);
  }
});
</script>

<template>
  <div class="absolute bottom-0 -translate-x-1/2 left-1/2">
    <div class="glass">
      <label
        for="default-input"
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Select Floor</label
      >
      <input
        type="text"
        v-model="input"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
